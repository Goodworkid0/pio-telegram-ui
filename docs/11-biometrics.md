# Biometrics - Biometric Authentication (Bot API 7.2+)

Mini Apps mogu koristiti biometric authentication (fingerprint, Face ID, etc.) za sigurnu autentifikaciju korisnika.

---

## BiometricManager

Upravlja biometric authentication-om. **Mora biti inicijalizovan** pre prve upotrebe.

### Pristup

```javascript
const biometricManager = Telegram.WebApp.BiometricManager;
```

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isInited` | Boolean | Da li je BiometricManager inicijalizovan |
| `isBiometricAvailable` | Boolean | Da li je biometric authentication dostupan |
| `biometricType` | String | Tip biometrije: `"finger"`, `"face"`, `"unknown"` |
| `isAccessRequested` | Boolean | Da li je pristup zatražen |
| `isAccessGranted` | Boolean | Da li je pristup odobren |
| `isBiometricTokenSaved` | Boolean | Da li je biometric token snimljen |
| `deviceId` | String | Unique device identifier (npr. za token binding) |

---

## Metode

### init()

```javascript
BiometricManager.init([callback])
```

Inicijalizuje BiometricManager objekat. **Obavezno pozvati pre prve upotrebe.**

**Callback:** `callback()` - poziva se kada je inicijalizacija završena

**Primer:**
```javascript
Telegram.WebApp.BiometricManager.init(function() {
  console.log('BiometricManager initialized');
  console.log('Biometric available:', Telegram.WebApp.BiometricManager.isBiometricAvailable);
  console.log('Type:', Telegram.WebApp.BiometricManager.biometricType);
  
  if (Telegram.WebApp.BiometricManager.isBiometricAvailable) {
    showBiometricLogin();
  }
});
```

### requestAccess()

```javascript
BiometricManager.requestAccess(params, [callback])
```

Zahteva permission za biometric access.

**Parametri:**
- `params` - objekat sa poljima:
  - `reason` (String, optional) - Razlog zašto trebaš biometric pristup (prikazan korisniku)

**Callback:** `callback(accessGranted)` 
- `accessGranted` - Boolean, `true` ako je pristup odobren

**Primer:**
```javascript
Telegram.WebApp.BiometricManager.requestAccess({
  reason: 'We need biometric authentication to secure your account'
}, function(accessGranted) {
  if (accessGranted) {
    console.log('Biometric access granted');
    enableBiometricFeatures();
  } else {
    console.log('Biometric access denied');
    showFallbackLogin();
  }
});
```

### authenticate()

```javascript
BiometricManager.authenticate(params, [callback])
```

Autentifikuje korisnika pomoću biometrije.

**Parametri:**
- `params` - objekat sa poljima:
  - `reason` (String, optional) - Razlog za authentication (prikazan korisniku)

**Callback:** `callback(success, biometricToken)` 
- `success` - Boolean, da li je authentication uspeo
- `biometricToken` - String, unique token za autentifikovanu sesiju (samo ako je `isBiometricTokenSaved` true)

**Primer:**
```javascript
Telegram.WebApp.BiometricManager.authenticate({
  reason: 'Confirm your payment'
}, function(success, biometricToken) {
  if (success) {
    console.log('Authentication successful');
    
    if (biometricToken) {
      console.log('Token:', biometricToken);
      // Koristi token za autorizaciju na serveru
      verifyBiometricToken(biometricToken);
    }
    
    // Nastavi sa akcijom
    processPayment();
  } else {
    console.log('Authentication failed');
    showAuthenticationError();
  }
});
```

### updateBiometricToken()

```javascript
BiometricManager.updateBiometricToken([token], [callback])
```

Čuva ili briše biometric token.

**Parametri:**
- `token` (String, optional) - Token za snimanje. Ako je prazan string ili se izostavi, token se briše.

**Callback:** `callback(success)` 
- `success` - Boolean, da li je operacija uspela

**Primer - Snimanje tokena:**
```javascript
const token = generateSecureToken();

Telegram.WebApp.BiometricManager.updateBiometricToken(token, function(success) {
  if (success) {
    console.log('Token saved securely');
  } else {
    console.log('Failed to save token');
  }
});
```

**Primer - Brisanje tokena:**
```javascript
Telegram.WebApp.BiometricManager.updateBiometricToken('', function(success) {
  if (success) {
    console.log('Token removed');
  }
});
```

### openSettings()

```javascript
BiometricManager.openSettings()
```

Otvara biometric access settings za botove.

⚠️ **Napomena:** Može se pozvati **samo kao odgovor na user interaction** (npr. klik).

**Primer:**
```javascript
// U event handler-u za button click
button.addEventListener('click', function() {
  if (!Telegram.WebApp.BiometricManager.isAccessGranted) {
    console.log('Opening biometric settings...');
    Telegram.WebApp.BiometricManager.openSettings();
  }
});
```

### Chaining

Sve metode vraćaju `BiometricManager` objekat, tako da se mogu ulančavati:

```javascript
Telegram.WebApp.BiometricManager
  .init()
  .requestAccess({ reason: 'Secure login' })
  .authenticate({ reason: 'Confirm action' });
