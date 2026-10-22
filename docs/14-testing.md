# Testing Mini Apps - Testiranje i Debugging

## Test Okruženje

### Uloguj se u Test Server

Telegram ima potpuno **odvojen test server** od production okruženja. Moraš kreirati novi account i novog bota.

#### iOS

1. Tapni **10 puta** na Settings icon
2. Accounts → Login to another account → **Test**

#### Telegram Desktop

1. Otvori ☰ Settings
2. **Shift + Alt + Right click** na 'Add Account'
3. Izaberi **'Test Server'**

#### macOS

1. Klikni Settings icon **10 puta** (otvara Debug Menu)
2. **⌘ + click** 'Add Account'
3. Uloguj se preko broja telefona

### Kreiraj Test Bota

Na test serveru:
1. Pronađi **@BotFather**
2. Kreiraj novog bota (`/newbot`)
3. Dobij bot token

### Bot API za Test Server

Format zahteva za test server:

```
https://api.telegram.org/bot<token>/test/METHOD_NAME
```

**Primer:**
```javascript
const BOT_TOKEN = 'your_test_bot_token';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/test/`;

// Send message
fetch(API_URL + 'sendMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: chatId,
    text: 'Hello from test environment!'
  })
});
```

### HTTP Links (Test Only)

⚠️ **Napomena:** Na test serveru možeš koristiti **HTTP linkove bez TLS** za testiranje Mini App-a.

```html
<!-- OK na test serveru -->
<script src="http://your-local-ip:3000/app.js"></script>

<!-- Production zahteva HTTPS -->
<script src="https://your-domain.com/app.js"></script>
```

---

## Debug Mode

### iOS

**Korak 1: Omogući Web View Inspection**

1. U Telegram-u tapni **10 puta** na Settings icon
2. Omogući **"Allow Web View Inspection"**

**Korak 2: Poveži iPhone sa Mac-om**

1. Poveži iPhone USB kablom sa računarom
2. Trust računar ako se pojavi prompt

**Korak 3: Safari Developer Tools**

1. Otvori **Safari** na Mac-u
2. Meni: **Develop** → **[Your Device Name]**
3. Pokreni Mini App na iPhone-u
4. U Develop menu-u će se pojaviti Mini App

**Korak 4: Inspect**

- Klikni na Mini App da otvoriš Web Inspector
- Console, Elements, Network, itd. su dostupni

```javascript
// Debug u konzoli
console.log('Debug info:', Telegram.WebApp);
console.table(Telegram.WebApp.themeParams);
```

---

### Android

**Korak 1: Omogući USB Debugging**

1. Idi u **Settings** → **About phone**
2. Tapni **7 puta** na "Build number"
3. Vrati se u Settings → **Developer options**
4. Omogući **USB debugging**

**Korak 2: Omogući WebView Debug u Telegram-u**

1. Telegram Settings
2. Skroluj do kraja
3. **Press and hold** na version number **2 puta**
4. U Debug Settings omogući **"Enable WebView Debug"**

**Korak 3: Poveži Android sa računarom**

1. Poveži USB kablom
2. Odobri USB debugging na telefonu

**Korak 4: Chrome DevTools**

1. Otvori Chrome na računaru
2. Idi na `chrome://inspect/#devices`
3. Pokreni Mini App na telefonu
4. Klikni **"Inspect"** pored Mini App-a

```javascript
// Remote debugging
console.log('Android debug');
debugger; // breakpoint
```

---

### Telegram Desktop (Windows & Linux)

**Korak 1: Preuzmi Beta Verziju**

