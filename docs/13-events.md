# Events - Eventi Dostupni za Mini Apps

Mini App može primati događaje iz Telegram app-a. Handler se postavlja korišćenjem `Telegram.WebApp.onEvent(eventType, eventHandler)` metode.

Unutar `eventHandler` funkcije, `this` objekat se odnosi na `Telegram.WebApp`.

---

## Lifecycle Eventi

### activated (Bot API 8.0+)

Dešava se kada Mini App postane aktivan (npr. otvoren iz minimizovanog stanja ili izabran među tabovima).

**EventHandler:** Ne prima parametre

```javascript
Telegram.WebApp.onEvent('activated', function() {
  console.log('Mini App is now active');
  refreshData();
});
```

### deactivated (Bot API 8.0+)

Dešava se kada Mini App postane neaktivan (npr. minimizovan ili premešten u neaktivan tab).

**EventHandler:** Ne prima parametre

```javascript
Telegram.WebApp.onEvent('deactivated', function() {
  console.log('Mini App is now inactive');
  pauseAnimations();
});
```

---

## Theme Eventi

### themeChanged

Dešava se kada se theme settings promene u Telegram app-u (uključujući prelazak na night mode).

**EventHandler:** Ne prima parametre. Novi theme settings se mogu dobiti preko `this.themeParams` i `this.colorScheme`.

```javascript
Telegram.WebApp.onEvent('themeChanged', function() {
  const theme = this.themeParams;
  const scheme = this.colorScheme; // 'light' ili 'dark'
  
  console.log('Theme changed to:', scheme);
  
  // Ažuriraj UI
  document.body.style.backgroundColor = theme.bg_color;
  document.body.style.color = theme.text_color;
});
```

---

## Viewport Eventi

### viewportChanged

Dešava se kada se promeni vidljivi deo Mini App-a.

**EventHandler:** Prima objekat sa poljem `isStateStable`
- `isStateStable: true` - Resizing je završen
- `isStateStable: false` - Resizing je u toku

```javascript
Telegram.WebApp.onEvent('viewportChanged', function(event) {
  console.log('Viewport height:', this.viewportHeight);
  console.log('Is stable:', event.isStateStable);
  
  if (event.isStateStable) {
    // Finalna visina, ažuriraj layout
    adjustLayout();
  }
});
```

### safeAreaChanged (Bot API 8.0+)

Dešava se kada se promene device safe area insets (npr. zbog rotacije ili screen adjustments).

**EventHandler:** Ne prima parametre. Trenutne vrednosti dostupne preko `this.safeAreaInset`.

```javascript
Telegram.WebApp.onEvent('safeAreaChanged', function() {
  const safe = this.safeAreaInset;
  console.log('Safe area:', safe);
  
  // Ažuriraj padding
  document.body.style.paddingTop = safe.top + 'px';
  document.body.style.paddingBottom = safe.bottom + 'px';
});
```

### contentSafeAreaChanged (Bot API 8.0+)

Dešava se kada se promeni safe area za sadržaj.

**EventHandler:** Ne prima parametre. Dostupno preko `this.contentSafeAreaInset`.

```javascript
Telegram.WebApp.onEvent('contentSafeAreaChanged', function() {
  const contentSafe = this.contentSafeAreaInset;
  console.log('Content safe area:', contentSafe);
  
  adjustContentPadding(contentSafe);
});
```

---

## Button Eventi

### mainButtonClicked

Dešava se kada se pritisne main button.

**EventHandler:** Ne prima parametre

```javascript
Telegram.WebApp.MainButton
  .setText('Submit')
  .onClick(() => {
    console.log('Main button clicked!');
    submitForm();
  })
  .show();

// Ili korišćenjem event-a
Telegram.WebApp.onEvent('mainButtonClicked', function() {
  submitForm();
});
```

### secondaryButtonClicked (Bot API 7.10+)

Dešava se kada se pritisne secondary button.

```javascript
Telegram.WebApp.SecondaryButton
  .setText('Cancel')
  .onClick(() => {
    console.log('Cancel clicked');
    closeForm();
  })
  .show();
```

