# ThemeParams - Parametri Teme

Mini Apps mogu prilagoditi izgled interfejsa prema trenutnoj temi korisnika u realnom vremenu. Ovaj objekat sadrži korisnikove trenutne theme settings.

## Pristup ThemeParams

```javascript
const theme = Telegram.WebApp.themeParams;
```

---

## Polja

### Osnovne Boje

| Polje | Tip | CSS Varijabla | Opis |
|-------|-----|---------------|------|
| `bg_color` | String | `var(--tg-theme-bg-color)` | Background boja u #RRGGBB formatu |
| `text_color` | String | `var(--tg-theme-text-color)` | Glavna boja teksta |
| `hint_color` | String | `var(--tg-theme-hint-color)` | Boja hint teksta |
| `link_color` | String | `var(--tg-theme-link-color)` | Boja linkova |

### Dugmad

| Polje | Tip | CSS Varijabla | Opis |
|-------|-----|---------------|------|
| `button_color` | String | `var(--tg-theme-button-color)` | Boja dugmeta |
| `button_text_color` | String | `var(--tg-theme-button-text-color)` | Boja teksta na dugmetu |

### Sekundarni Background (Bot API 6.1+)

| Polje | Tip | CSS Varijabla | Opis |
|-------|-----|---------------|------|
| `secondary_bg_color` | String | `var(--tg-theme-secondary-bg-color)` | Sekundarna background boja |

### Header i Bottom Bar (Bot API 7.0+)

| Polje | Tip | CSS Varijabla | Opis |
|-------|-----|---------------|------|
| `header_bg_color` | String | `var(--tg-theme-header-bg-color)` | Header background boja |
| `bottom_bar_bg_color` | String | `var(--tg-theme-bottom-bar-bg-color)` | **Bot API 7.10+** Bottom bar boja |

### Akcent Boje (Bot API 7.0+)

| Polje | Tip | CSS Varijabla | Opis |
|-------|-----|---------------|------|
| `accent_text_color` | String | `var(--tg-theme-accent-text-color)` | Akcent boja teksta |
| `destructive_text_color` | String | `var(--tg-theme-destructive-text-color)` | Boja za destruktivne akcije (Delete, Remove) |

### Sekcije (Bot API 7.0+)

| Polje | Tip | CSS Varijabla | Opis |
|-------|-----|---------------|------|
| `section_bg_color` | String | `var(--tg-theme-section-bg-color)` | Background sekcije. Preporučuje se koristiti sa `secondary_bg_color` |
| `section_header_text_color` | String | `var(--tg-theme-section-header-text-color)` | Boja header teksta sekcije |
| `section_separator_color` | String | `var(--tg-theme-section-separator-color)` | **Bot API 7.6+** Boja separatora sekcije |
| `subtitle_text_color` | String | `var(--tg-theme-subtitle-text-color)` | Boja subtitle teksta |

---

## Upotreba u JavaScript-u

### Osnovni Primer

```javascript
const theme = Telegram.WebApp.themeParams;

// Postavi background
document.body.style.backgroundColor = theme.bg_color;
document.body.style.color = theme.text_color;

// Stilizuj dugme
const button = document.querySelector('.my-button');
button.style.backgroundColor = theme.button_color;
button.style.color = theme.button_text_color;

// Linkovi
const links = document.querySelectorAll('a');
links.forEach(link => {
  link.style.color = theme.link_color;
});
```

### Dinamička Promena Teme

```javascript
function applyTheme() {
  const theme = Telegram.WebApp.themeParams;
  
  document.documentElement.style.setProperty('--app-bg', theme.bg_color);
  document.documentElement.style.setProperty('--app-text', theme.text_color);
  document.documentElement.style.setProperty('--app-button', theme.button_color);
  document.documentElement.style.setProperty('--app-button-text', theme.button_text_color);
  document.documentElement.style.setProperty('--app-link', theme.link_color);
}

// Primeni pri pokretanju
applyTheme();

// Slušaj promene
Telegram.WebApp.onEvent('themeChanged', function() {
  applyTheme();
});
```

---

## Upotreba u CSS-u

### Direktno Korišćenje CSS Varijabli

```css
:root {
  /* Telegram CSS varijable su automatski dostupne */
}

body {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}

a {
  color: var(--tg-theme-link-color);
}

button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
}

.secondary {
  background-color: var(--tg-theme-secondary-bg-color);
}

.hint {
  color: var(--tg-theme-hint-color);
  font-size: 14px;
}

.destructive {
  color: var(--tg-theme-destructive-text-color);
}
```

### Section Styling

