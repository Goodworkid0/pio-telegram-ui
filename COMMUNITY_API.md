# 🔌 Community API - Developer Platform Strategy

**Comprehensive guide za implementaciju Community API-ja**

---

## 🎯 Executive Summary

Community API omogućava **community owner-ima** da integrišu eksterne servise, automatizuju procese, i grade custom funkcionalnosti. Ovo transformiše pio.gg iz simple platforme u **programabilni ekosistem** gde developeri mogu da kreiraju dodatnu vrednost.

### Business Impact

- **📈 Retention:** Communities sa API integracijama 3x manje verovatno da napuste platformu
- **💰 Revenue:** API subscriptions ($29-200/mo) dodaju ~$6k/mo revenue (Month 6 projection)
- **🚀 Growth:** Third-party integrations privlače nove communities
- **🎯 Differentiation:** Nijedna druga Telegram Mini App nema developer API
- **🌐 Network Effects:** Više integrations = veća vrednost = više users

---

## 🏗️ Architecture

### API Stack

```
┌─────────────────────────────────────────┐
│         Developer Applications          │
│    (Bots, Dashboards, Integrations)    │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS + API Key
               │
┌──────────────▼──────────────────────────┐
│          API Gateway (Vercel)           │
│  - Authentication (API keys)            │
│  - Rate limiting (Upstash Redis)        │
│  - Request validation (Zod)             │
│  - Logging (Sentry)                     │
└──────────────┬──────────────────────────┘
               │
       ┌───────┼───────┐
       │               │
┌──────▼─────┐  ┌─────▼──────┐
│  REST API  │  │  Webhooks  │
│  Routes    │  │  (Svix)    │
└──────┬─────┘  └─────┬──────┘
       │               │
       └───────┬───────┘
               │
┌──────────────▼──────────────────────────┐
│         Business Logic Layer            │
│  - Community service                    │
│  - Post service                         │
│  - Moderation service                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Database (PostgreSQL + Redis)      │
└─────────────────────────────────────────┘
```

### API Key Flow

```
1. Community owner otvaraš Developer Portal
2. Klikće "Generate API Key"
3. Bira scopes (read:posts, write:comments, etc)
4. System generiše key: pio_live_c_programming_abc123...
5. Key se hash-uje i čuva u database
6. Owner vidi key samo jednom (copy to clipboard)
7. Developer koristi key u Authorization header
8. Middleware validira key + scopes + rate limits
9. Request prosledi do API route
```

### Webhook Flow

```
1. Developer registruje webhook URL
2. Bira events (post.created, comment.created, etc)
3. System generiše webhook secret
4. Event se desi (npr. novi post)
5. Worker job kreira delivery payload
6. Payload se potpisuje HMAC-SHA-256
7. HTTP POST request na webhook URL
8. Developer verifikuje signature
9. Ako fail → retry sa exponential backoff
10. Log delivery status u database
```

---

## 📊 Database Schema

### api_keys

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  created_by BIGINT REFERENCES users(id),
  
  name VARCHAR(100) NOT NULL,
  key_prefix VARCHAR(20) NOT NULL,           -- 'pio_live_', 'pio_test_'
  key_hash VARCHAR(256) NOT NULL,            -- bcrypt hash
  
  scopes JSONB DEFAULT '[]',                 -- ['read:posts', 'write:posts']
  
  tier VARCHAR(20) DEFAULT 'free',
  rate_limit_per_minute INTEGER DEFAULT 100,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  last_used_at TIMESTAMP,
  request_count INTEGER DEFAULT 0,
  
  allowed_ips JSONB DEFAULT '[]',
  webhook_secret VARCHAR(64),
  
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_community ON api_keys(community_id, is_active);
```

### api_webhooks

```sql
CREATE TABLE api_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,
  events JSONB NOT NULL,                     -- ['post.created', ...]
  secret VARCHAR(64) NOT NULL,
  
  is_active BOOLEAN DEFAULT true,
  
  max_retries INTEGER DEFAULT 3,
  retry_backoff VARCHAR(20) DEFAULT 'exponential',
  
  total_deliveries INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  last_delivery_at TIMESTAMP,
  last_delivery_status VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhooks_community ON api_webhooks(community_id, is_active);
