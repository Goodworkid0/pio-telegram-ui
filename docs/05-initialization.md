# Inicijalizacija Mini Apps

## Povezivanje SDK-a

Da bi povezali Mini App sa Telegram klijentom, postavi script `telegram-web-app.js` u `<head>` tag **pre svih drugih skripti**:

```html
<script src="https://telegram.org/js/telegram-web-app.js?59"></script>
```

Kada je script povezan, `window.Telegram.WebApp` objekat će postati dostupan.

---

## WebApp Object - Osnovna Polja

### Init Data

| Polje | Tip | Opis |
|-------|-----|------|
| `initData` | String | Raw data string prenesen Mini App-u. **VAŽNO:** Validiraj ove podatke pre upotrebe na serveru! |
| `initDataUnsafe` | WebAppInitData | Objekat sa input podacima. **UPOZORENJE:** Ne veruj ovim podacima - koristi `initData` na serveru nakon validacije. |

### Verzija i Platforma

| Polje | Tip | Opis |
|-------|-----|------|
| `version` | String | Verzija Bot API dostupna u korisnikovoj Telegram app |
| `platform` | String | Ime platforme Telegram app-a korisnika |

### Tema i Boje

| Polje | Tip | Opis |
|-------|-----|------|
| `colorScheme` | String | Trenutna šema boja: `"light"` ili `"dark"`. Dostupno i kao CSS varijabla `var(--tg-color-scheme)` |
| `themeParams` | ThemeParams | Objekat sa trenutnim theme settings-ima |

### Status i Stanje

| Polje | Tip | Opis |
|-------|-----|------|
| `isActive` | Boolean | **Bot API 8.0+** `true` ako je Mini App aktivan, `false` ako je minimizovan |
| `isExpanded` | Boolean | `true` ako je Mini App razvučen na maksimalnu visinu |
| `isClosingConfirmationEnabled` | Boolean | `true` ako je confirmation dialog omogućen pri zatvaranju |
| `isVerticalSwipesEnabled` | Boolean | `true` ako su vertikalni swipe-ovi omogućeni |
| `isFullscreen` | Boolean | **Bot API 8.0+** `true` ako je Mini App u fullscreen modu |
| `isOrientationLocked` | Boolean | **Bot API 8.0+** `true` ako je orijentacija zaključana |

### Viewport Dimenzije

| Polje | Tip | Opis |
|-------|-----|------|
| `viewportHeight` | Float | Trenutna visina vidljive oblasti. Dostupno kao CSS `var(--tg-viewport-height)`. **Napomena:** Refresh rate nije dovoljan za smooth praćenje - koristi za general layout. |
| `viewportStableHeight` | Float | Visina vidljive oblasti u zadnjem stabilnom stanju. Dostupno kao CSS `var(--tg-viewport-stable-height)`. Ažurira se nakon završetka animacija i gestura. |

### Boje UI Elemenata

| Polje | Tip | Opis |
|-------|-----|------|
| `headerColor` | String | Boja header-a u #RRGGBB formatu |
| `backgroundColor` | String | Background boja u #RRGGBB formatu |
| `bottomBarColor` | String | Boja bottom bar-a u #RRGGBB formatu |

### Safe Areas

| Polje | Tip | Opis |
|-------|-----|------|
| `safeAreaInset` | SafeAreaInset | **Bot API 8.0+** Device safe area insets (notch, navigation bar) |
| `contentSafeAreaInset` | ContentSafeAreaInset | **Bot API 8.0+** Safe area za sadržaj, bez Telegram UI elemenata |

### UI Kontrole

| Polje | Tip | Opis |
|-------|-----|------|
| `BackButton` | BackButton | Kontrola za back dugme u header-u |
| `MainButton` | BottomButton | Kontrola za main dugme na dnu |
| `SecondaryButton` | BottomButton | **Bot API 7.10+** Kontrola za secondary dugme |
| `SettingsButton` | SettingsButton | Kontrola za Settings item u context menu-u |

### Feedback i Storage

| Polje | Tip | Opis |
|-------|-----|------|
| `HapticFeedback` | HapticFeedback | Kontrola za haptički feedback |
| `CloudStorage` | CloudStorage | **Bot API 6.9+** Cloud storage (1024 items) |
| `DeviceStorage` | DeviceStorage | **Bot API 9.0+** Lokalno skladište (5MB) |
| `SecureStorage` | SecureStorage | **Bot API 9.0+** Sigurno skladište (10 items) |

### Biometrics i Location

| Polje | Tip | Opis |
|-------|-----|------|
| `BiometricManager` | BiometricManager | **Bot API 7.2+** Biometrijska autentifikacija |
| `LocationManager` | LocationManager | **Bot API 8.0+** Pristup geolokaciji |

