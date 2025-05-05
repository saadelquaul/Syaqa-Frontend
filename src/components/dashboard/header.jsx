import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar } from "@/components/ui/avatar"
import AvatarImage from "@/assets/images/avatar.png"

export default function DashboardHeader(props) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return AvatarImage;
    
    if (imagePath.startsWith('http')) return imagePath;
    
    return `http://localhost:8000/storage/${imagePath}`;
  }

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
            <Avatar src={getImageUrl(props.user.profile_picture)} alt="Photo de profil" size="sm" />
            <span className="header-username">{props.user.name}</span>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="user-info">
                <Avatar src={getImageUrl(props.user.profile_picture)} alt="Photo de profil" size="md" />
                <div>
                  <h4>{props.user.name}</h4>
                  <p>{props.user.email}</p>
                </div>
              </div>
              <ul className="dropdown-menu-items">
                <li>
                  <Link to="/account">Mon profil</Link>
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
