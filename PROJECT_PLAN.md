# 🚀 Telegram Mini App - Reddit Klon "pio.gg"

**Necenzurisana diskusiona platforma na Telegram-u**

---

## 📋 Executive Summary

**pio.gg** je Telegram Mini App koji kombinuje najbolje aspekte Reddit-a, foruma, i Discord-a - platforma za nekenzurisanu diskusiju sa gamifikacijom kroz achievements sistem. Korisnici se loguju preko Telegram naloga (instant authentication), mogu kreirati javne ili privatne zajednice (invite-only), učestvovati u diskusijama, glasati, i otključavati achievements.

### 🎯 Ključne Karakteristike

- ✅ **Zero Friction Login** - Telegram authentication (instant access)
- ✅ **Public & Private Communities** - Javne zajednice + invite-only pristup
- ✅ **Nested Comments** - Reddit-style threading (do 10 nivoa)
- ✅ **Voting System** - Upvote/Downvote sa karma sistemom
- ✅ **Achievements & Gamification** - Badges, leveli, streaks
- ✅ **Bot Integration** - Browse communities, notifications, deep links
- ✅ **Content Freedom** - Minimalna cenzura, community-driven moderation
- ✅ **Real-time Updates** - Live discussion updates
- ✅ **Rich Media Support** - Images, videos, links, embeds
- ✅ **Progressive Web App** - Works offline, installable

---

## 🏗️ Tech Stack

### Frontend (Next.js 15)
```
- Framework: Next.js 15 (App Router + Turbopack)
- Language: TypeScript 5.6+
- UI Library: React 19 (with React Compiler)
- Styling: Tailwind CSS 4 + shadcn/ui
- State Management: Zustand + React Query v5
- Telegram SDK: @twa-dev/sdk
- Real-time: Socket.io Client
- Forms: React Hook Form + Zod
- Rich Text: TipTap / Lexical
- Icons: Lucide React
```

### Backend (Next.js API Routes)
```
- Runtime: Node.js 20+
- API: Next.js 15 API Routes (App Router) + tRPC v11 (optional)
- Authentication: Telegram Web App initData validation
- Database ORM: Prisma 6
- Validation: Zod
- Rate Limiting: Upstash Redis
- File Upload: uploadthing / S3
- Real-time: Socket.io Server
- Jobs: BullMQ (Redis)
- Search: Meilisearch / Typesense
- Webhooks: Svix (for Community API)
```

### Database
```
- Primary: PostgreSQL 16 (Supabase / Railway)
- Cache: Redis (Upstash)
- File Storage: S3 / Cloudflare R2
- Search Index: Meilisearch
```

### Infrastructure
```
- Hosting: Vercel (Frontend + API)
- Database: Supabase / Railway
- Redis: Upstash
- CDN: Cloudflare
- Monitoring: Sentry + Vercel Analytics
- Bot: Node.js (Telegraf.js) on Railway
```

---

## 📐 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TELEGRAM USERS                          │
│              (iOS / Android / Desktop / Web)                │
└────────────────────┬───────────────────┬────────────────────┘
                     │                   │
                     │                   │
        ┌────────────▼─────────┐   ┌────▼──────────────┐
        │   TELEGRAM BOT       │   │  MINI APP (PWA)   │
        │   (Community Browser)│   │  (Main Interface) │
        │   - Browse commands  │   │  - Next.js App    │
        │   - Notifications    │   │  - Real-time UI   │
        │   - Deep Links       │   │  - Offline Mode   │
        └────────────┬─────────┘   └────┬──────────────┘
                     │                   │
                     │                   │
                     └──────────┬────────┘
                                │
                    ┌───────────▼────────────┐
                    │   NEXT.JS BACKEND      │
                    │   (API Routes)         │
                    │   - REST API           │
                    │   - WebSocket Server   │
                    │   - Auth Middleware    │
                    │   - Rate Limiting      │
                    └───────────┬────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
        │ PostgreSQL   │ │   Redis    │ │  S3/R2     │
        │ (Data)       │ │  (Cache)   │ │ (Files)    │
        └──────────────┘ └────────────┘ └────────────┘
                │
        ┌───────▼──────┐
        │ Meilisearch  │
        │  (Search)    │
        └──────────────┘
```

### Authentication Flow

```
┌─────────────┐
│   User      │
│ Opens Bot   │
└──────┬──────┘
       │
       │ Clicks "Open App"
       │
┌──────▼─────────────────────────────────────────┐
│  Telegram sends initData with:                 │
│  - user: {id, first_name, username, ...}      │
│  - auth_date: timestamp                        │
│  - hash: HMAC-SHA-256 signature               │
└──────┬─────────────────────────────────────────┘
       │
       │ Mini App loads with initData
       │
┌──────▼──────────────────────────────────────────┐
│  Next.js Middleware validates initData:        │
│  1. Parse query string                         │
│  2. Extract hash                               │
│  3. Compute HMAC with bot secret               │
│  4. Compare hashes                             │
│  5. Check auth_date freshness (< 24h)         │
└──────┬──────────────────────────────────────────┘
       │
       ├─── Valid ────┐
       │              │
       │         ┌────▼────────────────────────┐
       │         │  Create/Update User in DB  │
       │         │  - Check if user exists    │
       │         │  - Update last_seen        │
       │         │  - Generate JWT session    │
       │         └────┬───────────────────────┘
       │              │
       │         ┌────▼────────────────────────┐
       │         │  Return JWT in cookie      │
       │         │  + Set user context        │
       │         └────────────────────────────┘
       │
       └─── Invalid ──┐
                      │
                 ┌────▼────────────────────────┐
                 │  Reject with 401           │
                 │  Show error message        │
                 └────────────────────────────┘
```

---

## 🗄️ Database Schema

### Core Tables

#### **users**
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,                    -- Telegram user ID
  username VARCHAR(32),                      -- @username
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64),
  bio TEXT,
  avatar_url TEXT,
  language_code VARCHAR(10),
  is_premium BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  karma INTEGER DEFAULT 0,                   -- Total upvotes - downvotes
  level INTEGER DEFAULT 1,                   -- Gamification level
  xp INTEGER DEFAULT 0,                      -- Experience points
  streak_days INTEGER DEFAULT 0,             -- Daily visit streak
  last_streak_date DATE,
  achievements JSONB DEFAULT '[]',           -- [achievement_id, ...]
  settings JSONB DEFAULT '{}',               -- User preferences
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_seen_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_karma ON users(karma DESC);
CREATE INDEX idx_users_level ON users(level DESC);
```