```

### api_webhook_deliveries

```sql
CREATE TABLE api_webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES api_webhooks(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  
  status_code INTEGER,
  response_body TEXT,
  response_time_ms INTEGER,
  
  attempt_number INTEGER DEFAULT 1,
  next_retry_at TIMESTAMP,
  
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deliveries_webhook ON api_webhook_deliveries(webhook_id, created_at DESC);
CREATE INDEX idx_deliveries_retry ON api_webhook_deliveries(success, next_retry_at) 
  WHERE success = false;
```

### api_usage_logs

```sql
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  
  endpoint VARCHAR(200) NOT NULL,
  method VARCHAR(10) NOT NULL,
  
  status_code INTEGER,
  response_time_ms INTEGER,
  
  ip_address INET,
  user_agent TEXT,
  
  rate_limit_remaining INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partition by month
CREATE INDEX idx_logs_key_date ON api_usage_logs(api_key_id, created_at DESC);
```

---

## 🔐 Security Implementation

### API Key Generation

```typescript
// lib/api-keys.ts
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function generateApiKey(
  communityId: string,
  createdBy: number,
  name: string,
  scopes: string[]
) {
  // Generate random key
  const randomBytes = crypto.randomBytes(32);
  const keyId = randomBytes.toString('base64url').slice(0, 12);
  
  // Format: pio_live_c_{community_slug}_{random}
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { slug: true }
  });
  
  const prefix = 'pio_live';
  const fullKey = `${prefix}_c_${community.slug}_${keyId}`;
  
  // Hash key for storage (NEVER store plaintext)
  const keyHash = await bcrypt.hash(fullKey, 10);
  
  // Generate webhook secret
  const webhookSecret = crypto.randomBytes(32).toString('hex');
  
  // Save to database
  const apiKey = await prisma.apiKey.create({
    data: {
      community_id: communityId,
      created_by: createdBy,
      name,
      key_prefix: prefix,
      key_hash: keyHash,
      scopes,
      webhook_secret: webhookSecret,
      tier: 'free', // Default tier
      rate_limit_per_minute: 100,
      rate_limit_per_day: 10000
    }
  });
  
  // Return plaintext key ONLY once
  return {
    apiKey: fullKey,
    webhookSecret,
    id: apiKey.id
  };
}
```

### API Key Validation Middleware

```typescript
// middleware/api-auth.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Missing or invalid authorization header' },
      { status: 401 }
    );
  }
  
  const apiKey = authHeader.replace('Bearer ', '');
  
  // Check cache first (faster)
  const cached = await redis.get(`api_key:${apiKey}`);
  if (cached) {
    const keyData = JSON.parse(cached);
    
    // Check if still active
    if (!keyData.is_active || (keyData.expires_at && new Date(keyData.expires_at) < new Date())) {
      return NextResponse.json(
        { error: 'API key expired or inactive' },
        { status: 401 }
      );
    }
    
    return keyData;
  }
  
  // Find key in database
  const keys = await prisma.apiKey.findMany({
    where: {
      is_active: true,
      OR: [
        { expires_at: null },
        { expires_at: { gt: new Date() } }
      ]
    }
  });
  
  // Compare hashes (constant-time)
  let matchedKey = null;
  for (const key of keys) {
    const matches = await bcrypt.compare(apiKey, key.key_hash);
    if (matches) {
      matchedKey = key;
      break;
    }
  }
  
  if (!matchedKey) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }
  
  // Cache for 5 minutes
  await redis.setex(
    `api_key:${apiKey}`,
    300,
    JSON.stringify(matchedKey)
  );
  
  // Update last used
  await prisma.apiKey.update({
    where: { id: matchedKey.id },
    data: {
      last_used_at: new Date(),
      request_count: { increment: 1 }
    }
  });
  
  return matchedKey;
}
```

### Rate Limiting

```typescript
// middleware/rate-limit.ts
import { redis } from '@/lib/redis';

export async function checkRateLimit(
  apiKeyId: string,
  tier: string,
  limits: { perMinute: number; perDay: number }
) {
  const now = Date.now();
  const minuteKey = `rate_limit:${apiKeyId}:minute:${Math.floor(now / 60000)}`;
  const dayKey = `rate_limit:${apiKeyId}:day:${new Date().toISOString().split('T')[0]}`;
  
  // Increment counters
  const [minuteCount, dayCount] = await Promise.all([
    redis.incr(minuteKey),
    redis.incr(dayKey)
  ]);
  
  // Set expiration
  if (minuteCount === 1) {
    await redis.expire(minuteKey, 60);
  }
  if (dayCount === 1) {
    await redis.expire(dayKey, 86400);
  }
  
  // Check limits
  if (minuteCount > limits.perMinute) {
    return {
      allowed: false,
      limit: limits.perMinute,
      remaining: 0,
      reset: Math.floor(now / 60000) * 60 + 60
    };
  }
  
  if (dayCount > limits.perDay) {
    return {
      allowed: false,
      limit: limits.perDay,
      remaining: 0,
      reset: new Date().setHours(24, 0, 0, 0)
    };
  }
  
  return {
    allowed: true,
    limit: limits.perMinute,
    remaining: limits.perMinute - minuteCount,
    reset: Math.floor(now / 60000) * 60 + 60
  };
}
```

### Webhook Signature Verification

```typescript
// lib/webhooks.ts
import crypto from 'crypto';

