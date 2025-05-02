import { X, User, Phone, Calendar, MapPin, FileText, Car, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PendingUserDetailsModal({
  showDetailsModal,
  setShowDetailsModal,
  selectedUser,
  handleApprove,
  handleReject
}) {
  if (!showDetailsModal || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Détails de l'utilisateur</h2>
          <button 
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mx-auto md:mx-0">
              <img 
                src={
                  selectedUser.profile_picture ? 
                    selectedUser.profile_picture.startsWith('https://avatar.iran.liara.run')
                      ? selectedUser.profile_picture
                      : `http://localhost:8000/storage/${selectedUser.profile_picture}` 
                    : 'https://avatar.iran.liara.run/public'
                } 
                alt={selectedUser.name} 
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 text-gray-600">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span className="capitalize">{selectedUser.role}</span>
                </div>
                <span className="hidden md:block">•</span>
                <div className="flex items-center gap-1">
                  <span>{selectedUser.email}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 
                  selectedUser.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.status === 'active' ? 'Actif' : 
                   selectedUser.status === 'inactive' ? 'En attente' : 'Rejeté'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Personal Info Section */}
          <UserInfoSection user={selectedUser} />
          
          {/* Candidate Info Section */}
          {selectedUser.role === 'candidate' && selectedUser.candidate && (
            <CandidateInfoSection candidate={selectedUser.candidate} />
          )}
          
          {/* Documents Section */}
          {selectedUser.role === 'candidate' && 
           selectedUser.candidate && 
           selectedUser.candidate.document && 
           selectedUser.candidate.document.CIN && (
            <DocumentSection document={selectedUser.candidate.document} />
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={() => handleApprove(selectedUser.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => handleReject(selectedUser.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
            <Button 
              variant="outline"
              className="text-gray-500 hover:text-black border-gray-300"
              onClick={() => setShowDetailsModal(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components for the modal
function UserInfoSection({ user }) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold border-b pb-2 mb-4">Informations personnelles</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.phone_number && (
          <div className="flex items-center gap-2">
            <Phone className="text-gray-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Téléphone</div>
              <div>{user.phone_number}</div>
            </div>
          </div>
        )}
        
        {user.date_of_birth && (
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Date de naissance</div>
              <div>{new Date(user.date_of_birth).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        )}
        
        {user.address && (
          <div className="flex items-start gap-2 col-span-1 md:col-span-2">
            <MapPin className="text-gray-500 mt-1" size={18} />
            <div>
              <div className="text-sm text-gray-500">Adresse</div>
              <div>{user.address}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateInfoSection({ candidate }) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold border-b pb-2 mb-4">Informations du candidat</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidate.license_type && (
          <div className="flex items-center gap-2">
            <Car className="text-gray-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Type de permis</div>
              <div>{candidate.license_type}</div>
            </div>
          </div>
        )}
        
        {candidate.enrollment_date && (
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Date d'inscription</div>
              <div>{new Date(candidate.enrollment_date).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentSection({ document }) {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold border-b pb-2 mb-4">Documents</h4>
      <div className="flex flex-wrap gap-4">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>CIN</span>
            </div>
            <a
              href={`http://localhost:8000/storage/${document.CIN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Télécharger
            </a>
          </div>
          <div className="p-2">
            <img 
              src={`http://localhost:8000/storage/${document.CIN}`}
              alt="CIN"
              className="max-h-48 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}