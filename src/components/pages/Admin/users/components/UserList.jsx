import { UserListItem } from "./UserListItem";
import { LoadingSpinner } from "./LoadingSpinner";

export function UserList({
  isLoading,
  error,
  filteredUsers,
  showActions,
  toggleActions,
  handleViewDetails,
  handleEdit,
  handleDeleteUser
}) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun utilisateur trouvé
      </div>
    );
  }

  return (
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
            <UserListItem
              key={user.id}
              user={user}
              showActions={showActions}
              toggleActions={toggleActions}
              handleViewDetails={handleViewDetails}
              handleEdit={handleEdit}
              handleDeleteUser={handleDeleteUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}