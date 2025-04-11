"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, StarHalf, Quote } from "lucide-react"
import PersonImage from "../../../assets/images/PersonPlaceHolder.png"
const testimonials = [
  {
    id: 1,
    text: "Grâce à Syaqa, j'ai réussi mon examen du premier coup ! Les cours étaient très clairs et les examens blancs m'ont parfaitement préparé à l'examen officiel.",
    author: "Karim B.",
    location: "Casablanca",
    rating: 5,
    image: PersonImage,
  },
  {
    id: 2,
    text: "La meilleure plateforme pour apprendre à conduire ! L'application est intuitive et le support des instructeurs est rapide et efficace. Je recommande vivement.",
    author: "Leila M.",
    location: "Rabat",
    rating: 4.5,
    image: PersonImage,
  },
  {
    id: 3,
    text: "J'avais échoué deux fois avant de découvrir Syaqa. Leurs vidéos explicatives et leurs quiz m'ont permis de comprendre mes erreurs. J'ai finalement réussi mon examen !",
    author: "Ahmed T.",
    location: "Tanger",
    rating: 5,
    image: PersonImage,
  },
]

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Ce que disent nos étudiants</h2>
          <p>Découvrez les expériences de nos étudiants qui ont réussi leur examen</p>
        </div>

        <div className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className={`testimonial-slide ${index === currentSlide ? "active" : ""}`}>
              <div className="testimonial-card">
                <div className="testimonial-quote">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={60}
                    height={60}
                    className="author-image"
                  />
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <span>{testimonial.location}</span>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(testimonial.rating)) {
                        return <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      } else if (i < testimonial.rating) {
                        return <StarHalf key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      } else {
                        return <Star key={i} className="h-4 w-4" />
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-controls">
          <button className="testimonial-btn prev" onClick={prevSlide} aria-label="Témoignage précédent">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
          <button className="testimonial-btn next" onClick={nextSlide} aria-label="Témoignage suivant">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
