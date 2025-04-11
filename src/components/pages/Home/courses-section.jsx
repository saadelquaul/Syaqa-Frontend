import { Link } from "react-router-dom"
import { Book, Clock, Star, StarHalf } from "lucide-react"

export default function CoursesSection() {
  return (
    <section className="courses-section" id="courses">
      <div className="container">
        <div className="section-header">
          <h2>Nos cours populaires</h2>
          <p>Découvrez nos cours les plus appréciés par nos étudiants</p>
        </div>

        <div className="courses-grid">
          <div className="course-card">
            <div className="course-image">
              <img src="/placeholder.svg?height=200&width=350" alt="Code de la route" width={350} height={200} />
              <div className="course-tag">Populaire</div>
            </div>
            <div className="course-content">
              <div className="course-category">Théorie</div>
              <h3>Code de la route complet</h3>
              <div className="course-meta">
                <span>
                  <Book className="h-4 w-4" /> 24 leçons
                </span>
                <span>
                  <Clock className="h-4 w-4" /> 12 heures
                </span>
              </div>
              <p>
                Maîtrisez toutes les règles et panneaux du code de la route marocain pour réussir votre examen
                théorique.
              </p>
              <div className="course-footer">
                <div className="course-rating">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <StarHalf className="h-4 w-4 fill-current text-yellow-400" />
                  <span>4.8</span>
                </div>
                <Link href="#" className="btn btn-outline-sm">
                  Voir plus
                </Link>
              </div>
            </div>
          </div>

          <div className="course-card">
            <div className="course-image">
              <img
                src="/placeholder.svg?height=200&width=350"
                alt="Techniques de conduite"
                width={350}
                height={200}
              />
            </div>
            <div className="course-content">
              <div className="course-category">Pratique</div>
              <h3>Techniques de conduite essentielles</h3>
              <div className="course-meta">
                <span>
                  <Book className="h-4 w-4" /> 18 leçons
                </span>
                <span>
                  <Clock className="h-4 w-4" /> 10 heures
                </span>
              </div>
              <p>Apprenez les techniques fondamentales pour maîtriser votre véhicule et conduire en toute confiance.</p>
              <div className="course-footer">
                <div className="course-rating">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4" />
                  <span>4.0</span>
                </div>
                <Link href="#" className="btn btn-outline-sm">
                  Voir plus
                </Link>
              </div>
            </div>
          </div>

          <div className="course-card">
            <div className="course-image">
              <img src="/placeholder.svg?height=200&width=350" alt="Examens blancs" width={350} height={200} />
              <div className="course-tag">Nouveau</div>
            </div>
            <div className="course-content">
              <div className="course-category">Examen</div>
              <h3>Pack 50 examens blancs</h3>
              <div className="course-meta">
                <span>
                  <Book className="h-4 w-4" /> 50 tests
                </span>
                <span>
                  <Clock className="h-4 w-4" /> 25 heures
                </span>
              </div>
              <p>
                Préparez-vous efficacement avec 50 examens blancs complets qui simulent l&apos;examen officiel du permis
                de conduire.
              </p>
              <div className="course-footer">
                <div className="course-rating">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span>5.0</span>
                </div>
                <Link href="#" className="btn btn-outline-sm">
                  Voir plus
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="courses-cta">
          <Link href="#" className="btn btn-secondary">
            Voir tous les cours
          </Link>
        </div>
      </div>
    </section>
  )
}