export function signWebhookPayload(
  payload: any,
  secret: string
): string {
  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', secret);
  return 'sha256=' + hmac.update(payloadString).digest('hex');
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signWebhookPayload(
    JSON.parse(payload),
    secret
  );
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## 🚀 Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Database:**
- ✅ Add api_keys, api_webhooks, api_webhook_deliveries tables
- ✅ Add api_usage_logs table

**API Key Management:**
- ✅ Generate API keys endpoint
- ✅ List/revoke API keys
- ✅ Key validation middleware
- ✅ Rate limiting middleware

**Developer Portal:**
- ✅ API keys page (generate, view, revoke)
- ✅ Usage dashboard (requests, rate limits)

### Phase 2: REST API (Week 3-4)

**Endpoints:**
- ✅ Communities: GET, PATCH
- ✅ Posts: GET, POST, PATCH, DELETE
- ✅ Comments: GET, POST, DELETE
- ✅ Members: GET, POST, DELETE
- ✅ Moderation: GET, POST

**Features:**
- ✅ Scope-based permissions
- ✅ Pagination (cursor-based)
- ✅ Filtering & sorting
- ✅ Request validation (Zod)
- ✅ Error handling
- ✅ API versioning (/api/v1)

### Phase 3: Webhooks (Week 5-6)

**Webhook System:**
- ✅ Register/update/delete webhooks
- ✅ Event emitter integration
- ✅ Webhook delivery worker (BullMQ)
- ✅ Retry logic with exponential backoff
- ✅ Delivery status tracking
- ✅ Signature generation

**Events:**
- ✅ post.created, post.updated, post.deleted
- ✅ comment.created, comment.updated, comment.deleted
- ✅ community.member_joined, community.member_left
- ✅ moderation.* events

### Phase 4: Developer Experience (Week 7-8)

**Documentation:**
- ✅ API reference (OpenAPI/Swagger)
- ✅ Guides & tutorials
- ✅ Code examples
- ✅ Webhook examples

**SDKs:**
- ✅ JavaScript/TypeScript SDK
- ✅ Python SDK
- ⏳ Go SDK (future)

**Developer Portal:**
- ✅ Interactive API explorer
- ✅ Webhook testing tool
- ✅ Usage analytics
- ✅ Billing & subscription

### Phase 5: Beta Launch (Week 9-10)

**Beta Program:**
- ✅ Invite 20 selected communities
- ✅ Collect feedback
- ✅ Fix bugs
- ✅ Improve docs

**Marketing:**
- ✅ Developer blog post
- ✅ Video tutorial
- ✅ Showcase integrations
- ✅ Twitter announcement

### Phase 6: Public Launch (Week 11-12)

**Launch:**
- ✅ Open API to all communities
- ✅ Launch pricing tiers
- ✅ Integration marketplace
- ✅ Developer community forum

**Monitoring:**
- ✅ API uptime monitoring
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring
- ✅ Cost tracking

---

## 💰 Pricing Strategy

### Free Tier (Bootstrap)
```
✅ 100 requests/minute
✅ 10,000 requests/day
✅ 2 webhooks
✅ Community support (forum)
✅ 30-day usage retention

Target: Hobbyists, small communities
```

### Pro Tier - $29/month
```
✅ 1,000 requests/minute
✅ 100,000 requests/day
✅ 20 webhooks
✅ 90-day usage retention
✅ Priority support (24h response)
✅ Custom domains for widgets
✅ Webhook retry logic
✅ Advanced analytics

Target: Active communities, professional bots
```

### Enterprise - Starting at $200/month
```
✅ Custom rate limits (negotiable)
✅ Unlimited webhooks
✅ SLA guarantee (99.99% uptime)
✅ Dedicated support (4h response)
✅ White-label options
✅ Custom integrations
✅ On-premise deployment (optional)
✅ Annual billing (discount)

Target: Large communities, companies
```

### Usage-Based Add-ons
```
Extra requests: $10 per 100k requests/month
Extra webhooks: $5 per 10 webhooks/month
Data export: $50 per export
Custom integration: $500+ (one-time)
```

---

## 📊 Success Metrics

### Adoption Metrics
- API keys generated
- Active API keys (used in last 7 days)
- Communities using API (%)
- Requests per day
- Webhook deliveries per day

### Revenue Metrics
- MRR from API subscriptions
- Conversion rate (Free → Pro)
- Churn rate
- LTV per API customer

### Technical Metrics
- API uptime (target: 99.9%)
- P95 response time (target: <200ms)
- Webhook success rate (target: >99%)
- Error rate (target: <0.1%)

### Engagement Metrics
- API docs page views
- SDK downloads
- Developer forum activity
- Integration marketplace submissions

---

## 🎯 Go-to-Market Strategy

### Developer Outreach (Month 1-2)
- 📧 Email to top 50 community owners
- 🎥 Video tutorial series
- 📝 Blog post: "Building with pio.gg API"
- 🐦 Twitter thread with examples

### Beta Program (Month 2)
- 🎯 Invite 20 communities
- 💬 Weekly feedback calls
- 🐛 Bug bash event
- 🏆 Beta badge for early adopters

### Public Launch (Month 3)
- 🚀 Launch announcement
- 🎉 Launch day AMA
- 📚 Complete docs
- 🏪 Integration marketplace

### Community Building (Month 4-6)
- 💬 Developer Discord/Telegram group
- 📖 Monthly office hours
- 🏆 Hackathon with prizes
- 🌟 Showcase successful integrations

### Content Marketing (Ongoing)
- 📝 Use case blog posts
- 🎥 YouTube tutorials
- 📊 Case studies
- 🎓 Online course (Udemy?)

---

## 🔮 Future Roadmap

### Year 1
- ✅ REST API v1
- ✅ Webhooks
- ✅ JS/Python SDKs
- ✅ Integration marketplace
- ⏳ GraphQL API (optional)

### Year 2
- Real-time API (WebSockets)
- Streaming API (Server-Sent Events)
- AI-powered moderation API
- Custom widgets SDK
- Mobile SDKs (iOS/Android)

### Year 3
- Federation protocol (ActivityPub?)
- Decentralized API (blockchain?)
- Machine learning APIs
- Advanced analytics API
- White-label API platform

---

## 🤝 Partnership Opportunities

### Integration Partners
- **Discord** - Cross-post communities
- **Slack** - Team notifications
- **Zapier** - No-code automation
- **IFTTT** - Consumer automation
- **Make** (Integromat) - Advanced workflows

### Bot Platforms
- **Botpress** - Chatbot builder
- **Dialogflow** - NLP bot framework
- **Rasa** - Open-source bot framework

### Analytics
- **Mixpanel** - Product analytics
- **Amplitude** - User behavior analytics
- **Segment** - Data pipeline

### E-commerce
- **Shopify** - Online stores
- **Stripe** - Payments
- **Gumroad** - Digital products

---

## 🎁 Built-in Services (One-Click Integrations)

**Umesto da svaki community mora da pravi custom integraciju, nudimo gotove servise koje aktiviraju jednim klikom!**

### 🔥 Burner Messages (Privnote-style)

**Koncept:** Messages koji se auto-destruct nakon čitanja ili posle određenog vremena.

**Koristi:**
- 🕵️ Whistleblower communities (anonimni tips)
- 🎮 Gaming communities (spoiler protection)
- 💼 Job boards (sensitive info)
- 🎓 Study groups (exam answers after deadline)

**Implementacija:**

```typescript
// Database Schema
CREATE TABLE burner_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id),
  post_id UUID REFERENCES posts(id),
  
  encrypted_content TEXT NOT NULL,        -- AES-256 encrypted
  encryption_key VARCHAR(64) NOT NULL,    -- Stored separately
  
  burn_after_read BOOLEAN DEFAULT false,
  burn_after_seconds INTEGER,             -- NULL = never
  max_views INTEGER DEFAULT 1,
  views_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  burned_at TIMESTAMP,
  
  CHECK (burn_after_read = true OR burn_after_seconds IS NOT NULL)
);

CREATE INDEX idx_burner_expiry ON burner_messages(created_at, burn_after_seconds) 
  WHERE burned_at IS NULL;
```

**UI Flow:**
```
1. User klikne "Post Burner Message" 🔥
2. Popup sa opcijama:
   - [x] Burn after read (1 view only)
   - [ ] Burn after 1 hour
   - [ ] Burn after 1 day
   - [ ] Burn after 1 week
3. User piše poruku
4. Backend enkriptuje content (AES-256)
5. Post se prikaže sa 🔥 icon
6. Klikom se otvara modal:
   "⚠️ This message will self-destruct after reading. Continue?"
   [Cancel] [Read Message]
7. Nakon čitanja → content se briše iz DB
8. Post ostaje sa "🔥 This message has been burned"
```

**Revenue Model:**
- Free: 10 burner messages/month per community
- Pro: 100 burner messages/month
- Enterprise: Unlimited

**Technical Details:**
```typescript
// app/api/burner/create/route.ts
import { encrypt } from '@/lib/crypto';

export async function POST(req: Request) {
  const { communityId, content, burnAfterRead, burnAfterSeconds } = await req.json();
  
  // Generate encryption key
  const encryptionKey = crypto.randomBytes(32).toString('hex');
  
  // Encrypt content
  const encryptedContent = encrypt(content, encryptionKey);
  
  // Store in database
  const burner = await prisma.burnerMessage.create({
    data: {
      community_id: communityId,
      encrypted_content: encryptedContent,
      encryption_key: encryptionKey,
      burn_after_read: burnAfterRead,
      burn_after_seconds: burnAfterSeconds
    }
  });
  
  // Create post reference
  const post = await prisma.post.create({
    data: {
      community_id: communityId,
      burner_id: burner.id,
      type: 'burner',
      // ... other fields
    }
  });
  
  return Response.json({ id: burner.id });
}

// app/api/burner/read/route.ts
export async function POST(req: Request) {
  const { burnerId } = await req.json();
  
  const burner = await prisma.burnerMessage.findUnique({
    where: { id: burnerId }
  });
  
  if (!burner || burner.burned_at) {
    return Response.json({ error: 'Message already burned' }, { status: 410 });
  }
  
  // Check expiry
  if (burner.burn_after_seconds) {
    const expiryTime = new Date(burner.created_at).getTime() + burner.burn_after_seconds * 1000;
    if (Date.now() > expiryTime) {
      await burnMessage(burnerId);
      return Response.json({ error: 'Message expired' }, { status: 410 });
    }
  }
  
  // Decrypt content
  const content = decrypt(burner.encrypted_content, burner.encryption_key);
  
  // Increment views
  await prisma.burnerMessage.update({
    where: { id: burnerId },
    data: { views_count: { increment: 1 } }
  });
  
  // Check if should burn
  if (burner.burn_after_read || burner.views_count + 1 >= burner.max_views) {
    await burnMessage(burnerId);
  }
  
  return Response.json({ content, burned: burner.burn_after_read });
}

async function burnMessage(id: string) {
  await prisma.burnerMessage.update({
    where: { id },
    data: {
      encrypted_content: '',
      encryption_key: '',
      burned_at: new Date()
    }
  });
}
```

---

### 🏡 Local Community Hosting (Self-Hosted)

**Koncept:** Community može da hostuje svoj data **lokalno** (on-premise) ali koristi pio.gg kao frontend i infrastruturu.

**Koristi:**
- 🏥 Healthcare communities (HIPAA compliance)
- 🏛️ Government communities (data sovereignty)
- 💼 Enterprise (proprietary data)
- 🔒 Privacy-focused communities

**Architecture:**

```
┌─────────────────────────────────────────┐
│         pio.gg Frontend (Telegram)      │
│           (Hosted on Vercel)            │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS (TLS 1.3)
               │
┌──────────────▼──────────────────────────┐
│      Community's Local Server           │
│       (Docker Container)                │
│  - PostgreSQL                           │
│  - Redis                                │
│  - API Server (Next.js)                 │
│  - S3-compatible storage (MinIO)        │
└─────────────────────────────────────────┘
     Running in community's infrastructure
```

**How It Works:**

1. **Setup:**
```bash
# Community admin runs:
docker-compose up -d

# Docker Compose includes:
# - pio.gg API server
# - PostgreSQL
# - Redis
# - MinIO (S3-compatible)
# - Reverse proxy (Caddy)
```

2. **Configuration:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  pio-api:
    image: pio.gg/community-server:latest
    environment:
      - DATABASE_URL=postgresql://localhost:5432/pio
      - REDIS_URL=redis://localhost:6379
      - S3_ENDPOINT=http://minio:9000
      - COMMUNITY_ID=${COMMUNITY_ID}
      - API_KEY=${API_KEY}
      - HOSTED_MODE=self-hosted
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
      - minio
  
  postgres:
    image: postgres:16-alpine
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=pio
      - POSTGRES_PASSWORD=${DB_PASSWORD}
  
  redis:
    image: redis:7-alpine
    volumes:
      - ./data/redis:/data
  
  minio:
    image: minio/minio:latest
    volumes:
      - ./data/minio:/data
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
  
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./data/caddy:/data
```

3. **Sync Mechanism:**
```typescript
// pio.gg frontend automatski detektuje self-hosted community
// i šalje requests na njihov server umesto na centralni

// lib/api-client.ts
export function getApiEndpoint(communityId: string) {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { hosting_mode: true, self_hosted_url: true }
  });
  
  if (community.hosting_mode === 'self-hosted') {
    return community.self_hosted_url; // https://community.example.com
  }
  
  return 'https://api.pio.gg/v1'; // Default
}

