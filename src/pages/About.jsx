import React from "react";
import { Link } from "react-router-dom";
import { Shield, Target, Users, Award, CheckCircle } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                À propos de <span className="text-[#F97316]">Syaqa</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Une auto-école moderne pour une formation adaptée aux besoins d'aujourd'hui
              </p>
              <div className="w-24 h-1 bg-[#F97316] mx-auto"></div>
            </div>
          </div>
        </section>

        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
                <p className="text-gray-600 mb-4">
                  Chez Syaqa, nous croyons que l'apprentissage de la conduite devrait être 
                  accessible, efficace et adapté au rythme de chacun. Notre mission est de 
                  former des conducteurs responsables et confiants en utilisant des méthodes 
                  pédagogiques modernes et personnalisées.
                </p>
                <p className="text-gray-600">
                  Nous nous efforçons d'offrir une expérience d'apprentissage qui combine 
                  technologie, expertise et accompagnement personnalisé pour garantir votre 
                  réussite.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Shield className="h-12 w-12 text-[#F97316] mb-4" />
                  <h3 className="font-bold text-lg mb-2">Sécurité</h3>
                  <p className="text-gray-600">
                    La sécurité est notre priorité absolue dans toutes nos formations
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Target className="h-12 w-12 text-[#F97316] mb-4" />
                  <h3 className="font-bold text-lg mb-2">Efficacité</h3>
                  <p className="text-gray-600">
                    Des méthodes d'apprentissage optimisées pour votre réussite
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Users className="h-12 w-12 text-[#F97316] mb-4" />
                  <h3 className="font-bold text-lg mb-2">Personnalisation</h3>
                  <p className="text-gray-600">
                    Une approche adaptée à votre rythme et vos besoins
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Award className="h-12 w-12 text-[#F97316] mb-4" />
                  <h3 className="font-bold text-lg mb-2">Qualité</h3>
                  <p className="text-gray-600">
                    Des formateurs experts et un suivi de qualité
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
              <p className="text-gray-600">
                Découvrez les formations adaptées à vos besoins et objectifs
              </p>
            </div>

            <div className="grid md:grid-cols place-items-center gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#F97316]">B</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Permis B</h3>
                <p className="text-gray-600 mb-4">
                  Formation complète au permis voiture avec cours théoriques et pratiques
                </p>
                <ul className="space-y-2">
                  {["Code de la route en ligne", "Cours pratiques flexibles", "Moniteurs expérimentés"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-[#F97316] to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à commencer votre formation ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez Syaqa dès aujourd'hui et bénéficiez d'un accompagnement personnalisé 
              pour obtenir votre permis de conduire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="bg-white text-[#F97316] hover:bg-gray-100 px-8 py-3 rounded-md font-bold"
              >
                Nous contacter
              </Link>
              <Link 
                to="/register" 
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-md font-bold"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}