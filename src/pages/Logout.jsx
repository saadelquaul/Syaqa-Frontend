import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/utils/auth";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-[#F97316] mx-auto mb-4" />
        <h1 className="text-xl font-medium text-gray-700">Déconnexion en cours...</h1>
      </div>
    </div>
  );
}