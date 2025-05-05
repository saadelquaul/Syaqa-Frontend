import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Logo from "@/assets/images/syaqa.ico"
import { isLoggedIn } from "../../utils/auth"
import { Avatar } from "@/components/ui/avatar"
import AvatarImage from "@/assets/images/avatar.png"
import { getCurrentUser } from "../../utils/auth"

const user = getCurrentUser()
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return AvatarImage;

    if (imagePath.startsWith('http')) return imagePath;

    return `http://localhost:8000/storage/${imagePath}`;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className={`main-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <h1 className="text-3xl"><span className="text-[#F97316]">S</span>YAQA</h1>
          </Link>
        </div>

        <nav className={`main-nav ${mobileMenuOpen ? "active" : ""}`} ref={navRef}>
          <ul className="nav-menu">
            <li className="nav-item active">
              <Link to="/" className="nav-link">
                Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                À propos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {isLoggedIn() && (
          <div className="header-user">
          <button
            className="header-user-button"
            onClick={() => {
              setShowUserMenu(!showUserMenu)
            }}
            aria-label="Menu utilisateur"
          >
            <Avatar src={getImageUrl(user.profile_picture)} alt="Photo de profil" size="sm" />
            <span className="header-username">{user.name}</span>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="user-info">
                <Avatar src={getImageUrl(user.profile_picture)} alt="Photo de profil" size="md" />
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              <ul className="dropdown-menu-items">
                <li>
                  <Link to="/account">Mon profil</Link>
                </li>
                <li>
                  <Link to = {`/${user.role}/home`} >Dashboard</Link>
                </li>
                <li>
                  <Link to="/logout">Déconnexion</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        )}

        {!isLoggedIn() && (
          <div className="header-buttons">
            <Link to="/login" className="btn btn-secondary">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary">
              S&apos;inscrire
            </Link>
          </div>
        )}

        <div
          className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </header>
  )
}