# Next.js Project Architecture - pio.gg

Kompletna struktura Next.js 14 App Router projekta za Telegram Mini App Reddit klon.

---

## 📁 Project Structure

```
pio.gg/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # CI/CD pipeline
│       └── deploy.yml                  # Deployment automation
│
├── app/                                # Next.js App Router
│   ├── (auth)/                         # Auth layout group
│   │   ├── layout.tsx
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (main)/                         # Main app layout
│   │   ├── layout.tsx                  # Main layout with nav
│   │   ├── page.tsx                    # Home feed
│   │   │
│   │   ├── c/                          # Communities
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx            # Community view
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx        # Community about
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx        # Community settings (mod)
│   │   │   └── create/
│   │   │       └── page.tsx            # Create community
│   │   │
│   │   ├── p/                          # Posts
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx            # Post detail + comments
│   │   │   └── create/
│   │   │       └── page.tsx            # Create post
│   │   │
│   │   ├── u/                          # Users
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # User profile
│   │   │       ├── posts/
│   │   │       │   └── page.tsx
│   │   │       ├── comments/
│   │   │       │   └── page.tsx
│   │   │       └── saved/
│   │   │           └── page.tsx
│   │   │
│   │   ├── search/
│   │   │   └── page.tsx                # Search results
│   │   │
│   │   ├── notifications/
│   │   │   └── page.tsx                # Notifications feed
│   │   │
│   │   ├── settings/
│   │   │   └── page.tsx                # User settings
│   │   │
│   │   └── achievements/
│   │       └── page.tsx                # Achievements page
│   │
│   ├── api/                            # API Routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   │
│   │   ├── communities/
│   │   │   ├── route.ts                # GET, POST
│   │   │   ├── [slug]/
│   │   │   │   ├── route.ts            # GET, PATCH, DELETE
│   │   │   │   ├── join/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── leave/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── members/
│   │   │   │   │   └── route.ts
│   │   │   │   └── invite/
│   │   │   │       └── route.ts
│   │   │   └── trending/
│   │   │       └── route.ts
│   │   │
│   │   ├── posts/
│   │   │   ├── route.ts                # GET, POST
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts            # GET, PATCH, DELETE
│   │   │   │   ├── vote/
│   │   │   │   │   └── route.ts
│   │   │   │   └── comments/
│   │   │   │       └── route.ts
│   │   │   └── feed/
│   │   │       └── route.ts            # Home feed algorithm
│   │   │
│   │   ├── comments/
│   │   │   ├── route.ts                # POST
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET, PATCH, DELETE
│   │   │       └── vote/
│   │   │           └── route.ts
│   │   │
│   │   ├── users/
│   │   │   └── [id]/
│   │   │       ├── route.ts            # GET, PATCH
│   │   │       ├── posts/
│   │   │       │   └── route.ts
│   │   │       ├── comments/
│   │   │       │   └── route.ts
│   │   │       └── achievements/
│   │   │           └── route.ts
│   │   │
│   │   ├── search/
│   │   │   └── route.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── read/
│   │   │       │   └── route.ts
│   │   │       └── route.ts            # DELETE
│   │   │
│   │   ├── upload/
│   │   │   └── route.ts                # File upload
│   │   │
│   │   ├── reports/
│   │   │   └── route.ts
│   │   │
│   │   └── webhook/
│   │       └── telegram/
│   │           └── route.ts            # Telegram bot webhook
│   │
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   ├── providers.tsx                   # React Query, Zustand providers
│   └── error.tsx                       # Global error boundary
│
├── components/                         # React Components
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...                         # More shadcn components
│   │
│   ├── layout/
│   │   ├── header.tsx                  # App header
│   │   ├── bottom-nav.tsx              # Mobile bottom navigation
│   │   ├── sidebar.tsx                 # Desktop sidebar (optional)
│   │   └── footer.tsx
│   │
│   ├── auth/
│   │   ├── login-button.tsx
│   │   └── auth-guard.tsx              # Protected route wrapper
│   │
│   ├── community/
│   │   ├── community-card.tsx          # Community preview card
│   │   ├── community-header.tsx        # Community page header
│   │   ├── community-sidebar.tsx       # Community info sidebar
│   │   ├── community-list.tsx          # List of communities
│   │   ├── create-community-form.tsx
│   │   ├── join-button.tsx
│   │   └── invite-modal.tsx
│   │
│   ├── post/
│   │   ├── post-card.tsx               # Post in feed
│   │   ├── post-detail.tsx             # Full post view
│   │   ├── post-actions.tsx            # Vote, comment, share buttons
│   │   ├── post-form.tsx               # Create/edit post
│   │   ├── post-list.tsx               # List of posts
│   │   ├── vote-buttons.tsx            # Upvote/downvote
│   │   └── post-skeleton.tsx           # Loading skeleton
│   │
│   ├── comment/
│   │   ├── comment.tsx                 # Single comment
│   │   ├── comment-tree.tsx            # Nested comments
│   │   ├── comment-form.tsx            # Add/edit comment
│   │   ├── comment-actions.tsx
│   │   └── comment-skeleton.tsx
│   │
│   ├── user/
│   │   ├── user-card.tsx               # User profile card
│   │   ├── user-avatar.tsx             # Avatar with fallback
│   │   ├── user-badge.tsx              # OP, MOD badges
│   │   ├── karma-display.tsx
│   │   └── level-badge.tsx
│   │
│   ├── achievement/
│   │   ├── achievement-card.tsx
│   │   ├── achievement-badge.tsx
│   │   ├── achievement-list.tsx
│   │   └── achievement-unlock-modal.tsx
│   │
│   ├── notification/
│   │   ├── notification-bell.tsx       # Bell icon with count
│   │   ├── notification-item.tsx
│   │   └── notification-list.tsx
│   │
│   ├── search/
│   │   ├── search-bar.tsx
│   │   ├── search-filters.tsx
│   │   └── search-results.tsx
│   │
│   ├── editor/
│   │   ├── rich-text-editor.tsx        # TipTap editor
│   │   ├── markdown-preview.tsx
│   │   └── editor-toolbar.tsx
│   │
│   ├── upload/
│   │   ├── image-upload.tsx
│   │   ├── video-upload.tsx
│   │   └── file-preview.tsx
│   │
│   └── shared/
│       ├── loading-spinner.tsx
│       ├── empty-state.tsx
│       ├── error-message.tsx
│       ├── confirmation-dialog.tsx
│       ├── share-button.tsx
│       └── infinite-scroll.tsx
│
├── lib/                                # Utilities & Config
│   ├── prisma.ts                       # Prisma client singleton
│   ├── redis.ts                        # Redis client
│   ├── telegram.ts                     # Telegram SDK utilities
│   ├── auth.ts                         # Auth helpers
│   ├── upload.ts                       # File upload helpers
│   ├── search.ts                       # Meilisearch client
│   ├── queue.ts                        # BullMQ queue
│   ├── socket.ts                       # Socket.io setup
│   ├── utils.ts                        # General utilities
│   ├── cn.ts                           # Tailwind class merger
│   └── constants.ts                    # App constants
│
├── lib/validations/                    # Zod schemas
│   ├── auth.ts
│   ├── community.ts
│   ├── post.ts
│   ├── comment.ts
│   ├── user.ts
│   └── common.ts
│
├── lib/api/                            # API layer
│   ├── client.ts                       # API client (axios/fetch)
│   ├── communities.ts                  # Community API calls
│   ├── posts.ts                        # Post API calls
│   ├── comments.ts                     # Comment API calls
│   ├── users.ts                        # User API calls
│   ├── notifications.ts
│   └── search.ts
│
├── lib/algorithms/                     # Ranking algorithms
│   ├── hot.ts                          # Hot posts algorithm
│   ├── trending.ts                     # Trending algorithm
│   ├── karma.ts                        # Karma calculation
│   └── achievements.ts                 # Achievement unlock logic
│
├── hooks/                              # Custom React hooks
│   ├── use-auth.ts                     # Authentication hook
│   ├── use-telegram.ts                 # Telegram WebApp hook
│   ├── use-posts.ts                    # Posts data hook (React Query)
│   ├── use-comments.ts                 # Comments hook
│   ├── use-communities.ts              # Communities hook
│   ├── use-vote.ts                     # Voting hook
│   ├── use-notifications.ts            # Notifications hook
│   ├── use-search.ts                   # Search hook
│   ├── use-infinite-scroll.ts          # Infinite scroll hook
│   ├── use-haptic.ts                   # Haptic feedback hook
│   └── use-theme.ts                    # Theme hook
│
├── stores/                             # Zustand stores
│   ├── auth-store.ts                   # Auth state
│   ├── ui-store.ts                     # UI state (modals, etc)
│   ├── notification-store.ts           # Notification state
│   └── draft-store.ts                  # Draft posts/comments
│
├── middleware/                         # API middleware
│   ├── auth.ts                         # Auth middleware
│   ├── rate-limit.ts                   # Rate limiting
│   ├── error-handler.ts                # Error handling
│   ├── validate.ts                     # Request validation
│   └── logger.ts                       # Request logging
│
├── services/                           # Business logic
│   ├── auth.service.ts
│   ├── community.service.ts
│   ├── post.service.ts
│   ├── comment.service.ts
│   ├── vote.service.ts
│   ├── user.service.ts
│   ├── notification.service.ts
│   ├── achievement.service.ts
│   ├── moderation.service.ts
│   └── search.service.ts
│
├── workers/                            # Background jobs
│   ├── notification-worker.ts          # Send notifications
│   ├── achievement-worker.ts           # Check achievements
│   ├── cleanup-worker.ts               # Cleanup old data
│   └── search-indexer.ts               # Index content for search
│
├── bot/                                # Telegram Bot
│   ├── index.ts                        # Bot entry point
│   ├── commands/
│   │   ├── start.ts
│   │   ├── communities.ts
│   │   ├── trending.ts
│   │   ├── profile.ts
│   │   └── search.ts
│   ├── handlers/
│   │   ├── callback-query.ts
│   │   ├── inline-query.ts
│   │   └── message.ts
│   ├── keyboards/
│   │   ├── main.ts
│   │   └── community.ts
│   └── utils/
│       ├── deeplinks.ts
│       └── formatting.ts
│
├── prisma/
│   ├── schema.prisma                   # Database schema
│   ├── seed.ts                         # Seed data
│   └── migrations/                     # Migration files
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── types/                              # TypeScript types
│   ├── api.ts                          # API types
│   ├── database.ts                     # Database types
│   ├── telegram.ts                     # Telegram types
│   └── index.ts                        # Exported types
│
├── config/
│   ├── site.ts                         # Site config
│   ├── achievements.ts                 # Achievement definitions
│   └── features.ts                     # Feature flags
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example                        # Example environment variables
├── .env.local                          # Local environment (gitignored)
├── .eslintrc.json                      # ESLint config
├── .prettierrc                         # Prettier config
├── next.config.js                      # Next.js config
├── tailwind.config.ts                  # Tailwind config
├── tsconfig.json                       # TypeScript config
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 🔐 Authentication Flow

### 1. Telegram initData Validation

**middleware.ts** (Root middleware)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateTelegramWebAppData } from '@/lib/telegram';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip auth for public routes
  if (path.startsWith('/api/webhook') || path === '/') {
    return NextResponse.next();
  }
  
  // Get initData from cookie or header
  const initData = request.cookies.get('tg_init_data')?.value || 
                   request.headers.get('x-telegram-init-data');
  
  if (!initData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Validate initData
  const validation = await validateTelegramWebAppData(initData);
  
  if (!validation.valid) {
    return NextResponse.json({ error: 'Invalid auth' }, { status: 401 });
  }
  
  // Add user info to headers
  const response = NextResponse.next();
  response.headers.set('x-user-id', validation.user.id.toString());
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 2. Auth Helper

**lib/auth.ts**
```typescript
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  user?: TelegramUser;
  authDate?: number;
}

