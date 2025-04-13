"use client"

import React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const { success, error } = await login(formData.email, formData.password)
      
      if (success) {
        // If remember me is checked, we can handle that here
        // (though the token is already stored in the auth service)
        
        // Redirect to dashboard or home page
        navigate("/dashboard")
      } else {
        setErrorMessage(error || "Échec de la connexion. Veuillez vérifier vos informations.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Show error message if any */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="auth-form-group">
        <label htmlFor="email" className="auth-label">
          Adresse e-mail
        </label>
        <div className="auth-input-wrapper">
          <Mail className="auth-input-icon" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="auth-input"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="auth-form-group">
        <div className="flex justify-between items-center">
          <label htmlFor="password" className="auth-label">
            Mot de passe
          </label>
          <Link to="/forgot-password" className="auth-forgot-link">
            Mot de passe oublié?
          </Link>
        </div>
        <div className="auth-input-wrapper">
          <Lock className="auth-input-icon" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="auth-input"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="auth-password-toggle"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="auth-checkbox-wrapper">
        <input
          id="remember-me"
          name="rememberMe"
          type="checkbox"
          className="auth-checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        <label htmlFor="remember-me" className="auth-checkbox-label">
          Se souvenir de moi
        </label>
      </div>

      <button type="submit" className="auth-submit-button" disabled={isLoading}>
        {isLoading ? (
          <>
            <svg className="auth-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connexion en cours...
          </>
        ) : (
          "Se connecter"
        )}
      </button>
    </form>
  )
}
