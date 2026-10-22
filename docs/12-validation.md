# Validation - Validacija Podataka

## Zašto je Validacija Važna?

Podaci primljeni preko `Telegram.WebApp.initData` **moraju biti validirani** na bot serveru pre upotrebe.

⚠️ **NIKAD ne veruj** `initDataUnsafe` - ovi podaci mogu biti manipulisani na klijentskoj strani.

---

## Validacija za Bot Server

### Algoritam

Podaci se validiraju poređenjem primljenog `hash` parametra sa HMAC-SHA-256 signature.

**Koraci:**

1. Kreiraj **data-check-string** od svih primljenih polja (osim `hash`)
2. Sortiraj alfabetski
3. Format: `key=<value>` sa `\n` separatorom
4. Kreiraj **secret_key**: `HMAC_SHA256(<bot_token>, "WebAppData")`
5. Kreiraj **signature**: `HMAC_SHA256(data_check_string, secret_key)`
6. Uporedi sa primljenim `hash` parametrom

### Pseudo-kod

```
data_check_string = ...
secret_key = HMAC_SHA256(<bot_token>, "WebAppData")

if (hex(HMAC_SHA256(data_check_string, secret_key)) == hash) {
  // Data je od Telegrama
}
```

### Python Implementacija

```python
import hmac
import hashlib
from urllib.parse import parse_qs

def validate_telegram_web_app_data(bot_token, init_data):
    """
    Validira Telegram Web App init data.
    
    Args:
        bot_token: Bot token iz @BotFather
        init_data: Raw initData string iz Telegram.WebApp.initData
        
    Returns:
        True ako su podaci validni, False inače
    """
    # Parse init data
    parsed = parse_qs(init_data)
    
    # Extract hash
    received_hash = parsed.get('hash', [''])[0]
    if not received_hash:
        return False
    
    # Remove hash from data
    parsed.pop('hash', None)
    
    # Sort keys alphabetically and create data check string
    data_check_arr = []
    for key in sorted(parsed.keys()):
        value = parsed[key][0]  # Take first value
        data_check_arr.append(f'{key}={value}')
    
    data_check_string = '\n'.join(data_check_arr)
    
    # Create secret key
    secret_key = hmac.new(
        b"WebAppData",
        bot_token.encode(),
        hashlib.sha256
    ).digest()
    
    # Calculate signature
    signature = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Compare
    return signature == received_hash


# Upotreba
BOT_TOKEN = "your_bot_token"
init_data = request.headers.get('X-Telegram-Init-Data')  # ili iz body-ja

if validate_telegram_web_app_data(BOT_TOKEN, init_data):
    print("Data is valid!")
    # Parse i koristi podatke
    parsed_data = parse_qs(init_data)
    user_data = json.loads(parsed_data['user'][0])
    print(f"User ID: {user_data['id']}")
else:
    print("Invalid data!")
    return {"error": "Unauthorized"}, 401
```

### Node.js Implementacija

```javascript
const crypto = require('crypto');

function validateTelegramWebAppData(botToken, initData) {
  /**
   * Validira Telegram Web App init data.
   * 
   * @param {string} botToken - Bot token iz @BotFather
   * @param {string} initData - Raw initData string iz Telegram.WebApp.initData
   * @returns {boolean} True ako su podaci validni
   */
  
  // Parse init data
  const urlParams = new URLSearchParams(initData);
  const receivedHash = urlParams.get('hash');
  
  if (!receivedHash) {
    return false;
  }
  
  // Remove hash
  urlParams.delete('hash');
  
  // Sort keys and create data check string
  const dataCheckArr = [];
  for (const [key, value] of [...urlParams.entries()].sort()) {
    dataCheckArr.push(`${key}=${value}`);
  }
  const dataCheckString = dataCheckArr.join('\n');
  
  // Create secret key
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  // Calculate signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  // Compare
  return signature === receivedHash;
}

// Upotreba
const BOT_TOKEN = 'your_bot_token';
const initData = req.headers['x-telegram-init-data']; // ili iz body-ja

if (validateTelegramWebAppData(BOT_TOKEN, initData)) {
  console.log('Data is valid!');
  
  // Parse podatke
  const urlParams = new URLSearchParams(initData);
  const user = JSON.parse(urlParams.get('user'));
  console.log('User ID:', user.id);
} else {
  console.log('Invalid data!');
  res.status(401).json({ error: 'Unauthorized' });
}
```

### PHP Implementacija

