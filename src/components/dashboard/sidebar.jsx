"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Home, BookOpen, FolderTree, Calendar, LogOut, ChevronRight, Menu, X } from "lucide-react"

export default function DashboardSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const navItems = [
    {
        name: "Tableau de bord",
        href: "/monitor/home",
        icon: <Home className="sidebar-icon" />,
      },
    {
      name: "Cours",
      href: "/monitor/courses",
      icon: <BookOpen className="sidebar-icon" />,
    },
    {
      name: "Catégories",
      href: "/monitor/categories",
      icon: <FolderTree className="sidebar-icon" />,
    },
    {
      name: "Réservations",
      href: "/monitor/bookings",
      icon: <Calendar className="sidebar-icon" />,
    },
  ]


  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`dashboard-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/
          " className="sidebar-logo-link">
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Syaqa Logo"
              width={120}
              height={40}
              className="sidebar-logo"
            />
          </Link>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Développer" : "Réduire"}
          >
            <ChevronRight />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="sidebar-nav-item">
                <Link
                  to={item.href}
                  className={`sidebar-nav-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  <span className="sidebar-link-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link to="/logout" className="sidebar-logout">
            <LogOut className="sidebar-icon" />
            <span className="sidebar-link-text">Déconnexion</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
