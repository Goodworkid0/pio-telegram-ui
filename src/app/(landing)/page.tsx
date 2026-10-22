import { Suspense } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import SelfHosted from './components/SelfHosted';
import ApiShowcase from './components/ApiShowcase';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

export const metadata = {
  title: 'pio.gg - Privacy-First Community Platform for Telegram',
  description: 'Build private, self-hosted communities on Telegram. Full data ownership, end-to-end encryption, and powerful moderation tools. Your data, your rules.',
  keywords: ['telegram', 'community', 'privacy', 'self-hosted', 'encrypted', 'mini app', 'discussion', 'forum', 'data ownership'],
  authors: [{ name: 'pio.gg Team' }],
  openGraph: {
    title: 'pio.gg - Privacy-First Communities on Telegram',
    description: 'Self-hosted community platform with full data ownership. Built as Telegram Mini App with privacy and security at its core.',
    url: 'https://pio.gg',
    siteName: 'pio.gg',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'pio.gg - Reddit for Telegram'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pio.gg - Privacy-First Communities',
    description: 'Self-hosted communities on Telegram. Your data, your rules. Full ownership and control.',
    images: ['/images/twitter-card.png'],
    creator: '@piogg'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  }
};

export default function LandingPage() {
  return (
    <>
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <Hero />
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <Features />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <SelfHosted />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <ApiShowcase />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <HowItWorks />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <Pricing />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
          <FAQ />
        </Suspense>
        
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
