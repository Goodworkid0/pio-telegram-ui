# Location - Geolocation Access (Bot API 8.0+)

Mini Apps mogu zatražiti pristup geolokaciji korisnika.

---

## LocationManager

Kontroliše pristup lokaciji na uređaju. **Mora biti inicijalizovan** pre prve upotrebe.

### Pristup

```javascript
const locationManager = Telegram.WebApp.LocationManager;
```

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `isInited` | Boolean | Da li je LocationManager inicijalizovan |
| `isLocationAvailable` | Boolean | Da li su location servisi dostupni na uređaju |
| `isAccessRequested` | Boolean | Da li je dozvola zatražena |
| `isAccessGranted` | Boolean | Da li je dozvola odobrena |

---

## Metode

### init()

```javascript
LocationManager.init([callback])
```

Inicijalizuje LocationManager objekat. **Obavezno pozvati pre prve upotrebe.**

**Callback:** `callback()` - poziva se kada je inicijalizacija završena

**Primer:**
```javascript
Telegram.WebApp.LocationManager.init(function() {
  console.log('LocationManager initialized');
  console.log('Location available:', Telegram.WebApp.LocationManager.isLocationAvailable);
  
  if (Telegram.WebApp.LocationManager.isLocationAvailable) {
    requestLocation();
  }
});
```

### getLocation()

```javascript
LocationManager.getLocation(callback)
```

Zahteva location podatke.

**Callback:** `callback(locationData)` 
- `locationData` - `LocationData` objekat ili `null` ako pristup nije odobren

**Primer:**
```javascript
Telegram.WebApp.LocationManager.getLocation(function(locationData) {
  if (locationData) {
    console.log('Latitude:', locationData.latitude);
    console.log('Longitude:', locationData.longitude);
    console.log('Altitude:', locationData.altitude);
    console.log('Accuracy:', locationData.horizontal_accuracy);
    
    // Update map
    updateMap(locationData.latitude, locationData.longitude);
  } else {
    console.log('Location access denied');
    showLocationDeniedMessage();
  }
});
```

### openSettings()

```javascript
LocationManager.openSettings()
```

Otvara location access settings za botove. Korisno kada trebaš zatražiti pristup od korisnika koji nije već odobrio.

⚠️ **Napomena:** Može se pozvati **samo kao odgovor na user interaction** (npr. klik).

**Primer:**
```javascript
// U event handler-u za button click
button.addEventListener('click', function() {
  if (!Telegram.WebApp.LocationManager.isAccessGranted) {
    console.log('Opening location settings...');
    Telegram.WebApp.LocationManager.openSettings();
  }
});
```

### Chaining

Sve metode vraćaju `LocationManager` objekat, tako da se mogu ulančavati:

```javascript
Telegram.WebApp.LocationManager
  .init()
  .getLocation(handleLocation);
```

---

## LocationData Object

Objekat koji sadrži podatke o trenutnoj lokaciji.

### Polja

| Polje | Tip | Opis |
|-------|-----|------|
| `latitude` | Float | Geografska širina u stepenima |
| `longitude` | Float | Geografska dužina u stepenima |
| `altitude` | Float | Nadmorska visina u metrima. `null` ako nije dostupno |
| `course` | Float | Smer kretanja uređaja u stepenima (0=North, 90=East, 180=South, 270=West). `null` ako nije dostupno |
| `speed` | Float | Brzina uređaja u m/s. `null` ako nije dostupno |
| `horizontal_accuracy` | Float | Tačnost latitude/longitude u metrima. `null` ako nije dostupno |
| `vertical_accuracy` | Float | Tačnost altitude u metrima. `null` ako nije dostupno |
| `course_accuracy` | Float | Tačnost course u stepenima. `null` ako nije dostupno |
| `speed_accuracy` | Float | Tačnost speed u m/s. `null` ako nije dostupno |

**Primer LocationData objekta:**
```javascript
{
  latitude: 40.7128,
  longitude: -74.0060,
  altitude: 10.5,
  course: 45.0,
  speed: 1.2,
  horizontal_accuracy: 5.0,
  vertical_accuracy: 10.0,
  course_accuracy: 5.0,
  speed_accuracy: 0.5
}
```

---

## Eventi

### locationManagerUpdated

Dešava se kada se LocationManager objekat promeni.

```javascript
Telegram.WebApp.onEvent('locationManagerUpdated', function() {
  const manager = Telegram.WebApp.LocationManager;
  
  console.log('Location available:', manager.isLocationAvailable);
  console.log('Access granted:', manager.isAccessGranted);
  
  if (manager.isAccessGranted) {
    enableLocationFeatures();
  }
});
```