#### **communities**
```sql
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,          -- URL-friendly name
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  banner_url TEXT,
  creator_id BIGINT REFERENCES users(id),
  
  -- Visibility settings
  is_public BOOLEAN DEFAULT true,
  require_invite BOOLEAN DEFAULT false,
  invite_code VARCHAR(32) UNIQUE,            -- For private communities
  
  -- Stats
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  
  -- Moderation
  rules JSONB DEFAULT '[]',                  -- [{title, description}, ...]
  allowed_content_types JSONB DEFAULT '["text","image","video","link"]',
  
  -- Features
  features JSONB DEFAULT '{}',               -- {polls: true, images: true, ...}
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP                       -- Soft delete
);

CREATE INDEX idx_communities_slug ON communities(slug);
CREATE INDEX idx_communities_public ON communities(is_public) WHERE deleted_at IS NULL;
CREATE INDEX idx_communities_member_count ON communities(member_count DESC);
```

#### **community_members**
```sql
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  
  -- Role: 'owner', 'moderator', 'member'
  role VARCHAR(20) DEFAULT 'member',
  
  -- Permissions
  can_post BOOLEAN DEFAULT true,
  can_comment BOOLEAN DEFAULT true,
  can_moderate BOOLEAN DEFAULT false,
  
  -- Join method
  joined_via VARCHAR(20),                    -- 'public', 'invite', 'link'
  invited_by BIGINT REFERENCES users(id),
  
  joined_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(community_id, user_id)
);

CREATE INDEX idx_community_members_community ON community_members(community_id);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_role ON community_members(community_id, role);
```

#### **posts**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Content
  title VARCHAR(300) NOT NULL,
  content TEXT,
  content_type VARCHAR(20) DEFAULT 'text',   -- text, image, video, link, poll
  
  -- Media
  media_urls JSONB DEFAULT '[]',             -- [{url, type, thumbnail}, ...]
  
  -- Link post
  link_url TEXT,
  link_title TEXT,
  link_description TEXT,
  link_thumbnail TEXT,
  
  -- Poll (if content_type = poll)
  poll_options JSONB,                        -- [{id, text, votes}, ...]
  poll_ends_at TIMESTAMP,
  
  -- Engagement
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  score INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Flags
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_nsfw BOOLEAN DEFAULT false,
  is_removed BOOLEAN DEFAULT false,
  removal_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_posts_community ON posts(community_id, created_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_score ON posts(community_id, score DESC);
CREATE INDEX idx_posts_hot ON posts(community_id, created_at DESC, score DESC);
```

#### **comments**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- For threading
  author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  
  -- Content
  content TEXT NOT NULL,
  depth INTEGER DEFAULT 0,                   -- Thread depth (max 10)
  
  -- Engagement
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  score INTEGER GENERATED ALWAYS AS (upvotes - downvotes) STORED,
  
  -- Flags
  is_removed BOOLEAN DEFAULT false,
  removal_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  edited_at TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at ASC);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_score ON comments(post_id, score DESC);
```

#### **votes**
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  votable_type VARCHAR(20) NOT NULL,         -- 'post' or 'comment'
  votable_id UUID NOT NULL,
  value SMALLINT NOT NULL CHECK (value IN (-1, 1)),  -- -1 downvote, 1 upvote
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, votable_type, votable_id)
);

CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_votable ON votes(votable_type, votable_id);
```

#### **achievements**
```sql
CREATE TABLE achievements (
  id VARCHAR(50) PRIMARY KEY,                -- 'first_post', 'karma_1000', etc
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  category VARCHAR(30),                      -- 'posting', 'social', 'moderation', etc
  rarity VARCHAR(20),                        -- 'common', 'rare', 'epic', 'legendary'
  xp_reward INTEGER DEFAULT 0,
  
  -- Unlock criteria
  criteria JSONB NOT NULL,                   -- {type: 'post_count', value: 10}
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
```

#### **invites**
```sql
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  created_by BIGINT REFERENCES users(id),
  
  code VARCHAR(32) UNIQUE NOT NULL,
  
  -- Limits
  max_uses INTEGER,                          -- NULL = unlimited
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invites_code ON invites(code);
CREATE INDEX idx_invites_community ON invites(community_id);

CREATE TABLE invite_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID REFERENCES invites(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id),
  used_at TIMESTAMP DEFAULT NOW()
);
```

#### **notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,                 -- 'reply', 'mention', 'upvote', 'achievement'
  title VARCHAR(200),
  content TEXT,
  
  -- Related entities
  actor_id BIGINT REFERENCES users(id),      -- Who triggered notification
  entity_type VARCHAR(20),                   -- 'post', 'comment', 'achievement'
  entity_id UUID,
  
  action_url TEXT,                           -- Deep link
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

#### **reports**
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id BIGINT REFERENCES users(id),
  
  reportable_type VARCHAR(20) NOT NULL,      -- 'post', 'comment', 'user'
  reportable_id UUID NOT NULL,
  
  reason VARCHAR(50) NOT NULL,               -- 'spam', 'harassment', 'illegal', etc
  description TEXT,
  
  status VARCHAR(20) DEFAULT 'pending',      -- 'pending', 'resolved', 'dismissed'
  reviewed_by BIGINT REFERENCES users(id),
  reviewed_at TIMESTAMP,
  moderator_note TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status, created_at DESC);
CREATE INDEX idx_reports_reportable ON reports(reportable_type, reportable_id);
```