// Frontend automatically routes requests
const response = await fetch(`${apiEndpoint}/posts`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Community-ID': communityId
  }
});
```

**Pricing:**
- Setup fee: $200 (one-time)
- License: $50/month (unlimited members)
- Support: $100/month (optional)
- Enterprise SLA: Custom pricing

**Data Privacy Benefits:**
- ✅ Community owns 100% of data
- ✅ Data never leaves their infrastructure
- ✅ Full GDPR/HIPAA compliance control
- ✅ Custom backup/retention policies
- ✅ Audit logs stay internal

---

### 💾 Archive Service (Internet Archive Integration)

**Koncept:** Automatski arhiviranje important posts na Archive.org ili lokalni backup.

**Koristi:**
- 📚 Knowledge bases (preserve tutorials)
- 📰 News communities (historical record)
- 🎓 Educational content
- 🏛️ Legal/compliance (audit trail)

**Implementation:**

```typescript
// Database Schema
CREATE TABLE archived_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  community_id UUID REFERENCES communities(id),
  
  archive_url TEXT,                       -- Archive.org URL
  archive_snapshot_id VARCHAR(100),
  
  ipfs_hash VARCHAR(100),                 -- Decentralized backup (optional)
  
  archived_at TIMESTAMP DEFAULT NOW(),
  archive_type VARCHAR(20)                -- 'archive.org', 'ipfs', 'local'
);
```

**Auto-Archive Rules:**
```typescript
// Community settings
{
  auto_archive: {
    enabled: true,
    triggers: [
      { condition: 'upvotes > 100', action: 'archive' },
      { condition: 'age > 30 days', action: 'archive' },
      { condition: 'flair = "important"', action: 'archive' }
    ],
    methods: ['archive.org', 'ipfs'],
    retention: 'permanent'
  }
}
```

**Worker Job:**
```typescript
// workers/archive-posts.ts
import { Wayback } from '@internetarchive/wayback';

