import React from "react"
import { Link } from "react-router-dom"
import "@/assets/styles/auth.css"


export default function AuthLayout({ children, title, subtitle, backgroundImage }) {
  return (
    <div className="auth-container">
      <div className="auth-background" style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-content-wrapper">
        
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>

          <div className="auth-card-content">{children}</div>
        </div>

        <div className="auth-footer">
          <p className="auth-copyright">&copy; {new Date().getFullYear()} Syaqa. Tous droits réservés.</p>
          <div className="auth-footer-links">
            <Link href="/privacy" className="auth-footer-link">
              Confidentialité
            </Link>
            <Link href="/terms" className="auth-footer-link">
              Conditions d&apos;utilisation
            </Link>
            <Link href="/help" className="auth-footer-link">
              Aide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
