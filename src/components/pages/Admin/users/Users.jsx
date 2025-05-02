import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserFilters } from "./components/UserFilters";
import { UserList } from "./components/UserList";
import { UserDetailsModal } from "./components/modals/UserDetailsModal";
import { UserEditModal } from "./components/modals/UserEditModal";
import { AddMonitorModal } from "./components/modals/AddMonitorModal";

export default function AdminUsersPage() {
  const {
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
  } = useUserManagement();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Gestion des utilisateurs</h1>
        <Button 
          onClick={() => setShowAddMonitorModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Ajouter un moniteur
        </Button>
      </div>

      <Card className="dashboard-card">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Liste des utilisateurs</CardTitle>
          <RefreshCw 
              className="cursor-pointer hover:scale-105 transition" 
              onClick={refreshData}
            />
        </CardHeader>
        <CardContent>
          <UserFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <UserList
            isLoading={isLoading}
            error={error}
            filteredUsers={filteredUsers}
            showActions={showActions}
            toggleActions={toggleActions}
            handleViewDetails={handleViewDetails}
            handleEdit={handleEdit}
            handleDeleteUser={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        isLoadingDetails={isLoadingDetails}
        selectedUser={selectedUser}
        handleEdit={handleEdit}
      />

      <UserEditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedUser={selectedUser}
        editForm={editForm}
        handleEditFormChange={handleEditFormChange}
        handleUpdateUser={handleUpdateUser}
      />

      <AddMonitorModal
        showAddMonitorModal={showAddMonitorModal}
        setShowAddMonitorModal={setShowAddMonitorModal}
        setReFetchUsers={setReFetchUsers}
      />
    </div>
  );
}