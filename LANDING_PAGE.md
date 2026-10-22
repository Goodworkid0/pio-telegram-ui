# 🎨 pio.gg Landing Page - Design & Implementation

**Modern landing page sa Telegram Mini App detection**

---

## 🎯 Objectives

### Core Goals
1. **Telegram Users:** Automatski redirect na dashboard (seamless experience)
2. **Web Visitors:** Engaging landing page → CTA → Open in Telegram
3. **Developers:** Showcase Community API + documentation
4. **Conversion:** Clear value proposition → high signup rate

### User Flows

```
┌─────────────────────────────────────┐
│     User visits pio.gg              │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │  Detection  │
        └──────┬──────┘
               │
       ┌───────┴───────┐
       │               │
   Telegram?        Web Browser?
       │               │
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│  Dashboard   │  │Landing Page  │
│  (Board)     │  │ + CTA        │
└──────────────┘  └──────────────┘
```

---

## 🏗️ File Structure

```
app/
├── (landing)/
│   ├── layout.tsx                 // Landing-specific layout
│   ├── page.tsx                   // Main landing page
│   └── components/
│       ├── Hero.tsx               // Hero section
│       ├── Features.tsx           // Features grid
│       ├── ApiShowcase.tsx        // API demo
│       ├── HowItWorks.tsx         // Step-by-step guide
│       ├── Pricing.tsx            // Pricing tiers
│       ├── Testimonials.tsx       // Social proof
│       ├── FAQ.tsx                // Frequently asked questions
│       ├── CTA.tsx                // Call-to-action
│       └── Footer.tsx             // Footer
│
├── (dashboard)/
│   ├── layout.tsx                 // Dashboard layout
│   ├── page.tsx                   // Main dashboard (board)
│   └── components/
│       └── Board.tsx              // Community board
│
├── middleware.ts                  // Telegram detection
├── layout.tsx                     // Root layout
└── globals.css                    // Global styles

lib/
├── telegram.ts                    // Telegram SDK utils
├── analytics.ts                   // Analytics tracking
└── hooks/
    └── useTelegramUser.ts         // Telegram user hook

public/
├── images/
│   ├── hero-screenshot.png        // Dashboard preview
│   ├── api-showcase.gif           // API demo GIF
│   └── logos/
│       ├── telegram.svg
│       └── pio-logo.svg
└── videos/
    └── demo.mp4                   // Product demo video
```

---

## 🎨 Landing Page Design

### Color Palette

```css
:root {
  /* Primary - Telegram Blue */
  --primary: #0088cc;
  --primary-hover: #0077b5;
  --primary-light: #e5f4fb;
  
  /* Accent - Electric Purple */
  --accent: #7c3aed;
  --accent-hover: #6d28d9;
  
  /* Neutrals */
  --background: #ffffff;
  --surface: #f9fafb;
  --surface-dark: #111827;
  --text: #111827;
  --text-secondary: #6b7280;
  
  /* Success */
  --success: #10b981;
  
  /* Gradient */
  --gradient: linear-gradient(135deg, #0088cc 0%, #7c3aed 100%);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --surface: #1e293b;
    --text: #f1f5f9;
    --text-secondary: #94a3b8;
  }
}
```

### Typography

```css
/* Inter for UI, JetBrains Mono for code */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

code, pre {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
}
```

---

## 📄 Page Sections

### 1. Hero Section

**Layout:**
```
┌──────────────────────────────────────────────────┐
│  Navigation: [Logo] [Features] [API] [Pricing]  │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Left Column]              [Right Column]      │
│  🚀 Reddit for Telegram      [Screenshot]       │
│  Build communities inside    [Dashboard UI]     │
│  Telegram Mini Apps          [Preview]          │
│                                                  │
│  [Open in Telegram] [Learn More]                │
│  ⭐ 1,234 communities • 50K+ members            │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Copy:**
```
Headline: "Reddit for Telegram Mini Apps"
Subheading: "Build thriving communities inside Telegram with posts, comments, upvotes, and moderation tools."

