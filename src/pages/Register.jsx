import { Link } from "react-router-dom"
import RegisterForm from "@/components/auth/register-form"
import AuthLayout from "@/components/auth/auth-layout"
import bgImage from "@/assets/images/bg1.jpg"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Créer un compte condidat"
      subtitle="Rejoignez notre plateforme d'apprentissage de conduite"
      backgroundImage= {bgImage}
    >
      <RegisterForm />

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Déjà inscrit?{" "}
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
