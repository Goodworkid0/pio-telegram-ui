# Storage - Skladištenje Podataka

Telegram Mini Apps podržavaju 3 tipa storage-a za čuvanje podataka.

---

## 📦 CloudStorage (Bot API 6.9+)

Cloud storage omogućava čuvanje podataka u oblaku. Svaki bot može čuvati do **1024 items po korisniku**.

### Pristup

```javascript
const storage = Telegram.WebApp.CloudStorage;
```

### Metode

#### setItem()

```javascript
CloudStorage.setItem(key, value[, callback])
```

Čuva vrednost u cloud storage-u.

**Parametri:**
- `key` - String (1-128 karaktera): A-Z, a-z, 0-9, `_`, `-`
- `value` - String (0-4096 karaktera)
- `callback(error, success)` - Optional

**Primer:**
```javascript
Telegram.WebApp.CloudStorage.setItem('user_score', '1250', function(error, success) {
  if (error) {
    console.error('Error saving:', error);
  } else {
    console.log('Saved:', success);
  }
});
```

#### getItem()

```javascript
CloudStorage.getItem(key, callback)
```

Čita vrednost iz cloud storage-a.

**Callback:** `callback(error, value)`

**Primer:**
```javascript
Telegram.WebApp.CloudStorage.getItem('user_score', function(error, value) {
  if (error) {
    console.error('Error reading:', error);
  } else {
    console.log('Score:', value);
  }
});
```

#### getItems()

```javascript
CloudStorage.getItems(keys, callback)
```

Čita više vrednosti odjednom.

**Callback:** `callback(error, values)`

**Primer:**
```javascript
const keys = ['user_score', 'user_level', 'user_name'];

Telegram.WebApp.CloudStorage.getItems(keys, function(error, values) {
  if (!error) {
    console.log('Values:', values);
    // values = { user_score: '1250', user_level: '5', user_name: 'John' }
  }
});
```

#### removeItem()

```javascript
CloudStorage.removeItem(key[, callback])
```

Briše vrednost iz storage-a.

**Primer:**
```javascript
Telegram.WebApp.CloudStorage.removeItem('old_data', function(error, removed) {
  console.log('Removed:', removed);
});
```

#### removeItems()

```javascript
CloudStorage.removeItems(keys[, callback])
```

Briše više vrednosti odjednom.

#### getKeys()

```javascript
CloudStorage.getKeys(callback)
```

Vraća listu svih ključeva u storage-u.

**Primer:**
```javascript
Telegram.WebApp.CloudStorage.getKeys(function(error, keys) {
  console.log('All keys:', keys);
  // keys = ['user_score', 'user_level', 'settings']
});
```

### CloudStorage - Kompletni Primer

```javascript
class CloudSettings {
  constructor() {
    this.storage = Telegram.WebApp.CloudStorage;
  }
  
  async save(key, value) {
    return new Promise((resolve, reject) => {
      this.storage.setItem(key, JSON.stringify(value), (error, success) => {
        if (error) reject(error);
        else resolve(success);
      });
    });
  }
  
  async load(key) {
    return new Promise((resolve, reject) => {
      this.storage.getItem(key, (error, value) => {
        if (error) reject(error);
        else resolve(value ? JSON.parse(value) : null);
      });
    });
  }
  
  async loadAll(keys) {
    return new Promise((resolve, reject) => {
      this.storage.getItems(keys, (error, values) => {
        if (error) reject(error);
        else {
          const parsed = {};
          for (let key in values) {
            parsed[key] = JSON.parse(values[key]);
          }
          resolve(parsed);
        }
      });
    });
  }
}

// Upotreba
const settings = new CloudSettings();

// Save
await settings.save('preferences', {
  theme: 'dark',
  notifications: true,
  language: 'en'
});

// Load
const prefs = await settings.load('preferences');
console.log(prefs.theme); // 'dark'
```

### Ograničenja CloudStorage

- ✅ 1024 items po korisniku
- ✅ Ključ: 1-128 karaktera
- ✅ Vrednost: 0-4096 karaktera
- ✅ Sinhronizovano između uređaja
- ❌ Nije enkriptovano

---

## 💾 DeviceStorage (Bot API 9.0+)

Persistent lokalno skladište na uređaju korisnika. Svaki bot može čuvati do **5MB po korisniku**.

**Slično:** Browser `localStorage` API, ali integrisano u Telegram klijent.

### Pristup

```javascript
const storage = Telegram.WebApp.DeviceStorage;
```

### Metode

#### setItem()

```javascript
DeviceStorage.setItem(key, value[, callback])
```