### locationRequested

Dešava se kada su location podaci zatraženi.

**EventHandler:** Prima objekat sa poljem `locationData`

```javascript
Telegram.WebApp.onEvent('locationRequested', function(event) {
  if (event.locationData) {
    const loc = event.locationData;
    console.log(`Location: ${loc.latitude}, ${loc.longitude}`);
    
    updateMap(loc);
    findNearbyPlaces(loc);
  } else {
    console.log('No location data - access denied or unavailable');
  }
});
```

---

## Kompletni Primeri

### Primer 1: Simple Location Request

```javascript
class LocationService {
  constructor() {
    this.manager = Telegram.WebApp.LocationManager;
    this.initialized = false;
  }
  
  async init() {
    return new Promise((resolve) => {
      this.manager.init(() => {
        this.initialized = true;
        console.log('Location service initialized');
        resolve(this.manager.isLocationAvailable);
      });
    });
  }
  
  async getCurrentLocation() {
    if (!this.initialized) {
      await this.init();
    }
    
    if (!this.manager.isLocationAvailable) {
      throw new Error('Location services not available');
    }
    
    return new Promise((resolve, reject) => {
      this.manager.getLocation((locationData) => {
        if (locationData) {
          resolve(locationData);
        } else {
          reject(new Error('Location access denied'));
        }
      });
    });
  }
  
  requestPermission() {
    if (!this.manager.isAccessGranted) {
      this.manager.openSettings();
    }
  }
}

// Upotreba
const locationService = new LocationService();

async function showMyLocation() {
  try {
    await locationService.init();
    const location = await locationService.getCurrentLocation();
    
    console.log('Your location:');
    console.log(`Lat: ${location.latitude}`);
    console.log(`Lng: ${location.longitude}`);
    console.log(`Accuracy: ±${location.horizontal_accuracy}m`);
    
    displayOnMap(location);
  } catch (error) {
    console.error('Error:', error.message);
    
    // Show button to open settings
    showPermissionButton();
  }
}

// Button handler
document.getElementById('enableLocation').addEventListener('click', () => {
  locationService.requestPermission();
});
```

### Primer 2: Live Tracking

```javascript
class LiveLocationTracker {
  constructor() {
    this.manager = Telegram.WebApp.LocationManager;
    this.isTracking = false;
    this.trackingInterval = null;
    this.locations = [];
  }
  
  async init() {
    return new Promise((resolve) => {
      this.manager.init(() => {
        this.setupEvents();
        resolve();
      });
    });
  }
  
  setupEvents() {
    Telegram.WebApp.onEvent('locationRequested', (event) => {
      if (event.locationData && this.isTracking) {
        this.onLocationUpdate(event.locationData);
      }
    });
  }
  
  startTracking(intervalMs = 5000) {
    if (!this.manager.isAccessGranted) {
      console.error('Location access not granted');
      return false;
    }
    
    this.isTracking = true;
    console.log('Started location tracking');
    
    // Get initial location
    this.requestLocation();
    
    // Poll for updates
    this.trackingInterval = setInterval(() => {
      this.requestLocation();
    }, intervalMs);
    
    return true;
  }
  
  stopTracking() {
    this.isTracking = false;
    
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    
    console.log('Stopped location tracking');
  }
  
  requestLocation() {
    this.manager.getLocation((locationData) => {
      if (locationData && this.isTracking) {
        this.onLocationUpdate(locationData);
      }
    });
  }
  
  onLocationUpdate(locationData) {
    const timestamp = Date.now();
    
    this.locations.push({
      ...locationData,
      timestamp
    });
    
    console.log('Location update:', locationData);
    
    // Update UI
    this.updateTrackingUI(locationData);
    
    // Calculate distance traveled
    if (this.locations.length > 1) {
      const distance = this.calculateTotalDistance();
      console.log('Total distance:', distance.toFixed(2), 'm');
    }
  }
  
  calculateTotalDistance() {
    let total = 0;
    
    for (let i = 1; i < this.locations.length; i++) {
      const prev = this.locations[i - 1];
      const curr = this.locations[i];
      
      total += this.haversineDistance(
        prev.latitude, prev.longitude,
        curr.latitude, curr.longitude
      );
    }
    
    return total;
  }
  
  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
  
  updateTrackingUI(locationData) {
    // Update map marker
    updateMapMarker(locationData.latitude, locationData.longitude);
    
    // Update stats
    document.getElementById('latitude').textContent = locationData.latitude.toFixed(6);
    document.getElementById('longitude').textContent = locationData.longitude.toFixed(6);
    document.getElementById('speed').textContent = 
      locationData.speed ? (locationData.speed * 3.6).toFixed(1) + ' km/h' : 'N/A';
    document.getElementById('accuracy').textContent = 
      locationData.horizontal_accuracy ? '±' + locationData.horizontal_accuracy.toFixed(1) + 'm' : 'N/A';
  }
  
  exportTrack() {
    return {
      locations: this.locations,
      totalDistance: this.calculateTotalDistance(),
      duration: this.locations.length > 0 
        ? this.locations[this.locations.length - 1].timestamp - this.locations[0].timestamp
        : 0
    };
  }
}

// Upotreba
const tracker = new LiveLocationTracker();

async function startRunTracking() {
  await tracker.init();
  
  if (tracker.startTracking(3000)) { // Update every 3 seconds
    console.log('Tracking started');
    showTrackingUI();
  } else {
    showPermissionRequest();
  }
}

function stopRunTracking() {
  tracker.stopTracking();
  
  const trackData = tracker.exportTrack();
  console.log('Track data:', trackData);
  
  saveTrackToServer(trackData);
}
```

