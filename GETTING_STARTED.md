# 🚀 Getting Started with pio.gg Landing Page

**Installation guide za lokalni development**

---

## ✅ Kreirana Struktura

```
pio.gg/
├── src/
│   ├── app/
│   │   └── (landing)/
│   │       ├── components/
│   │       │   ├── Navigation.tsx     ✅ Fixed navbar sa Telegram CTA
│   │       │   └── Hero.tsx            ✅ Hero section sa animacijama
│   │       ├── page.tsx                ✅ Main landing page
│   │       └── layout.tsx              ✅ Landing layout
│   ├── middleware.ts                   ✅ Telegram detection
│   └── styles/
│       └── globals.css                 ✅ Global styles + animations
├── docs/
│   ├── PROJECT_PLAN.md                 ✅ Complete project plan
│   ├── ARCHITECTURE.md                 ✅ Technical architecture
│   ├── COMMUNITY_API.md                ✅ API documentation
│   └── LANDING_PAGE.md                 ✅ Landing page design
├── package.json                        ✅ Dependencies
├── tsconfig.json                       ✅ TypeScript config
├── tailwind.config.ts                  ✅ Tailwind setup
├── next.config.js                      ✅ Next.js config
├── postcss.config.js                   ✅ PostCSS config
└── .gitignore                          ✅ Git ignore rules
```

---

## 📦 Step 1: Install Dependencies

```bash
cd /home/c/Desktop/projekti/pio.gg

# Install all dependencies
npm install
```

**Šta se instalira:**
- Next.js 15.0.3 (sa Turbopack)
- React 19.0.0 (latest)
- TypeScript 5.7.2
- Tailwind CSS 3.4.16
- Framer Motion 11.15.0 (animacije)
- Lucide React 0.460.0 (ikone)
- Telegram SDK 2.3.0

---

## 🏃 Step 2: Run Development Server

```bash
npm run dev
```

Server će startovati na **http://localhost:3000**

**Očekivano ponašanje:**
- Ako otvoriš u **regular browser** → Landing page sa CTA "Open in Telegram"
- Ako otvoriš preko **Telegram Mini App** → Automatski redirect na `/dashboard`

---

## 🎨 Šta je Implementirano

### ✅ Middleware (Telegram Detection)

```typescript
// src/middleware.ts
- Detektuje da li je Telegram Mini App
- Telegram user → redirect /dashboard
- Web user → ostaje na landing page
- Web user pokušava /dashboard → redirect na / sa porukom
```

### ✅ Landing Page Components

**1. Navigation.tsx**
- Fixed navbar sa scroll effect
- Desktop + mobile responsive
- "Open in Telegram" CTA button
- Logo + links (Features, API, Pricing, Docs, Blog)

**2. Hero.tsx**
- Animated blob background (3 blobs)
- Floating elements (New Post, Upvotes, Live indicator)
- Phone mockup sa dashboard preview
- CTA buttons: "Open in Telegram" + "Watch Demo"
- Social proof stats (50K+ members, 99.9% uptime)
- Telegram required message ako user dolazi sa /dashboard

### ✅ Animacije (Framer Motion)

- **Blob animations:** 20s infinite floating
- **Floating elements:** Upvotes, new post, live indicator
- **Scroll reveals:** fade-in + slide-up on scroll
- **Hover effects:** Scale on hover, smooth transitions

### ✅ SEO Optimization

```typescript
// Metadata u page.tsx
- Title: "pio.gg - Reddit for Telegram Mini Apps"
- Description: SEO optimized
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Robots meta (index, follow)
```

### ✅ Performance

- **Image optimization:** AVIF + WebP formats
- **Code splitting:** Dynamic imports za heavy components
- **Font loading:** Inter + JetBrains Mono sa display: swap
- **Turbopack:** Brži build times

---

## 🎯 Next Steps - Komponente za Dodavanje

### Missing Components (treba kreirati):

```bash
src/app/(landing)/components/
├── Features.tsx        # Grid sa 9 features (već u LANDING_PAGE.md)
├── ApiShowcase.tsx     # Code examples + live demo
├── HowItWorks.tsx      # Timeline (4 steps)
├── Pricing.tsx         # 3 pricing tiers
├── Testimonials.tsx    # Carousel sa reviews
├── FAQ.tsx             # Accordion sa pitanjima
├── CTA.tsx             # Final call-to-action section
└── Footer.tsx          # 4-column footer
```

Hoćeš da:
1. ✅ **Instaliram dependencies sada?** (`npm install`)
2. 📝 **Kreiram preostale komponente?** (Features, ApiShowcase, itd.)
3. 🎨 **Dodam screenshotove/images?** (mockup slike)
4. 🚀 **Deploy na Vercel?** (production ready)

---

## 🔧 Development Commands

```bash
# Development server (Turbopack)
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 📱 Testing Telegram Detection

### Test 1: Regular Browser
```
URL: http://localhost:3000
Expected: Landing page prikazana
```

### Test 2: Simulate Telegram
```
URL: http://localhost:3000?tgWebAppPlatform=ios
Expected: Redirect na /dashboard
```

### Test 3: Web User na Dashboard
```
URL: http://localhost:3000/dashboard
Expected: Redirect na / sa message=telegram-required
```

---

## 🎨 Customization

### Change Colors

```css
/* src/styles/globals.css */
:root {
  --primary: #0088cc;        /* Telegram Blue */
  --accent: #7c3aed;         /* Purple */
}
```

### Change Fonts

```typescript
// src/app/(landing)/layout.tsx
const inter = Inter({ subsets: ['latin'] });
```

### Telegram Deep Link

```typescript
// Promeni u Navigation.tsx i Hero.tsx
const telegramDeepLink = 'https://t.me/YOUR_BOT/app';
```

---

## 🚀 Deploy na Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

**Environment Variables na Vercel:**
```
NEXT_PUBLIC_APP_URL=https://pio.gg
NEXT_PUBLIC_TELEGRAM_BOT_URL=https://t.me/piogg_bot
```

---

## ✅ Checklist

- [x] Next.js 15 setup
- [x] TypeScript configuration
- [x] Tailwind CSS setup
- [x] Middleware za Telegram detection
- [x] Navigation component
- [x] Hero component sa animacijama
- [x] Responsive design (mobile + desktop)
- [x] SEO meta tags
- [x] Performance optimization
- [ ] Install dependencies (`npm install`)
- [ ] Features component
- [ ] ApiShowcase component
- [ ] HowItWorks component
- [ ] Pricing component
- [ ] Testimonials component
- [ ] FAQ component
- [ ] CTA component
- [ ] Footer component
- [ ] Dashboard page (za Telegram users)
- [ ] Deploy na Vercel

---

**Landing page struktura je spremna! Sledeći korak: `npm install` i kreiranje preostalih komponenti. 🚀**
