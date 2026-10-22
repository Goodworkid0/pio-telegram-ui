# User-Agent - Dodatne Informacije (Android)

## Pregled

Kada Mini App radi na **Android** uređaju, dodatne informacije se dodaju u User-Agent string za bolji uvid u app okruženje.

---

## Format User-Agent-a

```
Telegram-Android/{app_version} ({manufacturer} {model}; Android {android_version}; SDK {sdk_version}; {performance_class})
```

### Parametri

| Parametar | Opis | Primer |
|-----------|------|--------|
| `{app_version}` | Verzija Telegram app-a | `11.3.3` |
| `{manufacturer} {model}` | Proizvođač i model uređaja | `Google sdk_gphone64_arm64` |
| `{android_version}` | Android OS verzija | `14` |
| `{sdk_version}` | Android SDK verzija | `34` |
| `{performance_class}` | Performance klasa uređaja | `LOW`, `AVERAGE`, `HIGH` |

---

## Primer User-Agent-a

```
Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.136 Mobile Safari/537.36 Telegram-Android/11.3.3 (Google sdk_gphone64_arm64; Android 14; SDK 34; LOW)
```

---

## Performance Class

Uređaji su kategorisani u 3 performance klase:

### 🔴 LOW

**Karakteristike:**
- Nizak broj CPU jezgara
- Mala RAM memorija
- Sporiji GPU
- Stariji uređaji

**Optimizacije:**
- Smanji broj animacija
- Isključi particle efekte
- Koristi niže rezolucije
- Pojednostavi grafiku
- Smanji broj rendered objekata

### 🟡 AVERAGE

**Karakteristike:**
- Mid-range uređaji
- Prosečan performans
- Većina Android uređaja

**Optimizacije:**
- Umereni vizuelni efekti
- Standardna rezolucija
- Uravnotežen quality/performance

### 🟢 HIGH

**Karakteristike:**
- Flagship uređaji
- Mnogo RAM-a
- Moćan CPU/GPU
- Novi uređaji

**Optimizacije:**
- Puni vizuelni efekti
- Visoke rezolucije
- Napredni shader-i
- Maksimalan quality

---

## Parsing User-Agent-a

### JavaScript

```javascript
function parseAndroidUserAgent(userAgent) {
  // Check if Telegram-Android
  if (!userAgent.includes('Telegram-Android')) {
    return null;
  }
  
  // Parse Telegram-Android section
  const match = userAgent.match(/Telegram-Android\/([\d.]+) \(([^;]+); Android ([\d.]+); SDK (\d+); (LOW|AVERAGE|HIGH)\)/);
  
  if (!match) {
    return null;
  }
  
  return {
    appVersion: match[1],
    device: match[2],
    androidVersion: match[3],
    sdkVersion: parseInt(match[4]),
    performanceClass: match[5]
  };
}

// Upotreba
const userAgent = navigator.userAgent;
const androidInfo = parseAndroidUserAgent(userAgent);

if (androidInfo) {
  console.log('Telegram Android detected');
  console.log('App version:', androidInfo.appVersion);
  console.log('Device:', androidInfo.device);
  console.log('Android:', androidInfo.androidVersion);
  console.log('SDK:', androidInfo.sdkVersion);
  console.log('Performance:', androidInfo.performanceClass);
  
  // Apply optimizations
  if (androidInfo.performanceClass === 'LOW') {
    disableHeavyAnimations();
    lowerGraphicsQuality();
  }
} else {
  console.log('Not Android or no performance data');
}
```

---

## Optimizacija Prema Performance Class

### Primer - Game Settings

```javascript
function getOptimalGameSettings(performanceClass) {
  const settings = {
    LOW: {
      particleCount: 10,
      shadowQuality: 'none',
      textureQuality: 'low',
      antialiasing: false,
      postProcessing: false,
      maxFPS: 30
    },
    AVERAGE: {
      particleCount: 50,
      shadowQuality: 'medium',
      textureQuality: 'medium',
      antialiasing: true,
      postProcessing: false,
      maxFPS: 60
    },
    HIGH: {
      particleCount: 200,
      shadowQuality: 'high',
      textureQuality: 'high',
      antialiasing: true,
      postProcessing: true,
      maxFPS: 60
    }
  };
  
  return settings[performanceClass] || settings.AVERAGE;
}

// Primena
const androidInfo = parseAndroidUserAgent(navigator.userAgent);

if (androidInfo) {
  const gameSettings = getOptimalGameSettings(androidInfo.performanceClass);
  
  console.log('Game settings:', gameSettings);
  applyGameSettings(gameSettings);
}
```