### Primer 3: Nearby Places

```javascript
class NearbyPlaces {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.manager = Telegram.WebApp.LocationManager;
  }
  
  async init() {
    return new Promise((resolve) => {
      this.manager.init(resolve);
    });
  }
  
  async findNearby(type, radius = 1000) {
    await this.init();
    
    return new Promise((resolve, reject) => {
      this.manager.getLocation(async (locationData) => {
        if (!locationData) {
          reject(new Error('Location access denied'));
          return;
        }
        
        try {
          const places = await this.searchPlaces(
            locationData.latitude,
            locationData.longitude,
            type,
            radius
          );
          
          resolve(places);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  
  async searchPlaces(lat, lng, type, radius) {
    // Example: Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.results.map(place => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      distance: this.calculateDistance(
        lat, lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      ),
      rating: place.rating,
      types: place.types
    }));
  }
  
  calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }
}

// Upotreba
const nearby = new NearbyPlaces('your_google_api_key');

async function findRestaurants() {
  try {
    const restaurants = await nearby.findNearby('restaurant', 1000);
    
    console.log(`Found ${restaurants.length} restaurants nearby:`);
    
    restaurants
      .sort((a, b) => a.distance - b.distance)
      .forEach(restaurant => {
        console.log(`${restaurant.name} - ${restaurant.distance.toFixed(0)}m away`);
      });
    
    displayPlaces(restaurants);
  } catch (error) {
    console.error('Error finding restaurants:', error);
  }
}
```

---

## Use Cases

### ✅ Navigation Apps
- Turn-by-turn directions
- Real-time tracking
- ETA calculations

### ✅ Location-Based Services
- Nearby places (restaurants, shops, etc.)
- Geo-targeted content
- Local events

### ✅ Fitness & Health
- Running/cycling tracking
- Distance calculation
- Route recording

### ✅ Games
- Pokemon GO-style games
- Geo-caching
- Location-based challenges

### ✅ Social
- Check-ins
- Location sharing
- Friend finder

### ✅ Delivery & Logistics
- Order tracking
- Delivery ETA
- Driver location

---

## Best Practices

### 1. ✅ Uvek Inicijalizuj Prvo

```javascript
// ✅ Dobro
await locationManager.init();
const location = await getLocation();

// ❌ Loše
const location = await getLocation(); // Može failovati
```

### 2. ✅ Proveri Dostupnost

```javascript
if (Telegram.WebApp.LocationManager.isLocationAvailable) {
  requestLocation();
} else {
  showLocationUnavailableMessage();
}
```

### 3. ✅ Handle Permission Denial

```javascript
locationManager.getLocation((data) => {
  if (!data) {
    // Show UI to explain why you need location
    showPermissionExplanation();
    
    // Offer button to open settings
    showSettingsButton();
  }
});
```

### 4. ✅ Respect Privacy

```javascript
// Objasni zašto trebaš lokaciju
showLocationPurpose("We need your location to show nearby restaurants");

// Zatraži samo kada je potrebno
requestLocationOnDemand();
```

### 5. ✅ Check Accuracy

```javascript
locationManager.getLocation((location) => {
  if (location.horizontal_accuracy > 100) {
    console.warn('Low accuracy location');
    showLowAccuracyWarning();
  }
});
```

---

## Povezani Resursi

- [Eventi](./13-events.md#location-events)
- [Inicijalizacija](./05-initialization.md)
- [Design Guidelines](./03-design-guidelines.md)
