import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import "@/assets/styles/dashboard.css"

const isAuthenticated = () => {
  return true
}
export default function MonitorDashboardLayout({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);
  

  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-content">
        <DashboardHeader />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  )
}
