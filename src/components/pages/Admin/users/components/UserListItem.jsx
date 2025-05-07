import { MoreVertical, Eye, Edit, Trash } from "lucide-react";
import DefaultProfileImage from "@/assets/images/default-profile-icon.jpg";


export function UserListItem({ 
  user, 
  showActions, 
  toggleActions, 
  handleViewDetails,
  handleEdit,
  handleDeleteUser 
}) {
  return (
    <tr key={user.id}>
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={user.profile_picture ? user.profile_picture.startsWith('https://avatar.iran.liara.run') ?
                  user.profile_picture :
                   `http://localhost:8000/storage/${user.profile_picture}` :
                    DefaultProfileImage
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
  );
}