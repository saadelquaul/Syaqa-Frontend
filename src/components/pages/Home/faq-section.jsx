import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "Qu'est-ce que Syaqa ?",
    answer:
      "Syaqa est une plateforme d'apprentissage en ligne dédiée à la préparation de l'examen du permis de conduire au Maroc. Nous offrons des cours théoriques, des tests pratiques et des examens blancs pour vous aider à réussir votre permis du premier coup.",
  },
  {
    id: 2,
    question: "Comment fonctionne l'abonnement ?",
    answer:
      "Nous proposons plusieurs formules d'abonnement, allant d'un accès mensuel à un accès annuel. Vous pouvez commencer avec un essai gratuit de 7 jours pour explorer notre plateforme avant de vous engager. Tous nos abonnements donnent accès à l'ensemble du contenu sans restrictions.",
  },
  {
    id: 3,
    question: "La plateforme remplace-t-elle une auto-école traditionnelle ?",
    answer:
      "Syaqa est un complément idéal à votre formation en auto-école traditionnelle. Nous vous aidons à mieux comprendre et à réviser la théorie, mais pour obtenir votre permis, vous devez toujours vous inscrire dans une auto-école agréée pour les leçons pratiques et passer l'examen officiel.",
  },
  {
    id: 4,
    question: "Quels sont les avantages par rapport aux méthodes traditionnelles ?",
    answer:
      "Syaqa vous permet d'apprendre à votre propre rythme, où que vous soyez. Vous pouvez réviser autant de fois que nécessaire, passer des tests illimités, et recevoir des analyses détaillées de vos performances pour cibler les domaines à améliorer. Notre contenu est constamment mis à jour selon les dernières réglementations.",
  },
]

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <h2>Questions fréquentes</h2>
          <p>Trouvez des réponses aux questions les plus courantes sur notre plateforme</p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={faq.id} className={`faq-item ${activeIndex === index ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h3>{faq.question}</h3>
                <span className={`faq-toggle ${activeIndex === index ? "active" : ""}`}>
                  <Plus className="h-4 w-4" />
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  )
}
