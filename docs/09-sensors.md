# Sensors - Device Motion Tracking (Bot API 8.0+)

Mini Apps mogu pratiti detaljne podatke o pokretima uređaja:
- **Accelerometer** - akceleracija
- **DeviceOrientation** - orijentacija
- **Gyroscope** - rotacija

---

## 📱 Accelerometer

Pristup akcelerometru na uređaju - meri akceleraciju u m/s².

### Pristup

```javascript
const accelerometer = Telegram.WebApp.Accelerometer;
```

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isStarted` | Boolean | Da li je tracking aktivan |
| `x` | Float | Akceleracija u X-osi (m/s²) |
| `y` | Float | Akceleracija u Y-osi (m/s²) |
| `z` | Float | Akceleracija u Z-osi (m/s²) |

### Metode

#### start()

```javascript
Accelerometer.start(params[, callback])
```

**Params:** `AccelerometerStartParams`
- `refresh_rate` - Integer (20-1000ms, default 1000)

**Callback:** `callback(success)` - boolean

**Primer:**
```javascript
Telegram.WebApp.Accelerometer.start({
  refresh_rate: 100  // 100ms = 10Hz
}, function(started) {
  if (started) {
    console.log('Accelerometer started');
  } else {
    console.log('Failed to start');
  }
});
```

#### stop()

```javascript
Accelerometer.stop([callback])
```

**Callback:** `callback(success)`

### Eventi

- `accelerometerStarted` - uspešno započeto
- `accelerometerStopped` - zaustavljeno
- `accelerometerChanged` - novi podaci (sa refresh_rate frekvencijom)
- `accelerometerFailed` - greška (error: 'UNSUPPORTED')

### Primer Upotrebe

```javascript
// Start tracking
Telegram.WebApp.Accelerometer.start({ refresh_rate: 100 });

// Listen for changes
Telegram.WebApp.onEvent('accelerometerChanged', function() {
  const acc = Telegram.WebApp.Accelerometer;
  
  console.log(`X: ${acc.x.toFixed(2)} m/s²`);
  console.log(`Y: ${acc.y.toFixed(2)} m/s²`);
  console.log(`Z: ${acc.z.toFixed(2)} m/s²`);
  
  // Update game physics
  updateGamePhysics(acc.x, acc.y, acc.z);
});

// Handle errors
Telegram.WebApp.onEvent('accelerometerFailed', function(event) {
  console.error('Accelerometer error:', event.error);
  showFallbackControls();
});

// Stop when done
function cleanup() {
  Telegram.WebApp.Accelerometer.stop(function(stopped) {
    console.log('Accelerometer stopped');
  });
}
```

### Use Cases

✅ **Igre:**
- Tilt controls
- Physics simulation
- Gesture recognition

✅ **Fitness:**
- Step counter
- Movement detection
- Activity tracking

✅ **Utility:**
- Level tool
- Vibration detection
- Motion alerts

---

## 🧭 DeviceOrientation

Pristup orijentaciji uređaja - meri rotaciju oko X, Y, Z osa u radijanima.

### Pristup

```javascript
const orientation = Telegram.WebApp.DeviceOrientation;
```

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isStarted` | Boolean | Da li je tracking aktivan |
| `absolute` | Boolean | Da li su podaci apsolutni (relative to magnetic north) |
| `alpha` | Float | Rotacija oko Z-ose (radiјani) |
| `beta` | Float | Rotacija oko X-ose (radiјani) |
| `gamma` | Float | Rotacija oko Y-ose (radiјani) |

### Metode

#### start()

```javascript
DeviceOrientation.start(params[, callback])
```

**Params:** `DeviceOrientationStartParams`
- `refresh_rate` - Integer (20-1000ms, default 1000)
- `need_absolute` - Boolean (default false)

**Callback:** `callback(success)`

**Primer:**
```javascript
// Relativna orijentacija
Telegram.WebApp.DeviceOrientation.start({
  refresh_rate: 50,
  need_absolute: false
});

// Apsolutna (compass)
Telegram.WebApp.DeviceOrientation.start({
  refresh_rate: 100,
  need_absolute: true  // Relative to magnetic north
}, function(started) {
  if (started) {
    // Check if absolute is actually supported
    const isAbsolute = Telegram.WebApp.DeviceOrientation.absolute;
    console.log('Absolute orientation:', isAbsolute);
  }
});
```

⚠️ **Napomena:** Neki uređaji ne podržavaju apsolutnu orijentaciju. Proveri `absolute` polje.

#### stop()

```javascript
DeviceOrientation.stop([callback])
```

### Eventi

