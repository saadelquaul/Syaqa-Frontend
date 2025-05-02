import { useState } from "react";
import { X, CheckCircle, Upload, User, Phone, Calendar, MapPin, CreditCard, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";

export function AddMonitorModal({ showAddMonitorModal, setShowAddMonitorModal, setReFetchUsers }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [monitorForm, setMonitorForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone_number: "",
    date_of_birth: "",
    license_number: "",
    employment_date: ""
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const handleMonitorFormChange = (e) => {
    const { name, value } = e.target;
    setMonitorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMonitorRegistration = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      Object.keys(monitorForm).forEach(key => {
        formData.append(key, monitorForm[key]);
      });
      
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      
      formData.append('role', 'monitor');
      
      await axios.post(
        'http://localhost:8000/api/register-monitor',
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Reset form
      setMonitorForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        address: "",
        phone_number: "",
        date_of_birth: "",
        license_number: "",
        employment_date: ""
      });
      setProfilePicture(null);
      setProfilePreview(null);
      
      // Close modal and trigger refetch
      setShowAddMonitorModal(false);
      setReFetchUsers(prev => !prev);
      
    } catch (err) {
      console.error("Failed to register monitor:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showAddMonitorModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Ajouter un nouveau moniteur</h2>
          <button 
            onClick={() => setShowAddMonitorModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleMonitorRegistration} className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative mb-2">
                {profilePreview ? (
                  <img 
                    src={profilePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              
              <label className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md cursor-pointer flex items-center">
                <Upload size={14} className="mr-1" />
                Photo de profil
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={monitorForm.name}
                    onChange={handleMonitorFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={monitorForm.email}
                    onChange={handleMonitorFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={monitorForm.password}
                    onChange={handleMonitorFormChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={monitorForm.password_confirmation}
                    onChange={handleMonitorFormChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <hr className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <div className="flex">
                <Phone size={16} className="mr-2 mt-2 text-gray-500" />
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={monitorForm.phone_number}
                  onChange={handleMonitorFormChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance *
              </label>
              <div className="flex">
                <Calendar size={16} className="mr-2 mt-2 text-gray-500" />
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={monitorForm.date_of_birth}
                  onChange={handleMonitorFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <div className="flex">
                <MapPin size={16} className="mr-2 mt-2 text-gray-500" />
                <Input
                  id="address"
                  name="address"
                  value={monitorForm.address}
                  onChange={handleMonitorFormChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="license_number" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de permis *
              </label>
              <div className="flex">
                <CreditCard size={16} className="mr-2 mt-2 text-gray-500" />
                <Input
                  id="license_number"
                  name="license_number"
                  value={monitorForm.license_number}
                  onChange={handleMonitorFormChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="employment_date" className="block text-sm font-medium text-gray-700 mb-1">
                Date d'embauche *
              </label>
              <div className="flex">
                <Briefcase size={16} className="mr-2 mt-2 text-gray-500" />
                <Input
                  id="employment_date"
                  name="employment_date"
                  type="date"
                  value={monitorForm.employment_date}
                  onChange={handleMonitorFormChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddMonitorModal(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}