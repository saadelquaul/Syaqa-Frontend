import { Link } from 'react-router-dom'

export default function CtaSection() {
  return (
    <section className="cta-section" id="register">
      <div className="container">
        <div className="cta-content">
          <h2>Prêt à commencer votre apprentissage et prends ton permis ?</h2>
          <Link to="register" className="btn btn-cta">
            S&apos;inscrire maintenant
          </Link>
        </div>
      </div>
    </section>
  )
}
