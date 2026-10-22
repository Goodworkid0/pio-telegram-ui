# Implementation - Načini Implementacije Mini Apps

Telegram trenutno podržava **7 različitih načina** za pokretanje Mini Apps-a.

---

## 1. 🎯 Main Mini App (Profile Button)

### Opis

Ako je tvoj bot zapravo mini app, možeš otključati brojne featyre koji pojednostavljuju način na koji korisnici vide i interaguju sa njim.

**Omogućava:**
- **Launch App dugme** na profilu bota
- High-quality demo video i screenshots
- Prikaz u **Apps tab** search-a

### Setup

1. Idi na **@BotFather**
2. Komanda: `/mybots`
3. Izaberi bota
4. **Bot Settings** → **Set Main Mini App**
5. Postavi URL Mini App-a
6. Upload media previews (opciono)

### Media Previews

- Podržava više jezika
- Upload translated verzije
- Korisnicima se prikazuju na osnovu app language

### Direct Links

Format:
```
https://t.me/botusername?startapp
https://t.me/botusername?startapp=command
https://t.me/botusername?startapp=command&mode=compact
```

**Parametri:**
- `startapp` - prosleđuje se u `start_param` field i GET parameter `tgWebAppStartParam`
- `mode=compact` - otvara se u half-screen height modu

**JavaScript pristup:**
```javascript
const startParam = Telegram.WebApp.initDataUnsafe.start_param;
console.log('Start param:', startParam);

// Ili iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const tgStartParam = urlParams.get('tgWebAppStartParam');
```

### Context Tracking

Mini Apps mogu koristiti `chat_type` i `chat_instance` parametre za praćenje konteksta chata.

**Use cases:**
- Live whiteboards
- Group orders
- Multiplayer games
- Collaborative apps

```javascript
const initData = Telegram.WebApp.initDataUnsafe;

console.log('Chat type:', initData.chat_type); // 'sender', 'private', 'group', 'supergroup', 'channel'
console.log('Chat instance:', initData.chat_instance);

if (initData.chat_type === 'group') {
  enableMultiplayerMode();
}
```

### Opening Mode

**Default:** Full-screen height (od Bot API 7.6+)
- Korisnici ne mogu smanjiti na half-height

**Compact Mode:** `mode=compact` u URL-u
- Otvara se u half-screen height
- Korisnici mogu razvući

**@BotFather opcija:**
- Možeš promeniti default behavior

### Mini App Store

Uspešni botovi koji:
- ✅ Omogućili main Mini App
- ✅ Prihvataju plaćanja u Telegram Stars

Mogu biti **featured** u Telegram Mini App Store-u.

**Preporuke:**
- Upload high-quality media na profil
- Prati [design guidelines](./03-design-guidelines.md)

---

## 2. ⌨️ Keyboard Button Mini Apps

### Opis

Mini Apps pokrenuti iz `web_app` tipa keyboard button-a mogu slati podatke nazad botu u service message-u.

**Jedinstveno:** Ne zahteva eksterne servere - bot može odgovoriti direktno.

### Setup

Bot šalje custom keyboard sa `web_app` dugmetom:

```python
# Python (python-telegram-bot)
from telegram import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo

keyboard = [
    [KeyboardButton(
        text="Open Mini App",
        web_app=WebAppInfo(url="https://your-app.com")
    )]
]
reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

await update.message.reply_text(
    "Click the button to open Mini App:",
    reply_markup=reply_markup
)
```

```javascript
// Node.js (node-telegram-bot-api)
bot.sendMessage(chatId, 'Click the button:', {
  reply_markup: {
    keyboard: [[
      {
        text: 'Open Mini App',
        web_app: { url: 'https://your-app.com' }
      }
    ]],
    resize_keyboard: true
  }
});
```

### Sending Data Back

```javascript
// U Mini App-u
const data = JSON.stringify({
  selected_date: '2025-10-25',
  user_choice: 'option_A'
});

// Šalje data botu i zatvara Mini App
Telegram.WebApp.sendData(data);
```

Bot prima data:

