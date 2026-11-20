import { MotionConfig, useReducedMotion } from 'framer-motion';
import { BookingProvider } from './components/BookingContext';
import { BookingForm } from './components/BookingForm';
import { CareGuide } from './components/CareGuide';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Reviews } from './components/Reviews';
import { Studio } from './components/Studio';
import { TopBar } from './components/TopBar';
import { TrustBar } from './components/TrustBar';

export default function App() {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user" transition={reduce ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}>
      <BookingProvider>
        <TopBar />
        <Navbar />
        <main>
          <Hero />
          <TrustBar />
          <Portfolio />
          <Pricing />
          <Studio />
          <CareGuide />
          <Reviews />
          <Faq />
          <BookingForm />
        </main>
        <Footer />
      </BookingProvider>
    </MotionConfig>
  );
}
