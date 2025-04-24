import { useEffect, useState } from "react";
import { logout } from "@/utils/auth";

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(3);
  
  useEffect(() => {
    // Display message for 3 seconds before logout
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Perform logout
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <div className="mb-6">
        <h1 className="text-3xl"><span className="text-[#F97316]">S</span>YAQA</h1>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Déconnexion en cours...</h1>
        
        <div className="mb-6 relative">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-2">
          Vous êtes en train d'être déconnecté.
        </p>
        <p className="text-gray-600">
          Redirection dans {countdown} seconde{countdown !== 1 ? 's' : ''}...
        </p>
      </div>
    </div>
  );
}