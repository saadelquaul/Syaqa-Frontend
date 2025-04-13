import { Link } from "react-router-dom"
import LoginForm from "@/components/auth/login-form"
import AuthLayout from "@/components/auth/auth-layout"
import bgImage from "@/assets/images/bg1.jpg"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Connexion à Syaqa"
      subtitle="Accédez à votre espace d'apprentissage de conduite"
      backgroundImage={bgImage}
    >
      <LoginForm />

      <div className="mt-9 py-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Vous n&apos;avez pas de compte?{" "}
          <Link to="/register" className="auth-link">
            Créer un compte
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