Čuva vrednost lokalno na uređaju.

**Primer:**
```javascript
Telegram.WebApp.DeviceStorage.setItem('cache_data', JSON.stringify(largeData), 
  function(error, success) {
    if (error) {
      console.error('Failed to cache:', error);
    } else {
      console.log('Cached successfully');
    }
  }
);
```

#### getItem()

```javascript
DeviceStorage.getItem(key, callback)
```

Čita vrednost sa uređaja.

**Callback:** `callback(error, value)`

#### removeItem()

```javascript
DeviceStorage.removeItem(key[, callback])
```

Briše vrednost.

#### clear()

```javascript
DeviceStorage.clear([callback])
```

Briše sve ključeve koje je bot prethodno sačuvao.

**Primer:**
```javascript
Telegram.WebApp.DeviceStorage.clear(function(error, success) {
  if (success) {
    console.log('All device data cleared');
  }
});
```

### DeviceStorage - Primer

```javascript
class LocalCache {
  constructor() {
    this.storage = Telegram.WebApp.DeviceStorage;
  }
  
  cache(key, data, ttl = 3600000) { // 1 hour default
    const item = {
      data: data,
      timestamp: Date.now(),
      ttl: ttl
    };
    
    return new Promise((resolve, reject) => {
      this.storage.setItem(key, JSON.stringify(item), (error, success) => {
        if (error) reject(error);
        else resolve(success);
      });
    });
  }
  
  get(key) {
    return new Promise((resolve, reject) => {
      this.storage.getItem(key, (error, value) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (!value) {
          resolve(null);
          return;
        }
        
        const item = JSON.parse(value);
        
        // Check if expired
        if (Date.now() - item.timestamp > item.ttl) {
          // Remove expired item
          this.storage.removeItem(key);
          resolve(null);
        } else {
          resolve(item.data);
        }
      });
    });
  }
  
  clearAll() {
    return new Promise((resolve, reject) => {
      this.storage.clear((error, success) => {
        if (error) reject(error);
        else resolve(success);
      });
    });
  }
}

// Upotreba
const cache = new LocalCache();

// Cache API response for 1 hour
await cache.cache('api_users', usersData, 3600000);

// Get cached data
const cachedUsers = await cache.get('api_users');
if (cachedUsers) {
  console.log('Using cached data');
} else {
  console.log('Cache expired, fetch new data');
}
```

### Kada Koristiti DeviceStorage?

✅ **Dobro za:**
- Large data caching
- Offline data
- Performance optimization
- App state koji ne treba sync

❌ **Ne koristi za:**
- Osetljive podatke (koristi SecureStorage)
- Cross-device sync (koristi CloudStorage)

---

## 🔒 SecureStorage (Bot API 9.0+)

Sigurno skladište za osetljive podatke. Svaki bot može čuvati do **10 items po korisniku**.

**Enkripcija:**
- **iOS:** System Keychain
- **Android:** Keystore
- Enkriptovano at rest
- Nedostupno neautorizovanim aplikacijama

### Pristup

```javascript
const storage = Telegram.WebApp.SecureStorage;
```

### Metode

#### setItem()

```javascript
SecureStorage.setItem(key, value[, callback])
```

Čuva osetljivu vrednost enkriptovano.

**Primer:**
```javascript
Telegram.WebApp.SecureStorage.setItem('auth_token', 'secret_jwt_token', 
  function(error, success) {
    if (error) {
      console.error('Failed to save token:', error);
    } else {
      console.log('Token saved securely');
    }
  }
);
```

#### getItem()

```javascript
SecureStorage.getItem(key, callback)
```

Čita osetljivu vrednost.

**Callback:** `callback(error, value, canRestore)`

**Parametri:**
- `error` - greška ako postoji
- `value` - vrednost ili `null` ako ne postoji
- `canRestore` - boolean da li se može restore-ovati

**Primer:**
```javascript
Telegram.WebApp.SecureStorage.getItem('auth_token', 
  function(error, value, canRestore) {
    if (error) {
      console.error('Error:', error);
    } else if (value) {
      console.log('Token:', value);
    } else if (canRestore) {
      console.log('Token can be restored');
      // Call restoreItem()
    } else {
      console.log('No token found');
    }
  }
);
```

#### restoreItem()

```javascript
SecureStorage.restoreItem(key[, callback])
```

Pokušava restore-ovati ključ koji je prethodno postojao na uređaju.

**Callback:** `callback(error, value)`

**Napomena:** Korisnik mora odobriti restore.

