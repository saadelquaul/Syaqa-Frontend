import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import "@/assets/styles/dashboard.css";

export default function MonitorDashboardLayout({ children }) {
  const { user, isLoading, error } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }
  
  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  if(user.role !== "monitor") {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-content">
        <DashboardHeader user={user}/>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