### Senzori

| Polje | Tip | Opis |
|-------|-----|------|
| `Accelerometer` | Accelerometer | **Bot API 8.0+** Pristup akcelerometru |
| `DeviceOrientation` | DeviceOrientation | **Bot API 8.0+** Orijentacija uređaja |
| `Gyroscope` | Gyroscope | **Bot API 8.0+** Pristup žiroskopu |

---

## WebApp Object - Metode

### Provera Verzije

```javascript
isVersionAtLeast(version)
```

Vraća `true` ako korisnikova app podržava Bot API verziju jednaku ili višu od prosleđene.

**Primer:**
```javascript
if (Telegram.WebApp.isVersionAtLeast('8.0')) {
  // Koristi fullscreen features
  Telegram.WebApp.requestFullscreen();
}
```

### Boje

```javascript
setHeaderColor(color)
```
**Bot API 6.1+** Postavlja header boju.
- **Format:** `#RRGGBB` ili keywords: `bg_color`, `secondary_bg_color`
- **Napomena Bot API 6.1-6.8:** Samo theme boje

```javascript
setBackgroundColor(color)
```
**Bot API 6.1+** Postavlja background boju.

```javascript
setBottomBarColor(color)
```
**Bot API 7.10+** Postavlja bottom bar boju (primenjuje se i na navigation bar na Android-u).
- **Keywords:** `bg_color`, `secondary_bg_color`, `bottom_bar_bg_color`

### Konfirmacija Zatvaranja

```javascript
enableClosingConfirmation()
disableClosingConfirmation()
```
**Bot API 6.2+** Omogućava/onemogućava confirmation dialog pri zatvaranju.

### Vertical Swipes

```javascript
enableVerticalSwipes()
disableVerticalSwipes()
```
**Bot API 7.7+** Omogućava/onemogućava vertikalne swipe-ove za zatvaranje/minimizaciju.

**Preporuka:** Uvek omogući swipe-ove osim ako ne konfliktuju sa gestovima Mini App-a.

### Fullscreen

```javascript
requestFullscreen()
```
**Bot API 8.0+** Zahteva prelazak u fullscreen mod.

**Preporuka:** Postavi header boju sa `setHeaderColor()` za kontrast sa status bar-om.

```javascript
exitFullscreen()
```
**Bot API 8.0+** Izlazi iz fullscreen moda.

### Screen Orientation

```javascript
lockOrientation()
```
**Bot API 8.0+** Zaključava orijentaciju na trenutni mod (portrait ili landscape).

```javascript
unlockOrientation()
```
**Bot API 8.0+** Otključava orijentaciju - prati rotaciju uređaja.

### Home Screen

```javascript
addToHomeScreen()
```
**Bot API 8.0+** Traži od korisnika da doda Mini App na home screen.

**Event:** `homeScreenAdded` se okine nakon uspešnog dodavanja.

```javascript
checkHomeScreenStatus([callback])
```
**Bot API 8.0+** Proverava da li je dodavanje na home screen podržano i da li je već dodato.

**Callback parametar:** `status` string
- `unsupported` - nije podržano
- `unknown` - podržano, status nepoznat
- `added` - već dodato
- `missed` - nije dodato

### Eventi

```javascript
onEvent(eventType, eventHandler)
```
Postavlja event handler za određeni tip eventa.

```javascript
offEvent(eventType, eventHandler)
```
Briše prethodno postavljeni event handler.

**Primer:**
```javascript
function handleThemeChange() {
  console.log('Theme changed to:', this.colorScheme);
  updateUI();
}

Telegram.WebApp.onEvent('themeChanged', handleThemeChange);

// Later...
Telegram.WebApp.offEvent('themeChanged', handleThemeChange);
```

> 📖 [Lista svih evenata](./13-events.md)

### Slanje Podataka Botu (Keyboard Button Only)

```javascript
sendData(data)
```
Šalje podatke botu (do 4096 bytes). Mini App se zatvara nakon slanja.

**Dostupno samo za:** Mini Apps pokrenute preko Keyboard button-a.

### Inline Query

```javascript
switchInlineQuery(query[, choose_chat_types])
```
**Bot API 6.7+** Ubacuje bot username i inline query u input field.

**Parametri:**
- `query` - može biti prazan string
- `choose_chat_types` - array: `['users', 'bots', 'groups', 'channels']`

### Linkovi

```javascript
openLink(url[, options])
```
Otvara link u eksternom browser-u. Mini App ostaje otvoren.

**Bot API 6.4+** Options: `{try_instant_view: true}` za Instant View.

**Napomena:** Može se pozvati samo kao odgovor na user interaction.