CTA Primary: "Open in Telegram" (opens tg://resolve?...)
CTA Secondary: "Watch Demo" (scroll to video)

Social Proof: "1,234 communities • 50K+ members • 99.9% uptime"
```

---

### 2. Features Section

**Grid Layout (3 columns):**

```
┌─────────────┬─────────────┬─────────────┐
│ 💬 Discuss  │ 🚀 Engage   │ 🛡️ Moderate │
├─────────────┼─────────────┼─────────────┤
│ 📊 Analytics│ 🎨 Customize│ 🔌 API      │
├─────────────┼─────────────┼─────────────┤
│ 🏡 Self-Host│ 🔥 Burner   │ 🤖 AI Mod   │
└─────────────┴─────────────┴─────────────┘
```

**Features:**
1. **💬 Reddit-style Discussions**
   - Posts, comments, nested replies
   - Upvotes & downvotes
   - Sorting (hot, new, top, controversial)

2. **🚀 Telegram Native**
   - Built as Telegram Mini App
   - No installation required
   - Works on iOS, Android, Desktop

3. **🛡️ Powerful Moderation**
   - Auto-mod rules
   - Content filters
   - Ban/mute users
   - Report system

4. **📊 Deep Analytics**
   - Growth metrics
   - Engagement insights
   - Activity heatmaps
   - Sentiment analysis

5. **🎨 Full Customization**
   - Custom flairs
   - Community branding
   - Custom rules
   - Pinned posts

6. **🔌 Developer API**
   - REST API + Webhooks
   - JavaScript/Python SDKs
   - Build custom bots
   - Integration marketplace

7. **🏡 Self-Hosted Option**
   - Host your own data
   - GDPR/HIPAA compliant
   - Docker deployment
   - Full data ownership

8. **🔥 Burner Messages**
   - Self-destructing posts
   - Burn after read
   - Encrypted content
   - Perfect for sensitive info

9. **🤖 AI-Powered Moderation**
   - Automatic spam detection
   - Hate speech filter
   - NSFW content blocking
   - Custom AI rules

---

### 3. API Showcase Section

**Visual:**
```
┌────────────────────────────────────────────┐
│  Build with pio.gg Community API          │
│                                            │
│  [Code Editor]            [Live Preview]   │
│  ```javascript            ┌──────────────┐ │
│  const pio =              │ 💬 New Post  │ │
│    new PioAPI(key);       │ Title...     │ │
│                           │ Body...      │ │
│  await pio.posts.create({ │ [Submit]     │ │
│    title: "Hello",        │              │ │
│    body: "World"          │ ✅ Posted!   │ │
│  });                      └──────────────┘ │
│  ```                                       │
│                                            │
│  [View Documentation] [Get API Key]       │
└────────────────────────────────────────────┘
```

**Live Code Examples:**
- Create post
- Add comment
- Register webhook
- Fetch analytics

**Interactive Demo:**
- Live API playground
- Real-time response
- Try without signup

---

### 4. How It Works

**Timeline Layout:**

```
Step 1: Open Telegram
├─► Click "Open in Telegram" button
└─► Mini App opens instantly

Step 2: Create Community
├─► Choose community name & slug
└─► Customize settings & branding

Step 3: Invite Members
├─► Share community link
└─► Members join via Telegram

Step 4: Start Posting
├─► Create posts, comment, upvote
└─► Community grows organically
```

---

### 5. Pricing Section

**Tiered Pricing Cards:**

```
┌─────────────┬─────────────┬─────────────┐
│   Starter   │     Pro     │ Enterprise  │
├─────────────┼─────────────┼─────────────┤
│    FREE     │   $9/mo     │   Custom    │
│             │             │             │
│ • 1,000     │ • 10,000    │ • Unlimited │
│   members   │   members   │   members   │
│ • Basic     │ • Advanced  │ • Priority  │
│   features  │   analytics │   support   │
│ • Community │ • Custom    │ • SLA       │
│   support   │   branding  │ • Self-host │
│             │ • API access│ • White-lb  │
│             │             │             │
│ [Start Free]│ [Try Pro]   │ [Contact]   │
└─────────────┴─────────────┴─────────────┘
```

**Add-ons:**
- API Pro: $29/mo (advanced API limits)
- Self-Hosting: $50/mo
- AI Moderation: $19/mo
- Analytics Pro: $15/mo

---

### 6. Testimonials / Social Proof

**Carousel:**

```
┌──────────────────────────────────────────┐
│  "pio.gg transformed our Telegram group  │
│   into a structured community!"          │
│                                          │
│   - Alex, @programming community         │
│   ⭐⭐⭐⭐⭐                                │
│                                          │
│   [< Previous] [1][2][3] [Next >]       │
└──────────────────────────────────────────┘
```

**Stats Bar:**
```
[1,234 Communities] [50K+ Members] [1M+ Posts] [99.9% Uptime]
```

---

### 7. FAQ Section

**Accordion:**

```
▼ What is pio.gg?
  Reddit-style community platform built as Telegram Mini App.

▼ How is it different from Telegram groups?
  Structured posts, upvotes, moderation tools, analytics.

▼ Is it free?
  Yes! Starter plan is free forever for communities up to 1,000 members.

▼ Can I use the API?
  Yes, API access included in Pro plan ($9/mo + $29/mo API add-on).

▼ Is my data secure?
  Yes. All data encrypted. Option for self-hosted deployment.

▼ Can I migrate from Reddit?
  Yes, we provide migration tools (CSV import, API sync).
```

---

### 8. Final CTA Section

**Full-Width Banner:**

```
┌────────────────────────────────────────────────┐
│  🚀 Ready to build your community?             │
│                                                │
│  Join 1,234 communities on pio.gg             │
│                                                │
│  [Open in Telegram] [View Documentation]      │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 9. Footer

**4 Columns:**

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  Product    │  Developers │  Company    │  Legal      │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Features    │ API Docs    │ About       │ Privacy     │
│ Pricing     │ SDKs        │ Blog        │ Terms       │
│ Changelog   │ Webhooks    │ Careers     │ GDPR        │
│ Status      │ GitHub      │ Contact     │ Cookies     │
└─────────────┴─────────────┴─────────────┴─────────────┘

© 2025 pio.gg • Built with ❤️ for Telegram
```

---

## 💻 Implementation

### middleware.ts - Telegram Detection

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next();
  }
  
  // Detect Telegram Mini App
  const isTelegramApp = 
    request.headers.get('user-agent')?.includes('Telegram') ||
    searchParams.get('tgWebAppPlatform') !== null ||
    searchParams.get('tgWebAppVersion') !== null;
  
  // If Telegram user and on landing page → redirect to dashboard
  if (isTelegramApp && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If web user and on dashboard → redirect to landing
  if (!isTelegramApp && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
```

---

### app/(landing)/page.tsx - Landing Page

```typescript
// app/(landing)/page.tsx
import Hero from './components/Hero';
import Features from './components/Features';
import ApiShowcase from './components/ApiShowcase';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

export const metadata = {
  title: 'pio.gg - Reddit for Telegram Mini Apps',
  description: 'Build thriving communities inside Telegram with posts, comments, upvotes, and powerful moderation tools.',
  openGraph: {
    title: 'pio.gg - Reddit for Telegram',
    description: 'Community platform built as Telegram Mini App',
    images: ['/images/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pio.gg - Reddit for Telegram',
    description: 'Build communities in Telegram',
    images: ['/images/twitter-card.png'],
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Hero />
      <Features />
      <ApiShowcase />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
```

---

### app/(landing)/components/Hero.tsx

```typescript
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Play, Users, TrendingUp } from 'lucide-react';

export default function Hero() {
  const telegramDeepLink = 'https://t.me/piogg_bot/app';
  
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
      
      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>1,234 communities already using pio.gg</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Reddit for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Telegram
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Build thriving communities inside Telegram with posts, comments, upvotes, and powerful moderation tools.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={telegramDeepLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg shadow-blue-500/50 transition-all hover:scale-105"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.764 8.317c-.132.589-.475.732-.963.456l-2.66-1.96-1.282 1.234c-.142.142-.26.26-.533.26l.19-2.7 4.906-4.433c.213-.19-.047-.295-.33-.106l-6.062 3.817-2.613-.817c-.568-.177-.578-.568.119-.843l10.215-3.939c.474-.177.889.106.737.843z"/>
                </svg>
                Open in Telegram
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <button
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-gray-900 dark:text-white font-semibold text-lg transition-all hover:scale-105"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
            
            {/* Social Proof Stats */}
            <div className="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>50K+ members</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>99.9% uptime</span>
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
            <div className="relative mx-auto w-full max-w-sm">
              {/* Phone mockup */}
              <div className="relative bg-gray-900 rounded-3xl p-3 shadow-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/hero-screenshot.png"
                    alt="pio.gg Dashboard"
                    width={400}
                    height={800}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

---

### app/(landing)/components/Features.tsx

```typescript
'use client';

import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Zap, 
  Shield, 
  BarChart3, 
  Palette, 
  Code2,
  Server,
  Flame,
  Bot
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Reddit-style Discussions',
    description: 'Posts, comments, nested replies with upvotes & downvotes. Sort by hot, new, top, or controversial.',
    color: 'blue'
  },
  {
    icon: Zap,
    title: 'Telegram Native',
    description: 'Built as Telegram Mini App. No installation required. Works on iOS, Android, and Desktop.',
    color: 'yellow'
  },
  {
    icon: Shield,
    title: 'Powerful Moderation',
    description: 'Auto-mod rules, content filters, ban/mute users, and comprehensive report system.',
    color: 'red'
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Track growth metrics, engagement insights, activity heatmaps, and sentiment analysis.',
    color: 'green'
  },
  {
    icon: Palette,
    title: 'Full Customization',
    description: 'Custom flairs, community branding, rules, pinned posts, and theme customization.',
    color: 'purple'
  },
  {
    icon: Code2,
    title: 'Developer API',
    description: 'REST API + Webhooks with JavaScript/Python SDKs. Build custom bots and integrations.',
    color: 'indigo'
  },
  {
    icon: Server,
    title: 'Self-Hosted Option',
    description: 'Host your own data for GDPR/HIPAA compliance. Docker deployment with full data ownership.',
    color: 'gray'
  },
  {
    icon: Flame,
    title: 'Burner Messages',
    description: 'Self-destructing posts that burn after reading or time. Perfect for sensitive information.',
    color: 'orange'
  },
  {
    icon: Bot,
    title: 'AI-Powered Moderation',
    description: 'Automatic spam detection, hate speech filter, NSFW blocking, and custom AI rules.',
    color: 'pink'
  }
];

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  gray: 'from-gray-500 to-gray-600',
  orange: 'from-orange-500 to-orange-600',
  pink: 'from-pink-500 to-pink-600',
};

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              build communities
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features built specifically for Telegram communities
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorMap[feature.color as keyof typeof colorMap]} mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### app/(landing)/components/ApiShowcase.tsx

