import { LaptopIcon as LaptopCode, ClipboardList, Car, Headset } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Pourquoi choisir Syaqa ?</h2>
          <p>Notre plateforme offre tous les outils nécessaires pour réussir votre examen du permis</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <LaptopCode className="h-8 w-8" />
            </div>
            <h3>Cours interactifs</h3>
            <p>
              Accédez à des cours interactifs avec vidéos, animations et exercices pratiques pour un apprentissage
              engageant et efficace.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3>Quiz et examens blancs</h3>
            <p>
              Testez vos connaissances avec nos quiz thématiques et préparez-vous avec des examens blancs similaires à
              l&apos;examen officiel.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Car className="h-8 w-8" />
            </div>
            <h3>Leçons pratiques</h3>
            <p>
              Découvrez des conseils et astuces pour vos leçons de conduite pratiques avec nos vidéos et guides
              détaillés.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Headset className="h-8 w-8" />
            </div>
            <h3>Support instructeur</h3>
            <p>
              Bénéficiez d&apos;une assistance personnalisée de nos instructeurs qualifiés pour répondre à toutes vos
              questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
