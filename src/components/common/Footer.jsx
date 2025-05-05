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
            <h1 className="text-3xl p-4"><span className="text-[#F97316]">S</span>YAQA</h1>
            </Link>
            <p className="footer-desc">
              Syaqa est la première plateforme marocaine dédiée à l&apos;apprentissage de la conduite, conçue pour vous
              aider à réussir votre permis du premier coup.
            </p>
          </div>

          <div className="footer-col">
          </div>

          <div className="footer-col">  
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
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} Syaqa. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