```

---

## Eventi

### biometricManagerUpdated

Dešava se kada se BiometricManager objekat promeni.

```javascript
Telegram.WebApp.onEvent('biometricManagerUpdated', function() {
  const manager = Telegram.WebApp.BiometricManager;
  
  console.log('Biometric available:', manager.isBiometricAvailable);
  console.log('Access granted:', manager.isAccessGranted);
  console.log('Token saved:', manager.isBiometricTokenSaved);
  
  updateBiometricUI();
});
```

### biometricAuthRequested

Dešava se kada je biometric authentication zatražena.

**EventHandler:** Prima objekat sa poljima:
- `isAuthenticated` - Boolean
- `biometricToken` - String (ako je token snimljen)

```javascript
Telegram.WebApp.onEvent('biometricAuthRequested', function(event) {
  if (event.isAuthenticated) {
    console.log('Authentication successful');
    
    if (event.biometricToken) {
      verifyTokenOnServer(event.biometricToken);
    }
  } else {
    console.log('Authentication failed');
    showError('Please try again');
  }
});
```

### biometricTokenUpdated

Dešava se kada se biometric token ažurira (snimi ili obriše).

**EventHandler:** Prima objekat sa poljem:
- `isUpdated` - Boolean, da li je operacija uspela

```javascript
Telegram.WebApp.onEvent('biometricTokenUpdated', function(event) {
  if (event.isUpdated) {
    console.log('Token updated successfully');
    
    if (Telegram.WebApp.BiometricManager.isBiometricTokenSaved) {
      console.log('Token is now saved');
      enableQuickLogin();
    } else {
      console.log('Token removed');
      disableQuickLogin();
    }
  } else {
    console.log('Token update failed');
  }
});
```

---

## Kompletni Primeri

### Primer 1: Basic Biometric Login

```javascript
class BiometricAuth {
  constructor() {
    this.manager = Telegram.WebApp.BiometricManager;
    this.initialized = false;
  }
  
  async init() {
    return new Promise((resolve) => {
      this.manager.init(() => {
        this.initialized = true;
        console.log('Biometric type:', this.manager.biometricType);
        resolve(this.manager.isBiometricAvailable);
      });
    });
  }
  
  async requestPermission() {
    return new Promise((resolve) => {
      this.manager.requestAccess({
        reason: 'Enable biometric login for quick access'
      }, (granted) => {
        resolve(granted);
      });
    });
  }
  
  async authenticate(reason = 'Verify your identity') {
    return new Promise((resolve) => {
      this.manager.authenticate({
        reason: reason
      }, (success, token) => {
        resolve({ success, token });
      });
    });
  }
  
  async saveToken(token) {
    return new Promise((resolve) => {
      this.manager.updateBiometricToken(token, (success) => {
        resolve(success);
      });
    });
  }
  
  async removeToken() {
    return new Promise((resolve) => {
      this.manager.updateBiometricToken('', (success) => {
        resolve(success);
      });
    });
  }
  
  isAvailable() {
    return this.manager.isBiometricAvailable;
  }
  
  hasAccess() {
    return this.manager.isAccessGranted;
  }
  
  hasToken() {
    return this.manager.isBiometricTokenSaved;
  }
}

// Upotreba
const biometricAuth = new BiometricAuth();

async function setupBiometricLogin() {
  // 1. Inicijalizacija
  const available = await biometricAuth.init();
  
  if (!available) {
    console.log('Biometric not available on this device');
    return false;
  }
  
  // 2. Zahtevaj permission
  if (!biometricAuth.hasAccess()) {
    const granted = await biometricAuth.requestPermission();
    
    if (!granted) {
      console.log('Biometric access denied');
      return false;
    }
  }
  
  // 3. Autentifikuj korisnika
  const { success, token } = await biometricAuth.authenticate('Set up biometric login');
  
  if (!success) {
    console.log('Authentication failed');
    return false;
  }
  
  // 4. Generiši i snimi token
  const secureToken = await generateSecureTokenFromServer();
  const saved = await biometricAuth.saveToken(secureToken);
  
  if (saved) {
    console.log('Biometric login enabled!');
    return true;
  }
  
  return false;
}

