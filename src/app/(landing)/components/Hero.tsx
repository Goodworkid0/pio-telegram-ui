'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Play, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Hero() {
  const searchParams = useSearchParams();
  const [showTelegramMessage, setShowTelegramMessage] = useState(false);
  
  useEffect(() => {
    if (searchParams.get('message') === 'telegram-required') {
      setShowTelegramMessage(true);
      setTimeout(() => setShowTelegramMessage(false), 5000);
    }
  }, [searchParams]);
  
  const telegramDeepLink = 'https://t.me/piogg_bot/app';
  
  return (
    <section className="relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
      
      {/* Telegram Required Message */}
      {showTelegramMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          <p className="text-sm font-medium">
            ⚠️ Dashboard is only accessible via Telegram Mini App
          </p>
        </motion.div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span>Privacy-first • Self-hosted • Your data, your rules</span>
            </motion.div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              Community Platform
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                You Own
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Build <span className="font-semibold text-gray-900 dark:text-white">private communities</span> on Telegram with{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">full data ownership</span>.{' '}
              Self-host your data, or use our secure cloud. <span className="font-semibold text-gray-900 dark:text-white">Your community, your rules.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={telegramDeepLink}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg shadow-blue-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.764 8.317c-.132.589-.475.732-.963.456l-2.66-1.96-1.282 1.234c-.142.142-.26.26-.533.26l.19-2.7 4.906-4.433c.213-.19-.047-.295-.33-.106l-6.062 3.817-2.613-.817c-.568-.177-.578-.568.119-.843l10.215-3.939c.474-.177.889.106.737.843z"/>
                </svg>
                Open in Telegram
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-900 dark:text-white font-semibold text-lg transition-all hover:scale-105"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
            
            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span className="font-medium">100% data ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span className="font-medium">Self-hosted option</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path d="M9 10h.01M15 10h.01"/>
                  <path d="M9.5 15a3.5 3.5 0 005 0"/>
                </svg>
                <span className="font-medium">GDPR compliant</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Screenshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Device Frame */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              {/* Phone mockup */}
              <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-gray-900 rounded-b-3xl z-10" />
                
                {/* Screen */}
                <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-inner">
                  {/* Placeholder dashboard screenshot */}
                  <div className="aspect-[9/19] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                        <div>
                          <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                    
                    {/* Posts */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700" />
                              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                {Math.floor(Math.random() * 1000)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="w-3/4 h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded mb-1" />
                              <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-600 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                    💬
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">New Post</div>
                    <div className="text-xs text-gray-500">Just now</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">+124 upvotes</div>
                    <div className="text-xs text-gray-500">Trending now</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 -right-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 border border-gray-200 dark:border-gray-700"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Live</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
