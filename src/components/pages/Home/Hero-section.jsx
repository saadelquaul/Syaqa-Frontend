import { Link } from "react-router-dom"
import HeroImage from "../../../assets/images/heroSection.jpeg"

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1>Maîtrisez la conduite avec confiance</h1>
          <p>
            La première plateforme marocaine pour apprendre à conduire efficacement. Préparez votre examen du permis
            avec des cours interactifs, des quiz et un support personnalisé.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Commencer gratuitement
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">15K+</span>
              <span className="stat-text">Étudiants</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-text">Taux de réussite</span>
            </div>
            <div className="stat">
              <span className="stat-number">200+</span>
              <span className="stat-text">Leçons</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={HeroImage} alt="École de conduite" width={600} height={500} />
          <div className="hero-badge">
            <span>N°1 au Maroc</span>
          </div>
        </div>
      </div>
    </section>
  )
}