### backButtonClicked (Bot API 6.1+)

Dešava se kada se pritisne back button.

```javascript
Telegram.WebApp.BackButton.show();

Telegram.WebApp.onEvent('backButtonClicked', function() {
  console.log('Going back');
  navigateBack();
});
```

### settingsButtonClicked (Bot API 6.1+)

Dešava se kada se pritisne Settings item u context menu-u.

```javascript
Telegram.WebApp.SettingsButton.show();

Telegram.WebApp.onEvent('settingsButtonClicked', function() {
  console.log('Opening settings');
  openSettings();
});
```

---

## Fullscreen Eventi (Bot API 8.0+)

### fullscreenChanged

Dešava se kada Mini App uđe ili izađe iz fullscreen moda.

**EventHandler:** Ne prima parametre. Status dostupan preko `this.isFullscreen`.

```javascript
Telegram.WebApp.onEvent('fullscreenChanged', function() {
  if (this.isFullscreen) {
    console.log('Entered fullscreen');
    showFullscreenControls();
  } else {
    console.log('Exited fullscreen');
    hideFullscreenControls();
  }
});
```

### fullscreenFailed

Dešava se ako zahtev za fullscreen mode ne uspe.

**EventHandler:** Prima objekat sa poljem `error`

**Error vrednosti:**
- `UNSUPPORTED` - Fullscreen nije podržan
- `ALREADY_FULLSCREEN` - Već u fullscreen modu

```javascript
Telegram.WebApp.onEvent('fullscreenFailed', function(event) {
  console.error('Fullscreen failed:', event.error);
  
  if (event.error === 'UNSUPPORTED') {
    showMessage('Fullscreen nije podržan na ovom uređaju');
  }
});
```

---

## Home Screen Eventi (Bot API 8.0+)

### homeScreenAdded

Dešava se kada je Mini App uspešno dodat na home screen.

```javascript
Telegram.WebApp.onEvent('homeScreenAdded', function() {
  console.log('Added to home screen!');
  showThankYouMessage();
});
```

### homeScreenChecked

Dešava se nakon provere home screen statusa.

**EventHandler:** Prima objekat sa poljem `status`

**Status vrednosti:**
- `unsupported` - Nije podržano
- `unknown` - Podržano, status nepoznat
- `added` - Već dodato
- `missed` - Nije dodato

```javascript
Telegram.WebApp.checkHomeScreenStatus();

Telegram.WebApp.onEvent('homeScreenChecked', function(event) {
  console.log('Home screen status:', event.status);
  
  if (event.status === 'missed') {
    // Show prompt to add
    showAddToHomeScreenPrompt();
  }
});
```

---

## Accelerometer Eventi (Bot API 8.0+)

### accelerometerStarted

Dešava se kada accelerometer tracking uspešno počne.

```javascript
Telegram.WebApp.Accelerometer.start({ refresh_rate: 100 });

Telegram.WebApp.onEvent('accelerometerStarted', function() {
  console.log('Accelerometer started');
});
```

### accelerometerStopped

Dešava se kada accelerometer tracking prestane.

```javascript
Telegram.WebApp.onEvent('accelerometerStopped', function() {
  console.log('Accelerometer stopped');
});
```

### accelerometerChanged

Dešava se sa specificiranom frekvencijom nakon pozivanja `start()` metode.

**EventHandler:** Ne prima parametre. Vrednosti dostupne preko `this.x`, `this.y`, `this.z`.

```javascript
Telegram.WebApp.onEvent('accelerometerChanged', function() {
  const x = Telegram.WebApp.Accelerometer.x;
  const y = Telegram.WebApp.Accelerometer.y;
  const z = Telegram.WebApp.Accelerometer.z;
  
  console.log(`Acceleration: x=${x}, y=${y}, z=${z} m/s²`);
  
  updateGamePhysics(x, y, z);
});
```

### accelerometerFailed

Dešava se ako zahtev za accelerometer tracking ne uspe.

**EventHandler:** Prima objekat sa poljem `error`

