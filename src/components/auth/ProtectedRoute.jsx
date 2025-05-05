import { Navigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from '@/utils/auth';  

export default function ProtectedRoute({ children, allowedRole }) {  
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if(allowedRole === "*") {
    return children;
  }

  const currentUser = getCurrentUser();
  console.log("Current User:", currentUser);
  if (!currentUser || currentUser.role !== allowedRole) {
    if (currentUser && currentUser.role) {
      return <Navigate to={`/${currentUser.role}/home`} />;
    }
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}