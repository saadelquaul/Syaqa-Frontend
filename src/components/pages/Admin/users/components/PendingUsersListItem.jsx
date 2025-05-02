import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DefaultProfileImage from "@/assets/images/default-profile-icon.jpg";

export function PendingUsersListItem({ 
  user, 
  handleViewDetails,
  handleApprove,
  handleReject 
}) {
  return (
    <tr>
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img 
              src={
                user.profile_picture ? 
                  user.profile_picture.startsWith('https://avatar.iran.liara.run')
                    ? user.profile_picture
                    : `http://localhost:8000/storage/${user.profile_picture}` 
                  : DefaultProfileImage
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
  );
}