async function biometricLogin() {
  if (!biometricAuth.hasToken()) {
    console.log('No biometric token saved');
    return false;
  }
  
  const { success, token } = await biometricAuth.authenticate('Log in');
  
  if (success && token) {
    console.log('Login successful');
    
    // Verifikuj token na serveru
    const user = await verifyBiometricToken(token);
    
    if (user) {
      loginUser(user);
      return true;
    }
  }
  
  return false;
}
```

### Primer 2: Payment Confirmation

```javascript
class SecurePayment {
  constructor() {
    this.biometric = new BiometricAuth();
  }
  
  async init() {
    await this.biometric.init();
    
    // Setup events
    Telegram.WebApp.onEvent('biometricAuthRequested', (event) => {
      if (event.isAuthenticated) {
        this.onAuthSuccess(event.biometricToken);
      } else {
        this.onAuthFailed();
      }
    });
  }
  
  async processPayment(amount, description) {
    // Proveri da li je biometric dostupan
    if (!this.biometric.isAvailable()) {
      return this.fallbackPaymentConfirmation(amount, description);
    }
    
    // Zatraži biometric confirmation
    const { success } = await this.biometric.authenticate(
      `Confirm payment of $${amount.toFixed(2)} for ${description}`
    );
    
    if (!success) {
      throw new Error('Payment not authorized');
    }
    
    // Nastavi sa payment procesom
    console.log('Payment authorized via biometrics');
    
    const result = await this.sendPaymentToServer({
      amount,
      description,
      authMethod: 'biometric',
      deviceId: this.biometric.manager.deviceId
    });
    
    return result;
  }
  
  async sendPaymentToServer(paymentData) {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    
    return response.json();
  }
  
  fallbackPaymentConfirmation(amount, description) {
    // Fallback: pokazati confirmation dialog
    return Telegram.WebApp.showConfirm(
      `Confirm payment of $${amount.toFixed(2)} for ${description}?`
    );
  }
  
  onAuthSuccess(token) {
    console.log('Payment authorized');
    Telegram.WebApp.showAlert('Payment successful!');
  }
  
  onAuthFailed() {
    console.log('Payment authorization failed');
    Telegram.WebApp.showAlert('Payment cancelled');
  }
}

// Upotreba
const payment = new SecurePayment();

async function buyProduct(product) {
  await payment.init();
  
  try {
    const result = await payment.processPayment(
      product.price,
      product.name
    );
    
    if (result.success) {
      console.log('Payment completed:', result.transactionId);
      showSuccessScreen();
    }
  } catch (error) {
    console.error('Payment error:', error);
    showErrorScreen(error.message);
  }
}
```

### Primer 3: Secure Data Access

```javascript
class SecureVault {
  constructor() {
    this.biometric = new BiometricAuth();
    this.encryptedData = null;
  }
  
  async init() {
    await this.biometric.init();
    
    // Load encrypted data
    this.encryptedData = localStorage.getItem('secureData');
  }
  
  async saveSecureData(data) {
    // 1. Zahtevaj biometric authentication
    const { success } = await this.biometric.authenticate(
      'Protect your sensitive data'
    );
    
    if (!success) {
      throw new Error('Authentication required');
    }
    
    // 2. Generiši encryption key na serveru
    const encryptionKey = await this.getEncryptionKey();
    
    // 3. Enkriptuj data
    const encrypted = await this.encrypt(data, encryptionKey);
    
    // 4. Snimi encrypted data lokalno
    localStorage.setItem('secureData', encrypted);
    
    // 5. Snimi encryption key kao biometric token
    await this.biometric.saveToken(encryptionKey);
    
    console.log('Data saved securely');
    return true;
  }
  
  async getSecureData() {
    if (!this.encryptedData) {
      throw new Error('No secure data found');
    }
    
    if (!this.biometric.hasToken()) {
      throw new Error('Biometric token not set up');
    }
    
    // 1. Zahtevaj biometric authentication
    const { success, token } = await this.biometric.authenticate(
      'Access your sensitive data'
    );
    
    if (!success || !token) {
      throw new Error('Authentication failed');
    }
    
    // 2. Koristi biometric token kao encryption key
    const encryptionKey = token;
    
    // 3. Dekriptuj data
    try {
      const decrypted = await this.decrypt(this.encryptedData, encryptionKey);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Unable to access data');
    }
  }
  
  async deleteSecureData() {
    const { success } = await this.biometric.authenticate(
      'Delete your sensitive data'
    );
    
    if (!success) {
      throw new Error('Authentication required');
    }
    
    // Obriši data
    localStorage.removeItem('secureData');
    
    // Obriši biometric token
    await this.biometric.removeToken();
    
    this.encryptedData = null;
    console.log('Secure data deleted');
  }
  
  async encrypt(data, key) {
    // Simple example - use proper crypto library in production
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(JSON.stringify(data));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBytes
    );
    