```typescript
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Copy, Play } from 'lucide-react';

const codeExamples = {
  javascript: `import { PioAPI } from '@pio.gg/sdk';

const pio = new PioAPI('your_api_key');

// Create a post
const post = await pio.posts.create({
  communityId: 'c_programming',
  title: 'Hello from API!',
  body: 'This post was created via API',
  flair: 'Discussion'
});

// Add a comment
const comment = await pio.comments.create({
  postId: post.id,
  body: 'Great post! 🚀'
});

// Get community stats
const stats = await pio.analytics.get({
  communityId: 'c_programming',
  period: 'last_7_days'
});

console.log(\`Community has \${stats.members} members\`);`,

  python: `from pio_sdk import PioAPI

pio = PioAPI('your_api_key')

# Create a post
post = pio.posts.create(
    community_id='c_programming',
    title='Hello from Python!',
    body='This post was created via API',
    flair='Discussion'
)

# Add a comment
comment = pio.comments.create(
    post_id=post.id,
    body='Great post! 🚀'
)

# Get community stats
stats = pio.analytics.get(
    community_id='c_programming',
    period='last_7_days'
)

print(f"Community has {stats.members} members")`,

  curl: `# Create a post
curl -X POST https://api.pio.gg/v1/posts \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "communityId": "c_programming",
    "title": "Hello from API!",
    "body": "This post was created via API",
    "flair": "Discussion"
  }'

# Get community stats
curl -X GET https://api.pio.gg/v1/analytics \\
  -H "Authorization: Bearer your_api_key" \\
  -G -d "communityId=c_programming" \\
  -d "period=last_7_days"`
};