**Error:** `UNSUPPORTED`

```javascript
Telegram.WebApp.onEvent('accelerometerFailed', function(event) {
  console.error('Accelerometer failed:', event.error);
});
```

---

## Device Orientation Eventi (Bot API 8.0+)

### deviceOrientationStarted

Dešava se kada device orientation tracking počne.

### deviceOrientationStopped

Dešava se kada device orientation tracking prestane.

### deviceOrientationChanged

Dešava se sa specificiranom frekvencijom.

**EventHandler:** Ne prima parametre. Vrednosti preko `this.alpha`, `this.beta`, `this.gamma`.

```javascript
Telegram.WebApp.onEvent('deviceOrientationChanged', function() {
  const orientation = Telegram.WebApp.DeviceOrientation;
  
  console.log(`Orientation: alpha=${orientation.alpha}, beta=${orientation.beta}, gamma=${orientation.gamma}`);
  console.log('Absolute:', orientation.absolute);
  
  // Update compass or camera view
  updateCompass(orientation.alpha);
});
```

### deviceOrientationFailed

**Error:** `UNSUPPORTED`

---

## Gyroscope Eventi (Bot API 8.0+)

### gyroscopeStarted

Dešava se kada gyroscope tracking počne.

### gyroscopeStopped

Dešava se kada gyroscope tracking prestane.

### gyroscopeChanged

Dešava se sa specificiranom frekvencijom.

**EventHandler:** Vrednosti preko `this.x`, `this.y`, `this.z`.

```javascript
Telegram.WebApp.onEvent('gyroscopeChanged', function() {
  const gyro = Telegram.WebApp.Gyroscope;
  
  console.log(`Rotation: x=${gyro.x}, y=${gyro.y}, z=${gyro.z} rad/s`);
  
  // Update VR camera rotation
  updateVRRotation(gyro.x, gyro.y, gyro.z);
});
```

### gyroscopeFailed

**Error:** `UNSUPPORTED`

---

## Location Eventi (Bot API 8.0+)

### locationManagerUpdated

Dešava se kada se LocationManager objekat promeni.

```javascript
Telegram.WebApp.onEvent('locationManagerUpdated', function() {
  const manager = Telegram.WebApp.LocationManager;
  console.log('Location available:', manager.isLocationAvailable);
  console.log('Access granted:', manager.isAccessGranted);
});
```

### locationRequested

Dešava se kada su location podaci zatraženi.

**EventHandler:** Prima objekat sa poljem `locationData` tipa `LocationData`.

```javascript
Telegram.WebApp.LocationManager.getLocation((locationData) => {
  // Callback način
});

// Ili event način
Telegram.WebApp.onEvent('locationRequested', function(event) {
  if (event.locationData) {
    console.log('Lat:', event.locationData.latitude);
    console.log('Lng:', event.locationData.longitude);
    console.log('Altitude:', event.locationData.altitude);
    console.log('Speed:', event.locationData.speed);
    
    updateMap(event.locationData);
  } else {
    console.log('Location access denied');
  }
});
```

---

## Sharing Eventi (Bot API 8.0+)

### shareMessageSent

Dešava se kada korisnik uspešno podeli poruku.

```javascript
Telegram.WebApp.shareMessage('msg_123');

Telegram.WebApp.onEvent('shareMessageSent', function() {
  console.log('Message shared successfully!');
  showSuccessAnimation();
});
```

### shareMessageFailed

Dešava se ako deljenje poruke ne uspe.

**EventHandler:** Prima objekat sa poljem `error`

**Error vrednosti:**
- `UNSUPPORTED` - Feature nije podržan
- `MESSAGE_EXPIRED` - Poruka je istekla
- `MESSAGE_SEND_FAILED` - Greška pri slanju
- `USER_DECLINED` - Korisnik zatvorio dialog
- `UNKNOWN_ERROR` - Nepoznata greška

```javascript
Telegram.WebApp.onEvent('shareMessageFailed', function(event) {
  console.error('Share failed:', event.error);
  
  if (event.error === 'USER_DECLINED') {
    // User cancelled
  }
});
```