#### **api_keys**
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  created_by BIGINT REFERENCES users(id),
  
  name VARCHAR(100) NOT NULL,                -- 'Production API', 'Development', etc
  key_prefix VARCHAR(20) NOT NULL,           -- 'pio_live_', 'pio_test_'
  key_hash VARCHAR(256) NOT NULL,            -- Hashed API key
  
  -- Permissions (scopes)
  scopes JSONB DEFAULT '[]',                 -- ['read:posts', 'write:posts', ...]
  
  -- Rate limiting
  tier VARCHAR(20) DEFAULT 'free',           -- 'free', 'pro', 'enterprise'
  rate_limit_per_minute INTEGER DEFAULT 100,
  rate_limit_per_day INTEGER DEFAULT 10000,
  
  -- Usage tracking
  last_used_at TIMESTAMP,
  request_count INTEGER DEFAULT 0,
  
  -- Security
  allowed_ips JSONB DEFAULT '[]',            -- Whitelist IPs (optional)
  webhook_secret VARCHAR(64),                -- For webhook signature verification
  
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_community ON api_keys(community_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON api_keys(is_active, expires_at);
```

#### **api_webhooks**
```sql
CREATE TABLE api_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  
  url TEXT NOT NULL,                         -- Webhook endpoint URL
  events JSONB NOT NULL,                     -- ['post.created', 'comment.created', ...]
  
  -- Security
  secret VARCHAR(64) NOT NULL,               -- For HMAC signature
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Retry logic
  max_retries INTEGER DEFAULT 3,
  retry_backoff VARCHAR(20) DEFAULT 'exponential',
  
  -- Stats
  total_deliveries INTEGER DEFAULT 0,
  successful_deliveries INTEGER DEFAULT 0,
  failed_deliveries INTEGER DEFAULT 0,
  last_delivery_at TIMESTAMP,
  last_delivery_status VARCHAR(20),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_webhooks_community ON api_webhooks(community_id);
CREATE INDEX idx_api_webhooks_active ON api_webhooks(is_active);
```

#### **api_webhook_deliveries**
```sql
CREATE TABLE api_webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES api_webhooks(id) ON DELETE CASCADE,
  
  event_type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  
  -- Request
  request_headers JSONB,
  
  -- Response
  status_code INTEGER,
  response_body TEXT,
  response_time_ms INTEGER,
  
  -- Retry info
  attempt_number INTEGER DEFAULT 1,
  next_retry_at TIMESTAMP,
  
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhook_deliveries_webhook ON api_webhook_deliveries(webhook_id, created_at DESC);
CREATE INDEX idx_webhook_deliveries_retry ON api_webhook_deliveries(success, next_retry_at) 
  WHERE success = false AND next_retry_at IS NOT NULL;
```

#### **api_usage_logs**
```sql
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  
  endpoint VARCHAR(200) NOT NULL,            -- '/api/v1/posts'
  method VARCHAR(10) NOT NULL,               -- 'GET', 'POST', etc
  
  status_code INTEGER,
  response_time_ms INTEGER,
  
  -- Request info
  ip_address INET,
  user_agent TEXT,
  
  -- Rate limiting
  rate_limit_remaining INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partitioned by month for performance
CREATE INDEX idx_api_logs_key_date ON api_usage_logs(api_key_id, created_at DESC);
CREATE INDEX idx_api_logs_endpoint ON api_usage_logs(endpoint, created_at DESC);
```

---

## 🎨 Feature Specifications

### 1. Authentication & User Management

#### Login Flow
1. User opens bot via deep link or bot menu
2. Bot shows "Open pio.gg" button
3. User clicks → Mini App opens with initData
4. Backend validates initData HMAC
5. User auto-logged in (or registered if new)

#### User Profile
- Display: Avatar, username, karma, level, achievements
- Editable: Bio, notification settings
- View: Post history, comment history, saved posts
- Stats: Total posts, comments, upvotes received

### 2. Communities

#### Public Communities
- Anyone can join
- Visible in community browser (bot + mini app)
- Searchable
- Display member count

#### Private Communities (Invite-Only)
- Not listed publicly
- Require invite code or link
- Owner/mods generate invite links
- Configurable: max uses, expiration
- Track who invited whom

#### Community Creation
- Any user can create
- Must choose: public/private
- Set name, slug, description, icon
- Define rules
- Configure allowed content types

#### Community Management
- **Owner permissions:**
  - Transfer ownership
  - Delete community
  - Assign moderators
  - Edit settings
  
- **Moderator permissions:**
  - Remove posts/comments
  - Ban users
  - Pin posts
  - Edit community info

### 3. Posts

#### Post Types
1. **Text Post** - Rich text with markdown
2. **Image Post** - Up to 10 images
3. **Video Post** - Video upload + thumbnail
4. **Link Post** - URL with auto-preview
5. **Poll Post** - Multiple choice voting

#### Post Actions
- Upvote/Downvote
- Comment
- Share (Telegram share)
- Save (bookmark)
- Report
- Edit (author only, within 5 min)
- Delete (author + mods)

#### Post Sorting
- 🔥 **Hot** - Score + recency algorithm
- 🆕 **New** - Chronological
- 🏆 **Top** - Highest score (24h / week / month / all time)
- 💬 **Discussed** - Most comments

### 4. Comments

#### Threading
- Nested comments (max depth: 10)
- "Load more" for collapsed threads
- Permalink to comment

#### Comment Actions
- Upvote/Downvote
- Reply
- Edit (author only, within 5 min)
- Delete (author + mods)
- Report

#### Smart Features
- Mention detection (@username)
- Auto-notifications on replies
- "OP" badge for post author
- "MOD" badge for moderators
- Award system (future: give awards)

### 5. Voting System

#### Karma Calculation
```
User Karma = Σ(upvotes on posts) + Σ(upvotes on comments) - penalties
```

#### Vote Rules
- 1 vote per user per post/comment
- Can change vote (up → down or remove)
- No self-voting
- Vote weight: all equal (no "super votes")

#### Score Display
- Show net score (upvotes - downvotes)
- Display percentage for posts (80% upvoted)
- Don't show exact counts for first hour (anti-brigade)

### 6. Achievements System

#### Achievement Categories

**🎯 Posting Achievements**
- First Post - "Share your first thought"
- 10 Posts - "Getting Started"
- 100 Posts - "Prolific Poster"
- 1000 Posts - "Content Machine"
- Viral Post - "1000+ upvotes on single post"

**💬 Social Achievements**
- First Comment - "Breaking the ice"
- Conversationalist - "100 comments"
- Community Builder - "Created a community"
- Moderator - "Became a moderator"
- Karma Milestones - 100, 1k, 10k, 100k

**⏰ Consistency Achievements**
- 7-Day Streak - "Week Warrior"
- 30-Day Streak - "Monthly Regular"
- 365-Day Streak - "Year Champion"

**🏆 Special Achievements**
- Beta Tester - "Early adopter"
- Bug Hunter - "Reported critical bug"
- Community Hero - "Helped 100 users"
- Legend - "100k karma + all achievements"

#### Gamification
```
XP System:
- New post: +10 XP
- Comment: +5 XP
- Upvote received: +2 XP
- Achievement: +50-500 XP

Level Formula:
Level = floor(sqrt(XP / 100))

Rewards per level:
- Profile customization unlocks
- Exclusive badges
- Boosted visibility (future)
```

### 7. Search & Discovery

#### Search Features
- Full-text search (Meilisearch)
- Search within: all, posts, comments, communities, users
- Filters: time range, community, content type
- Sort: relevance, new, top

#### Discovery
- Trending communities
- Hot posts across all communities
- Recommended communities (based on activity)
- Popular today

### 8. Notifications

#### Push Notifications (via Telegram Bot)
- Reply to your post/comment
- Mention in comment
- New post in favorite community
- Upvote milestones (10, 100, 1000)
- Achievement unlocked
- Moderator actions

#### In-App Notifications
- Real-time bell icon with count
- Notification feed
- Mark as read
- Settings: enable/disable per type

### 9. Moderation Tools

#### Content Moderation
- **Remove** - Hide post/comment
- **Lock** - Prevent new comments
- **Pin** - Stick to top
- **Mark NSFW** - Flag sensitive content
- **Ban user** - Temporary or permanent

#### Mod Queue
- View reported content
- Review & take action
- Add moderator notes
- Appeal system (future)

#### Automod (Future)
- Keyword filters
- Spam detection
- Rate limiting
- New account restrictions

### 10. Telegram Bot Integration

#### Bot Commands
```
/start - Open mini app
/communities - Browse public communities
/trending - See hot posts
/profile - View your profile
/search <query> - Search content
/notifications - Check notifications
```

#### Bot Features
- Browse communities (inline buttons)
- Get notifications
- Quick post creation
- Deep links to posts/communities

#### Deep Links
```
https://t.me/pioggbot/app?startapp=c-{community_slug}
https://t.me/pioggbot/app?startapp=p-{post_id}
https://t.me/pioggbot/app?startapp=u-{user_id}
https://t.me/pioggbot/app?startapp=invite-{invite_code}
```

---

## 🔒 Security & Safety

### Authentication Security
- ✅ HMAC-SHA-256 validation of initData
- ✅ JWT session tokens (24h expiry)
- ✅ CSRF protection
- ✅ Rate limiting per user

### Content Security
- ✅ XSS prevention (sanitize HTML)
- ✅ Image scanning (future: NSFW detection)
- ✅ File type validation
- ✅ File size limits (10MB images, 100MB videos)

### Anti-Spam
- ✅ Rate limiting:
  - Posts: 10/day
  - Comments: 100/day
  - Votes: 1000/day
- ✅ Captcha for suspicious activity
- ✅ New account restrictions (24h cooldown)
- ✅ Shadow banning

### Privacy
- ✅ User IDs are Telegram IDs (public)
- ✅ Optional username display
- ✅ Private communities not indexed
- ✅ Delete account = anonymize content

### Moderation Philosophy
**Freedom-First Approach:**
1. Minimal top-level moderation
2. Community-driven rules
3. Transparent mod logs
4. Appeal system
5. Only remove: illegal content, doxxing, brigading

---

## 🎨 UI/UX Design

### Design System

#### Colors (Telegram Theme Integration)
```css
:root {
  /* Use Telegram theme colors */
  --bg-primary: var(--tg-theme-bg-color);
  --bg-secondary: var(--tg-theme-secondary-bg-color);
  --text-primary: var(--tg-theme-text-color);
  --text-hint: var(--tg-theme-hint-color);
  --accent: var(--tg-theme-button-color);
  --accent-text: var(--tg-theme-button-text-color);
  --link: var(--tg-theme-link-color);
  
  /* Custom colors */
  --upvote: #ff4500;
  --downvote: #7193ff;
  --success: #46d160;
  --warning: #ffb70f;
  --error: #f5455c;
}
```

#### Typography
```css
/* Telegram-friendly fonts */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;

/* Type scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

#### Spacing
```css
/* Consistent spacing (8px base) */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

### Screen Layouts

#### 1. Home Feed
```
┌─────────────────────────────────┐
│ [Logo] pio.gg        [🔔][👤]  │ ← Header (sticky)
├─────────────────────────────────┤
│ [🔥 Hot] [New] [Top] [Rising]  │ ← Sort tabs
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ c/technology · 3h           │ │
│ │ ↑ 234 ↓  Building a Reddit │ │ ← Post card
│ │         clone on Telegram   │ │
│ │         💬 45  🔗 Share     │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ c/showerthoughts · 5h       │ │
│ │ ↑ 1.2k ↓  Mind = blown 🤯  │ │
│ │         💬 234  🔗 Share    │ │
│ └─────────────────────────────┘ │
│ ...                             │
└─────────────────────────────────┘
│ [Home] [Search] [+] [Profile]  │ ← Bottom nav
└─────────────────────────────────┘
```

#### 2. Community View
```
┌─────────────────────────────────┐
│ [← Back]    c/technology        │
├─────────────────────────────────┤
│ [Icon]  Technology              │
│ Discussion about tech           │
│ 👥 12.5k members                │
│ [Join Community] [⚙️ Settings]  │
├─────────────────────────────────┤
│ [About] [Posts] [Rules]         │
├─────────────────────────────────┤
│ [+ New Post]                    │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ u/john · 2h                 │ │
│ │ ↑ 123 ↓  Cool article       │ │
│ │         💬 23               │ │
│ └─────────────────────────────┘ │
│ ...                             │
└─────────────────────────────────┘
```

#### 3. Post Detail
```
┌─────────────────────────────────┐
│ [← Back]         [...More]      │
├─────────────────────────────────┤
│ c/technology · u/john · 2h      │
│                                 │
│ Building a Reddit clone         │
│ on Telegram                     │
│                                 │
│ Long post content here...       │
│ With images, links, etc.        │
│                                 │
│ ┌─────┐                         │
│ │ ↑   │  234 points             │
│ │ 234 │  89% upvoted            │
│ │ ↓   │                         │
│ └─────┘                         │
│ 💬 Share  🔖 Save  ⚠️ Report    │
├─────────────────────────────────┤
│ 💬 45 Comments [Sort: Best ▼]  │
├─────────────────────────────────┤
│ u/alice · 1h          ↑ 12 ↓   │
│ Great idea! Have you...         │
│ [Reply]                         │
│   │                             │
│   └─ u/bob · 45m      ↑ 5 ↓    │
│      Thanks! Yes I...           │
│      [Reply]                    │
│                                 │
│ u/charlie · 30m       ↑ 8 ↓    │
│ Love this concept...            │
│ [Reply]                         │
└─────────────────────────────────┘
```

#### 4. Profile
```
┌─────────────────────────────────┐
│ [← Back]    Profile    [⚙️]     │
├─────────────────────────────────┤
│     [Avatar]                    │
│     John Doe                    │
│     @johndoe                    │
│                                 │
│  🏆 Level 12    ⭐ 2,345 Karma  │
│                                 │
│  Bio: Love tech and memes       │
│                                 │
│  🎖️ [🥇][🥈][🥉][🏆]          │ ← Achievements
│     12 achievements unlocked    │
│                                 │
│  [Posts] [Comments] [Saved]     │
├─────────────────────────────────┤
│  Recent Activity:               │
│  • Posted in c/tech (2h)        │
│  • Commented in c/memes (3h)    │
│  ...                            │
└─────────────────────────────────┘
```

### Animations & Interactions

#### Haptic Feedback
```javascript
// Upvote
WebApp.HapticFeedback.impactOccurred('light');

// Achievement unlocked
WebApp.HapticFeedback.notificationOccurred('success');

// Post submitted
WebApp.HapticFeedback.impactOccurred('medium');
```

#### Micro-interactions
- Upvote button: color change + number bump animation
- Comment collapse: smooth height transition
- New notification: badge bounce
- Achievement unlock: modal with confetti
- Pull to refresh: spinner animation

---

## 🚀 Development Roadmap

### Phase 1: MVP (Weeks 1-6) 🎯

**Week 1-2: Foundation**
- ✅ Next.js project setup
- ✅ Database schema + Prisma setup
- ✅ Telegram authentication
- ✅ Basic UI components (shadcn/ui)
- ✅ Middleware setup

**Week 3-4: Core Features**
- ✅ User registration/login
- ✅ Community CRUD
- ✅ Post creation (text only)
- ✅ Comment system (basic)
- ✅ Voting system
- ✅ Home feed

**Week 5-6: Polish & Testing**
- ✅ Community join/leave
- ✅ Public/private communities
- ✅ Invite system
- ✅ Search (basic)
- ✅ User profiles
- ✅ Bot commands (basic)

**MVP Feature Set:**
- ✅ Authentication via Telegram
- ✅ Create/join communities (public + private)
- ✅ Create text posts
- ✅ Comment on posts (nested)
- ✅ Upvote/downvote
- ✅ Basic profiles
- ✅ Search posts
- ✅ Bot integration

---

### Phase 2: Beta Launch (Weeks 7-10) 🚀

**Week 7: Rich Content**
- ✅ Image upload
- ✅ Link posts with previews
- ✅ Video upload (basic)
- ✅ Rich text editor (markdown)

**Week 8: Engagement**
- ✅ Notifications system
- ✅ Push notifications via bot
- ✅ Save/bookmark posts
- ✅ User mentions
- ✅ Karma system

**Week 9: Moderation**
- ✅ Moderator roles
- ✅ Remove posts/comments
- ✅ Ban users
- ✅ Pin posts
- ✅ Report system

**Week 10: Polish**
- ✅ Hot/Top/New sorting algorithms
- ✅ Performance optimization
- ✅ Mobile responsive
- ✅ Error handling
- ✅ Beta testing with users

**Beta Goals:**
- 100 users
- 10 active communities
- 1000 posts

---

### Phase 3: Public Launch (Weeks 11-14) 🎊

**Week 11: Gamification**
- ✅ Achievement system
- ✅ Level progression
- ✅ XP system
- ✅ Streak tracking
- ✅ Badges

**Week 12: Advanced Features**
- ✅ Poll posts
- ✅ Advanced search (Meilisearch)
- ✅ Trending algorithm
- ✅ User blocking
- ✅ Edit history

**Week 13: Bot Enhancement**
- ✅ Browse communities in bot
- ✅ Deep links
- ✅ Inline mode
- ✅ Quick actions

**Week 14: Launch Prep**
- ✅ Performance testing
- ✅ Security audit
- ✅ Documentation
- ✅ Landing page
- ✅ Marketing materials

**Launch Goals:**
- 1000 users in first week
- 50 communities
- 10k posts

---

### Phase 4: Post-Launch (Months 2-6) 🌟

**Month 2: Community Growth + API Beta**
- Community recommendations
- Invite friends feature
- Referral system
- Discovery improvements
- **🔌 Community API Beta** - Launch API for selected communities
- **📚 Developer Docs** - API documentation site

**Month 3: Advanced Moderation + API GA**
- AutoMod rules
- Mod mail
- Report queue
- Appeal system
- Mod logs (public)
- **🔌 Community API GA** - Public API launch
- **📦 SDK Libraries** - JS/Python/Go SDKs
- **🎯 Webhook System** - Real-time events

**Month 4: Monetization + Developer Portal**
- Premium badges (Telegram Stars)
- Community boosts
- Highlighted posts
- Profile customization
- **👨‍💻 Developer Portal** - API key management, analytics
- **💰 API Pricing Tiers** - Free/Pro/Enterprise

**Month 5: Social Features + API Ecosystem**
- User following
- Friend lists
- DMs (future)
- Share to Telegram Stories
- **🏪 Integration Marketplace** - Third-party integrations
- **🎓 Developer Community** - Forum for developers

**Month 6: Analytics & Insights + Enterprise Features**
- Community insights
- User statistics
- Mod analytics
- Growth dashboard
- **🏢 Enterprise API** - Custom SLAs, white-label
- **📊 API Analytics** - Usage tracking, billing

---

### Future Features (6+ months) 🔮

**Content Features:**
- Live chat rooms
- Voice/video posts
- Collaborative posts
- Wikis per community
- Event scheduling

**Gamification:**
- Leaderboards
- Tournaments
- Special events
- Limited-time achievements
- NFT badges (maybe?)

**Advanced:**
- Multi-language support
- Content translation
- API for third-party clients
- Desktop app (Electron)
- Browser extension

**AI Features:**
- Content summarization
- Sentiment analysis
- Smart recommendations
- Auto-tagging
- Duplicate detection

---

## 📊 Success Metrics (KPIs)

### User Metrics
- **DAU/MAU** (Daily/Monthly Active Users)
- **Retention Rate** (Day 1, 7, 30)
- **Session Duration**
- **Posts per user**
- **Comments per user**

### Community Metrics
- **Communities created**
- **Active communities** (>10 posts/week)
- **Average members per community**
- **Community growth rate**

### Engagement Metrics
- **Posts per day**
- **Comments per day**
- **Votes per day**
- **Average comments per post**
- **Average time on post**

### Growth Metrics
- **New users per day**
- **User referrals**
- **Invite link usage**
- **Viral coefficient**

### Technical Metrics
- **Page load time** (< 2s)
- **API response time** (< 200ms p95)
- **Error rate** (< 0.1%)
- **Uptime** (99.9%)

---

## � Community API - Developer Platform

### Overview

**Community API** omogućava community owner-ima i moderatorima da **integrišu eksterne servise, botove, i custom funkcionalnost** u svoje zajednice. Ovo čini pio.gg **programabilnom platformom** gde developeri mogu da grade custom rešenja.

### Use Cases

#### 🤖 Bot Integration
```javascript
// Community owner može da doda custom bot-a
// Bot dobija pristup samo toj community
const bot = await pioAPI.communities.addBot({
  community: 'c/programming',
  botToken: 'bot123:abc...',
  permissions: ['read_posts', 'post_comments', 'moderate'],
  webhooks: ['new_post', 'new_comment', 'new_member']
});

// Bot prima webhooks kad se nešto desi u community
// POST https://yourbot.com/webhook
{
  "event": "new_post",
  "community": "programming",
  "post": {
    "id": "abc123",
    "title": "How to learn Rust?",
    "author": "john_doe",
    "content": "..."
  }
}
```

#### 📊 Analytics & Dashboards
```javascript
// Fetch community statistike
const stats = await pioAPI.communities.getStats('c/programming');
// {
//   members: 5000,
//   posts_today: 45,
//   active_users_7d: 1200,
//   top_contributors: [...],
//   engagement_rate: 0.24
// }

// Real-time data za custom dashboard
const stream = pioAPI.communities.streamEvents('c/programming');
stream.on('post', (post) => {
  updateDashboard(post);
});
```

#### 🎮 Gamification Extensions
```javascript
// Custom achievements za community
await pioAPI.communities.addAchievement('c/gaming', {
  id: 'speedrunner',
  name: 'Speedrunner',
  description: 'Complete 10 game challenges',
  icon: 'https://...',
  criteria: {
    type: 'custom',
    webhookUrl: 'https://your-server.com/check-achievement'
  }
});
```

#### 🛍️ E-commerce Integration
```javascript
// Marketplace u community
await pioAPI.communities.addWidget('c/marketplace', {
  type: 'custom',
  title: 'Featured Products',
  embedUrl: 'https://your-store.com/widget',
  position: 'sidebar'
});
```

#### 🎫 Event Management
```javascript
// Event sistem integrisan u community
await pioAPI.communities.createEvent('c/meetups', {
  title: 'JavaScript Meetup #42',
  date: '2025-11-15T18:00:00Z',
  location: 'Belgrade, Serbia',
  rsvp: true,
  maxAttendees: 100
});
```

---

### API Authentication

#### API Keys
```javascript
// Community owner generiše API key u settings-u
// Svaki community ima svoj API key scope
const apiKey = 'pio_live_c_programming_abc123...';

// Headers za API calls
Authorization: Bearer pio_live_c_programming_abc123...
```

#### Scopes & Permissions
```
read:posts          - Read posts u community
write:posts         - Create/edit posts
read:comments       - Read comments
write:comments      - Post comments
read:members        - List members
write:members       - Invite/remove members
moderate:content    - Remove/pin/lock posts
moderate:users      - Ban/unban users
manage:webhooks     - Create/edit webhooks
manage:settings     - Edit community settings
analytics:read      - Access analytics data
```

---

### REST API Endpoints

#### Community Management
```
GET    /api/v1/communities/{slug}
GET    /api/v1/communities/{slug}/stats
PATCH  /api/v1/communities/{slug}/settings
```

#### Posts
```
GET    /api/v1/communities/{slug}/posts
POST   /api/v1/communities/{slug}/posts
GET    /api/v1/communities/{slug}/posts/{id}
PATCH  /api/v1/communities/{slug}/posts/{id}
DELETE /api/v1/communities/{slug}/posts/{id}
POST   /api/v1/communities/{slug}/posts/{id}/pin
POST   /api/v1/communities/{slug}/posts/{id}/lock
```

#### Comments
```
GET    /api/v1/communities/{slug}/posts/{postId}/comments
POST   /api/v1/communities/{slug}/posts/{postId}/comments
DELETE /api/v1/communities/{slug}/comments/{id}
```

#### Members
```
GET    /api/v1/communities/{slug}/members
POST   /api/v1/communities/{slug}/members/invite
DELETE /api/v1/communities/{slug}/members/{userId}
POST   /api/v1/communities/{slug}/members/{userId}/ban
```

#### Moderation
```
GET    /api/v1/communities/{slug}/reports
POST   /api/v1/communities/{slug}/reports/{id}/resolve
GET    /api/v1/communities/{slug}/mod-log
```

#### Webhooks
```
GET    /api/v1/communities/{slug}/webhooks
POST   /api/v1/communities/{slug}/webhooks
PATCH  /api/v1/communities/{slug}/webhooks/{id}
DELETE /api/v1/communities/{slug}/webhooks/{id}
POST   /api/v1/communities/{slug}/webhooks/{id}/test
```

#### Analytics
```
GET    /api/v1/communities/{slug}/analytics/overview
GET    /api/v1/communities/{slug}/analytics/growth
GET    /api/v1/communities/{slug}/analytics/engagement
GET    /api/v1/communities/{slug}/analytics/top-content
```

---

### Webhooks

Community owner-i mogu da registruju webhook URL-ove da primaju real-time events.

#### Supported Events
```
community.member_joined      - Novi član
community.member_left        - Član otišao
community.settings_updated   - Settings promenjeni

post.created                 - Nov post
post.updated                 - Post editovan
post.deleted                 - Post obrisan
post.pinned                  - Post pinovan
post.locked                  - Post zakljucan

comment.created              - Nov komentar
comment.updated              - Komentar editovan
comment.deleted              - Komentar obrisan

vote.created                 - Nov vote
vote.updated                 - Vote promenjen

moderation.report_created    - Nov report
moderation.user_banned       - User banovan
moderation.content_removed   - Sadržaj uklonjen
```

#### Webhook Payload Example
```json
{
  "event": "post.created",
  "community": "programming",
  "timestamp": "2025-10-25T14:30:00Z",
  "data": {
    "post": {
      "id": "abc123",
      "title": "How to learn Rust?",
      "content": "I want to start learning Rust...",
      "author": {
        "id": 123456789,
        "username": "john_doe",
        "karma": 1500
      },
      "created_at": "2025-10-25T14:30:00Z",
      "url": "https://t.me/pioggbot/app?startapp=p-abc123"
    }
  },
  "signature": "sha256=abc123..." // HMAC signature za verifikaciju
}
```

#### Webhook Verification
```javascript
// Server-side verification (Node.js)
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Express endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-pio-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  const { event, data } = req.body;
  
  if (event === 'post.created') {
    handleNewPost(data.post);
  }
  
  res.status(200).send('OK');
});
```

---

### SDK Libraries

#### JavaScript/TypeScript SDK
```bash
npm install @pio.gg/sdk
```

```typescript
import { PioClient } from '@pio.gg/sdk';

const pio = new PioClient({
  apiKey: 'pio_live_c_programming_abc123...',
  community: 'programming'
});

// Create post
const post = await pio.posts.create({
  title: 'Weekly Discussion Thread',
  content: 'What are you working on this week?',
  pinned: true
});

// Listen to events
pio.on('post.created', (post) => {
  console.log('New post:', post.title);
  
  // Auto-reply
  pio.comments.create(post.id, {
    content: 'Welcome to the discussion!'
  });
});

// Get analytics
const stats = await pio.analytics.getOverview({
  startDate: '2025-10-01',
  endDate: '2025-10-31'
});

console.log(`Posts: ${stats.posts}, Comments: ${stats.comments}`);
```

#### Python SDK
```bash
pip install pio-sdk
```

```python
from pio import PioClient

pio = PioClient(
    api_key='pio_live_c_programming_abc123...',
    community='programming'
)

# Create post
post = pio.posts.create(
    title='Python Tips & Tricks',
    content='Share your favorite Python tips!',
    tags=['python', 'tips']
)

# Listen to webhooks
@pio.webhook('post.created')
def on_new_post(post):
    print(f'New post: {post.title}')
    
    # Auto-moderate
    if 'spam' in post.content.lower():
        pio.moderation.remove_post(post.id, reason='Spam detected')
```

#### Go SDK
```bash
go get github.com/pio-gg/go-sdk
```

```go
package main

import "github.com/pio-gg/go-sdk"

func main() {
    client := pio.NewClient("pio_live_c_programming_abc123...")
    
    // Get posts
    posts, err := client.Posts.List(pio.PostsListParams{
        Community: "programming",
        Sort:      "hot",
        Limit:     50,
    })
    
    // Create comment
    comment, err := client.Comments.Create(pio.CommentCreateParams{
        PostID:  posts[0].ID,
        Content: "Great post!",
    })
}
```

---

### Rate Limits

#### API Rate Limits
```
Standard Tier (Free):
- 100 requests/minute
- 10,000 requests/day
- 2 webhooks max

Pro Tier ($29/mo):
- 1,000 requests/minute
- 100,000 requests/day
- 20 webhooks max
- Priority support

Enterprise Tier (Custom):
- Custom rate limits
- Dedicated infrastructure
- SLA guarantee
- White-label options
```

#### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698242400
```

---

### Use Case Examples

#### 1. Auto-Moderation Bot
```typescript
// Bot koji automatski moderira spam
import { PioClient } from '@pio.gg/sdk';
import { detectSpam } from './spam-detector';

const pio = new PioClient({
  apiKey: process.env.PIO_API_KEY,
  community: 'programming'
});

pio.on('post.created', async (post) => {
  const isSpam = await detectSpam(post.content);
  
  if (isSpam) {
    await pio.moderation.removePost(post.id, {
      reason: 'Spam detected by auto-moderator'
    });
    
    await pio.moderation.banUser(post.author.id, {
      duration: '24h',
      reason: 'Spam'
    });
    
    console.log(`Removed spam post: ${post.id}`);
  }
});
```

#### 2. Community Analytics Dashboard
```typescript
// Next.js app koji prikazuje analytics
import { PioClient } from '@pio.gg/sdk';

const pio = new PioClient({
  apiKey: process.env.PIO_API_KEY,
  community: 'programming'
});

export async function getCommunityStats() {
  const [overview, growth, topPosts] = await Promise.all([
    pio.analytics.getOverview(),
    pio.analytics.getGrowth({ days: 30 }),
    pio.analytics.getTopContent({ limit: 10 })
  ]);
  
  return {
    members: overview.members,
    postsToday: overview.posts_today,
    growth: growth.members_growth_rate,
    topPosts: topPosts
  };
}

// Real-time chart updates
pio.stream.subscribe('analytics', (data) => {
  updateChart(data);
});
```

#### 3. Custom Achievement System
```typescript
// Game developer dodaje custom achievements
const gameAchievements = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first match',
    xp: 100,
    icon: 'https://cdn.example.com/first_win.png'
  },
  {
    id: 'speedrun_master',
    name: 'Speedrun Master',
    description: 'Complete the game in under 2 hours',
    xp: 500,
    icon: 'https://cdn.example.com/speedrun.png'
  }
];