export default function ApiShowcase() {
  const [activeTab, setActiveTab] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Build with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Community API
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful REST API and webhooks to build custom integrations, bots, and automations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['javascript', 'python', 'curl'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'cURL'}
                </button>
              ))}
            </div>

            {/* Code Block */}
            <div className="relative bg-gray-900 rounded-2xl p-6 overflow-hidden">
              {/* Copy Button */}
              <button
                onClick={copyCode}
                className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>

              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>

            {/* Documentation Link */}
            <div className="mt-6 flex gap-4">
              <a
                href="/docs/api"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                View Documentation
              </a>
              <a
                href="/docs/api/playground"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-500 text-gray-900 dark:text-white font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                Try in Playground
              </a>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Feature
              icon="🔑"
              title="Secure API Keys"
              description="Generate API keys with custom scopes and rate limits. Full audit logging."
            />
            <Feature
              icon="🪝"
              title="Real-time Webhooks"
              description="Subscribe to events like post.created, comment.created, and more. Automatic retries."
            />
            <Feature
              icon="📦"
              title="Official SDKs"
              description="JavaScript/TypeScript, Python, and Go SDKs with full TypeScript support."
            />
            <Feature
              icon="📊"
              title="Advanced Analytics"
              description="Get insights on growth, engagement, top content, and community health."
            />
            <Feature
              icon="🤖"
              title="Build Bots"
              description="Create auto-mod bots, content schedulers, analytics dashboards, and more."
            />
            <Feature
              icon="🔌"
              title="Integration Marketplace"
              description="Discover and install pre-built integrations from the community."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 text-4xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
