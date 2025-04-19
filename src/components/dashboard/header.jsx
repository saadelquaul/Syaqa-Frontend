"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar } from "@/components/ui/avatar"

export default function DashboardHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="dashboard-header flex place-self-end">
      <div className="header-actions">
        <div className="header-user">
          <button
            className="header-user-button"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
            }}
            aria-label="Menu utilisateur"
          >
            <Avatar src="/assets/avatar-placeholder.png" alt="Photo de profil" size="sm" />
            <span className="header-username">Mohammed Alami</span>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="user-info">
                <Avatar src="/assets/avatar-placeholder.png" alt="Photo de profil" size="md" />
                <div>
                  <h4>Mohammed Alami</h4>
                  <p>mohammed.a@syaqa.ma</p>
                </div>
              </div>
              <ul className="dropdown-menu-items">
                <li>
                  <Link to="/monitor/profile">Mon profil</Link>
                </li>
                <li>
                  <Link to="/logout">Déconnexion</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