- `deviceOrientationStarted`
- `deviceOrientationStopped`
- `deviceOrientationChanged`
- `deviceOrientationFailed`

### Primer - Compass

```javascript
// Start absolute orientation tracking
Telegram.WebApp.DeviceOrientation.start({
  refresh_rate: 100,
  need_absolute: true
});

Telegram.WebApp.onEvent('deviceOrientationChanged', function() {
  const orientation = Telegram.WebApp.DeviceOrientation;
  
  if (!orientation.absolute) {
    console.warn('Absolute orientation not available');
    return;
  }
  
  // Alpha je heading (0 = north, PI/2 = east, PI = south, 3*PI/2 = west)
  const headingRadians = orientation.alpha;
  const headingDegrees = (headingRadians * 180 / Math.PI).toFixed(1);
  
  console.log(`Heading: ${headingDegrees}°`);
  
  // Update compass UI
  updateCompassNeedle(headingDegrees);
});
```

### Primer - Camera Rotation

```javascript
// Relative orientation for camera
Telegram.WebApp.DeviceOrientation.start({
  refresh_rate: 50,
  need_absolute: false
});

Telegram.WebApp.onEvent('deviceOrientationChanged', function() {
  const o = Telegram.WebApp.DeviceOrientation;
  
  // Alpha - Z rotation
  // Beta - X rotation (tilt forward/backward)
  // Gamma - Y rotation (tilt left/right)
  
  updateCameraRotation({
    yaw: o.alpha,
    pitch: o.beta,
    roll: o.gamma
  });
});
```

### Use Cases

✅ **Navigation:**
- Compass
- AR navigation
- Direction indicators

✅ **VR/AR:**
- Camera rotation
- 360° viewers
- Virtual tours

✅ **Games:**
- Steering
- Aiming
- View control

---

## 🔄 Gyroscope

Pristup žiroskopu - meri brzinu rotacije oko X, Y, Z osa u rad/s.

### Pristup

```javascript
const gyro = Telegram.WebApp.Gyroscope;
```

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isStarted` | Boolean | Da li je tracking aktivan |
| `x` | Float | Brzina rotacije oko X-ose (rad/s) |
| `y` | Float | Brzina rotacije oko Y-ose (rad/s) |
| `z` | Float | Brzina rotacije oko Z-ose (rad/s) |

### Metode

#### start()

```javascript
Gyroscope.start(params[, callback])
```

**Params:** `GyroscopeStartParams`
- `refresh_rate` - Integer (20-1000ms, default 1000)

**Callback:** `callback(success)`

```javascript
Telegram.WebApp.Gyroscope.start({
  refresh_rate: 50  // 20Hz
});
```

#### stop()

```javascript
Gyroscope.stop([callback])
```

### Eventi

- `gyroscopeStarted`
- `gyroscopeStopped`
- `gyroscopeChanged`
- `gyroscopeFailed`

### Primer - VR Camera

```javascript
// Start gyroscope
Telegram.WebApp.Gyroscope.start({ refresh_rate: 50 });

let rotation = { x: 0, y: 0, z: 0 };

Telegram.WebApp.onEvent('gyroscopeChanged', function() {
  const gyro = Telegram.WebApp.Gyroscope;
  
  // Brzina rotacije (rad/s)
  const deltaTime = 0.05; // 50ms = 0.05s
  
  // Integriši brzinu u rotaciju
  rotation.x += gyro.x * deltaTime;
  rotation.y += gyro.y * deltaTime;
  rotation.z += gyro.z * deltaTime;
  
  console.log(`Rotation: X=${rotation.x.toFixed(2)}, Y=${rotation.y.toFixed(2)}, Z=${rotation.z.toFixed(2)}`);
  
  // Update VR camera
  updateVRCamera(rotation);
});
```

### Use Cases

✅ **VR:**
- Head tracking
- 360° video playback
- Immersive experiences

✅ **Games:**
- Smooth camera rotation
- Vehicle controls
- Motion-based gameplay

✅ **Photography:**
- Stabilization
- Panorama stitching
- Motion detection

---

## Screen Orientation Lock

### Metode

```javascript
Telegram.WebApp.lockOrientation()
```
Zaključava trenutnu orijentaciju (portrait ili landscape).

```javascript
Telegram.WebApp.unlockOrientation()
```
Otključava - prati rotaciju uređaja.

### Primer

```javascript
// Check if locked
console.log('Orientation locked:', Telegram.WebApp.isOrientationLocked);

