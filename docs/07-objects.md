# Objects & Data Types - API Reference

Kompletna referenca svih objekata i data tipova u Telegram Mini Apps API-ju.

---

## Table of Contents

1. [WebApp](#webapp-object)
2. [WebAppInitData](#webappinitdata)
3. [WebAppUser](#webappuser)
4. [WebAppChat](#webappchat)
5. [ThemeParams](#themeparams)
6. [BackButton](#backbutton)
7. [MainButton](#mainbutton)
8. [SettingsButton](#settingsbutton)
9. [HapticFeedback](#hapticfeedback)
10. [CloudStorage](#cloudstorage)
11. [BiometricManager](#biometricmanager)
12. [PopupParams](#popupparams)
13. [ScanQrPopupParams](#scanqrpopupparams)
14. [StoryShareParams](#storyshareparams)
15. [SafeAreaInset](#safeareainset)
16. [ContentSafeAreaInset](#contentsafeareainset)
17. [LocationData](#locationdata)
18. [Invoice](#invoice)

---

## WebApp Object

Glavni objekat Mini App-a. Dostupan kao `window.Telegram.WebApp` ili `Telegram.WebApp`.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `initData` | String | Init data (query string) |
| `initDataUnsafe` | [WebAppInitData](#webappinitdata) | Parsiran init data objekat |
| `version` | String | Bot API verzija (npr. "9.1") |
| `platform` | String | `"android"`, `"ios"`, `"macos"`, `"tdesktop"`, `"weba"`, `"webk"`, `"unigram"`, `"unknown"` |
| `colorScheme` | String | `"light"` ili `"dark"` |
| `themeParams` | [ThemeParams](#themeparams) | Theme parametri |
| `isExpanded` | Boolean | Da li je WebView expandovan |
| `viewportHeight` | Float | Visible viewport height (px) |
| `viewportStableHeight` | Float | Stable viewport height bez keyboard-a (px) |
| `isClosingConfirmationEnabled` | Boolean | Da li je closing confirmation enabled |
| `isVerticalSwipesEnabled` | Boolean | Da li je vertical swipe to close enabled (Bot API 7.7+) |
| `isFullscreen` | Boolean | Da li je WebView u fullscreen modu (Bot API 8.0+) |
| `isOrientationLocked` | Boolean | Da li je screen orientation zaključan (Bot API 9.1+) |
| `headerColor` | String | Header color (`"bg_color"`, `"secondary_bg_color"`, ili custom `#RRGGBB`) |
| `backgroundColor` | String | Background color (`#RRGGBB`) |
| `bottomBarColor` | String | Bottom bar color (Bot API 7.10+) |
| `BackButton` | [BackButton](#backbutton) | Back button kontrola |
| `MainButton` | [MainButton](#mainbutton) | Main button kontrola |
| `SecondaryButton` | [MainButton](#mainbutton) | Secondary button (Bot API 7.10+) |
| `SettingsButton` | [SettingsButton](#settingsbutton) | Settings button (Bot API 6.10+) |
| `HapticFeedback` | [HapticFeedback](#hapticfeedback) | Haptic feedback kontrola |
| `CloudStorage` | [CloudStorage](#cloudstorage) | Cloud storage API |
| `BiometricManager` | [BiometricManager](#biometricmanager) | Biometric authentication (Bot API 7.2+) |
| `safeAreaInset` | [SafeAreaInset](#safeareainset) | Safe area insets (Bot API 8.0+) |
| `contentSafeAreaInset` | [ContentSafeAreaInset](#contentsafeareainset) | Content safe area (Bot API 8.0+) |

### Metode

Vidi [Initialization](./05-initialization.md) za kompletnu listu metoda.

---

## WebAppInitData

Objekat koji sadrži init data prosleđene WebApp-u.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `query_id` | String | Optional. Unique identifier za query |
| `user` | [WebAppUser](#webappuser) | Optional. User koji je pokrenuo Mini App |
| `receiver` | [WebAppUser](#webappuser) | Optional. Recipient user u privatnoj poruci (inline mode) |
| `chat` | [WebAppChat](#webappchat) | Optional. Chat iz kojeg je Mini App pokrenuta |
| `chat_type` | String | Optional. Tip chata: `"sender"`, `"private"`, `"group"`, `"supergroup"`, `"channel"` |
| `chat_instance` | String | Optional. Global identifier chat instance-a |
| `start_param` | String | Optional. Parametar iz start URL-a (`?startapp=param`) |
| `can_send_after` | Integer | Optional. Unix timestamp kada user može slati poruku u chatu |
| `auth_date` | Integer | Unix timestamp kada su init data generisani |
| `hash` | String | HMAC-SHA-256 hash za validaciju (vidi [Validation](./12-validation.md)) |

**Primer:**
```javascript
const initData = Telegram.WebApp.initDataUnsafe;

console.log('User:', initData.user);
console.log('Chat:', initData.chat);
console.log('Start param:', initData.start_param);
console.log('Auth date:', new Date(initData.auth_date * 1000));
```

---

## WebAppUser

Objekat koji opisuje korisnika.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `id` | Integer | Unique user identifier |
| `is_bot` | Boolean | Optional. `true` ako je bot |
| `first_name` | String | First name |
| `last_name` | String | Optional. Last name |
| `username` | String | Optional. Username |
| `language_code` | String | Optional. IETF language tag (npr. `"en"`, `"ru"`) |
| `is_premium` | Boolean | Optional. `true` ako ima Telegram Premium |
| `added_to_attachment_menu` | Boolean | Optional. `true` ako je bot dodat u attachment menu |
| `allows_write_to_pm` | Boolean | Optional. `true` ako user dozvoljava botu da mu šalje poruke |
| `photo_url` | String | Optional. HTTPS URL profile photo-a |

**Primer:**
```javascript
const user = Telegram.WebApp.initDataUnsafe.user;

if (user) {
  console.log(`Hello, ${user.first_name}!`);
  console.log('User ID:', user.id);
  console.log('Username:', user.username || 'No username');
  console.log('Language:', user.language_code);
  console.log('Premium:', user.is_premium ? 'Yes' : 'No');
  
  if (user.photo_url) {
    document.getElementById('avatar').src = user.photo_url;
  }
}
```

---

## WebAppChat

Objekat koji opisuje chat.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `id` | Integer | Unique chat identifier |
| `type` | String | Tip chata: `"group"`, `"supergroup"`, `"channel"` |
| `title` | String | Chat title |
| `username` | String | Optional. Chat username |
| `photo_url` | String | Optional. HTTPS URL chat photo-a |

**Primer:**
```javascript
const chat = Telegram.WebApp.initDataUnsafe.chat;

if (chat) {
  console.log('Chat:', chat.title);
  console.log('Type:', chat.type);
  console.log('ID:', chat.id);
  
  if (chat.username) {
    console.log('Link: https://t.me/' + chat.username);
  }
}
```

---

## ThemeParams

Objekat koji sadrži Telegram theme parametre.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `bg_color` | String | Background color (`#RRGGBB`) |
| `text_color` | String | Main text color |
| `hint_color` | String | Hint text color |
| `link_color` | String | Link color |
| `button_color` | String | Button background color |
| `button_text_color` | String | Button text color |
| `secondary_bg_color` | String | Secondary background color |
| `header_bg_color` | String | Header background color (Bot API 6.1+) |
| `accent_text_color` | String | Accent text color (Bot API 6.1+) |
| `section_bg_color` | String | Section background color (Bot API 6.1+) |
| `section_header_text_color` | String | Section header text color (Bot API 6.1+) |
| `subtitle_text_color` | String | Subtitle text color (Bot API 6.1+) |
| `destructive_text_color` | String | Destructive text color (Bot API 6.1+) |
| `section_separator_color` | String | Section separator color (Bot API 7.6+) |
| `bottom_bar_bg_color` | String | Bottom bar background color (Bot API 7.10+) |

**Primer:**
```javascript
const theme = Telegram.WebApp.themeParams;

// Apply theme to CSS
document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color);
document.documentElement.style.setProperty('--tg-text-color', theme.text_color);
document.documentElement.style.setProperty('--tg-button-color', theme.button_color);
```

**CSS Variables:**
```css
:root {
  --tg-theme-bg-color: var(--tg-bg-color, #ffffff);
  --tg-theme-text-color: var(--tg-text-color, #000000);
  --tg-theme-hint-color: var(--tg-hint-color, #999999);
  --tg-theme-link-color: var(--tg-link-color, #2481cc);
  --tg-theme-button-color: var(--tg-button-color, #2481cc);
  --tg-theme-button-text-color: var(--tg-button-text-color, #ffffff);
  --tg-theme-secondary-bg-color: var(--tg-secondary-bg-color, #f4f4f5);
}
```

Vidi [Theme Params](./06-theme-params.md) za više detalja.

---

## BackButton

Kontroliše Back button u header-u Mini App-a.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isVisible` | Boolean | Da li je button vidljiv |

### Metode

| Metoda | Opis |
|--------|------|
| `show()` | Prikazuje back button |
| `hide()` | Sakriva back button |
| `onClick(callback)` | Registruje click handler |
| `offClick(callback)` | Uklanja click handler |

**Primer:**
```javascript
// Prikaži back button
Telegram.WebApp.BackButton.show();

// Handle click
Telegram.WebApp.BackButton.onClick(function() {
  console.log('Back button clicked');
  goToPreviousPage();
});
```

---

## MainButton

Glavni button na dnu Mini App-a.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `text` | String | Button text |
| `color` | String | Button background color (`#RRGGBB`) |
| `textColor` | String | Button text color (`#RRGGBB`) |
| `isVisible` | Boolean | Da li je button vidljiv |
| `isActive` | Boolean | Da li je button aktivan (clickable) |
| `isProgressVisible` | Boolean | Da li se prikazuje loading spinner |

### Metode

| Metoda | Opis |
|--------|------|
| `setText(text)` | Postavlja button text |
| `setParams(params)` | Postavlja button parametre (`text`, `color`, `text_color`, `is_active`, `is_visible`) |
| `show()` | Prikazuje button |
| `hide()` | Sakriva button |
| `enable()` | Omogućava button |
| `disable()` | Onemogućava button |
| `showProgress(leaveActive)` | Prikazuje loading spinner |
| `hideProgress()` | Sakriva loading spinner |
| `onClick(callback)` | Registruje click handler |
| `offClick(callback)` | Uklanja click handler |

**Primer:**
```javascript
// Konfiguriši button
Telegram.WebApp.MainButton
  .setText('Submit')
  .setParams({
    color: '#2481cc',
    text_color: '#ffffff'
  })
  .show()
  .onClick(handleSubmit);

// Handle click
function handleSubmit() {
  // Show loading
  Telegram.WebApp.MainButton.showProgress();
  
  // Submit data
  submitForm().then(() => {
    Telegram.WebApp.MainButton.hideProgress();
    Telegram.WebApp.close();
  });
}
```

**SecondaryButton** (Bot API 7.10+) ima ista polja i metode kao MainButton.

---

## SettingsButton

Settings button u header-u Mini App-a (Bot API 6.10+).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isVisible` | Boolean | Da li je button vidljiv |

### Metode

| Metoda | Opis |
|--------|------|
| `show()` | Prikazuje settings button |
| `hide()` | Sakriva settings button |
| `onClick(callback)` | Registruje click handler |
| `offClick(callback)` | Uklanja click handler |

**Primer:**
```javascript
Telegram.WebApp.SettingsButton.show();

Telegram.WebApp.SettingsButton.onClick(function() {
  showSettingsPage();
});
```

---

## HapticFeedback

Upravlja haptic feedback-om (vibracija).

### Metode

| Metoda | Opis |
|--------|------|
| `impactOccurred(style)` | Impact haptic. Style: `"light"`, `"medium"`, `"heavy"`, `"rigid"`, `"soft"` |
| `notificationOccurred(type)` | Notification haptic. Type: `"error"`, `"success"`, `"warning"` |
| `selectionChanged()` | Selection change haptic |

**Primer:**
```javascript
// Light tap
Telegram.WebApp.HapticFeedback.impactOccurred('light');

// Success notification
Telegram.WebApp.HapticFeedback.notificationOccurred('success');

// Selection change
Telegram.WebApp.HapticFeedback.selectionChanged();
```

Vidi [Haptic Feedback](./05-initialization.md#hapticfeedback) za više detalja.

---

## CloudStorage

Key-value cloud storage sa do 1024 itema.

### Metode

| Metoda | Signature |
|--------|-----------|
| `setItem(key, value, callback)` | Postavlja item |
| `getItem(key, callback)` | Dobavlja item |
| `getItems(keys, callback)` | Dobavlja multiple items |
| `removeItem(key, callback)` | Briše item |
| `removeItems(keys, callback)` | Briše multiple items |
| `getKeys(callback)` | Dobavlja sve keys |

**Primer:**
```javascript
// Set item
Telegram.WebApp.CloudStorage.setItem('username', 'john_doe', function(error, success) {
  if (success) {
    console.log('Username saved');
  }
});

// Get item
Telegram.WebApp.CloudStorage.getItem('username', function(error, value) {
  if (!error) {
    console.log('Username:', value);
  }
});

// Get multiple items
Telegram.WebApp.CloudStorage.getItems(['username', 'score', 'level'], function(error, values) {
  if (!error) {
    console.log('Data:', values);
    // { username: 'john_doe', score: '1000', level: '5' }
  }
});
```

Vidi [Storage](./08-storage.md#cloudstorage) za više detalja.

---

## BiometricManager

Upravlja biometric authentication-om (Bot API 7.2+).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isInited` | Boolean | Da li je inicijalizovan |
| `isBiometricAvailable` | Boolean | Da li je biometrija dostupna |
| `biometricType` | String | `"finger"`, `"face"`, `"unknown"` |
| `isAccessRequested` | Boolean | Da li je pristup zatražen |
| `isAccessGranted` | Boolean | Da li je pristup odobren |
| `isBiometricTokenSaved` | Boolean | Da li je token snimljen |
| `deviceId` | String | Unique device identifier |

### Metode

| Metoda | Opis |
|--------|------|
| `init(callback)` | Inicijalizuje manager |
| `requestAccess(params, callback)` | Zahteva biometric access |
| `authenticate(params, callback)` | Autentifikuje korisnika |
| `updateBiometricToken(token, callback)` | Snima ili briše token |
| `openSettings()` | Otvara biometric settings |

**Primer:**
```javascript
// Initialize
Telegram.WebApp.BiometricManager.init(function() {
  console.log('Biometric type:', Telegram.WebApp.BiometricManager.biometricType);
});

// Request access
Telegram.WebApp.BiometricManager.requestAccess({
  reason: 'Enable quick login'
}, function(granted) {
  if (granted) {
    console.log('Access granted');
  }
});

// Authenticate
Telegram.WebApp.BiometricManager.authenticate({
  reason: 'Confirm payment'
}, function(success, token) {
  if (success) {
    console.log('Authenticated');
  }
});
```

Vidi [Biometrics](./11-biometrics.md) za više detalja.

---

## PopupParams

Parametri za `showPopup()` metodu.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `title` | String | Optional. Popup title (max 64 chars) |
| `message` | String | Popup message (1-256 chars) |
| `buttons` | Array<PopupButton> | Optional. Lista buttons (1-3, default je OK) |

### PopupButton

| Polje | Tip | Opis |
|-------|-----|------|
| `id` | String | Optional. Button identifier (vraćen u callback-u) |
| `type` | String | Optional. `"default"`, `"ok"`, `"close"`, `"cancel"`, `"destructive"` |
| `text` | String | Optional. Button text (max 64 chars) |

**Primer:**
```javascript
Telegram.WebApp.showPopup({
  title: 'Confirm Action',
  message: 'Are you sure you want to delete this item?',
  buttons: [
    { id: 'cancel', type: 'cancel', text: 'Cancel' },
    { id: 'delete', type: 'destructive', text: 'Delete' }
  ]
}, function(buttonId) {
  if (buttonId === 'delete') {
    deleteItem();
  }
});
```

---

## ScanQrPopupParams

Parametri za `showScanQrPopup()` metodu (Bot API 6.4+).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `text` | String | Optional. Tekst koji se prikazuje u popup-u (max 64 chars) |

**Primer:**
```javascript
Telegram.WebApp.showScanQrPopup({
  text: 'Scan QR code to continue'
}, function(text) {
  if (text) {
    console.log('Scanned:', text);
    processQrCode(text);
  }
});
```

---

## StoryShareParams

Parametri za `shareToStory()` metodu (Bot API 7.8+).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `text` | String | Optional. Tekst story-ja (0-200 chars za premium, 0-28 za obične) |
| `widget_link` | Object | Optional. Widget link objekat |
| `widget_link.url` | String | URL za widget (mora biti https://t.me/{bot_username}/{app_name}) |
| `widget_link.name` | String | Optional. Display name za widget link |

**Primer:**
```javascript
Telegram.WebApp.shareToStory('https://example.com/photo.jpg', {
  text: 'Check out my high score!',
  widget_link: {
    url: 'https://t.me/mybot/mygame',
    name: 'Play Game'
  }
});
```

---

## SafeAreaInset

Safe area insets (Bot API 8.0+). Područje koje nije sakriveno systemskim UI elementima (notch, home indicator, etc.).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `top` | Integer | Top inset u pixels |
| `bottom` | Integer | Bottom inset u pixels |
| `left` | Integer | Left inset u pixels |
| `right` | Integer | Right inset u pixels |

**Primer:**
```javascript
const safeArea = Telegram.WebApp.safeAreaInset;

console.log('Safe area:');
console.log('Top:', safeArea.top);
console.log('Bottom:', safeArea.bottom);
console.log('Left:', safeArea.left);
console.log('Right:', safeArea.right);

// Apply to CSS
document.documentElement.style.setProperty('--safe-area-top', safeArea.top + 'px');
document.documentElement.style.setProperty('--safe-area-bottom', safeArea.bottom + 'px');
```

**CSS:**
```css
.container {
  padding-top: var(--safe-area-top);
  padding-bottom: var(--safe-area-bottom);
  padding-left: var(--safe-area-left);
  padding-right: var(--safe-area-right);
}
```

---

## ContentSafeAreaInset

Content safe area insets (Bot API 8.0+). Područje koje nije sakriveno Telegram UI elementima (header, bottom bar, etc.).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `top` | Integer | Top inset u pixels |
| `bottom` | Integer | Bottom inset u pixels |
| `left` | Integer | Left inset u pixels |
| `right` | Integer | Right inset u pixels |

**Primer:**
```javascript
const contentSafeArea = Telegram.WebApp.contentSafeAreaInset;

console.log('Content safe area:');
console.log('Top:', contentSafeArea.top);
console.log('Bottom:', contentSafeArea.bottom);

// Apply to CSS
document.documentElement.style.setProperty('--content-safe-area-top', contentSafeArea.top + 'px');
document.documentElement.style.setProperty('--content-safe-area-bottom', contentSafeArea.bottom + 'px');
```

---

## LocationData

Objekat koji sadrži podatke o trenutnoj lokaciji (Bot API 8.0+).

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `latitude` | Float | Geografska širina u stepenima |
| `longitude` | Float | Geografska dužina u stepenima |
| `altitude` | Float | Optional. Nadmorska visina u metrima |
| `course` | Float | Optional. Smer kretanja u stepenima (0=North) |
| `speed` | Float | Optional. Brzina u m/s |
| `horizontal_accuracy` | Float | Optional. Tačnost lat/lng u metrima |
| `vertical_accuracy` | Float | Optional. Tačnost altitude u metrima |
| `course_accuracy` | Float | Optional. Tačnost course u stepenima |
| `speed_accuracy` | Float | Optional. Tačnost speed u m/s |

**Primer:**
```javascript
Telegram.WebApp.LocationManager.getLocation(function(locationData) {
  if (locationData) {
    console.log('Location:');
    console.log('Lat:', locationData.latitude);
    console.log('Lng:', locationData.longitude);
    console.log('Accuracy:', locationData.horizontal_accuracy, 'm');
    
    if (locationData.speed) {
      console.log('Speed:', (locationData.speed * 3.6).toFixed(1), 'km/h');
    }
    
    if (locationData.altitude) {
      console.log('Altitude:', locationData.altitude, 'm');
    }
  }
});
```

Vidi [Location](./10-location.md) za više detalja.

---

## Invoice

Objekat koji opisuje invoice za payment.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `title` | String | Product name (1-32 chars) |
| `description` | String | Product description (1-255 chars) |
| `payload` | String | Bot-defined invoice payload (1-128 bytes) |
| `provider_token` | String | Payment provider token |
| `currency` | String | Three-letter ISO 4217 currency code (npr. `"USD"`) |
| `prices` | Array<LabeledPrice> | Lista price portions |
| `max_tip_amount` | Integer | Optional. Maximum tip u smallest currency units |
| `suggested_tip_amounts` | Array<Integer> | Optional. Suggested tip amounts |
| `provider_data` | String | Optional. JSON-encoded data za payment provider |
| `photo_url` | String | Optional. Product photo URL |
| `photo_size` | Integer | Optional. Photo size u bytes |
| `photo_width` | Integer | Optional. Photo width u pixels |
| `photo_height` | Integer | Optional. Photo height u pixels |
| `need_name` | Boolean | Optional. Zahteva ime |
| `need_phone_number` | Boolean | Optional. Zahteva broj telefona |
| `need_email` | Boolean | Optional. Zahteva email |
| `need_shipping_address` | Boolean | Optional. Zahteva shipping adresu |
| `send_phone_number_to_provider` | Boolean | Optional. Šalje broj telefona provideru |
| `send_email_to_provider` | Boolean | Optional. Šalje email provideru |
| `is_flexible` | Boolean | Optional. Da li zavisi od shipping adrese |

### LabeledPrice

| Polje | Tip | Opis |
|-------|-----|------|
| `label` | String | Portion label |
| `amount` | Integer | Price amount u smallest currency units |

**Primer:**
```javascript
Telegram.WebApp.openInvoice('https://t.me/$your_invoice_url', function(status) {
  if (status === 'paid') {
    console.log('Payment successful!');
    deliverProduct();
  } else if (status === 'cancelled') {
    console.log('Payment cancelled');
  } else if (status === 'failed') {
    console.log('Payment failed');
  } else if (status === 'pending') {
    console.log('Payment pending');
  }
});
```

---

## Event Objects

### viewport Changed Event

```javascript
{
  isStateStable: Boolean // Da li je viewport transition završena
}
```

### themeChanged Event

```javascript
// No additional fields - use Telegram.WebApp.themeParams
```

### popupClosed Event

```javascript
{
  button_id: String // ID buttona koji je kliknut, ili null
}
```

### qrTextReceived Event

```javascript
{
  data: String // Scanned QR code text
}
```

### clipboardTextReceived Event

```javascript
{
  data: String // Clipboard text
}
```

### writeAccessRequested Event

```javascript
{
  status: String // "allowed" ili "cancelled"
}
```

### contactRequested Event

```javascript
{
  status: String, // "sent" ili "cancelled"
  response: String, // ResponseID za "sent"
  responseUnsafe: {
    contact: {
      phone_number: String,
      first_name: String,
      last_name: String,
      user_id: Integer
    }
  }
}
```

### invoiceClosed Event

```javascript
{
  url: String, // Invoice URL
  status: String // "paid", "cancelled", "failed", "pending"
}
```

### fullscreenChanged Event (Bot API 8.0+)

```javascript
// No additional fields - use Telegram.WebApp.isFullscreen
```

### fullscreenFailed Event (Bot API 8.0+)

```javascript
{
  error: String // Error message
}
```

### homeScreenAdded Event (Bot API 8.0+)

```javascript
// No additional fields
```

### homeScreenChecked Event (Bot API 8.0+)

```javascript
{
  status: String // "unsupported", "unknown", "added", "missed"
}
```

---

## Type Aliases

### String

JavaScript string. Svi stringovi su UTF-8 encoded.

### Integer

JavaScript number (integer). Može biti signed ili unsigned depending na context.

### Float

JavaScript number (floating point).

### Boolean

JavaScript boolean (`true` ili `false`).

---

## Povezani Resursi

- [Initialization](./05-initialization.md) - WebApp metode
- [Theme Params](./06-theme-params.md) - ThemeParams detalji
- [Storage](./08-storage.md) - CloudStorage API
- [Biometrics](./11-biometrics.md) - BiometricManager API
- [Location](./10-location.md) - LocationManager i LocationData
- [Events](./13-events.md) - Event handler-i
