import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "@/utils/auth";

export default function RecentRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/recent-registrations', {
          headers: getAuthHeader()
        });

        setRegistrations(response.data.registrations || []);
      } catch (err) {
        console.error("Failed to fetch recent registrations:", err);
        setError("Impossible de charger les inscriptions récentes");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRegistrations();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/users/${id}/approve`, {}, {
        headers: getAuthHeader()
      });
      
      // Update the local state to reflect the change
      setRegistrations(prev => 
        prev.map(user => 
          user.id === id ? { ...user, status: 'approved' } : user
        )
      );
    } catch (err) {
      console.error("Failed to approve user:", err);
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/users/${id}/reject`, {}, {
        headers: getAuthHeader()
      });
      
      // Update the local state to reflect the change
      setRegistrations(prev => 
        prev.map(user => 
          user.id === id ? { ...user, status: 'rejected' } : user
        )
      );
    } catch (err) {
      console.error("Failed to reject user:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">{error}</div>
    );
  }

  if (registrations.length === 0) {
    return <div className="empty-state">Aucune inscription récente</div>;
  }

  return (
    <ul className="space-y-3">
      {registrations.map((user) => (
        <li key={user.id} className="bg-white p-3 rounded-md border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar 
                src={ user.profile_picture ? 
                    user.profile_picture.startsWith('https://avatar.iran.liara.run')
                  ? user.profile_picture: `http://localhost:8000/storage/${user.profile_picture}` : 'https://avatar.iran.liara.run/public'
    } 
                alt={user.user.name} 
              />
              <div>
                <div className="font-medium">{user.user.name}</div>
                <div className="text-sm text-gray-500">{user.user.email}</div>
              </div>
            </div>
            
            <Badge className={
              user.status === 'inactive' ? "bg-yellow-100 text-yellow-800" : 
              user.status === 'active' ? "bg-green-100 text-green-800" : 
              "bg-red-100 text-red-800"
            }>
              {user.status === 'inactive' ? 'En attente' : 
               user.status === 'active' ? 'Approuvé' : 'Rejeté'}
            </Badge>
          </div>
          
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
          
          {user.status === 'pending' && (
            <div className="mt-3 flex justify-end gap-2">
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleApprove(user.id)}
              >
                Approuver
              </Button>
              <Button 
                size="sm" 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleReject(user.id)}
              >
                Rejeter
              </Button>
            </div>
          )}
        </li>
      ))}
      
      <div className="text-center mt-4">
        <Link to="/admin/pending-users">
          <Button variant="outline" size="sm">
            Voir toutes les inscriptions
          </Button>
        </Link>
      </div>
    </ul>
  );
}