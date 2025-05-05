import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Adresse email invalide";
    }
    
    if (!formData.subject.trim()) newErrors.subject = "Le sujet est requis";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    const loadingToast = toast.loading("Envoi en cours...");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Message envoyé avec succès", { id: loadingToast });
      setSubmitted(true);
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message " + error, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contactez-nous
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Nous sommes là pour répondre à toutes vos questions
              </p>
              <div className="w-24 h-1 bg-[#F97316] mx-auto"></div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Phone className="h-10 w-10 text-[#F97316] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Téléphone</h3>
                <p className="text-gray-600">+212 522 123 456</p>
                <p className="text-gray-600">+212 661 789 012</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Mail className="h-10 w-10 text-[#F97316] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <p className="text-gray-600">contact@syaqa.com</p>
                <p className="text-gray-600">info@syaqa.com</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <MapPin className="h-10 w-10 text-[#F97316] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Adresse</h3>
                <p className="text-gray-600">123 Avenue Mohammed V</p>
                <p className="text-gray-600">Casablanca, Maroc</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">Envoyez-nous un message</h2>
                
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                    <p className="text-gray-600 mb-4">
                      Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="bg-[#F97316] hover:bg-orange-600"
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet*
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={errors.name ? "border-red-500" : ""}
                          placeholder="Votre nom"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email*
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? "border-red-500" : ""}
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Sujet*
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={errors.subject ? "border-red-500" : ""}
                        placeholder="Objet de votre message"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message*
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                          errors.message ? "border-red-500" : "border-slate-300"
                        }`}
                        placeholder="Votre message..."
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-[#F97316] hover:bg-orange-600"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md mt-15 p-6">
                  <div className="flex items-start mb-4">
                    <Clock className="h-5 w-5 text-[#F97316] mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold mb-2">Heures d'ouverture</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Lundi - Vendredi</div>
                        <div>9:00 - 18:00</div>
                        <div>Samedi</div>
                        <div>9:00 - 13:00</div>
                        <div>Dimanche</div>
                        <div>Fermé</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>
              
              <div className="space-y-6">
                {[
                  {
                    question: "Comment s'inscrire à l'auto-école Syaqa ?",
                    answer: "Vous pouvez vous inscrire directement en ligne via notre site web en cliquant sur 'S'inscrire', ou vous pouvez nous rendre visite dans l'un de nos centres."
                  },
                  {
                    question: "Quels sont les tarifs pour le permis B ?",
                    answer: "Nos tarifs varient en fonction de la formule choisie. Nous proposons plusieurs forfaits adaptés à vos besoins. Contactez-nous pour obtenir un devis personnalisé."
                  },
                  {
                    question: "Combien de temps faut-il pour obtenir son permis ?",
                    answer: "La durée moyenne pour obtenir le permis B est de 3 à 6 mois, mais cela dépend de votre disponibilité pour les cours et de votre progression."
                  },
                  {
                    question: "Proposez-vous des formations accélérées ?",
                    answer: "Oui, nous proposons des formations intensives qui permettent d'obtenir le permis plus rapidement. Ces formations sont idéales si vous avez des contraintes de temps."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}