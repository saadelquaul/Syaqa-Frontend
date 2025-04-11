import { Link } from 'react-router-dom'

export default function CtaSection() {
  return (
    <section className="cta-section" id="register">
      <div className="container">
        <div className="cta-content">
          <h2>Prêt à commencer votre apprentissage ?</h2>
          <p>Inscrivez-vous gratuitement aujourd&apos;hui et accédez à un cours d&apos;introduction complet.</p>
          <Link href="#" className="btn btn-cta">
            S&apos;inscrire gratuitement
          </Link>
          <span className="cta-note">Pas de carte de crédit requise</span>
        </div>
      </div>
    </section>
  )
}