export async function archivePost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { community: true }
  });
  
  // Generate public URL for post
  const postUrl = `https://pio.gg/c/${post.community.slug}/p/${post.id}`;
  
  // Submit to Archive.org
  const wayback = new Wayback();
  const snapshot = await wayback.save(postUrl);
  
  // Save record
  await prisma.archivedPost.create({
    data: {
      post_id: postId,
      community_id: post.community_id,
      archive_url: snapshot.url,
      archive_snapshot_id: snapshot.id,
      archive_type: 'archive.org'
    }
  });
  
  // Optional: Also save to IPFS
  if (post.community.settings.archive.methods.includes('ipfs')) {
    const ipfsHash = await uploadToIPFS(post);
    await prisma.archivedPost.update({
      where: { post_id: postId },
      data: { ipfs_hash: ipfsHash }
    });
  }
  
  // Notify community
  await sendNotification({
    community_id: post.community_id,
    type: 'post_archived',
    message: `Post "${post.title}" has been archived`,
    url: snapshot.url
  });
}
```

**Revenue Model:**
- Free: 10 archives/month
- Pro: 100 archives/month + IPFS
- Enterprise: Unlimited + custom S3 backup

---

### 🤖 Auto-Mod AI Service

**Koncept:** AI-powered moderation service koji automatski detektuje spam, hate speech, NSFW content.

**Koristi:**
- 🛡️ Spam protection
- 🚫 Hate speech detection
- 🔞 NSFW content filter
- 🎯 Custom rules (community-specific)

**Implementation:**

```typescript
// Integration sa OpenAI Moderation API
import OpenAI from 'openai';