// Add achievements to community
for (const achievement of gameAchievements) {
  await pio.achievements.create(achievement);
}

// Unlock achievement za usera
pio.on('game.completed', async (userId, time) => {
  if (time < 7200) { // 2 hours
    await pio.achievements.unlock(userId, 'speedrun_master');
  }
});
```

#### 4. E-commerce Integration
```typescript
// Marketplace u community
import { PioClient } from '@pio.gg/sdk';
import { stripe } from './stripe-config';

const pio = new PioClient({
  apiKey: process.env.PIO_API_KEY,
  community: 'marketplace'
});

// Create product post
async function listProduct(product) {
  const post = await pio.posts.create({
    title: product.name,
    content: `${product.description}\n\n�💰 Price: $${product.price}`,
    metadata: {
      product_id: product.id,
      price: product.price,
      stock: product.stock
    }
  });
  
  return post;
}

// Handle purchase comments
pio.on('comment.created', async (comment) => {
  if (comment.content.includes('/buy')) {
    const post = await pio.posts.get(comment.post_id);
    const product_id = post.metadata.product_id;
    
    // Create Stripe checkout
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price: product_id,
        quantity: 1
      }],
      mode: 'payment',
      success_url: `https://t.me/pioggbot/app?startapp=p-${post.id}`,
      cancel_url: `https://t.me/pioggbot/app?startapp=p-${post.id}`
    });
    
    // Reply with payment link
    await pio.comments.create(comment.post_id, {
      content: `💳 [Complete your purchase](${session.url})`,
      parent_id: comment.id
    });
  }
});
```

#### 5. Event Management System
```typescript
// Event RSVP sistem
import { PioClient } from '@pio.gg/sdk';