export async function validateTelegramWebAppData(
  initData: string
): Promise<ValidationResult> {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');
    
    if (!hash) {
      return { valid: false };
    }
    
    // Create data-check-string
    const dataCheckArr = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);
    const dataCheckString = dataCheckArr.join('\n');
    
    // Calculate secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN!)
      .digest();
    
    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    // Compare hashes
    if (calculatedHash !== hash) {
      return { valid: false };
    }
    
    // Check auth_date (must be recent)
    const authDate = parseInt(params.get('auth_date') || '0');
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 24 * 60 * 60; // 24 hours
    
    if (now - authDate > maxAge) {
      return { valid: false };
    }
    
    // Parse user data
    const userJson = params.get('user');
    if (!userJson) {
      return { valid: false };
    }
    
    const user: TelegramUser = JSON.parse(userJson);
    
    return {
      valid: true,
      user,
      authDate,
    };
  } catch (error) {
    console.error('Telegram validation error:', error);
    return { valid: false };
  }
}

export async function getCurrentUser(request: NextRequest): Promise<TelegramUser | null> {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return null;
  }
  
  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
  });
  
  return user;
}
```

### 3. Auth Hook

**hooks/use-auth.ts**
```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WebApp from '@twa-dev/sdk';

interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  avatar_url?: string;
  karma: number;
  level: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    async function initAuth() {
      try {
        // Get Telegram initData
        const initData = WebApp.initData;
        
        if (!initData) {
          throw new Error('No initData');
        }
        
        // Send to backend for validation
        const response = await fetch('/api/auth/me', {
          headers: {
            'X-Telegram-Init-Data': initData,
          },
        });
        
        if (!response.ok) {
          throw new Error('Auth failed');
        }
        
        const data = await response.json();
        setUser(data.user);
        
        // Store initData in cookie for subsequent requests
        document.cookie = `tg_init_data=${initData}; path=/; max-age=86400`;
        
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    
    initAuth();
  }, [router]);
  
  return { user, loading };
}
```

---

## 🔄 State Management

### Zustand Stores

**stores/auth-store.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username?: string;
  first_name: string;
  karma: number;
  level: number;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**stores/ui-store.ts**
```typescript
import { create } from 'zustand';

