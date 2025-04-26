import React, { useState, useRef } from "react"
import { User, Mail, Lock, Eye, EyeOff, Upload, Check, AlertCircle, Calendar, MapPin, Phone, Car, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { register } from "@/utils/auth"

export default function RegisterForm() {

  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
    address: "",
    phone: "",
    license_type: "B",
    enrollment_date: new Date().toISOString().split('T')[0],
  })
  const [cinFile, setCinFile] = useState(null)

  const successAlertRef = useRef(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (errorMessage) {
      setErrorMessage("");
    }

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      }

      if (name === "password" || name === "confirmPassword") {
        const match = name === "password"
          ? value === prev.confirmPassword
          : prev.password === value;

        setPasswordMatch(match || !value || (name === "confirmPassword" && !prev.password))
      }

      return newData;
    });
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Le fichier est trop volumineux. La taille maximale est de 2MB.");
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage("Format de fichier non valide. Utilisez JPEG, JPG ou PNG.");
        return;
      }

      setCinFile(file);

      setErrorMessage("");
      if (validationErrors.cin_file) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.cin_file;
          return newErrors;
        });
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    if (!cinFile) {
      setErrorMessage("Veuillez télécharger une copie de votre CIN");
      return;
    }

    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
   
    if (age < 18) {
      setValidationErrors(prev => ({ ...prev, date_of_birth: ["Vous devez avoir au moins 18 ans pour vous inscrire."] }));
      return;
    }

    if ( age > 80) {
      setValidationErrors(prev => ({ ...prev, date_of_birth: ["Vous devez avoir moins de 80 ans pour vous inscrire."] }));
      return;
    }

    const phoneRegex = /^(0|\+212)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setValidationErrors(prev => ({ ...prev, phone: ["Veuillez saisir un numéro de téléphone marocain valide."] }));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setValidationErrors({});
    setIsSuccess(false);

    try {

      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        phone: formData.phone,
        license_type: formData.license_type,
        enrollment_date: formData.enrollment_date,
        cin_file: cinFile
      };

      const { success, error, validationErrors: serverValidationErrors } = await register(registrationData);

      if (success) {

        setIsSuccess(true);

      } else {
        setErrorMessage(error || "Échec de l'inscription. Veuillez vérifier vos informations.");

        if (serverValidationErrors) {
          setValidationErrors(serverValidationErrors);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Une erreur inattendue s'est produite lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  }

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] ? (
      <p className="auth-error-message flex items-center mt-1">
        <AlertCircle className="h-4 w-4 mr-1" />
        {validationErrors[fieldName][0]}
      </p>
    ) : null;
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 80);

  return (
    <form className="auth-form" onSubmit={handleSubmit}>

      {isSuccess && (
        <div
          className="bg-green-50 border border-green-400 text-green-700 px-6 py-4 rounded mb-6"
          role="alert"
          ref={successAlertRef}                        
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Inscription réussie!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Votre compte a été créé avec succès. Un administrateur doit valider votre compte avant que vous puissiez vous connecter. Vous recevrez un e-mail de confirmation dès que votre compte sera validé.</p>
              </div>
              <div className="mt-4 py-4 flex rounded-md place-self-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Aller à la page de connexion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
          ref={(el) => {
            if (el && errorMessage) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
        >
          <p className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}

{!isSuccess && (
        <>
      <div className="auth-form-group">
        <label htmlFor="fullName" className="auth-label">
          Nom complet
        </label>
        <div className="auth-input-wrapper">
          <User className="auth-input-icon" />
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className={`auth-input ${validationErrors.name ? "auth-input-error" : ""}`}
            placeholder="Prénom Nom"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        {getFieldError("name")}
      </div>

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
            className={`auth-input ${validationErrors.email ? "auth-input-error" : ""}`}
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {getFieldError("email")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="date_of_birth" className="auth-label">
          Date de naissance
        </label>
        <div className="auth-input-wrapper">
          <Calendar className="auth-input-icon" />
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            required
            className={`auth-input ${validationErrors.date_of_birth ? "auth-input-error" : ""}`}
            value={formData.date_of_birth}
            onChange={handleChange}
            min={minDate.toISOString().split('T')[0]}
            max={maxDate.toISOString().split('T')[0]}
          />
        </div>
        <p className="auth-input-hint">Vous devez avoir au moins 18 ans</p>
        {getFieldError("date_of_birth")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="address" className="auth-label">
          Adresse
        </label>
        <div className="auth-input-wrapper">
          <MapPin className="auth-input-icon" />
          <input
            id="address"
            name="address"
            type="text"
            required
            className={`auth-input ${validationErrors.address ? "auth-input-error" : ""}`}
            placeholder="Votre adresse complète"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        {getFieldError("address")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="phone" className="auth-label">
          Téléphone
        </label>
        <div className="auth-input-wrapper">
          <Phone className="auth-input-icon" />
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={`auth-input ${validationErrors.phone ? "auth-input-error" : ""}`}
            placeholder="06XXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <p className="auth-input-hint">Format: 06XXXXXXXX ou +212XXXXXXXX</p>
        {getFieldError("phone")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="license_type" className="auth-label">
          Type de permis
        </label>
        <div className="auth-input-wrapper">
          <Car className="auth-input-icon" />
          <select
            id="license_type"
            name="license_type"
            required
            className={`auth-input appearance-none ${validationErrors.license_type ? "auth-input-error" : ""}`}
            value={formData.license_type}
            onChange={handleChange}
          >
            <option value="B">Permis B (Voiture)</option>
          </select>
        </div>
        {getFieldError("license_type")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="password" className="auth-label">
          Mot de passe
        </label>
        <div className="auth-input-wrapper">
          <Lock className="auth-input-icon" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className={`auth-input ${validationErrors.password ? "auth-input-error" : ""}`}
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
        <p className="auth-input-hint">
          Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre
        </p>
        {getFieldError("password")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="confirmPassword" className="auth-label">
          Confirmer le mot de passe
        </label>
        <div className="auth-input-wrapper">
          <Lock className="auth-input-icon" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            className={`auth-input ${!passwordMatch || validationErrors.password_confirmation ? "auth-input-error" : ""}`}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="auth-password-toggle"
            aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {!passwordMatch && <p className="auth-error-message">Les mots de passe ne correspondent pas</p>}
        {getFieldError("password_confirmation")}
      </div>

      <div className="auth-form-group">
        <label htmlFor="cin" className="auth-label">
          Carte d&apos;identité nationale (CIN)
        </label>
        <div className={`auth-file-upload ${cinFile ? "has-file" : ""} ${validationErrors.cin_file ? "auth-input-error" : ""}`}>
          <input
            id="cin"
            name="cin"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="auth-file-input"
            onChange={handleFileChange}
          />
          <div className="auth-file-content">
            <Upload className="auth-file-icon" />
            <div className="auth-file-text">
              {cinFile ? (
                <div className="auth-file-selected">
                  <Check className="auth-file-check" />
                  <span className="auth-file-name">{cinFile.name}</span>
                </div>
              ) : (
                <>
                  <span className="auth-file-label">Télécharger votre CIN</span>
                  <span className="auth-file-hint">Glissez-déposez ou cliquez pour sélectionner</span>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="auth-input-hint">Formats acceptés: JPG, PNG, JEPG (max 5MB)</p>
        {getFieldError("cin_file")}
      </div>


      <button
        type="submit"
        className="auth-submit-button"
        disabled={isLoading || !passwordMatch}
      >
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
            Inscription en cours...
          </>
        ) : (
          "S'inscrire"
        )}
      </button>
      </>
      )}
    </form>
  )
}