### Primer - Animacije

```javascript
class AnimationController {
  constructor() {
    this.performanceClass = this.detectPerformanceClass();
  }
  
  detectPerformanceClass() {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/; (LOW|AVERAGE|HIGH)\)/);
    return match ? match[1] : 'AVERAGE';
  }
  
  shouldAnimate(animationType) {
    const animations = {
      LOW: {
        parallax: false,
        particles: false,
        transitions: false,
        complexEffects: false
      },
      AVERAGE: {
        parallax: false,
        particles: true,
        transitions: true,
        complexEffects: false
      },
      HIGH: {
        parallax: true,
        particles: true,
        transitions: true,
        complexEffects: true
      }
    };
    
    return animations[this.performanceClass][animationType];
  }
  
  getTransitionDuration() {
    const durations = {
      LOW: 0,        // Instant
      AVERAGE: 200,  // 200ms
      HIGH: 300      // 300ms
    };
    
    return durations[this.performanceClass];
  }
}

// Upotreba
const animController = new AnimationController();

if (animController.shouldAnimate('particles')) {
  enableParticleEffects();
}

const transitionTime = animController.getTransitionDuration();
element.style.transition = `all ${transitionTime}ms ease`;
```

---

## CSS Media Queries

Možeš koristiti custom CSS properties za prilagođavanje:

```javascript
// Set CSS variable based on performance
const androidInfo = parseAndroidUserAgent(navigator.userAgent);

if (androidInfo) {
  document.documentElement.style.setProperty(
    '--performance-class',
    androidInfo.performanceClass.toLowerCase()
  );
}
```

```css
/* Default styles */
.animated-element {
  transition: transform 300ms ease;
  will-change: transform;
}

/* Low performance - disable animations */
:root[style*="--performance-class: low"] .animated-element {
  transition: none;
  will-change: auto;
}

/* Particle effects */
.particles {
  opacity: 1;
}

:root[style*="--performance-class: low"] .particles {
  display: none; /* Hide particles on low-end devices */
}
```

---

## Image Loading Strategy

```javascript
function getImageQuality(performanceClass) {
  const qualities = {
    LOW: {
      format: 'webp',
      quality: 60,
      maxWidth: 800
    },
    AVERAGE: {
      format: 'webp',
      quality: 80,
      maxWidth: 1200
    },
    HIGH: {
      format: 'webp',
      quality: 90,
      maxWidth: 1920
    }
  };
  
  return qualities[performanceClass] || qualities.AVERAGE;
}

function loadOptimizedImage(src, performanceClass) {
  const quality = getImageQuality(performanceClass);
  
  // Build optimized URL (example with image CDN)
  const optimizedSrc = `${src}?format=${quality.format}&quality=${quality.quality}&width=${quality.maxWidth}`;
  
  const img = new Image();
  img.src = optimizedSrc;
  
  return img;
}
```

---

## Video Playback

```javascript
function getVideoSettings(performanceClass) {
  const settings = {
    LOW: {
      resolution: '480p',
      bitrate: '500k',
      fps: 24,
      autoplay: false
    },
    AVERAGE: {
      resolution: '720p',
      bitrate: '1500k',
      fps: 30,
      autoplay: true
    },
    HIGH: {
      resolution: '1080p',
      bitrate: '3000k',
      fps: 60,
      autoplay: true
    }
  };
  
  return settings[performanceClass] || settings.AVERAGE;
}

// Apply to video element
const androidInfo = parseAndroidUserAgent(navigator.userAgent);

if (androidInfo) {
  const videoSettings = getVideoSettings(androidInfo.performanceClass);
  
  const video = document.querySelector('video');
  video.src = `video_${videoSettings.resolution}.mp4`;
  
  if (videoSettings.autoplay) {
    video.autoplay = true;
  }
}
```

---

## Canvas/WebGL Optimization

```javascript
function getCanvasSettings(performanceClass) {
  const settings = {
    LOW: {
      pixelRatio: 1,
      antialiasing: false,
      shadowsEnabled: false
    },
    AVERAGE: {
      pixelRatio: window.devicePixelRatio || 1,
      antialiasing: true,
      shadowsEnabled: false
    },
    HIGH: {
      pixelRatio: window.devicePixelRatio || 1,
      antialiasing: true,
      shadowsEnabled: true
    }
  };
  
  return settings[performanceClass] || settings.AVERAGE;
}

// WebGL context
const androidInfo = parseAndroidUserAgent(navigator.userAgent);
const canvasSettings = getCanvasSettings(androidInfo?.performanceClass || 'AVERAGE');

const gl = canvas.getContext('webgl', {
  antialias: canvasSettings.antialiasing,
  powerPreference: androidInfo?.performanceClass === 'LOW' ? 'low-power' : 'high-performance'
});

// Set canvas resolution
canvas.width = window.innerWidth * canvasSettings.pixelRatio;
canvas.height = window.innerHeight * canvasSettings.pixelRatio;
```

