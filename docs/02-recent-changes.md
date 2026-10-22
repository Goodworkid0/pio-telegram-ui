# Recent Changes - Istorijat Izmena

## Bot API 9.1 (Juli 3, 2025)

### Novo

- Dodata metoda `hideKeyboard()` u klasu `WebApp`
  - Skriva tastaturna kad je vidljiva
  - Ne radi ništa ako tastatura nije aktivna

---

## Bot API 9.0 (April 11, 2025)

### Novo

- **DeviceStorage** - Persistent lokalno skladište na uređaju korisnika
  - Do 5MB po korisniku
  - Slično browser localStorage API
  
- **SecureStorage** - Sigurno lokalno skladište za osetljive podatke
  - iOS: koristi system Keychain
  - Android: koristi Keystore
  - Enkripcija at rest
  - Do 10 items po korisniku

---

## Bot API 8.0 (Novembar 17, 2024)

> **Najveći update u istoriji Telegram mini apps-a** - više od 10 novih funkcionalnosti i opcija za monetizaciju.
> 
> [Detaljni blog post](https://telegram.org/blog/mini-apps-8-0)

### Full-screen Mode

Mini Apps sada mogu postati full-screen u portrait i landscape modu.

**Nove metode:**
- `requestFullscreen()` - prelazak u fullscreen
- `exitFullscreen()` - izlazak iz fullscreen-a

**Nova polja:**
- `safeAreaInset` - safe area margins uređaja
- `contentSafeAreaInset` - safe area za sadržaj
- `isActive` - da li je Mini App trenutno aktivan
- `isFullscreen` - da li je u fullscreen modu

**Novi eventi:**
- `activated` - kada Mini App postane aktivan
- `deactivated` - kada Mini App postane neaktivan
- `safeAreaChanged` - promena safe area
- `contentSafeAreaChanged` - promena content safe area
- `fullscreenChanged` - promena fullscreen statusa
- `fullscreenFailed` - greška pri fullscreen-u

### Homescreen Shortcuts

Mini Apps se sada mogu pokrenuti preko shortcut-a na home screen-u mobilnih uređaja.

**Nove metode:**
- `addToHomeScreen()` - kreiranje shortcut-a
- `checkHomeScreenStatus()` - provera statusa shortcut-a

**Novi eventi:**
- `homeScreenAdded`
- `homeScreenChecked`

### Emoji Status

Mini Apps mogu tražiti od korisnika da postave emoji status.

**Nove metode:**
- `setEmojiStatus(custom_emoji_id, params, callback)` - ručno postavljanje
- `requestEmojiStatusAccess(callback)` - traženje dozvole za automatsko ažuriranje

**Novi eventi:**
- `emojiStatusSet`
- `emojiStatusFailed`
- `emojiStatusAccessRequested`

### Media Sharing and File Downloads

Korisnici mogu deliti media direktno iz Mini Apps-a.

**Nove metode:**
- `shareMessage(msg_id, callback)` - deljenje poruka u chatove
- `downloadFile(params, callback)` - download fajlova

**Novi eventi:**
- `shareMessageSent`
- `shareMessageFailed`
- `fileDownloadRequested`

### Geolocation Access

Mini Apps mogu tražiti pristup geolokaciji.

**Nova polja:**
- `LocationManager` u `WebApp` klasi

**Novi eventi:**
- `locationManagerUpdated`
- `locationRequested`

### Device Motion Tracking

Praćenje detaljnih podataka o pokretima uređaja.

**Nova polja:**
- `isOrientationLocked`
- `Accelerometer`
- `DeviceOrientation`
- `Gyroscope`

**Nove metode:**
- `lockOrientation()`
- `unlockOrientation()`

**Novi eventi:**
- `accelerometerStarted`, `accelerometerStopped`, `accelerometerChanged`, `accelerometerFailed`
- `deviceOrientationStarted`, `deviceOrientationStopped`, `deviceOrientationChanged`, `deviceOrientationFailed`
- `gyroscopeStarted`, `gyroscopeStopped`, `gyroscopeChanged`, `gyroscopeFailed`

### Subscription Plans and Gifts (Telegram Stars)

- Plaćene pretplate powered by Telegram Stars
- Slanje poklona korisnicima
- [Više informacija](https://core.telegram.org/bots/api#paid-subscriptions)

### Loading Screen Customization

- Prilagođavanje loading screen-a
- Dodavanje ikone i boja za light/dark teme
- Konfiguracija: @BotFather > Bot Settings > Configure Mini App

### Hardware-specific Optimizations (Android)

Mini Apps na Android-u primaju informacije o hardveru uređaja:
- OS verzija
- App verzija
- SDK verzija
- Model uređaja
- **Performance class** (LOW, AVERAGE, HIGH)

### General

- `photo_url` u `WebAppUser` dostupno svim Mini Apps-ima
- Third-party validacija bez bot token-a
- Proširene debug opcije za iOS

---

## Bot API 7.10 (Septembar 6, 2024)

### Novo

- **SecondaryButton** - dodatno dugme na dnu
- Event `secondaryButtonClicked`
- Rename: `MainButton` → `BottomButton`
- `bottomBarColor` polje i `setBottomBarColor()` metoda
- `bottom_bar_bg_color` u `ThemeParams`

---

## Bot API 7.8 (Juli 31, 2024)

### Novo

- **Main Mini App** - botovi mogu postaviti glavni Mini App
  - Preview dugme u profilu bota
  - Direktan link za pokretanje
- `shareToStory()` metoda

---

## Bot API 7.7 (Juli 7, 2024)

### Novo

- `isVerticalSwipesEnabled` polje
- `enableVerticalSwipes()` i `disableVerticalSwipes()` metode
- Event `scanQrPopupClosed`

---

## Bot API 7.6 (Juli 1, 2024)

### Novo

- `section_separator_color` u `ThemeParams`
- Promena default opening moda za Direct Link Mini Apps

---

## Bot API 7.2 (Mart 31, 2024)

### Novo

- **BiometricManager** - biometrijska autentifikacija

---

## Bot API 7.0 (Decembar 29, 2023)

### Novo

- **SettingsButton** u kontekstnom meniju
- Nove boje u `ThemeParams`:
  - `header_bg_color`
  - `accent_text_color`
  - `section_bg_color`
  - `section_header_text_color`
  - `subtitle_text_color`
  - `destructive_text_color`
- Mini Apps se više ne zatvaraju pri `openTelegramLink()`

---

## Bot API 6.9 (Septembar 22, 2023)

### Novo

- **CloudStorage** - skladište u oblaku (do 1024 items)
- `requestWriteAccess()` i `requestContact()` metode
- Nova polja u `WebAppUser`:
  - `added_to_attachment_menu`
  - `allows_write_to_pm`
- Eventi: `writeAccessRequested`, `contactRequested`
- `setHeaderColor()` sada prihvata bilo koju boju

---

## Bot API 6.7 (April 21, 2023)

### Novo

- Pokretanje Mini Apps iz inline query results-a i direct link-a
- `switchInlineQuery()` metoda

---

## Bot API 6.4 (Decembar 30, 2022)

### Novo

- `platform` polje
- `options` parameter za `openLink()`
- Nove metode:
  - `showScanQrPopup()`
  - `closeScanQrPopup()`
  - `readTextFromClipboard()`
- Eventi: `qrTextReceived`, `clipboardTextReceived`

---

## Bot API 6.2 (Avgust 12, 2022)

### Novo

- `isClosingConfirmationEnabled` polje
- Nove metode:
  - `enableClosingConfirmation()`
  - `disableClosingConfirmation()`
  - `showPopup()`
  - `showAlert()`
  - `showConfirm()`
- `is_premium` u `WebAppUser`
- Event `popupClosed`

---

## Bot API 6.1 (Jun 20, 2022)

### Novo

- Attachment menu botovi u grupama, supergrupama i kanalima
- t.me linkovi za izbor chat-a
- Nova polja i metode:
  - `version`, `headerColor`, `backgroundColor`
  - `BackButton`, `HapticFeedback`
  - `isVersionAtLeast()`, `setHeaderColor()`, `setBackgroundColor()`
  - `openLink()`, `openTelegramLink()`, `openInvoice()`
- `secondary_bg_color` u `ThemeParams`
- `offClick()` metoda za `MainButton`
- `chat`, `can_send_after` u `WebAppInitData`
- Eventi: `backButtonClicked`, `settingsButtonClicked`, `invoiceClosed`
