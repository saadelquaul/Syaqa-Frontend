import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import HeroSection from '../components/pages/Home/Hero-section';
import FeaturesSection from '../components/pages/Home/Features-section';
import HowItWorks from '../components/pages/Home/How-it-works';
import CoursesSection from '../components/pages/Home/courses-section';
import TestimonialsSection from '../components/pages/Home/testimonials-section';
import FaqSection from '../components/pages/Home/faq-section';
export default function Home() {
    return (
        <>
        <Header/>
        <main>
            <HeroSection/>
            <FeaturesSection/>
            <HowItWorks/>
            <CoursesSection/>
            <TestimonialsSection/>
            <FaqSection/>
        </main>
        <Footer/>
        
        </>

    );
}