```javascript
openTelegramLink(url)
```
Otvara telegram link unutar Telegram app-a. Mini App ostaje otvoren.

```javascript
openInvoice(url[, callback])
```
**Bot API 6.1+** Otvara invoice.

**Event:** `invoiceClosed` kada se zatvori.

### Sharing

```javascript
shareToStory(media_url[, params])
```
**Bot API 7.8+** Otvara story editor sa medijom.

**Params:** `StoryShareParams` objekat.

```javascript
shareMessage(msg_id[, callback])
```
**Bot API 8.0+** Deli poruku pripremljenu od bota.

**Callback:** Prima boolean - da li je poslato uspešno.

### Emoji Status

```javascript
setEmojiStatus(custom_emoji_id[, params, callback])
```
**Bot API 8.0+** Postavlja custom emoji kao status.

**Params:** `EmojiStatusParams` - npr. `{duration: 3600}`

**Napomena:** Otvara native dialog - ne može programatski bez user interaction.

```javascript
requestEmojiStatusAccess([callback])
```
**Bot API 8.0+** Traži dozvolu za programatsko upravljanje emoji statusom.

### File Download

```javascript
downloadFile(params[, callback])
```
**Bot API 8.0+** Prikazuje popup za download fajla.

**Params:** `DownloadFileParams` - `{url, file_name}`

### Keyboard

```javascript
hideKeyboard()
```
**Bot API 9.1+** Sakriva tastatura ako je vidljiva.

### Popups

```javascript
showPopup(params[, callback])
```
**Bot API 6.2+** Prikazuje native popup.

**Params:** `PopupParams` objekat.

```javascript
showAlert(message[, callback])
```
**Bot API 6.2+** Prikazuje jednostavan alert sa 'Close' dugmetom.

```javascript
showConfirm(message[, callback])
```
**Bot API 6.2+** Prikazuje confirmation sa 'OK' i 'Cancel' dugmadima.

**Callback:** Prima boolean - da li je OK pritisnuto.

### QR Scanner

```javascript
showScanQrPopup(params[, callback])
```
**Bot API 6.4+** Otvara QR code scanner.

**Params:** `ScanQrPopupParams`

**Event:** `qrTextReceived` za svaki skeniran kod.

**Callback:** Vrati `true` da zatvoriš popup.

```javascript
closeScanQrPopup()
```
**Bot API 6.4+** Zatvara QR scanner.

### Clipboard

```javascript
readTextFromClipboard([callback])
```
**Bot API 6.4+** Čita tekst iz clipboard-a.

**Event:** `clipboardTextReceived`

**Napomena:** Samo za Mini Apps iz attachment menu-a i u odgovoru na user interaction.

### Permissions

```javascript
requestWriteAccess([callback])
```
**Bot API 6.9+** Traži dozvolu za slanje poruka.

**Callback:** Prima boolean.

```javascript
requestContact([callback])
```
**Bot API 6.9+** Traži korisnikov broj telefona.

**Callback:** Prima boolean.

### Lifecycle

```javascript
ready()
```
Obaveštava Telegram da je Mini App spreman za prikaz.

**Preporuka:** Pozovi čim se učitaju osnovni elementi. Loading placeholder se sakriva.

```javascript
expand()
```
Razvlači Mini App na maksimalnu visinu.

```javascript
close()
```
Zatvara Mini App.

---

## Primer Inicijalizacije

```javascript
// 1. Proveri verziju
if (!Telegram.WebApp.isVersionAtLeast('6.0')) {
  alert('Molimo ažurirajte Telegram aplikaciju');
  return;
}

// 2. Postavi temu
function applyTheme() {
  const theme = Telegram.WebApp.themeParams;
  document.body.style.backgroundColor = theme.bg_color;
  document.body.style.color = theme.text_color;
}
applyTheme();

// 3. Slušaj promene teme
Telegram.WebApp.onEvent('themeChanged', applyTheme);

// 4. Postavi Main Button
Telegram.WebApp.MainButton
  .setText('Nastavi')
  .onClick(() => {
    console.log('Main button clicked');
  })
  .show();

// 5. Omogući swipe-ove
if (Telegram.WebApp.isVersionAtLeast('7.7')) {
  Telegram.WebApp.enableVerticalSwipes();
}

// 6. Obavesti da je app spreman
Telegram.WebApp.ready();

// 7. Razvuči na punu visinu
Telegram.WebApp.expand();
```

---

## Povezani Resursi

- [ThemeParams](./06-theme-params.md)
- [Eventi](./13-events.md)
- [Storage](./08-storage.md)
- [Senzori](./09-sensors.md)
- [Location](./10-location.md)
- [Biometrics](./11-biometrics.md)