---

## Emoji Status Eventi (Bot API 8.0+)

### emojiStatusSet

Dešava se kada je emoji status uspešno postavljen.

```javascript
Telegram.WebApp.setEmojiStatus('custom_emoji_id_here', { duration: 3600 });

Telegram.WebApp.onEvent('emojiStatusSet', function() {
  console.log('Emoji status set!');
  unlockAchievement('status_setter');
});
```

### emojiStatusFailed

Dešava se ako postavljanje emoji statusa ne uspe.

**Error vrednosti:**
- `UNSUPPORTED`
- `SUGGESTED_EMOJI_INVALID`
- `DURATION_INVALID`
- `USER_DECLINED`
- `SERVER_ERROR`
- `UNKNOWN_ERROR`

### emojiStatusAccessRequested

Dešava se kada je zatražena dozvola za emoji status.

**EventHandler:** Prima objekat sa poljem `status`

**Status:**
- `allowed` - Korisnik odobrio
- `cancelled` - Korisnik odbio

```javascript
Telegram.WebApp.requestEmojiStatusAccess();

Telegram.WebApp.onEvent('emojiStatusAccessRequested', function(event) {
  if (event.status === 'allowed') {
    console.log('Can now update emoji status programmatically');
    savePermission();
  }
});
```

---

## File Download Eventi (Bot API 8.0+)

### fileDownloadRequested

Dešava se kada korisnik odgovori na zahtev za download fajla.

**EventHandler:** Prima objekat sa poljem `status`

**Status:**
- `downloading` - Download počeo
- `cancelled` - Korisnik odbio

```javascript
Telegram.WebApp.downloadFile({
  url: 'https://example.com/file.pdf',
  file_name: 'document.pdf'
});

Telegram.WebApp.onEvent('fileDownloadRequested', function(event) {
  if (event.status === 'downloading') {
    console.log('Download started');
    trackDownload();
  } else {
    console.log('Download cancelled');
  }
});
```

---

## Invoice Eventi (Bot API 6.1+)

### invoiceClosed

Dešava se kada se otvoren invoice zatvori.

**EventHandler:** Prima objekat sa poljima `url` i `status`

**Status vrednosti:**
- `paid` - Uspešna uplata
- `cancelled` - Korisnik zatvorio bez plaćanja
- `failed` - Neuspelo plaćanje
- `pending` - U obradi (bot će dobiti service message)

```javascript
Telegram.WebApp.openInvoice('https://t.me/$invoice_url');

Telegram.WebApp.onEvent('invoiceClosed', function(event) {
  console.log('Invoice URL:', event.url);
  console.log('Status:', event.status);
  
  if (event.status === 'paid') {
    showSuccessMessage();
    unlockPremiumFeatures();
  } else if (event.status === 'pending') {
    showPendingMessage();
  }
});
```

---

## Popup Eventi (Bot API 6.2+)

### popupClosed

Dešava se kada se popup zatvori.

**EventHandler:** Prima objekat sa poljem `button_id`

```javascript
Telegram.WebApp.showPopup({
  title: 'Confirm Action',
  message: 'Are you sure?',
  buttons: [
    { id: 'yes', type: 'default', text: 'Yes' },
    { id: 'no', type: 'cancel' }
  ]
});

Telegram.WebApp.onEvent('popupClosed', function(event) {
  if (event.button_id === 'yes') {
    performAction();
  } else if (event.button_id === null) {
    // Closed without pressing any button
  }
});
```

---

## QR Scanner Eventi (Bot API 6.4+)

### qrTextReceived

Dešava se svaki put kada scanner uhvati kod sa tekstom.

**EventHandler:** Prima objekat sa poljem `data`

```javascript
Telegram.WebApp.showScanQrPopup({ text: 'Scan QR Code' }, function(text) {
  console.log('QR data:', text);
  
  // Vrati true da zatvoris popup
  if (isValidQR(text)) {
    return true;
  }
  return false;
});

Telegram.WebApp.onEvent('qrTextReceived', function(event) {
  console.log('QR scanned:', event.data);
  processQRCode(event.data);
});
```

