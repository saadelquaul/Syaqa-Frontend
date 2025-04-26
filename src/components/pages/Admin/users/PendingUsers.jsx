import { useState, useEffect } from "react";
import { Search, RefreshCw, Filter, CheckCircle, XCircle, Eye, X, User, Phone, Calendar, MapPin, FileText, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";

export default function PendingUsersPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Refrecher, setRefrecher] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/pending-users', {
          headers: getAuthHeader()
        });
        
        setPendingUsers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch monitor users:", err);
        setError("Impossible de charger les utilisateurs en attente");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingUsers();
  }, [Refrecher]);

  const handleViewDetails = async (id) => {
    
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
        headers: getAuthHeader()
      });
      setSelectedUser(response.data.user);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      alert("Erreur lors du chargement des détails de l'utilisateur");
    }
  };


  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/condidate/${id}/approve`, {}, {
        headers: getAuthHeader()
      });
      
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Erreur lors de l'approbation de l'utilisateur");
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/condidate/${id}/reject`, {}, {
        headers: getAuthHeader()
      });
      
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Failed to reject user:", err);
      alert("Erreur lors du rejet de l'utilisateur");
    }
  };

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Utilisateurs en attente de validation</h1>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex justify-between">Demandes d'inscription 
            <RefreshCw className="cursor-pointer hover:scale-120 transition" onClick={()=> setRefrecher(!Refrecher)}/>
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="filters-container">
            <div className="search-container">
              <Search className="search-icon" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters">
              <select 
                className="px-3 py-2 border rounded-md"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tous les rôles</option>
                <option value="candidate">Candidat</option>
                <option value="monitor">Moniteur</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun utilisateur en attente de validation
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={
                                user.profile_picture ? 
                                  user.profile_picture.startsWith('https://avatar.iran.liara.run')
                                    ? user.profile_picture
                                    : `http://localhost:8000/storage/${user.profile_picture}` 
                                  : `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}`
                              } 
                              alt={user.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold capitalize rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-500 hover:bg-blue-600 inline-flex items-center"
                            onClick={() => handleViewDetails(user.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                          
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 inline-flex items-center"
                            onClick={() => handleApprove(user.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-500 hover:bg-red-600 inline-flex items-center"
                            onClick={() => handleReject(user.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {
      showDetailsModal && selectedUser &&  (
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
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold border-b pb-2 mb-4">Informations personnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUser.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-500" size={18} />
                      <div>
                        <div className="text-sm text-gray-500">Téléphone</div>
                        <div>{selectedUser.phone_number}</div>
                      </div>
                    </div>
                  )}
                  
                  {selectedUser.date_of_birth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-500" size={18} />
                      <div>
                        <div className="text-sm text-gray-500">Date de naissance</div>
                        <div>{new Date(selectedUser.date_of_birth).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  )}
                  
                  {selectedUser.address && (
                    <div className="flex items-start gap-2 col-span-1 md:col-span-2">
                      <MapPin className="text-gray-500 mt-1" size={18} />
                      <div>
                        <div className="text-sm text-gray-500">Adresse</div>
                        <div>{selectedUser.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedUser.role === 'candidate' && selectedUser.candidate && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold border-b pb-2 mb-4">Informations du candidat</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUser.candidate.license_type && (
                      <div className="flex items-center gap-2">
                        <Car className="text-gray-500" size={18} />
                        <div>
                          <div className="text-sm text-gray-500">Type de permis</div>
                          <div>{selectedUser.candidate.license_type}</div>
                        </div>
                      </div>
                    )}
                    
                    {selectedUser.candidate.enrollment_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-500" size={18} />
                        <div>
                          <div className="text-sm text-gray-500">Date d'inscription</div>
                          <div>{new Date(selectedUser.candidate.enrollment_date).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedUser.role === 'candidate' && selectedUser.candidate.document.CIN && (
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
                          href={`http://localhost:8000/storage/${selectedUser.candidate.document.CIN}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Télécharger
                        </a>
                      </div>
                      <div className="p-2">
                        <img 
                          src={`http://localhost:8000/storage/${selectedUser.candidate.document.CIN}`}
                          alt="CIN"
                          className="max-h-48 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
                <Button 
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    handleApprove(selectedUser.id);
                    setShowDetailsModal(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    handleReject(selectedUser.id);
                    setShowDetailsModal(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button 
                  variant="outline"
                  className="text-gray-500 hover:text-black  border-gray-300"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}