```php
<?php

function validateTelegramWebAppData($botToken, $initData) {
    /**
     * Validira Telegram Web App init data.
     * 
     * @param string $botToken Bot token iz @BotFather
     * @param string $initData Raw initData string
     * @return bool True ako su podaci validni
     */
    
    // Parse init data
    parse_str($initData, $parsed);
    
    // Extract hash
    $receivedHash = $parsed['hash'] ?? null;
    if (!$receivedHash) {
        return false;
    }
    
    // Remove hash
    unset($parsed['hash']);
    
    // Sort keys and create data check string
    ksort($parsed);
    $dataCheckArr = [];
    foreach ($parsed as $key => $value) {
        $dataCheckArr[] = "$key=$value";
    }
    $dataCheckString = implode("\n", $dataCheckArr);
    
    // Create secret key
    $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
    
    // Calculate signature
    $signature = hash_hmac('sha256', $dataCheckString, $secretKey);
    
    // Compare
    return $signature === $receivedHash;
}

// Upotreba
$botToken = 'your_bot_token';
$initData = $_SERVER['HTTP_X_TELEGRAM_INIT_DATA']; // ili iz POST-a

if (validateTelegramWebAppData($botToken, $initData)) {
    echo "Data is valid!\n";
    
    // Parse podatke
    parse_str($initData, $parsed);
    $user = json_decode($parsed['user'], true);
    echo "User ID: " . $user['id'] . "\n";
} else {
    echo "Invalid data!\n";
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
}
?>
```

---

## Data Check String - Format

**Format:**
```
key1=value1
key2=value2
key3=value3
```

**Pravila:**
1. Sortirano **alfabetski** po key-u
2. Format: `key=<value>`
3. Separator: `\n` (line feed, 0x0A)
4. **Bez** `hash` polja

**Primer:**
```
auth_date=1635000000
query_id=QUERY123456
user={"id":12345,"first_name":"John"}
```

---

## Provera auth_date

Za sprečavanje korišćenja zastarelih podataka, proveri `auth_date` field (Unix timestamp).

```python
import time

def is_data_fresh(init_data, max_age=3600):
    """
    Provera da li su podaci dovoljno sveži.
    
    Args:
        init_data: Parsed init data
        max_age: Maksimalna starost u sekundama (default 1 sat)
    
    Returns:
        True ako su podaci sveži
    """
    parsed = parse_qs(init_data)
    auth_date = int(parsed.get('auth_date', [0])[0])
    
    current_time = int(time.time())
    age = current_time - auth_date
    
    return age <= max_age

# Upotreba
if validate_telegram_web_app_data(BOT_TOKEN, init_data):
    if is_data_fresh(init_data, max_age=3600):  # 1 hour
        # Podaci su validni i sveži
        process_data(init_data)
    else:
        return {"error": "Data too old"}, 401
else:
    return {"error": "Invalid signature"}, 401
```

---

## Complex Data Types

Kompleksni tipovi podataka su predstavljeni kao **JSON-serialized** objekti.

**Primer `user` polja:**
```json
{
  "id": 12345,
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "language_code": "en",
  "is_premium": true
}
```

**Parsing:**
```python
import json
from urllib.parse import parse_qs

parsed = parse_qs(init_data)
user_json = parsed.get('user', [''])[0]
user = json.loads(user_json)

print(f"User ID: {user['id']}")
print(f"Name: {user['first_name']}")
```

---

## Validacija za Third-Party Use (Bot API 8.0+)

### Novi Feature

Ako trebaš deliti podatke sa third party-em, oni mogu validirati podatke **bez pristupa bot token-u**.

**Potrebno:**
- `initData` string
- `bot_id`

### Algoritam

Validacija se vrši proverom `signature` parametra (base64url-encoded Ed25519 signature).

**Data-check-string format:**
1. `bot_id` + `:` + `"WebAppData"`
2. `\n`
3. Sva ostala polja (osim `hash` i `signature`), sortirana alfabetski
4. Format: `key=<value>` sa `\n` separatorom

**Primer:**
```
12345678:WebAppData
auth_date=1635000000
query_id=QUERY123456
user={"id":12345,"first_name":"John"}
```

### Public Keys

Telegram Ed25519 public keys za verifikaciju:

**Test environment:**
```
40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec
```

**Production:**
```
e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d
```

### Python Implementacija (Third-Party)