### scanQrPopupClosed (Bot API 7.7+)

Dešava se kada korisnik zatvori QR scanner popup.

```javascript
Telegram.WebApp.onEvent('scanQrPopupClosed', function() {
  console.log('QR scanner closed by user');
});
```

---

## Clipboard Eventi (Bot API 6.4+)

### clipboardTextReceived

Dešava se kada se pozove `readTextFromClipboard()` metoda.

**EventHandler:** Prima objekat sa poljem `data`
- `data` - tekst iz clipboard-a
- `data` - prazan string ako clipboard sadrži non-text data
- `data` - `null` ako nema pristupa clipboard-u

```javascript
Telegram.WebApp.readTextFromClipboard();

Telegram.WebApp.onEvent('clipboardTextReceived', function(event) {
  if (event.data === null) {
    console.log('No clipboard access');
  } else if (event.data === '') {
    console.log('Clipboard contains non-text data');
  } else {
    console.log('Clipboard text:', event.data);
    pasteText(event.data);
  }
});
```

---

## Permission Eventi (Bot API 6.9+)

### writeAccessRequested

Dešava se kada je zatražena dozvola za pisanje.

**EventHandler:** Prima objekat sa poljem `status`

**Status:**
- `allowed` - Odobreno
- `cancelled` - Odbijeno

```javascript
Telegram.WebApp.requestWriteAccess();

Telegram.WebApp.onEvent('writeAccessRequested', function(event) {
  if (event.status === 'allowed') {
    console.log('Can now send messages');
  }
});
```

### contactRequested

Dešava se kada je zatražen broj telefona.

**Status:**
- `sent` - Korisnik podelio broj
- `cancelled` - Odbijeno

```javascript
Telegram.WebApp.requestContact();

Telegram.WebApp.onEvent('contactRequested', function(event) {
  if (event.status === 'sent') {
    console.log('Phone number shared');
  }
});
```

---

## Biometric Eventi (Bot API 7.2+)

### biometricManagerUpdated

Dešava se kada se BiometricManager objekat promeni.

### biometricAuthRequested

Dešava se nakon biometrijske autentifikacije.

**EventHandler:** Prima objekat sa poljima `isAuthenticated` i `biometricToken`

### biometricTokenUpdated

Dešava se nakon ažuriranja biometric token-a.

**EventHandler:** Prima objekat sa poljem `isUpdated`

> 📖 [Više o Biometrics](./11-biometrics.md)

---

## Primer: Event Listener Manager

```javascript
class EventManager {
  constructor() {
    this.handlers = {};
  }
  
  on(eventType, handler) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    
    this.handlers[eventType].push(handler);
    Telegram.WebApp.onEvent(eventType, handler);
    
    return this;
  }
  
  off(eventType, handler) {
    if (this.handlers[eventType]) {
      const index = this.handlers[eventType].indexOf(handler);
      if (index > -1) {
        this.handlers[eventType].splice(index, 1);
      }
    }
    
    Telegram.WebApp.offEvent(eventType, handler);
    
    return this;
  }
  
  offAll(eventType) {
    if (this.handlers[eventType]) {
      this.handlers[eventType].forEach(handler => {
        Telegram.WebApp.offEvent(eventType, handler);
      });
      this.handlers[eventType] = [];
    }
    
    return this;
  }
  
  clear() {
    for (let eventType in this.handlers) {
      this.offAll(eventType);
    }
  }
}

// Upotreba
const events = new EventManager();

events
  .on('themeChanged', () => console.log('Theme changed'))
  .on('viewportChanged', (e) => console.log('Viewport:', e))
  .on('mainButtonClicked', handleSubmit);

// Kasnije
events.off('themeChanged', handler);
events.clear(); // Remove all
```

---

## Povezani Resursi

- [Inicijalizacija](./05-initialization.md)
- [Senzori](./09-sensors.md)
- [Location](./10-location.md)
- [Biometrics](./11-biometrics.md)
