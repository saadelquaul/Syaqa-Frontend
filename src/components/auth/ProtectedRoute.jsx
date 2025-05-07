import { Navigate } from "react-router-dom";
import { isLoggedIn, getCurrentUser } from '@/utils/auth';
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, allowedRole }) {
  const [ currentUser, setCurrentUser ] = useState(null);
  
    useEffect(() => {
      setCurrentUser(getCurrentUser());
    }, [children]);

  setTimeout( () => { if (!isLoggedIn()) {
    
    return <Navigate to="/login" />;
  }

  if(allowedRole === "*") {
    return children;
  }

  if (!currentUser || currentUser.role !== allowedRole) {
    if (currentUser && currentUser.role) {
      return <Navigate to={`/${currentUser.role}/home`} />;
    }
    return <Navigate to="/unauthorized" />;
  }
}, 1500);
  
  return children;
}