- Download [Beta Version](https://desktop.telegram.org/changelog) Telegram Desktop-a
- **Napomena:** Ne radi još na macOS verziji

**Korak 2: Omogući Inspection**

1. Settings → **Advanced** → **Experimental settings**
2. Omogući **"Enable webview inspection"**

**Korak 3: Inspect**

1. Pokreni Mini App
2. **Right click** u WebView-u
3. Izaberi **"Inspect"**

DevTools će se otvoriti direktno u Telegram-u.

---

### Telegram macOS

**Korak 1: Preuzmi Beta Verziju**

- Download [Beta Version](https://telegram.org/dl/macos/beta) Telegram macOS-a

**Korak 2: Omogući Debug**

1. Brzo klikni **5 puta** na Settings icon
2. Otvoriće se debug menu
3. Omogući **"Debug Mini Apps"**

**Korak 3: Inspect**

1. Pokreni Mini App
2. **Right click** u Mini App-u
3. Izaberi **"Inspect Element"**

Safari Web Inspector će se otvoriti.

---

## Lokalno Testiranje

### Development Server

**Option 1: Simple HTTP Server (Python)**

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js Server**

```bash
# Install http-server
npm install -g http-server

# Run
http-server -p 8000
```

**Option 3: VS Code Live Server**

1. Install "Live Server" extension
2. Right click HTML fajl → "Open with Live Server"

### Ngrok za Remote Testing

Za testiranje na pravom telefonu bez deployanja:

```bash
# Install ngrok
npm install -g ngrok

# Start local server
python3 -m http.server 8000

# Expose to internet
ngrok http 8000
```

Ngrok će dati HTTPS URL:
```
https://abc123.ngrok.io
```

Koristi ovaj URL u @BotFather za Mini App URL.

---

## Debugging Tehnike

### 1. Console Logging

```javascript
// Osnovni log
console.log('User data:', Telegram.WebApp.initDataUnsafe);

// Table format
console.table(Telegram.WebApp.themeParams);

// Group
console.group('Theme Info');
console.log('Scheme:', Telegram.WebApp.colorScheme);
console.log('BG Color:', Telegram.WebApp.themeParams.bg_color);
console.groupEnd();

// Timing
console.time('init');
initializeApp();
console.timeEnd('init');
```

### 2. Error Handling

```javascript
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  
  // Send to analytics
  sendErrorToServer({
    message: event.error.message,
    stack: event.error.stack,
    platform: Telegram.WebApp.platform,
    version: Telegram.WebApp.version
  });
});

// Promise errors
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### 3. Version Checking

```javascript
function checkSupport() {
  const required = '8.0';
  
  if (!Telegram.WebApp.isVersionAtLeast(required)) {
    console.error(`App requires Bot API ${required}+`);
    console.log('Current version:', Telegram.WebApp.version);
    
    showUpgradeMessage();
    return false;
  }
  
  return true;
}
```

### 4. Feature Detection

```javascript
const features = {
  fullscreen: typeof Telegram.WebApp.requestFullscreen === 'function',
  deviceStorage: !!Telegram.WebApp.DeviceStorage,
  secureStorage: !!Telegram.WebApp.SecureStorage,
  accelerometer: !!Telegram.WebApp.Accelerometer,
  location: !!Telegram.WebApp.LocationManager,
  biometrics: !!Telegram.WebApp.BiometricManager
};

console.table(features);

// Conditional feature usage
if (features.fullscreen) {
  showFullscreenButton();
}
```

### 5. Event Debugging

```javascript
// Log all events
const allEvents = [
  'themeChanged',
  'viewportChanged',
  'mainButtonClicked',
  'backButtonClicked',
  // ... sve ostale
];

allEvents.forEach(eventType => {
  Telegram.WebApp.onEvent(eventType, function(data) {
    console.log(`Event: ${eventType}`, data || 'no data');
  });
});
```

### 6. Network Monitoring

```javascript
// Intercept fetch
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('Fetch:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('Response:', response.status, args[0]);
      return response;
    })
    .catch(error => {
      console.error('Fetch error:', error, args[0]);
      throw error;
    });
};
```

---

## Testing Checklist

### Functionality

- [ ] App se učitava korektno
- [ ] `ready()` se poziva nakon učitavanja
- [ ] Svi button-i funkcionišu
- [ ] Data validation radi
- [ ] Error handling implementiran
- [ ] Offline behavior (ako je potrebno)

### Compatibility

- [ ] iOS (Safari)
- [ ] Android (Chrome WebView)
- [ ] Desktop (Windows, Linux, macOS)
- [ ] Različite verzije Bot API

### Themes

- [ ] Light theme
- [ ] Dark theme
- [ ] Theme switching radi
- [ ] CSS varijable korektno primenjene

### Viewport

- [ ] Expanded state
- [ ] Collapsed state
- [ ] Viewport resize handling
- [ ] Safe areas respected (fullscreen)

### Performance

- [ ] Load time < 3s
- [ ] Smooth animations (60fps)
- [ ] No memory leaks
- [ ] Low-end device testing

### Security

- [ ] `initData` validation
- [ ] XSS protection
- [ ] Secure API calls
- [ ] No sensitive data in localStorage

---

## Performance Monitoring

```javascript
// Track load time
const loadStart = performance.now();

