import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

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
            <img src="/placeholder.svg" alt="Syaqa" className="w-[120px] h-[40px]" />
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
              <Link to="/courses" className="nav-link">
                Cours
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/exams" className="nav-link">
                Examens
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/quizzes" className="nav-link">
                Quiz
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
    
        <div className="header-buttons">
          <Link to="/login" className="btn btn-secondary">
            Connexion
          </Link>
          <Link to="/register" className="btn btn-primary">
            S&apos;inscrire
          </Link>
        </div>

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