---

## Telemetry & Analytics

```javascript
// Send performance class to analytics
const androidInfo = parseAndroidUserAgent(navigator.userAgent);

if (androidInfo) {
  // Google Analytics
  gtag('event', 'device_info', {
    'performance_class': androidInfo.performanceClass,
    'android_version': androidInfo.androidVersion,
    'app_version': androidInfo.appVersion,
    'device_model': androidInfo.device
  });
  
  // Custom analytics
  analytics.track('Device Performance', {
    performanceClass: androidInfo.performanceClass,
    androidVersion: androidInfo.androidVersion,
    sdkVersion: androidInfo.sdkVersion
  });
}
```

---

## Helper Class

```javascript
class TelegramAndroidDetector {
  constructor() {
    this.info = this.parse(navigator.userAgent);
  }
  
  parse(userAgent) {
    const match = userAgent.match(/Telegram-Android\/([\d.]+) \(([^;]+); Android ([\d.]+); SDK (\d+); (LOW|AVERAGE|HIGH)\)/);
    
    if (!match) {
      return null;
    }
    
    return {
      appVersion: match[1],
      device: match[2],
      androidVersion: match[3],
      sdkVersion: parseInt(match[4]),
      performanceClass: match[5]
    };
  }
  
  isAndroid() {
    return this.info !== null;
  }
  
  isLowPerformance() {
    return this.info?.performanceClass === 'LOW';
  }
  
  isHighPerformance() {
    return this.info?.performanceClass === 'HIGH';
  }
  
  shouldReduceAnimations() {
    return this.isLowPerformance();
  }
  
  getOptimalSettings(type) {
    if (!this.isAndroid()) {
      return this.getDefaultSettings(type);
    }
    
    const perfClass = this.info.performanceClass;
    
    const settingsByType = {
      graphics: {
        LOW: { quality: 'low', effects: false },
        AVERAGE: { quality: 'medium', effects: true },
        HIGH: { quality: 'high', effects: true }
      },
      animations: {
        LOW: { enabled: false, duration: 0 },
        AVERAGE: { enabled: true, duration: 200 },
        HIGH: { enabled: true, duration: 300 }
      }
    };
    
    return settingsByType[type]?.[perfClass];
  }
  
  getDefaultSettings(type) {
    // Fallback for non-Android
    return type === 'graphics' 
      ? { quality: 'medium', effects: true }
      : { enabled: true, duration: 200 };
  }
}

// Usage
const detector = new TelegramAndroidDetector();

if (detector.isAndroid()) {
  console.log('Running on Android:', detector.info);
  
  if (detector.shouldReduceAnimations()) {
    console.log('Low performance device - reducing animations');
    disableAnimations();
  }
  
  const graphicsSettings = detector.getOptimalSettings('graphics');
  applyGraphicsSettings(graphicsSettings);
}
```

---

## Best Practices

### 1. ✅ Adaptive Performance

```javascript
// Detect and adapt
const detector = new TelegramAndroidDetector();

if (detector.isLowPerformance()) {
  // Aggressive optimizations
  disableAllAnimations();
  lowerResolution();
  disableEffects();
} else if (detector.isHighPerformance()) {
  // Enable all features
  enablePremiumEffects();
  useHighResAssets();
}
```

### 2. ✅ Graceful Degradation

```javascript
// Start with high quality, reduce if needed
let currentQuality = 'high';

if (detector.isLowPerformance()) {
  currentQuality = 'low';
  console.log('Degrading to low quality');
}

loadAssets(currentQuality);
```

### 3. ✅ User Choice

```javascript
// Let users override auto-detection
const userPreference = localStorage.getItem('graphics_quality');

const quality = userPreference || detector.getOptimalSettings('graphics').quality;

applySettings(quality);
```

### 4. ⚠️ Fallback za Non-Android

```javascript
// Uvek pruži fallback
const detector = new TelegramAndroidDetector();

const performanceClass = detector.isAndroid() 
  ? detector.info.performanceClass 
  : 'AVERAGE'; // Default for iOS/Desktop

applySettings(performanceClass);
```

---

## Povezani Resursi

- [Design Guidelines](./03-design-guidelines.md#hardware-optimizations)
- [Testing](./14-testing.md)
- [Sensors](./09-sensors.md)
