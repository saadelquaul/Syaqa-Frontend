import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';


export function usePendingUsersManagement() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8000/api/admin/pending-users', {
          headers: getAuthHeader()
        });
        
        setPendingUsers(response.data.users || []);
        
      } catch (err) {
        console.error("Failed to fetch pending users:", err);
        setError("Impossible de charger les utilisateurs en attente");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingUsers();
  }, [refreshTrigger]);

  
  const filteredUsers = pendingUsers.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  
  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
        headers: getAuthHeader()
      });
      setSelectedUser(response.data.user);
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  };

 
  const handleApprove = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/candidate/${id}/approve`, {}, {
        headers: getAuthHeader()
      });
      
      setPendingUsers(prev => prev.filter(user => user.id !== id));
      setShowDetailsModal(false);
    } catch (err) {
      console.error("Failed to approve user:", err);
    }
  };
  
  
  const handleReject = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/candidate/${id}/reject`, {}, {
        headers: getAuthHeader()
      });
      
      setPendingUsers(prev => prev.filter(user => user.id !== id));
      setShowDetailsModal(false);
    } catch (err) {
      console.error("Failed to reject user:", err);
    }
  };

  
  const refreshData = () => setRefreshTrigger(prev => !prev);

  return {
    pendingUsers,
    filteredUsers,
    selectedUser,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    showDetailsModal,
    setShowDetailsModal,
    handleViewDetails,
    handleApprove,
    handleReject,
    refreshData
  };
}