// Lock to current mode
Telegram.WebApp.lockOrientation();
console.log('Locked to:', window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

// Later, unlock
Telegram.WebApp.unlockOrientation();
```

### Use Case

```javascript
// Game starts - lock to landscape
function startGame() {
  if (window.innerWidth < window.innerHeight) {
    alert('Please rotate to landscape');
    return;
  }
  
  Telegram.WebApp.lockOrientation();
  console.log('Orientation locked for gaming');
  
  startGameLoop();
}

// Game ends - unlock
function endGame() {
  Telegram.WebApp.unlockOrientation();
  console.log('Orientation unlocked');
}
```

---

## Kombinovana Upotreba

### Primer - Full Motion Game

```javascript
class MotionController {
  constructor() {
    this.acceleration = { x: 0, y: 0, z: 0 };
    this.orientation = { alpha: 0, beta: 0, gamma: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
  }
  
  start() {
    // Start all sensors
    Telegram.WebApp.Accelerometer.start({ refresh_rate: 50 });
    Telegram.WebApp.DeviceOrientation.start({ 
      refresh_rate: 50,
      need_absolute: false
    });
    Telegram.WebApp.Gyroscope.start({ refresh_rate: 50 });
    
    // Lock orientation
    Telegram.WebApp.lockOrientation();
    
    // Listen to changes
    this.setupListeners();
  }
  
  setupListeners() {
    Telegram.WebApp.onEvent('accelerometerChanged', () => {
      const acc = Telegram.WebApp.Accelerometer;
      this.acceleration = { x: acc.x, y: acc.y, z: acc.z };
    });
    
    Telegram.WebApp.onEvent('deviceOrientationChanged', () => {
      const ori = Telegram.WebApp.DeviceOrientation;
      this.orientation = { 
        alpha: ori.alpha,
        beta: ori.beta,
        gamma: ori.gamma
      };
    });
    
    Telegram.WebApp.onEvent('gyroscopeChanged', () => {
      const gyro = Telegram.WebApp.Gyroscope;
      this.rotation = { x: gyro.x, y: gyro.y, z: gyro.z };
    });
  }
  
  stop() {
    Telegram.WebApp.Accelerometer.stop();
    Telegram.WebApp.DeviceOrientation.stop();
    Telegram.WebApp.Gyroscope.stop();
    Telegram.WebApp.unlockOrientation();
  }
  
  getMotionData() {
    return {
      acceleration: this.acceleration,
      orientation: this.orientation,
      rotation: this.rotation
    };
  }
}

// Upotreba
const motion = new MotionController();
motion.start();

// Game loop
setInterval(() => {
  const data = motion.getMotionData();
  updateGamePhysics(data);
}, 16); // 60fps

// Cleanup
window.addEventListener('beforeunload', () => {
  motion.stop();
});
```

---

## Performance Considerations

### 1. Refresh Rate

```javascript
// Niži refresh rate za battery saving
Telegram.WebApp.Accelerometer.start({
  refresh_rate: 1000  // 1Hz - za simple detection
});

// Viši refresh rate za precision
Telegram.WebApp.Gyroscope.start({
  refresh_rate: 20  // 50Hz - za VR/games
});
```

### 2. Stop When Not Needed

```javascript
// Stop kada app nije aktivan
Telegram.WebApp.onEvent('deactivated', function() {
  Telegram.WebApp.Accelerometer.stop();
  Telegram.WebApp.Gyroscope.stop();
});

Telegram.WebApp.onEvent('activated', function() {
  Telegram.WebApp.Accelerometer.start({ refresh_rate: 100 });
});
```

### 3. Throttle Updates

```javascript
let lastUpdate = 0;
const throttleMs = 100;

Telegram.WebApp.onEvent('accelerometerChanged', function() {
  const now = Date.now();
  
  if (now - lastUpdate < throttleMs) {
    return; // Skip update
  }
  
  lastUpdate = now;
  
  // Process data
  const acc = Telegram.WebApp.Accelerometer;
  updateUI(acc);
});
```

---

## Browser Compatibility Note

⚠️ Ovi API-ji koriste Device Orientation/Motion API-je browsera, koji mogu imati različitu podršku i preciznost na različitim uređajima.

**Uvek proveri:**
```javascript
// Feature detection
const features = {
  accelerometer: !!Telegram.WebApp.Accelerometer,
  orientation: !!Telegram.WebApp.DeviceOrientation,
  gyroscope: !!Telegram.WebApp.Gyroscope
};

if (!features.accelerometer) {
  console.log('Accelerometer not available');
  showAlternativeControls();
}
```

---

## Povezani Resursi

- [Eventi](./13-events.md#sensor-events)
- [Inicijalizacija](./05-initialization.md)
- [Design Guidelines](./03-design-guidelines.md)
