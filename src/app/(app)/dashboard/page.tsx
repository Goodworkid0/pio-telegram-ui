'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, MessageCircle, Plus, TrendingUp, Clock, Shield } from 'lucide-react';
import CreatePostModal from './components/CreatePostModal';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  votes: number;
  comments: number;
  timestamp: string;
  community: string;
  userVote?: 'up' | 'down' | null;
}

// Mock data - biće zamijenjen sa pravim API-jem
const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Welcome to pio.gg - Privacy-First Communities 🎉',
    content: 'This is the first post in our new community platform. Everything is end-to-end encrypted and you own your data!',
    author: 'admin',
    votes: 42,
    comments: 8,
    timestamp: '2h ago',
    community: 'announcements',
    userVote: null,
  },
  {
    id: 2,
    title: 'How to self-host your own pio.gg instance',
    content: 'Quick guide: docker pull piogg/server && docker run -p 3000:3000 piogg/server',
    author: 'devops_ninja',
    votes: 28,
    comments: 12,
    timestamp: '5h ago',
    community: 'tech',
    userVote: 'up',
  },
  {
    id: 3,
    title: 'GDPR Compliance: What makes pio.gg different?',
    content: 'Unlike Reddit or Discord, we don\'t track you, sell your data, or use dark patterns. Full transparency.',
    author: 'privacy_advocate',
    votes: 35,
    comments: 6,
    timestamp: '1d ago',
    community: 'privacy',
    userVote: null,
  },
  {
    id: 4,
    title: 'Feature Request: Dark Mode Toggle',
    content: 'Would love to have a manual dark mode toggle in addition to the automatic Telegram theme sync.',
    author: 'user123',
    votes: 15,
    comments: 4,
    timestamp: '2d ago',
    community: 'feedback',
    userVote: null,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [tgUser, setTgUser] = useState<string>('Guest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Get Telegram user info
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        setTgUser(user.first_name || user.username || 'User');
      }
    }
  }, []);

  const handleCreatePost = (newPost: { title: string; content: string; community: string }) => {
    const post: Post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: tgUser.toLowerCase().replace(/\s+/g, '_'),
      votes: 1,
      comments: 0,
      timestamp: 'just now',
      community: newPost.community,
      userVote: 'up',
    };
    setPosts([post, ...posts]);
  };

  const handleVote = (postId: number, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        let newVotes = post.votes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote
        if (post.userVote === 'up') newVotes--;
        if (post.userVote === 'down') newVotes++;

        // Apply new vote
        if (voteType === 'up' && post.userVote !== 'up') {
          newVotes++;
        } else if (voteType === 'down' && post.userVote !== 'down') {
          newVotes--;
        } else {
          // Same vote = cancel
          newUserVote = null;
        }

        return { ...post, votes: newVotes, userVote: newUserVote };
      }
      return post;
    }));
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'hot') return b.votes - a.votes;
    if (sortBy === 'new') return b.id - a.id;
    if (sortBy === 'top') return b.votes - a.votes;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">pio.gg</h1>
              <p className="text-xs text-gray-500">Hey, {tgUser}! 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-600">🔒 E2E Encrypted</span>
          </div>
        </div>
      </header>

      {/* Sort Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2">
          {(['hot', 'new', 'top'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                sortBy === option
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {option === 'hot' && <TrendingUp className="inline w-4 h-4 mr-1" />}
              {option === 'new' && <Clock className="inline w-4 h-4 mr-1" />}
              {option === 'top' && <ArrowUp className="inline w-4 h-4 mr-1" />}
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-3">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              {/* Post Header */}
              <div className="flex items-start gap-3">
                {/* Vote Section */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  <button
                    onClick={() => handleVote(post.id, 'up')}
                    className={`p-1 rounded-md transition-colors ${
                      post.userVote === 'up'
                        ? 'text-orange-500 bg-orange-50'
                        : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className={`text-sm font-bold ${
                    post.userVote === 'up' ? 'text-orange-500' :
                    post.userVote === 'down' ? 'text-blue-500' :
                    'text-gray-700'
                  }`}>
                    {post.votes}
                  </span>
                  <button
                    onClick={() => handleVote(post.id, 'down')}
                    className={`p-1 rounded-md transition-colors ${
                      post.userVote === 'down'
                        ? 'text-blue-500 bg-blue-50'
                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span className="font-medium text-blue-600">c/{post.community}</span>
                    <span>•</span>
                    <span>u/{post.author}</span>
                    <span>•</span>
                    <span>{post.timestamp}</span>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/dashboard/post/${post.id}`)}
                    className="text-left w-full group"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>
                  </button>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => router.push(`/dashboard/post/${post.id}`)}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments} comments</span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                      Share
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:scale-110"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

      {/* Privacy Badge (Bottom) */}
      <div className="fixed bottom-6 left-6 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-gray-700">Your data, your rules</span>
        </div>
      </div>
    </div>
  );
}