```python
import nacl.signing
import nacl.encoding

def validate_third_party(bot_id, init_data, signature_b64url):
    """
    Third-party validacija bez bot token-a.
    
    Args:
        bot_id: Bot ID
        init_data: Init data string
        signature_b64url: Base64url-encoded signature
    
    Returns:
        True ako je validno
    """
    # Public key (production)
    public_key_hex = 'e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d'
    public_key_bytes = bytes.fromhex(public_key_hex)
    
    # Parse init data
    parsed = parse_qs(init_data)
    parsed.pop('hash', None)
    parsed.pop('signature', None)
    
    # Create data check string
    data_check_arr = [f'{bot_id}:WebAppData']
    for key in sorted(parsed.keys()):
        value = parsed[key][0]
        data_check_arr.append(f'{key}={value}')
    
    data_check_string = '\n'.join(data_check_arr)
    
    # Decode signature
    import base64
    signature = base64.urlsafe_b64decode(signature_b64url + '==')  # Add padding
    
    # Verify
    try:
        verify_key = nacl.signing.VerifyKey(public_key_bytes)
        verify_key.verify(data_check_string.encode(), signature)
        return True
    except Exception:
        return False
```

---

## Best Practices

### 1. Uvek Validiraj na Serveru

❌ **Loše:**
```javascript
// Na klijentu
const user = Telegram.WebApp.initDataUnsafe.user;
// Koristi user.id direktno - NESIGURNO!
```

✅ **Dobro:**
```javascript
// Na klijentu
const initData = Telegram.WebApp.initData;

// Pošalji na server
fetch('/api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': initData
  }
});

// Na serveru
if (validate_telegram_web_app_data(BOT_TOKEN, init_data)) {
  // Sigurno koristi podatke
}
```

### 2. Proveri auth_date

```python
MAX_AGE = 3600  # 1 hour

if not is_data_fresh(init_data, MAX_AGE):
    return {"error": "Session expired"}, 401
```

### 3. HTTPS Only (Production)

⚠️ HTTP je OK samo na **test serveru**.

Na production-u:
- ✅ Koristi HTTPS
- ✅ Valid SSL certificate
- ✅ HSTS header

### 4. Rate Limiting

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/data')
@limiter.limit("10 per minute")
def get_data():
    # ...
```

### 5. Logging

```python
import logging

if not validate_telegram_web_app_data(BOT_TOKEN, init_data):
    logging.warning(f"Invalid init data from IP: {request.remote_addr}")
    return {"error": "Unauthorized"}, 401
```

---

## Kompletni Primer (Flask + Python)

```python
from flask import Flask, request, jsonify
import hmac
import hashlib
from urllib.parse import parse_qs
import json
import time

app = Flask(__name__)
BOT_TOKEN = "your_bot_token_here"

def validate_init_data(init_data, max_age=3600):
    """Validira init data i proverava starost."""
    try:
        # Parse
        parsed = parse_qs(init_data)
        
        # Check hash
        received_hash = parsed.get('hash', [''])[0]
        if not received_hash:
            return False, "No hash"
        
        # Check auth_date
        auth_date = int(parsed.get('auth_date', [0])[0])
        if time.time() - auth_date > max_age:
            return False, "Data too old"
        
        # Remove hash
        parsed.pop('hash', None)
        
        # Create data check string
        data_check_arr = []
        for key in sorted(parsed.keys()):
            data_check_arr.append(f"{key}={parsed[key][0]}")
        data_check_string = '\n'.join(data_check_arr)
        
        # Validate
        secret_key = hmac.new(
            b"WebAppData",
            BOT_TOKEN.encode(),
            hashlib.sha256
        ).digest()
        
        signature = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != received_hash:
            return False, "Invalid signature"
        
        return True, None
        
    except Exception as e:
        return False, str(e)

@app.route('/api/user', methods=['POST'])
def get_user():
    # Get init data
    init_data = request.headers.get('X-Telegram-Init-Data')
    
    if not init_data:
        return jsonify({"error": "No init data"}), 401
    
    # Validate
    valid, error = validate_init_data(init_data, max_age=3600)
    
    if not valid:
        return jsonify({"error": error}), 401
    
    # Parse user data
    parsed = parse_qs(init_data)
    user = json.loads(parsed['user'][0])
    
    # Process...
    return jsonify({
        "user_id": user['id'],
        "name": user['first_name'],
        "is_premium": user.get('is_premium', False)
    })

if __name__ == '__main__':
    app.run(debug=True)
```

---

## Povezani Resursi

- [Inicijalizacija](./05-initialization.md)
- [WebAppInitData](./07-objects.md#webappinitdata)
- [Testing](./14-testing.md)
