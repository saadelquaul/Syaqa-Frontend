import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Send as PaperPlane } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col brand-col">
            <Link href="#" className="footer-logo">
              <img src="/placeholder.svg?height=60&width=180" alt="Logo Syaqa" width={180} height={60} />
            </Link>
            <p className="footer-desc">
              Syaqa est la première plateforme marocaine dédiée à l&apos;apprentissage de la conduite, conçue pour vous
              aider à réussir votre permis du premier coup.
            </p>
            <div className="footer-socials">
              <Link href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </Link>
              <Link href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </Link>
              <Link href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Liens rapides</h4>
            <ul className="footer-links">
              <li>
                <Link href="#">Accueil</Link>
              </li>
              <li>
                <Link href="#courses">Cours</Link>
              </li>
              <li>
                <Link href="#exams">Examens</Link>
              </li>
              <li>
                <Link href="#quizzes">Quiz</Link>
              </li>
              <li>
                <Link href="#about">À propos</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Aide</h4>
            <ul className="footer-links">
              <li>
                <Link href="#">Centre d&apos;aide</Link>
              </li>
              <li>
                <Link href="#faq">FAQ</Link>
              </li>
              <li>
                <Link href="#">Conditions d&apos;utilisation</Link>
              </li>
              <li>
                <Link href="#">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="#">Nous contacter</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <div className="contact-info">
              <p>
                <MapPin className="h-4 w-4" /> YouCode, Safi, Maroc
              </p>
              <p>
                <Phone className="h-4 w-4" /> +212 616 889 565
              </p>
              <p>
                <Mail className="h-4 w-4" /> contact@syaqa.ma
              </p>
            </div>
            <div className="footer-newsletter">
              <h5>Restez informé</h5>
              <form className="newsletter-form">
                <input type="email" placeholder="Votre email" required />
                <button type="submit" aria-label="S&apos;abonner">
                  <PaperPlane className="h-5 w-5 flex place-self-center " />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} Syaqa. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