```

---

## 🎬 Animations

### Scroll Reveal Animation

```typescript
// lib/hooks/useScrollReveal.ts
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return { ref, isInView };
}
```

### Blob Animation

```css
/* globals.css */
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -50px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 20s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
```

---

## 📱 Responsive Design

### Breakpoints

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px'  // Ultra-wide
    }
  }
};
```

### Mobile-First Approach

```tsx
// Example: Hero section responsive classes
<div className="
  grid 
  grid-cols-1       /* Mobile: 1 column */
  lg:grid-cols-2    /* Desktop: 2 columns */
  gap-8             /* Mobile: 8px gap */
  lg:gap-12         /* Desktop: 12px gap */
">
```

---

## 🚀 Performance Optimization

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['pio.gg'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96]
  }
};
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### Font Loading

```typescript
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains'
});
```

---

## 📈 Analytics & Tracking

```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  // PostHog
  if (window.posthog) {
    window.posthog.capture(event, properties);
  }
  
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', event, properties);
  }
}

// Track CTA clicks
trackEvent('cta_clicked', {
  button: 'open_in_telegram',
  location: 'hero'
});
```

---

## ✅ SEO Checklist

- [x] Meta tags (title, description)
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Alt text for images
- [x] Semantic HTML
- [x] Mobile responsive
- [x] Fast load time (<3s)
- [x] HTTPS
- [x] Canonical URLs

---

**Landing page je spremna za implementaciju! 🚀**