window.addEventListener('load', function() {
  const loadTime = performance.now() - loadStart;
  console.log('Load time:', loadTime.toFixed(2), 'ms');
  
  // Send to analytics
  if (loadTime > 3000) {
    console.warn('Slow load time detected');
  }
});

// Monitor memory
if (performance.memory) {
  setInterval(() => {
    const memoryMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    console.log('Memory usage:', memoryMB, 'MB');
  }, 10000);
}

// FPS monitoring
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  const currentTime = performance.now();
  frames++;
  
  if (currentTime >= lastTime + 1000) {
    const fps = Math.round(frames * 1000 / (currentTime - lastTime));
    console.log('FPS:', fps);
    
    if (fps < 30) {
      console.warn('Low FPS detected');
    }
    
    frames = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(measureFPS);
}

measureFPS();
```

---

## Common Issues

### 1. Mini App se ne učitava

**Provera:**
- Da li je HTTPS? (Production zahteva HTTPS)
- Da li je URL ispravan u @BotFather?
- Da li telegram-web-app.js script učitan?
- Console errors?

### 2. `Telegram.WebApp` je undefined

```javascript
// Wait for script to load
if (window.Telegram && window.Telegram.WebApp) {
  initApp();
} else {
  window.addEventListener('load', initApp);
}
```

### 3. Theme boje ne rade

```javascript
// Fallback boje
const theme = Telegram.WebApp.themeParams;
const bgColor = theme.bg_color || '#ffffff';
const textColor = theme.text_color || '#000000';
```

### 4. Events se ne okidaju

```javascript
// Proveri da li je verzija podržana
if (Telegram.WebApp.isVersionAtLeast('8.0')) {
  Telegram.WebApp.onEvent('fullscreenChanged', handler);
} else {
  console.warn('fullscreenChanged event not supported');
}
```

---

## Debug Helper Class

```javascript
class TelegramDebug {
  static log() {
    console.group('Telegram Web App Debug Info');
    
    console.log('Version:', Telegram.WebApp.version);
    console.log('Platform:', Telegram.WebApp.platform);
    console.log('Color Scheme:', Telegram.WebApp.colorScheme);
    console.log('Is Expanded:', Telegram.WebApp.isExpanded);
    console.log('Viewport Height:', Telegram.WebApp.viewportHeight);
    
    if (Telegram.WebApp.isVersionAtLeast('8.0')) {
      console.log('Is Fullscreen:', Telegram.WebApp.isFullscreen);
      console.log('Is Active:', Telegram.WebApp.isActive);
    }
    
    console.groupCollapsed('Init Data');
    console.log(Telegram.WebApp.initDataUnsafe);
    console.groupEnd();
    
    console.groupCollapsed('Theme Params');
    console.table(Telegram.WebApp.themeParams);
    console.groupEnd();
    
    console.groupEnd();
  }
  
  static testButtons() {
    // Test MainButton
    Telegram.WebApp.MainButton
      .setText('Test Main Button')
      .onClick(() => console.log('Main button clicked!'))
      .show();
    
    // Test BackButton
    Telegram.WebApp.BackButton
      .onClick(() => console.log('Back button clicked!'))
      .show();
  }
  
  static testStorage() {
    Telegram.WebApp.CloudStorage.setItem('test_key', 'test_value', (err, ok) => {
      if (!err) {
        console.log('Storage write OK');
        
        Telegram.WebApp.CloudStorage.getItem('test_key', (err, value) => {
          console.log('Storage read:', value);
        });
      }
    });
  }
}

// Usage
TelegramDebug.log();
TelegramDebug.testButtons();
TelegramDebug.testStorage();
```

---

## Povezani Resursi

- [Design Guidelines](./03-design-guidelines.md)
- [User-Agent Info](./15-user-agent.md)
- [Eventi](./13-events.md)