**Primer:**
```javascript
Telegram.WebApp.SecureStorage.restoreItem('auth_token', 
  function(error, value) {
    if (error) {
      console.log('User declined or error:', error);
    } else {
      console.log('Token restored:', value);
    }
  }
);
```

#### removeItem()

```javascript
SecureStorage.removeItem(key[, callback])
```

Briše osetljivu vrednost.

#### clear()

```javascript
SecureStorage.clear([callback])
```

Briše sve secure ključeve.

### SecureStorage - Primer

```javascript
class SecureAuth {
  constructor() {
    this.storage = Telegram.WebApp.SecureStorage;
  }
  
  saveToken(token) {
    return new Promise((resolve, reject) => {
      this.storage.setItem('auth_token', token, (error, success) => {
        if (error) reject(error);
        else resolve(success);
      });
    });
  }
  
  async getToken() {
    return new Promise((resolve, reject) => {
      this.storage.getItem('auth_token', async (error, value, canRestore) => {
        if (error) {
          reject(error);
        } else if (value) {
          resolve(value);
        } else if (canRestore) {
          // Try to restore
          try {
            const restored = await this.restoreToken();
            resolve(restored);
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
  
  restoreToken() {
    return new Promise((resolve, reject) => {
      this.storage.restoreItem('auth_token', (error, value) => {
        if (error) reject(error);
        else resolve(value);
      });
    });
  }
  
  clearAuth() {
    return new Promise((resolve, reject) => {
      this.storage.removeItem('auth_token', (error, success) => {
        if (error) reject(error);
        else resolve(success);
      });
    });
  }
}

// Upotreba
const auth = new SecureAuth();

// Login
await auth.saveToken('jwt_token_here');

// Get token
const token = await auth.getToken();
if (token) {
  // Make authenticated API call
  fetch('/api/user', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Logout
await auth.clearAuth();
```

### Kada Koristiti SecureStorage?

✅ **Dobro za:**
- Authentication tokens
- API keys
- Private keys
- Passwords
- Personal data
- Biometric tokens

❌ **Ne koristi za:**
- Large data (limit 10 items)
- Non-sensitive data
- Frequently changed data

---

## Poređenje Storage Tipova

| Feature | CloudStorage | DeviceStorage | SecureStorage |
|---------|--------------|---------------|---------------|
| **Kapacitet** | 1024 items | 5MB | 10 items |
| **Sinhronizacija** | ✅ Cross-device | ❌ Local only | ❌ Local only |
| **Enkripcija** | ❌ Ne | ❌ Ne | ✅ Da (Keychain/Keystore) |
| **Bot API** | 6.9+ | 9.0+ | 9.0+ |
| **Najbolje za** | Settings, scores | Cache, offline | Tokens, secrets |
| **Restore support** | ❌ Ne | ❌ Ne | ✅ Da |

---

## Best Practices

### 1. Izbor Pravog Storage-a

```javascript
// Settings - CloudStorage (sync između uređaja)
Telegram.WebApp.CloudStorage.setItem('theme', 'dark');

// Large cache - DeviceStorage (performanse)
Telegram.WebApp.DeviceStorage.setItem('cached_images', JSON.stringify(images));

// Auth token - SecureStorage (sigurnost)
Telegram.WebApp.SecureStorage.setItem('auth_token', token);
```

### 2. Error Handling

```javascript
function saveData(key, value) {
  return new Promise((resolve, reject) => {
    Telegram.WebApp.CloudStorage.setItem(key, value, (error, success) => {
      if (error) {
        // Log error
        console.error('Storage error:', error);
        // Fallback to localStorage
        try {
          localStorage.setItem(key, value);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(success);
      }
    });
  });
}
```

### 3. Versioning

```javascript
const STORAGE_VERSION = '1.0';

async function saveSettings(settings) {
  const data = {
    version: STORAGE_VERSION,
    data: settings,
    timestamp: Date.now()
  };
  
  await CloudStorage.setItem('settings', JSON.stringify(data));
}

async function loadSettings() {
  const stored = await CloudStorage.getItem('settings');
  if (!stored) return null;
  
  const parsed = JSON.parse(stored);
  
  if (parsed.version !== STORAGE_VERSION) {
    // Migrate or reset
    return migrateSettings(parsed);
  }
  
  return parsed.data;
}
```

### 4. Chaining (Svi storage-i vraćaju this)

```javascript
Telegram.WebApp.CloudStorage
  .setItem('key1', 'value1')
  .setItem('key2', 'value2')
  .setItem('key3', 'value3');
```

---

## Povezani Resursi

- [Inicijalizacija](./05-initialization.md)
- [Biometrics](./11-biometrics.md) - koristi SecureStorage za biometric tokens
