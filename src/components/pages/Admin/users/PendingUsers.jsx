import { RefreshCw, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingUsersManagement } from "@/hooks/usePendingUsersManagement";
import { PendingUsersList } from "./components/PendingUsersList";
import { PendingUserDetailsModal } from "./components/modals/PendingUserDetailsModal";
import { Input } from "@/components/ui/input"

export default function PendingUsersPage() {
  const {
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
  } = usePendingUsersManagement();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="dashboard-title">Candidates en attente de validation</h1>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Demandes d'inscription 
            <RefreshCw 
              className="cursor-pointer hover:scale-105 transition" 
              onClick={refreshData}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="search-container">
        <Search className="search-icon" />
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
          
          <PendingUsersList
            isLoading={isLoading}
            error={error}
            filteredUsers={filteredUsers}
            handleViewDetails={handleViewDetails}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />
        </CardContent>
      </Card>

      <PendingUserDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedUser={selectedUser}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </div>
  );
}