const pio = new PioClient({
  apiKey: process.env.PIO_API_KEY,
  community: 'meetups'
});

// Create event post
async function createEvent(event) {
  const post = await pio.posts.create({
    title: `📅 ${event.title}`,
    content: `
**Date:** ${event.date}
**Location:** ${event.location}
**RSVP:** Comment "I'm going" to register

**Attendees:** 0/${event.maxAttendees}
    `,
    metadata: {
      type: 'event',
      date: event.date,
      maxAttendees: event.maxAttendees,
      attendees: []
    },
    pinned: true
  });
  
  return post;
}

// Handle RSVP
pio.on('comment.created', async (comment) => {
  const post = await pio.posts.get(comment.post_id);
  
  if (post.metadata.type === 'event' && 
      comment.content.toLowerCase().includes("i'm going")) {
    
    const attendees = post.metadata.attendees || [];
    
    if (attendees.length >= post.metadata.maxAttendees) {
      await pio.comments.create(comment.post_id, {
        content: '❌ Sorry, event is full!',
        parent_id: comment.id
      });
      return;
    }
    
    if (!attendees.includes(comment.author.id)) {
      attendees.push(comment.author.id);
      
      await pio.posts.update(post.id, {
        metadata: { ...post.metadata, attendees }
      });
      
      await pio.comments.create(comment.post_id, {
        content: `✅ You're registered! (${attendees.length}/${post.metadata.maxAttendees})`,
        parent_id: comment.id
      });
    }
  }
});
```

---

### API Pricing

#### Free Tier
```
✅ 100 requests/minute
✅ 10,000 requests/day
✅ 2 webhooks
✅ Basic analytics
✅ Community support
```

#### Pro Tier - $29/month
```
✅ 1,000 requests/minute
✅ 100,000 requests/day
✅ 20 webhooks
✅ Advanced analytics
✅ Priority support
✅ Custom domains for widgets
✅ Webhook retry logic
```

#### Enterprise - Custom Pricing
```
✅ Unlimited requests
✅ Unlimited webhooks
✅ Dedicated infrastructure
✅ SLA guarantee (99.99%)
✅ White-label options
✅ Custom integrations
✅ Dedicated support
✅ On-premise deployment (optional)
```

---

### Developer Portal

#### Features
- 📊 **Analytics Dashboard** - API usage, webhook deliveries
- 🔑 **API Key Management** - Create, rotate, revoke keys
- 📝 **Documentation** - Interactive API docs (Swagger/OpenAPI)
- 🧪 **Sandbox Environment** - Test API bez live data
- 🐛 **Debug Console** - Real-time webhook testing
- 📚 **Code Examples** - Copy-paste snippets
- 💬 **Developer Community** - Forum za developere

#### Access
```
https://developers.pio.gg
- Sign in with pio.gg account
- Select community
- Generate API keys
- Test webhooks
- View analytics
```

---

### Security & Best Practices

#### API Key Security
```bash
# ❌ Never commit API keys
# .env
PIO_API_KEY=pio_live_c_programming_abc123...

