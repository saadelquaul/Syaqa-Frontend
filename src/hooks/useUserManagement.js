import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeader } from '@/utils/auth';

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [reFetchUsers, setReFetchUsers] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMonitorModal, setShowAddMonitorModal] = useState(false);
  const [showActions, setShowActions] = useState(null);

 
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    address: "",
    phone_number: "",
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
  }, [reFetchUsers,refreshTrigger]);

  
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  
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

  const refreshData = () => setRefreshTrigger(prev => !prev);

  return {
    users,
    filteredUsers,
    selectedUser,
    isLoading,
    isLoadingDetails,
    error,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    showDetailsModal,
    setShowDetailsModal,
    showEditModal,
    setShowEditModal,
    showAddMonitorModal,
    setShowAddMonitorModal,
    showActions,
    editForm,
    handleViewDetails,
    handleEdit,
    handleEditFormChange,
    handleUpdateUser,
    handleDeleteUser,
    toggleActions,
    setReFetchUsers,
    refreshData
  };
}