    return btoa(String.fromCharCode(...iv) + String.fromCharCode(...new Uint8Array(encrypted)));
  }
  
  async decrypt(encryptedData, key) {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    
    const combined = atob(encryptedData);
    const iv = new Uint8Array([...combined.slice(0, 12)].map(c => c.charCodeAt(0)));
    const data = new Uint8Array([...combined.slice(12)].map(c => c.charCodeAt(0)));
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );
    
    return JSON.parse(decoder.decode(decrypted));
  }
  
  async getEncryptionKey() {
    // Get encryption key from server
    const response = await fetch('/api/encryption-key', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Telegram.WebApp.initData}`
      }
    });
    
    const { key } = await response.json();
    return key;
  }
}

// Upotreba
const vault = new SecureVault();

async function savePassword(password) {
  await vault.init();
  
  try {
    await vault.saveSecureData({
      password: password,
      timestamp: Date.now()
    });
    
    console.log('Password saved securely');
  } catch (error) {
    console.error('Error saving password:', error);
  }
}

async function retrievePassword() {
  try {
    const data = await vault.getSecureData();
    console.log('Retrieved password:', data.password);
    return data.password;
  } catch (error) {
    console.error('Error retrieving password:', error);
    return null;
  }
}
```

---

## Biometric Types

### `"finger"` - Fingerprint
- Android: Fingerprint sensor
- iOS: Touch ID

### `"face"` - Facial recognition
- iOS: Face ID
- Android: Face unlock (device-dependent)

### `"unknown"` - Other biometric
- Drugi tipovi biometric authentication (npr. iris scan)

**Provera tipa:**
```javascript
const type = Telegram.WebApp.BiometricManager.biometricType;

if (type === 'face') {
  showFaceIDIcon();
} else if (type === 'finger') {
  showFingerprintIcon();
}
```

---

## Security Best Practices

### 1. ✅ Token Storage

```javascript
// ✅ Dobro - Token je automatski enkriptovan
BiometricManager.updateBiometricToken(secureToken);

// ✅ Dobro - Token je tied to device
const deviceId = BiometricManager.deviceId; // Unique per device

// ❌ Loše - Nikad ne čuvaj token u localStorage
localStorage.setItem('token', token); // NE!
```

### 2. ✅ Server-Side Validation

```javascript
// Server-side (Node.js)
app.post('/api/verify-biometric', (req, res) => {
  const { token, deviceId } = req.body;
  
  // Proveri da li token postoji u bazi
  const storedToken = db.getBiometricToken(req.userId, deviceId);
  
  if (storedToken === token) {
    // Token je validan
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### 3. ✅ Token Rotation

```javascript
async function rotateToken() {
  // Generiši novi token periodično (npr. svakih 30 dana)
  const newToken = await generateNewSecureToken();
  
  await BiometricManager.updateBiometricToken(newToken);
  
  // Update na serveru
  await updateTokenOnServer(newToken);
}
```

### 4. ✅ Fallback Methods

```javascript
async function secureLogin() {
  // Pokušaj biometric prvo
  if (biometricAuth.isAvailable() && biometricAuth.hasToken()) {
    try {
      return await biometricLogin();
    } catch (error) {
      console.log('Biometric failed, falling back to password');
    }
  }
  
  // Fallback na password
  return await passwordLogin();
}
```

### 5. ✅ Clear Messaging

```javascript
BiometricManager.requestAccess({
  reason: 'We use biometric authentication to keep your account secure. Your biometric data never leaves your device.'
});

BiometricManager.authenticate({
  reason: 'Confirm this payment of $50.00 to proceed'
});
```

---

## Platform Differences

### iOS (Touch ID / Face ID)
- Koristi iOS Keychain za storage
- Native biometric prompts
- Poštuje Siri & Search settings

### Android (Fingerprint / Face Unlock)
- Koristi Android Keystore
- BiometricPrompt API
- Varira po device-u (neki nemaju face unlock)

**Handle gracefully:**
```javascript
if (!BiometricManager.isBiometricAvailable) {
  // Pokazati alternative auth method
  showPasswordLogin();
}
```

---

## Use Cases

### ✅ Authentication
- Quick login
- Re-authentication za sensitive actions
- Multi-factor authentication

### ✅ Payments
- Transaction confirmation
- In-app purchases
- Recurring payments

### ✅ Data Protection
- Encrypted notes
- Password manager
- Sensitive files

### ✅ Access Control
- Admin panels
- Restricted features
- Age verification

---

## Povezani Resursi

- [Eventi](./13-events.md#biometric-events)
- [Storage](./08-storage.md#securestorage) - SecureStorage
- [Inicijalizacija](./05-initialization.md)
- [Validation](./12-validation.md) - Server-side security