```python
# Python
@bot.message_handler(content_types=['web_app_data'])
def handle_web_app_data(message):
    data = json.loads(message.web_app_data.data)
    print('Received:', data)
    
    # Odgovori korisniku
    bot.reply_to(message, f"You selected: {data['selected_date']}")
```

```javascript
// Node.js
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    const data = JSON.parse(msg.web_app_data.data);
    console.log('Received:', data);
    
    bot.sendMessage(msg.chat.id, `You selected: ${data.selected_date}`);
  }
});
```

### Ograničenja

- ⚠️ Data limit: **4096 bytes**
- ⚠️ Mini App se **zatvara** nakon `sendData()`
- ⚠️ Samo za Keyboard button tip

### Dobro za:

- ✅ Custom data input interfejsi
- ✅ Kalendari za izbor datuma
- ✅ Napredni search sa filterima
- ✅ Randomizeri i "spin wheel" komponente
- ✅ Reusable komponente nezavisne od konkretnog bota

---

## 3. 🔘 Inline Button Mini Apps

### Opis

Za interaktivnije Mini Apps, koristi `web_app` tip Inline KeyboardButton.

**Dobija:**
- User info (ID, ime, username, language)
- `query_id` - za slanje poruka u ime korisnika

### Setup

```python
# Python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

keyboard = [[
    InlineKeyboardButton(
        text="Open App",
        web_app=WebAppInfo(url="https://your-app.com")
    )
]]
reply_markup = InlineKeyboardMarkup(keyboard)

await update.message.reply_text(
    "Try our Mini App:",
    reply_markup=reply_markup
)
```

```javascript
// Node.js
bot.sendMessage(chatId, 'Try our Mini App:', {
  reply_markup: {
    inline_keyboard: [[
      {
        text: 'Open App',
        web_app: { url: 'https://your-app.com' }
      }
    ]]
  }
});
```

### Pristup User Info

```javascript
const user = Telegram.WebApp.initDataUnsafe.user;

console.log('User ID:', user.id);
console.log('First name:', user.first_name);
console.log('Username:', user.username);
console.log('Language:', user.language_code);
console.log('Is premium:', user.is_premium);
```

### Slanje Poruka Nazad

```javascript
// VAŽNO: Koristi answerWebAppQuery iz Bot API, ne direktno iz Mini App-a
// Mini App kreira inline message i šalje query_id serveru

// Server-side (Python)
from telegram import InlineQueryResultArticle, InputTextMessageContent

query_id = request.json['query_id']
result = InlineQueryResultArticle(
    id='unique_id',
    title='Result Title',
    input_message_content=InputTextMessageContent(
        message_text='Message text'
    )
)

bot.answer_web_app_query(query_id, result)
```

### Dobro za:

- ✅ Potpuno razvijeni web servisi
- ✅ Integracije svih vrsta
- ✅ Use case-vi su praktično neograničeni

**Primeri:**
- E-commerce apps
- Food delivery
- Games
- Booking systems
- Social features

---

## 4. 📋 Menu Button Mini Apps

### Opis

Chat-ovi sa botovima imaju menu button koji prikazuje quick access listu komandi. Ovaj button može pokrenuti Mini App umesto.

**Identično kao Inline Button**, samo brži pristup.

### Setup Opcija 1: @BotFather (Za sve korisnike)

1. @BotFather → `/setmenubutton`
2. Izaberi bota
3. Unesi tekst i URL

Ili:

1. @BotFather → `/mybots`
2. Izaberi bota → **Bot Settings** → **Menu Button**
3. Unesi podatke

### Setup Opcija 2: Bot API (Per-user customization)

```python
# Python
from telegram import MenuButtonWebApp, WebAppInfo

# Za određenog korisnika
await bot.set_chat_menu_button(
    chat_id=user_id,
    menu_button=MenuButtonWebApp(
        text="Open App",
        web_app=WebAppInfo(url="https://your-app.com")
    )
)

# Za sve korisnike
await bot.set_chat_menu_button(
    menu_button=MenuButtonWebApp(
        text="Open App",
        web_app=WebAppInfo(url="https://your-app.com")
    )
)
```