# ✅ Use environment variables
# .gitignore
.env
.env.local
```

#### Webhook Security
```typescript
// ✅ Always verify webhook signatures
function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// ✅ Use HTTPS for webhook URLs
// ❌ http://your-server.com/webhook
// ✅ https://your-server.com/webhook

// ✅ Implement idempotency
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  const eventId = req.body.id;
  
  if (processedEvents.has(eventId)) {
    return res.status(200).send('Already processed');
  }
  
  processWebhook(req.body);
  processedEvents.add(eventId);
  
  res.status(200).send('OK');
});
```

#### Rate Limiting
```typescript
// ✅ Implement exponential backoff
async function apiCallWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) { // Rate limited
        const delay = Math.pow(2, i) * 1000;
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
}
```

---

### Community API Benefits

#### For Community Owners
✅ **Automation** - Auto-moderation, welcome messages, scheduled posts  
✅ **Analytics** - Deep insights into community health  
✅ **Integrations** - Connect with external tools (Discord, Slack, etc)  
✅ **Custom Features** - Build unique experiences for members  
✅ **Monetization** - E-commerce, paid memberships, premium content  

#### For Developers
✅ **New Revenue Stream** - Build tools za communities  
✅ **Easy Integration** - REST API + SDKs  
✅ **Real-time Events** - Webhooks za instant updates  
✅ **Scalable** - Handles high traffic  
✅ **Well Documented** - Comprehensive docs + examples  

#### For pio.gg Platform
✅ **Ecosystem Growth** - Third-party tools attract more users  
✅ **Stickiness** - Communities stay because of custom integrations  
✅ **Revenue** - API tier subscriptions  
✅ **Innovation** - Community builds features we haven't thought of  
✅ **Network Effects** - More integrations = more value  

---

### Infrastructure
```
Vercel (Pro):              $20
Supabase (Pro):            $25
Upstash Redis (1GB):       $10
Cloudflare R2 (100GB):     $1.50
Meilisearch (Cloud):       $29
Railway (Bot):             $5
Domain + SSL:              $2
Sentry (Error tracking):   $26
--------------------------------
Total:                     ~$118/month
```

### Scaling Considerations
- **1k users:** Current infrastructure OK
- **10k users:** Upgrade Supabase to $99, Redis to $50
- **100k users:** Dedicated servers, CDN, load balancer (~$500-1000/mo)

**💡 Community API Revenue:**
```
Assumption: 1000 communities by month 6