interface UIStore {
  // Modals
  isCreatePostModalOpen: boolean;
  isCreateCommunityModalOpen: boolean;
  isShareModalOpen: boolean;
  
  // Actions
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  openCreateCommunityModal: () => void;
  closeCreateCommunityModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCreatePostModalOpen: false,
  isCreateCommunityModalOpen: false,
  isShareModalOpen: false,
  
  openCreatePostModal: () => set({ isCreatePostModalOpen: true }),
  closeCreatePostModal: () => set({ isCreatePostModalOpen: false }),
  openCreateCommunityModal: () => set({ isCreateCommunityModalOpen: true }),
  closeCreateCommunityModal: () => set({ isCreateCommunityModalOpen: false }),
  openShareModal: () => set({ isShareModalOpen: true }),
  closeShareModal: () => set({ isShareModalOpen: false }),
  
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

### React Query Setup

**app/providers.tsx**
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**hooks/use-posts.ts**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, votePost } from '@/lib/api/posts';

export function usePosts(communitySlug?: string, sortBy: string = 'hot') {
  return useQuery({
    queryKey: ['posts', communitySlug, sortBy],
    queryFn: () => getPosts({ communitySlug, sortBy }),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useVotePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, value }: { postId: string; value: 1 | -1 }) =>
      votePost(postId, value),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });
}
```

---

## 🎯 API Route Examples

### Community API

**app/api/communities/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCommunitySchema } from '@/lib/validations/community';

// GET /api/communities - List communities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'members'; // members, new, name
    
    const skip = (page - 1) * limit;
    
    const where = {
      deleted_at: null,
      is_public: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    
    const orderBy = 
      sort === 'members' ? { member_count: 'desc' } :
      sort === 'new' ? { created_at: 'desc' } :
      { name: 'asc' };
    
    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          icon_url: true,
          member_count: true,
          post_count: true,
          created_at: true,
        },
      }),
      prisma.community.count({ where }),
    ]);
    
    return NextResponse.json({
      communities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}

// POST /api/communities - Create community
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const data = createCommunitySchema.parse(body);
    
    // Check if slug is taken
    const existing = await prisma.community.findUnique({
      where: { slug: data.slug },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Community slug already taken' },
        { status: 400 }
      );
    }
    
    // Create community
    const community = await prisma.community.create({
      data: {
        ...data,
        creator_id: user.id,
        invite_code: data.require_invite ? generateInviteCode() : null,
      },
    });
    
    // Add creator as owner
    await prisma.communityMember.create({
      data: {
        community_id: community.id,
        user_id: user.id,
        role: 'owner',
        joined_via: 'created',
      },
    });
    
    return NextResponse.json({ community }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500 }
    );
  }
}
```

---

## 🚀 Deployment Configuration

### Vercel Configuration

**vercel.json**
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "TELEGRAM_BOT_TOKEN": "@telegram-bot-token",
    "TELEGRAM_BOT_SECRET": "@telegram-bot-secret",
    "REDIS_URL": "@redis-url",
    "S3_BUCKET": "@s3-bucket",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### Environment Variables

**.env.example**
```bash
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/piogg

# Redis
REDIS_URL=redis://localhost:6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_SECRET=your_bot_secret
TELEGRAM_WEBHOOK_URL=https://yourapp.com/api/webhook/telegram

# Storage (AWS S3 or Cloudflare R2)
S3_BUCKET=piogg
S3_REGION=us-east-1
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Search (Meilisearch)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=xxx

# Auth
JWT_SECRET=your_random_secret_key

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# Monitoring
SENTRY_DSN=xxx
VERCEL_ANALYTICS_ID=xxx
```

---

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    
    "bot:dev": "tsx watch bot/index.ts",
    "bot:start": "node dist/bot/index.js",
    
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  }
}
```

---

**Sada je kompletna arhitektura definisana i spremna za implementaciju! 🚀**
