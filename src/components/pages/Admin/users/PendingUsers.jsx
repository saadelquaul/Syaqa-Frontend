import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, XCircle } from "lucide-react";
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

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/pending-users', {
          headers: getAuthHeader()
        });
        setPendingUsers(response.data.users || []);
        console.log(response.data.users);
      } catch (err) {
        console.error("Failed to fetch pending users:", err);
        setError("Impossible de charger les utilisateurs en attente");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/users/${id}/approve`, {}, {
        headers: getAuthHeader()
      });
      
      // Remove the approved user from the list
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Failed to approve user:", err);
      alert("Erreur lors de l'approbation de l'utilisateur");
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/users/${id}/reject`, {}, {
        headers: getAuthHeader()
      });
      
      // Remove the rejected user from the list
      setPendingUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Failed to reject user:", err);
      alert("Erreur lors du rejet de l'utilisateur");
    }
  };

  const filteredUsers = pendingUsers.filter(user => {
    const matchesSearch = 
      user.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user.user.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Utilisateurs en attente de validation</h1>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Demandes d'inscription</CardTitle>
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
                  ? user.profile_picture: `http://localhost:8000/storage/${user.profile_picture}` : 'https://avatar.iran.liara.run/public'
    
                              } 
                              alt={user.user.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.user.name}</div>
                            <div className="text-sm text-gray-500">{user.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold capitalize rounded-full bg-blue-100 text-blue-800
                        ">
                          {user.user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
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
    </div>
  );
}