Free Tier: 850 communities        $0
Pro Tier: 140 communities × $29    $4,060/mo
Enterprise: 10 communities × $200  $2,000/mo
────────────────────────────────────────────
Total Revenue:                     $6,060/mo

Net Profit (after infra):          $5,942/mo
```

**Revenue Projections:**
```
Month 3:  $500/mo   (20 Pro communities)
Month 6:  $6,000/mo (200 Pro, 10 Enterprise)
Month 12: $15,000/mo (500 Pro, 25 Enterprise)
Year 2:   $40,000/mo (1200 Pro, 80 Enterprise)
```

**Break-even Analysis:**
- Infrastructure: $118/mo
- Break-even: 5 Pro subscriptions ($145/mo revenue)
- Target: Week 8-10 (Beta phase)

---

## 🛠️ Development Setup

### Prerequisites
```bash
Node.js 20+
PostgreSQL 16
Redis
pnpm (package manager)
```

### Local Development
```bash
# Clone repo
git clone https://github.com/yourusername/pio.gg.git
cd pio.gg

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
pnpm db:push
pnpm db:seed

# Run dev server
pnpm dev

# Run bot (separate terminal)
cd bot
pnpm dev
```

### Environment Variables
```bash
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_SECRET=your_bot_secret

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/piogg

