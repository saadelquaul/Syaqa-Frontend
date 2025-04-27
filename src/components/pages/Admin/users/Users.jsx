import { useState, useEffect } from "react";
import { Search, Plus, Filter, MoreVertical, Trash, Edit, Eye, X, User, Mail, Calendar, CheckCircle, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActions, setShowActions] = useState(null);


  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    status: ""
  });


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: getAuthHeader()
        });
        setUsers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Impossible de charger la liste des utilisateurs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleViewDetails = async (id) => {
    try {
      setIsLoadingDetails(true);
      setShowDetailsModal(true);

      const response = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
        headers: getAuthHeader()
      });

      setSelectedUser(response.data.user);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setShowDetailsModal(false);
    } finally {
      setIsLoadingDetails(false);
      setShowActions(null);
    }
  };


  const handleEdit = async (id) => {
    try {
      setIsLoadingDetails(true);

      const response = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
        headers: getAuthHeader()
      });

      const user = response.data.user;
      setSelectedUser(user);

      setEditForm({
        name: user.name,
        email: user.email,
        address: user.address,
        phone_number: user.phone_number,
        status: user.status
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Failed to fetch user for editing:", err);
    } finally {
      setIsLoadingDetails(false);
      setShowActions(null);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8000/api/admin/users/${selectedUser.id}`,
        editForm,
        { headers: getAuthHeader() }
      );

      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id ? { ...user, ...editForm } : user
        )
      );

      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update user:", err);

    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
        headers: getAuthHeader()
      });


      setUsers(prev => prev.filter(user => user.id !== id));
      setShowActions(null);
    } catch (err) {
      console.error("Failed to delete user:", err);

    }
  };

  const toggleActions = (id) => {
    if (showActions === id) {
      setShowActions(null);
    } else {
      setShowActions(id);
    }
  };


  const filteredUsers = users.filter(user => {

    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Gestion des utilisateurs</h1>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
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
                <option value="admin">Administrateur</option>
                <option value="monitor">Moniteur</option>
                <option value="candidate">Candidat</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">En attente</option>
                <option value="rejected">Refusée</option>
                <option value="graduated">Titulaire du permis</option>
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
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
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
                              src={user.role === 'admin' ? 'https://avatar.iran.liara.run/public/job/operator/male'
                                : user.role === 'candidate' ? user.profile_picture.startsWith('https://avatar.iran.liara.run') ?
                                  user.profile_picture : `http://localhost:8000/storage/${user.candidate.profile_picture}` :
                                  user.monitor ? `http://localhost:8000/storage/${user.monitor.profile_picture}` :
                                    'https://avatar.iran.liara.run/public'
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : user.role === 'monitor'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role === 'admin' ? 'Admin' :
                            user.role === 'monitor' ? 'Moniteur' : 'Candidat'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'inactive'
                              ? 'bg-yellow-100 text-yellow-800' :
                              user.status === 'graduated' ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                          {user.status === 'active' ? 'Actif' :
                            user.status === 'inactive' ? 'En attente' :
                              user.status === 'graduated' ? 'Titulaire du permis' : 'Refusée'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div>
                          <button
                            onClick={() => toggleActions(user.id)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {showActions === user.id && (
                            <div className="absolute right-18 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewDetails(user.id)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Eye size={16} className="mr-2" />
                                  Voir les détails
                                </button>
                                <button

                                  onClick={() => {
                                    setShowDetailsModal(false);
                                    handleEdit(user.id);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit size={16} className="mr-2" />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash size={16} className="mr-2" />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          )}
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

      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Détails de l'utilisateur</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : selectedUser ? (
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={selectedUser.role === 'admin' ? 'https://avatar.iran.liara.run/public/job/operator/male'
                          : selectedUser.role === 'candidate' && selectedUser.candidate?.profile_picture ?
                            `http://localhost:8000/storage/${selectedUser.candidate.profile_picture}`
                            : selectedUser.role === 'monitor' && selectedUser.monitor?.profile_picture ?
                              `http://localhost:8000/storage/${selectedUser.monitor.profile_picture}`
                              : 'https://avatar.iran.liara.run/public'
                        }
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{selectedUser.name}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="text-gray-500" size={16} />
                        <span>{selectedUser.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-500" size={16} />
                        <span>Inscrit le {new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : selectedUser.role === 'monitor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {selectedUser.role === 'admin' ? 'Admin' :
                          selectedUser.role === 'monitor' ? 'Moniteur' : 'Candidat'}
                      </span>

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : selectedUser.status === 'inactive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedUser.status === 'graduated'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedUser.status === 'active' ? 'Actif' :
                          selectedUser.status === 'inactive' ? 'En attente' :
                            selectedUser.status === 'graduated' ? 'Titulaire du permis' : 'Refusé'}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="my-6" />

                {/* Role-specific information */}
                {selectedUser.role === 'candidate' && selectedUser.candidate && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">Informations du candidat</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="text-gray-500" size={16} />
                          <div>
                            <div className="text-sm text-gray-500">Téléphone</div>
                            <div>{selectedUser.phone_number}</div>
                          </div>
                        </div>
                      )}

                      {selectedUser.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="text-gray-500 mt-1" size={16} />
                          <div>
                            <div className="text-sm text-gray-500">Adresse</div>
                            <div>{selectedUser.address}</div>
                          </div>
                        </div>
                      )}

                      {selectedUser.candidate.license_type && (
                        <div className="flex items-center gap-2">
                          <User className="text-gray-500" size={16} />
                          <div>
                            <div className="text-sm text-gray-500">Type de permis</div>
                            <div>{selectedUser.candidate.license_type}</div>
                          </div>
                        </div>
                      )}

                      {selectedUser.candidate.document && (
                        <div className="flex items-center gap-2">
                          <User className="text-gray-500" size={16} />
                          <div>
                            <div className="text-sm text-gray-500">Document</div>
                            <a href={`http://localhost:8000/storage/${selectedUser.candidate.document.CIN}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Voir le document
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedUser.role === 'monitor' && selectedUser.monitor && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">Informations du moniteur</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.monitor.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="text-gray-500" size={16} />
                          <div>
                            <div className="text-sm text-gray-500">Téléphone</div>
                            <div>{selectedUser.monitor.phone_number}</div>
                          </div>
                        </div>
                      )}

                      {selectedUser.monitor.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="text-gray-500 mt-1" size={16} />
                          <div>
                            <div className="text-sm text-gray-500">Adresse</div>
                            <div>{selectedUser.monitor.address}</div>
                          </div>
                        </div>
                      )}

                      {/* Add more monitor-specific fields here */}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEdit(selectedUser.id);
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">
                Impossible de charger les détails de l'utilisateur
              </div>
            )}
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Modifier l'utilisateur</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={editForm.phone_number}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">En attente</option>
                    <option value="graduated">Titulaire du permis</option>
                    <option value="rejected">Refusé</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}