import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, BookOpen, LogOut, ChevronLeft, 
  Grid3X3, LayoutDashboard, CalendarDays, UserCheck, Settings
} from "lucide-react";
import Logo from "@/assets/images/syaqa.ico";

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  }

  return (
    <aside className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <Link to="/admin/home" className="sidebar-logo-link">
          <img src={Logo} alt="Syaqa Logo" className="sidebar-logo" />
        </Link>
        <button 
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <Link 
              to="/admin/home" 
              className={`sidebar-nav-link ${isActive("/admin/home") ? "active" : ""}`}
            >
              <LayoutDashboard className="sidebar-icon" />
              <span className="sidebar-link-text">Tableau de bord</span>
            </Link>
          </li>
          
          <li className="sidebar-nav-item">
            <Link 
              to="/admin/users" 
              className={`sidebar-nav-link ${isActive("/admin/users") ? "active" : ""}`}
            >
              <Users className="sidebar-icon" />
              <span className="sidebar-link-text">Utilisateurs</span>
            </Link>
          </li>

          <li className="sidebar-nav-item">
            <Link 
              to="/admin/pending-users" 
              className={`sidebar-nav-link ${isActive("/admin/pending-users") ? "active" : ""}`}
            >
              <UserCheck className="sidebar-icon" />
              <span className="sidebar-link-text">Validation Comptes</span>
            </Link>
          </li>
          
          <li className="sidebar-nav-item">
            <Link 
              to="/admin/categories" 
              className={`sidebar-nav-link ${isActive("/admin/categories") ? "active" : ""}`}
            >
              <Grid3X3 className="sidebar-icon" />
              <span className="sidebar-link-text">Catégories</span>
            </Link>
          </li>

          <li className="sidebar-nav-item">
            <Link 
              to="/admin/courses" 
              className={`sidebar-nav-link ${isActive("/admin/courses") ? "active" : ""}`}
            >
              <BookOpen className="sidebar-icon" />
              <span className="sidebar-link-text">Cours</span>
            </Link>
          </li>

          <li className="sidebar-nav-item">
            <Link 
              to="/admin/bookings" 
              className={`sidebar-nav-link ${isActive("/admin/bookings") ? "active" : ""}`}
            >
              <CalendarDays className="sidebar-icon" />
              <span className="sidebar-link-text">Réservations</span>
            </Link>
          </li>

          <li className="sidebar-nav-item">
            <Link 
              to="/admin/settings" 
              className={`sidebar-nav-link ${isActive("/admin/settings") ? "active" : ""}`}
            >
              <Settings className="sidebar-icon" />
              <span className="sidebar-link-text">Paramètres</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <Link to="/logout" className="sidebar-logout">
          <LogOut className="sidebar-icon" />
          <span className="sidebar-link-text">Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}