# Redis
REDIS_URL=redis://localhost:6379

# Storage
S3_BUCKET=piogg
S3_REGION=us-east-1
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx

# Search
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://piogg.vercel.app
JWT_SECRET=your_random_secret
```

---

## 📝 API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Communities
```
GET    /api/communities
POST   /api/communities
GET    /api/communities/[slug]
PATCH  /api/communities/[slug]
DELETE /api/communities/[slug]
POST   /api/communities/[slug]/join
POST   /api/communities/[slug]/leave
GET    /api/communities/[slug]/members
POST   /api/communities/[slug]/invite
```

### Posts
```
GET    /api/posts
POST   /api/posts
GET    /api/posts/[id]
PATCH  /api/posts/[id]
DELETE /api/posts/[id]
POST   /api/posts/[id]/vote
GET    /api/posts/[id]/comments
```

### Comments
```
GET    /api/comments
POST   /api/comments
GET    /api/comments/[id]
PATCH  /api/comments/[id]
DELETE /api/comments/[id]
POST   /api/comments/[id]/vote
```

### Users
```
GET    /api/users/[id]
PATCH  /api/users/[id]
GET    /api/users/[id]/posts
GET    /api/users/[id]/comments
GET    /api/users/[id]/achievements
```

### Search
```
GET /api/search?q=query&type=posts&sort=relevance
```

### Notifications
```
GET    /api/notifications
PATCH  /api/notifications/[id]/read
DELETE /api/notifications/[id]
```

---

## 🎯 Next Steps

1. **Setup Project Structure**
   ```bash
   npx create-next-app@latest pio.gg --typescript --tailwind --app
   ```

2. **Initialize Database**
   ```bash
   pnpm add prisma @prisma/client
   npx prisma init
   # Copy schema from this document
   npx prisma db push
   ```

3. **Install Core Dependencies**
   ```bash
   pnpm add @twa-dev/sdk zustand @tanstack/react-query
   pnpm add zod react-hook-form @hookform/resolvers
   pnpm add socket.io socket.io-client
   pnpm add telegraf
   ```

4. **Setup Telegram Bot**
   - Create bot with @BotFather
   - Set bot commands
   - Configure menu button
   - Setup webhooks

5. **Start Development**
   - Build authentication system
   - Create database models
   - Build core UI components
   - Implement MVP features

---

## 📚 Resources

### Documentation
- [Telegram Mini Apps Docs](./docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Telegraf.js](https://telegraf.js.org)

### Design Inspiration
- Reddit (layout, features)
- Discourse (forums, threading)
- Discord (communities, channels)
- Hacker News (voting, simplicity)

### Open Source References
- [Lemmy](https://github.com/LemmyNet/lemmy) - Federated Reddit alternative
- [Flarum](https://github.com/flarum/framework) - Modern forum
- [Discourse](https://github.com/discourse/discourse) - Discussion platform

---

## 🤝 Contributing

Coming soon...

---

## 📄 License

TBD

---

**Ready to build the future of discussion on Telegram! 🚀**
