# Design Guidelines - Smernice za Dizajn

## Color Schemes

Mini Apps uvek primaju podatke o trenutnoj kolornoj shemi korisnika u realnom vremenu, tako da možete prilagoditi izgled interfejsa.

**Primer:** Kada korisnici prelaze između Day i Night moda ili koriste različite custom teme.

> 📖 [Tehnička dokumentacija o temama](./06-theme-params.md)

---

## Design Principles

Telegram aplikacije su poznate po tome što su brze, glatke i prate konzistentan cross-platform dizajn. Vaš Mini App bi idealno trebao da reflektuje ove principe.

### 1. **Mobile-First & Responsive**

✅ Svi elementi moraju biti responsive i dizajnirani sa mobile-first pristupom

**Zašto?** Većina korisnika koristi Telegram na mobilnim uređajima.

### 2. **Konzistentni UI Elementi**

✅ Interaktivni elementi treba da oponašaju stil, ponašanje i nameru UI komponenti koje već postoje u Telegramu

**Primeri:**
- Dugmad slična Telegram dugmadima
- Input polja sa istim border radius-om
- Konzistentni paddings i margins

### 3. **Smooth Animacije**

✅ Sve uključene animacije treba da budu glatke, idealno **60fps**

**Optimizacija:**
- Koristiti CSS `transform` umesto `top`/`left`
- `will-change` property za optimizaciju
- Smanjiti animacije na low-performance uređajima

### 4. **Accessibility**

✅ Svi input-i i slike moraju sadržati labele za pristupačnost

**Primeri:**
```html
<input aria-label="Unesi svoje ime" />
<img alt="Logo aplikacije" />
<button aria-label="Zatvori" />
```

### 5. **Dynamic Theme Support**

✅ Aplikacija treba da prati dinamičke theme-based boje iz API-ja i da ih koristi

**Implementacija:**
```javascript
// Pristup theme parametrima
const themeParams = window.Telegram.WebApp.themeParams;

// Postavljanje boja
document.body.style.backgroundColor = themeParams.bg_color;
document.body.style.color = themeParams.text_color;

// Praćenje promena teme
Telegram.WebApp.onEvent('themeChanged', function() {
  // Ažuriraj boje
  updateColors();
});
```

**CSS varijable:**
```css
:root {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}
```

### 6. **Safe Area Respect**

✅ Interfejs mora poštovati **safe area** i **content safe area** kako bi izbegao preklapanje sa kontrolnim elementima

**Posebno važno za:**
- Fullscreen mode
- Uređaji sa notch-om (iPhone X+)
- Navigationa dugmad na dnu (Android)

**Implementacija:**
```javascript
const safeArea = Telegram.WebApp.safeAreaInset;
const contentSafeArea = Telegram.WebApp.contentSafeAreaInset;

// Primeni padding
element.style.paddingTop = safeArea.top + 'px';
element.style.paddingBottom = safeArea.bottom + 'px';
```

**CSS varijable:**
```css
.fullscreen-content {
  padding-top: var(--tg-safe-area-inset-top);
  padding-bottom: var(--tg-safe-area-inset-bottom);
  padding-left: var(--tg-safe-area-inset-left);
  padding-right: var(--tg-safe-area-inset-right);
}

.content-area {
  padding-top: var(--tg-content-safe-area-inset-top);
  padding-bottom: var(--tg-content-safe-area-inset-bottom);
}
```

### 7. **Performance Optimization (Android)**

✅ Za Android uređaje, razmotriti dodatne informacije iz User-Agent-a i prilagoditi za performance class uređaja

**Implementacija:**
```javascript
// Provera performance class iz User-Agent
const userAgent = navigator.userAgent;
const performanceMatch = userAgent.match(/\(([^)]*; (LOW|AVERAGE|HIGH))\)/);

if (performanceMatch && performanceMatch[2] === 'LOW') {
  // Smanji animacije
  disableHeavyAnimations();
  reduceVisualEffects();
  lowerFrameRate();
}
```

**Optimizacije za LOW performance:**
- Isključi parallax efekte
- Smanji broj particle-a
- Koristi jednostavnije transitions
- Umanji texture kvalitet u igrama
- Cache-uj više podataka

> 📖 [Više o User-Agent informacijama](./15-user-agent.md)

---

## UI Component Guidelines

### Buttons

**Glavni botuni (MainButton/BottomButton):**
- Koristi `Telegram.WebApp.MainButton` za primarne akcije
- Koristi `SecondaryButton` za sekundarne akcije
- Poštuj theme boje

```javascript
Telegram.WebApp.MainButton
  .setText('Nastavi')
  .show()
  .onClick(() => {
    // Handle click
  });
```

### Inputs

**Best practices:**
- Jasni placeholder tekstovi
- Validacija u realnom vremenu
- Error states sa jasnim porukama
- Focus states

### Colors

**Koristi ThemeParams boje:**
- `bg_color` - glavni background
- `text_color` - glavni tekst
- `hint_color` - hint tekstovi
- `link_color` - linkovi
- `button_color` - dugmad
- `button_text_color` - tekst na dugmadima
- `destructive_text_color` - destructive akcije (delete, remove)

### Typography

**Preporuke:**
- System fonts za najbolju kompatibilnost
- Konzistentne font sizes
- Dovoljan line-height za čitljivost
- Contrast ratio minimum 4.5:1

---

## Testing Across Themes

**Obavezno testirati:**
1. ✅ Light theme
2. ✅ Dark theme
3. ✅ Custom themes (ako postoje)
4. ✅ Tranzicije između tema

---

## Checklist Pre Lansiranja

- [ ] Responsive na svim screen sizes
- [ ] Smooth animacije (60fps)
- [ ] Pravilno poštovanje safe areas
- [ ] Accessibility labels
- [ ] Theme support (light/dark)
- [ ] Performance optimizacija za low-end uređaje
- [ ] Testiran na iOS i Android
- [ ] Loading states
- [ ] Error handling
- [ ] Offline experience (ako je potrebno)

---

## Resursi

- [ThemeParams dokumentacija](./06-theme-params.md)
- [Safe Area Implementation](./07-objects.md#safareainset)
- [User-Agent Info](./15-user-agent.md)
- [Testing Guide](./14-testing.md)