```css
.section {
  background-color: var(--tg-theme-section-bg-color);
  padding: 16px;
  margin: 8px 0;
  border-radius: 12px;
}

.section-header {
  color: var(--tg-theme-section-header-text-color);
  font-weight: bold;
  margin-bottom: 8px;
}

.section-separator {
  height: 1px;
  background-color: var(--tg-theme-section-separator-color);
  margin: 12px 0;
}

.subtitle {
  color: var(--tg-theme-subtitle-text-color);
  font-size: 13px;
}
```

### Header i Bottom Styling

```css
header {
  background-color: var(--tg-theme-header-bg-color);
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.bottom-bar {
  background-color: var(--tg-theme-bottom-bar-bg-color);
  padding: 12px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
```

---

## Dark/Light Mode Detection

```javascript
// Provera trenutne teme
const isDarkMode = Telegram.WebApp.colorScheme === 'dark';

if (isDarkMode) {
  console.log('Dark mode is active');
} else {
  console.log('Light mode is active');
}

// Takođe dostupno kao CSS varijabla
// var(--tg-color-scheme) - "light" ili "dark"
```

---

## Best Practices

### 1. **Uvek Koristi Theme Boje**

❌ **Loše:**
```css
body {
  background-color: #ffffff;
  color: #000000;
}
```

✅ **Dobro:**
```css
body {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
```

### 2. **Slušaj themeChanged Event**

```javascript
Telegram.WebApp.onEvent('themeChanged', function() {
  // Ažuriraj custom boje
  updateCustomColors();
  // Refreshuj canvas/charts
  redrawGraphs();
});
```

### 3. **Fallback Boje**

```css
body {
  /* Fallback za starije verzije */
  background-color: #ffffff;
  color: #000000;
  
  /* Telegram boje će override-ovati fallback */
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
```

### 4. **Proveravaj Dostupnost Polja**

```javascript
const theme = Telegram.WebApp.themeParams;

// Neka polja su optional
const sectionBg = theme.section_bg_color || theme.secondary_bg_color || theme.bg_color;
```

### 5. **Semantic Colors**

```css
/* Koristi destructive_text_color za opasne akcije */
.delete-button {
  color: var(--tg-theme-destructive-text-color);
}

.delete-button:hover {
  background-color: var(--tg-theme-destructive-text-color);
  color: var(--tg-theme-bg-color);
}
```

---

## Kompletni Primer

### HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="app-header">
    <h1>My Mini App</h1>
  </header>
  
  <div class="section">
    <div class="section-header">Settings</div>
    <div class="section-separator"></div>
    <p class="subtitle">Configure your preferences</p>
  </div>
  
  <button class="primary-button">Save</button>
  <button class="destructive-button">Delete</button>
  
  <a href="#">Learn more</a>
</body>
</html>
```

### CSS

```css
body {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.app-header {
  background-color: var(--tg-theme-header-bg-color);
  padding: 16px;
  position: sticky;
  top: 0;
}

.section {
  background-color: var(--tg-theme-section-bg-color);
  padding: 16px;
  margin: 16px;
  border-radius: 12px;
}

.section-header {
  color: var(--tg-theme-section-header-text-color);
  font-weight: 600;
  margin-bottom: 8px;
}

.section-separator {
  height: 1px;
  background-color: var(--tg-theme-section-separator-color);
  margin: 12px 0;
}

.subtitle {
  color: var(--tg-theme-subtitle-text-color);
  font-size: 14px;
}

.primary-button {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  margin: 8px;
}

.destructive-button {
  background-color: transparent;
  color: var(--tg-theme-destructive-text-color);
  border: 1px solid var(--tg-theme-destructive-text-color);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  margin: 8px;
}

a {
  color: var(--tg-theme-link-color);
  text-decoration: none;
}
```

### JavaScript

```javascript
function applyTheme() {
  const theme = Telegram.WebApp.themeParams;
  console.log('Current theme:', Telegram.WebApp.colorScheme);
  console.log('Theme params:', theme);
}

// Primeni pri učitavanju
applyTheme();

// Slušaj promene
Telegram.WebApp.onEvent('themeChanged', applyTheme);

// Obavesti da je app spreman
Telegram.WebApp.ready();
```

---

## WebView Colors Visualization

[Vizualizacija kako izgledaju različite boje u Telegram interfejsu]

- **bg_color** - Glavni background cele aplikacije
- **secondary_bg_color** - Kartice, modali
- **text_color** - Glavni tekst
- **hint_color** - Placeholderi, opisi
- **link_color** - Linkovi i akcenti
- **button_color** - Primarna dugmad
- **button_text_color** - Tekst na primarnim dugmadima
- **header_bg_color** - Sticky header
- **section_bg_color** - Liste i grupe
- **destructive_text_color** - Delete, Remove akcije

---

## Povezani Resursi

- [Inicijalizacija](./05-initialization.md)
- [Eventi](./13-events.md#themechanged)
- [Design Guidelines](./03-design-guidelines.md)