export async function moderateContent(content: string, communityId: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  // Get community's moderation rules
  const rules = await prisma.communitySettings.findUnique({
    where: { community_id: communityId },
    select: { moderation_rules: true }
  });
  
  // OpenAI Moderation
  const moderation = await openai.moderations.create({
    input: content
  });
  
  const result = moderation.results[0];
  
  // Custom AI prompt for community-specific rules
  if (rules.moderation_rules.custom_enabled) {
    const customCheck = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a moderator for a community with these rules: ${rules.moderation_rules.custom_rules.join(', ')}`
        },
        {
          role: 'user',
          content: `Does this content violate any rules? "${content}"`
        }
      ]
    });
    
    // Parse AI response
    const violates = customCheck.choices[0].message.content.includes('Yes');
    
    return {
      flagged: result.flagged || violates,
      categories: result.categories,
      custom_violation: violates,
      confidence: result.category_scores
    };
  }
  
  return {
    flagged: result.flagged,
    categories: result.categories,
    confidence: result.category_scores
  };
}
```

**Auto-Actions:**
```typescript
// Automatic moderation actions
const actions = {
  spam: 'auto-remove',              // Instantly delete
  hate_speech: 'flag-for-review',   // Human review
  nsfw: 'blur-content',             // Blur + 18+ warning
  violence: 'flag-for-review',
  custom_rule: 'notify-mods'        // Notify moderators
};
```

**Revenue Model:**
- Free: 100 AI checks/month
- Pro: 1,000 AI checks/month
- Enterprise: Unlimited + custom AI training

---

### 📊 Analytics Dashboard Service

**Koncept:** Real-time analytics dashboard sa insights o community growth, engagement, top content.

**Features:**
- 📈 Growth metrics (members, posts, comments over time)
- 🔥 Hot topics (trending keywords)
- 👥 User engagement (top contributors)
- ⏰ Activity heatmap (best time to post)
- 📍 Geographic distribution
- 💬 Sentiment analysis

**Implementation:**

```typescript
// Database (ClickHouse for analytics)
CREATE TABLE community_events (
  timestamp DateTime,
  community_id UUID,
  event_type String,
  user_id UInt64,
  metadata String,
  
  INDEX idx_community_time (community_id, timestamp)
) ENGINE = MergeTree()
ORDER BY (community_id, timestamp);

// Real-time queries
SELECT
  toStartOfHour(timestamp) as hour,
  count() as events
FROM community_events
WHERE community_id = {communityId}
  AND timestamp >= now() - INTERVAL 7 DAY
GROUP BY hour
ORDER BY hour;
```

**Dashboard UI:**
```typescript
// components/AnalyticsDashboard.tsx
export function AnalyticsDashboard({ communityId }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Growth Chart */}
      <Card>
        <h3>Member Growth</h3>
        <LineChart data={memberGrowth} />
        <p>+12.5% this week</p>
      </Card>
      
      {/* Engagement */}
      <Card>
        <h3>Engagement Rate</h3>
        <BarChart data={engagement} />
        <p>68% active members</p>
      </Card>
      
      {/* Top Content */}
      <Card>
        <h3>Top Posts</h3>
        <TopPostsList posts={topPosts} />
      </Card>
      
      {/* Activity Heatmap */}
      <Card className="col-span-2">
        <h3>Activity Heatmap</h3>
        <HeatmapChart data={activityByHour} />
        <p>Best time to post: Tuesday 2-4 PM</p>
      </Card>
      
      {/* Sentiment */}
      <Card>
        <h3>Community Sentiment</h3>
        <SentimentGauge value={0.72} />
        <p>Mostly positive</p>
      </Card>
    </div>
  );
}
```

**Revenue Model:**
- Free: Basic metrics (last 7 days)
- Pro: Advanced analytics (90 days) + exports
- Enterprise: Unlimited history + custom reports

---

### 🎫 Event Management Service

**Koncept:** Built-in event management za meetups, AMAs, live streams.

**Features:**
- 📅 Event calendar
- 🎟️ RSVP tracking
- ⏰ Reminders (1 day, 1 hour before)
- 📹 Live stream integration (YouTube, Twitch)
- 🎤 Q&A mode (approved questions only)
- 📊 Attendance tracking

**Database Schema:**

```sql
CREATE TABLE community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id),
  
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_type VARCHAR(50),                    -- 'meetup', 'ama', 'stream'
  
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  timezone VARCHAR(50),
  
  location TEXT,                             -- Physical or URL
  max_attendees INTEGER,
  
  rsvp_required BOOLEAN DEFAULT false,
  rsvp_count INTEGER DEFAULT 0,
  
  stream_url TEXT,
  recording_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES community_events(id),
  user_id BIGINT REFERENCES users(id),
  
  status VARCHAR(20),                        -- 'going', 'maybe', 'not_going'
  reminder_sent BOOLEAN DEFAULT false,
  attended BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI Flow:**
```
1. Mod clicks "Create Event" 🎫
2. Form:
   - Event name
   - Date & time
   - Type (Meetup, AMA, Stream)
   - Max attendees (optional)
   - [x] Require RSVP
3. Event post created in community
4. Members click "RSVP" → Going/Maybe/Not Going
5. 1 day before → notification sent
6. 1 hour before → reminder sent
7. At event time → "Join Stream" button appears
8. After event → recording uploaded
```

**Revenue Model:**
- Free: 5 events/month
- Pro: Unlimited events + recordings
- Enterprise: White-label + custom branding

---

### 💬 Translation Service

**Koncept:** Auto-translate posts/comments za multilingual communities.

**Implementation:**

```typescript
// Using DeepL API (better than Google Translate)
import { Translator } from 'deepl-node';

export async function translateContent(
  content: string,
  targetLang: string
) {
  const translator = new Translator(process.env.DEEPL_API_KEY);
  
  const result = await translator.translateText(
    content,
    null, // Auto-detect source
    targetLang
  );
  
  return result.text;
}

// Store translations
CREATE TABLE content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID,                           -- post_id or comment_id
  content_type VARCHAR(20),                  -- 'post', 'comment'
  
  source_lang VARCHAR(5),
  target_lang VARCHAR(5),
  
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**UI:**
```
Post content (original in English):
"This is a great community!"

[🌐 Translate to: [Serbian ▼]]

Translated content:
"Ovo je sjajna zajednica!"

[Show Original]
```

**Revenue Model:**
- Free: 50 translations/month
- Pro: 500 translations/month
- Enterprise: Unlimited

---

## 🎯 Built-in Services Pricing Summary

| Service | Free | Pro ($29/mo) | Enterprise |
|---------|------|--------------|------------|
| 🔥 Burner Messages | 10/mo | 100/mo | Unlimited |
| 🏡 Self-Hosting | ❌ | ❌ | ✅ ($50/mo) |
| 💾 Archive | 10/mo | 100/mo + IPFS | Unlimited + S3 |
| 🤖 Auto-Mod AI | 100 checks/mo | 1k checks/mo | Unlimited |
| 📊 Analytics | 7 days | 90 days + export | Unlimited + custom |
| 🎫 Events | 5/mo | Unlimited | White-label |
| 💬 Translation | 50/mo | 500/mo | Unlimited |

**Bundle Pricing:**
- **Pro Bundle ($49/mo):** All Pro features
- **Enterprise Bundle (Custom):** All Enterprise + SLA

---

## 📋 Developer Portal Features

### Dashboard
- 📊 API usage graph (requests over time)
- ⚡ Rate limit status
- 🔔 Webhook delivery status
- 💰 Current billing info

### API Keys
- ➕ Generate new key
- 👁️ View key details
- 🔄 Rotate key
- 🗑️ Revoke key
- 📋 Copy to clipboard

### Webhooks
- ➕ Add webhook URL
- ✅ Test webhook
- 📜 View delivery log
- 🔄 Retry failed deliveries
- 🗑️ Delete webhook

### Documentation
- 📖 API reference (interactive)
- 🎯 Quick start guide
- 💡 Code examples
- 🎥 Video tutorials
- ❓ FAQ

### Analytics
- 📈 Request volume
- ⚡ Response times
- ❌ Error rates
- 🔝 Top endpoints
- 🌍 Geographic distribution

### Billing
- 💳 Current plan
- 📊 Usage vs limits
- 💰 Billing history
- 🔄 Upgrade/downgrade
- 📄 Invoices

---

**Community API će transformisati pio.gg u programabilni ekosistem i kreirati novi revenue stream! 🚀**