```javascript
// Node.js
bot.setChatMenuButton({
  chat_id: userId,
  menu_button: {
    type: 'web_app',
    text: 'Open App',
    web_app: { url: 'https://your-app.com' }
  }
});
```

### Use Cases

- Različiti button text prema user language
- Različiti URLs prema user settings
- Personalizovani pristup

**Primer:**
```python
user_language = user.language_code

if user_language == 'sr':
    button_text = "Otvori Aplikaciju"
elif user_language == 'en':
    button_text = "Open App"
else:
    button_text = "Open App"

await bot.set_chat_menu_button(
    chat_id=user_id,
    menu_button=MenuButtonWebApp(
        text=button_text,
        web_app=WebAppInfo(url=f"https://app.com?lang={user_language}")
    )
)
```

**Primer bota:** [@DurgerKingBot](https://t.me/DurgerKingBot)

---

## 5. 🔎 Inline Mode Mini Apps

### Opis

Mini Apps u inline mode-u. Korisnici kreiraju sadržaj u web interfejsu i šalju ga u chat preko inline mode-a.

**Ograničenja:**
- ❌ Nema pristupa chat-u
- ❌ Ne može čitati poruke
- ❌ Ne može slati nove poruke direktno

**Slanje:** Samo preko inline mode-a - korisnik mora aktivno izabrati result.

### Setup

```python
# Python
from telegram import InlineQueryResultsButton, WebAppInfo

# Odgovor na inline query
await update.inline_query.answer(
    results=[],  # inline results (opciono)
    button=InlineQueryResultsButton(
        text="Open Mini App",
        web_app=WebAppInfo(url="https://your-app.com")
    )
)
```

```javascript
// Node.js
bot.on('inline_query', (query) => {
  bot.answerInlineQuery(query.id, [], {
    button: {
      text: 'Open Mini App',
      web_app: { url: 'https://your-app.com' }
    }
  });
});
```

### Switching Back to Inline Mode

```javascript
// U Mini App-u, vrati se u inline mode
Telegram.WebApp.switchInlineQuery('search query');

// Sa izborom chat tipa
Telegram.WebApp.switchInlineQuery('query', ['users', 'groups']);
```

### Dobro za:

- ✅ Content creation tools
- ✅ Meme generators
- ✅ Image editors
- ✅ Quiz creators
- ✅ Poll builders

---

## 6. 🔗 Direct Link Mini Apps

### Opis

Mini App Botovi se mogu pokrenuti iz direct link-a u bilo kom chat-u.

**Format:**
```
https://t.me/botusername/appname
https://t.me/botusername/appname?startapp=command
https://t.me/botusername/appname?startapp=command&mode=compact
```

### Features

**Context Awareness:**
```javascript
const initData = Telegram.WebApp.initDataUnsafe;

// Chat info
console.log('Chat type:', initData.chat_type);
console.log('Chat instance:', initData.chat_instance);

// Start parameter
console.log('Start param:', initData.start_param);
```

**Ograničenja:**
- ❌ Nema pristupa chat-u
- ❌ Ne može čitati/slati poruke direktno
- ✅ Mora koristiti inline mode za slanje

### Opening Mode (Bot API 7.6+)

**Default:** Full-screen
- Korisnici ne mogu smanjiti

**Compact:** `mode=compact`
- Otvara se half-screen
- Korisnici mogu razvući

### Dobro za:

- ✅ Standalone web servisi
- ✅ Multiplayer/cooperative apps
- ✅ Group games
- ✅ Live whiteboards
- ✅ Shared shopping lists

---

## 7. 📎 Attachment Menu Mini Apps

### Opis

Mini App Botovi mogu biti dodati direktno u user's **attachment menu**, omogućavajući brzo pokretanje iz bilo kog chat-a.

**Konfigurisanje:** Koje chat tipove podržava (private, groups, supergroups, channels)

### Availability

⚠️ **Trenutno dostupno samo za:**
- Major advertisers na Telegram Ad Platform
- **SVE botove na test serveru**

### Test Server Setup

1. Otvori @BotFather na **test serveru**
2. Komanda: `/setattach`
3. Izaberi bota
4. Unesi URL koji će se otvoriti

Ili:

1. @BotFather → `/mybots` → Bot Settings
2. **Configure Attachment Menu**
3. Postavi URL

### Settings Button

Možeš dodati 'Settings' item u context menu:

```python
# Bot prima settingsButtonClicked event
@bot.message_handler(func=lambda msg: msg.web_app_data)
def handle_settings_click(message):
    # User clicked settings
    pass
```

```javascript
// U Mini App-u
Telegram.WebApp.SettingsButton.show();

Telegram.WebApp.onEvent('settingsButtonClicked', function() {
  openSettings();
});
```

### Info Dobijeno

**User info:**
- ID, ime, username, language, photo

**Chat partner info** (private chats):
- ID, ime, username, photo

**Chat info** (groups/channels):
- ID, tip, naslov, username, photo

**Session info:**
- `query_id` - za slanje poruka

### Slanje Poruka

```python
# Python
bot.answer_web_app_query(
    web_app_query_id=query_id,
    result=inline_result
)
```

Mini App se zatvara nakon slanja poruke.

### Links

**Format 1:** Dodavanje u attachment menu
```
https://t.me/botusername?startattach
https://t.me/botusername?startattach=command
```

**Format 2:** Otvaranje u specifičnom chat-u
```
https://t.me/username?attach=botusername
https://t.me/username?attach=botusername&startattach=command
https://t.me/+1234567890?attach=botusername
```

**Format 3:** Izbor chat-a (Bot API 6.1+)
```
https://t.me/botusername?startattach&choose=users+bots
https://t.me/botusername?startattach=cmd&choose=groups+channels
```

**Chat types:**
- `users`
- `bots`
- `groups`
- `channels`

### Start Param

`startattach` parametar se prosleđuje u `start_param` field i GET parametru `tgWebAppStartParam`.

```javascript
const startParam = Telegram.WebApp.initDataUnsafe.start_param;
// ili
const urlParam = new URLSearchParams(window.location.search)
  .get('tgWebAppStartParam');
```

### Primer Bot

[@DurgerKingBot](https://t.me/DurgerKingBot?startattach) - Probaj attachment menu link.

### Dobro za:

- ✅ Productivity tools
- ✅ Media sharing apps
- ✅ Quick actions u bilo kom chat-u
- ✅ Cross-chat features

> 📖 [Više o dodavanju u Attachment Menu](./04-implementation.md#adding-bots-to-attachment-menu)

---

## Poređenje Tipova

| Tip | User Info | Chat Access | Send Messages | Use Case |
|-----|-----------|-------------|---------------|----------|
| **Main Mini App** | ✅ | ❌ | Via inline | Full apps, multiplayer |
| **Keyboard Button** | ❌ | ❌ | Via sendData | Simple inputs |
| **Inline Button** | ✅ | ❌ | Via answerWebAppQuery | Full apps |
| **Menu Button** | ✅ | ❌ | Via answerWebAppQuery | Quick access |
| **Inline Mode** | ✅ | ❌ | Via inline mode | Content creation |
| **Direct Link** | ✅ | ❌ | Via inline mode | Standalone apps |
| **Attachment Menu** | ✅ | ✅ (limited) | Via answerWebAppQuery | Quick tools |

---

## Izbor Pravog Tipa

### Keyboard Button → Simple Data Input
- Custom calendar
- Search with filters
- Option pickers

### Inline Button / Menu Button → Full Web Apps
- E-commerce
- Services
- Games
- Booking

### Main Mini App → Standalone Apps
- Big apps koje zamenjuju website
- Featured u App Store

### Inline Mode → Content Creation
- Meme generators
- Image editors
- Templates

### Direct Link → Shared/Multiplayer
- Games
- Whiteboards
- Group orders

### Attachment Menu → Quick Access
- Productivity tools
- Media sharing
- Cross-chat features

---

## Povezani Resursi

- [Inicijalizacija](./05-initialization.md)
- [Validacija Podataka](./12-validation.md)
- [Design Guidelines](./03-design-guidelines.md)
