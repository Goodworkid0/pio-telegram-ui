'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, MessageCircle, Share2, Bookmark, ArrowLeft, Send } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  votes: number;
  timestamp: string;
  replies?: Comment[];
  userVote?: 'up' | 'down' | null;
}

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

// Mock data
const mockPost: Post = {
  id: 1,
  title: 'Welcome to pio.gg - Privacy-First Communities 🎉',
  content: 'This is the first post in our new community platform. Everything is end-to-end encrypted and you own your data!\n\nWe built this because we believe communities should have full control over their content. No tracking, no data selling, no dark patterns.\n\nKey features:\n- 🔒 End-to-end encryption\n- 💾 100% data ownership\n- 🏠 Self-hosting option\n- 📊 GDPR/HIPAA compliant\n- 🚫 No ads, ever\n\nWhat do you think?',
  author: 'admin',
  votes: 42,
  comments: 8,
  timestamp: '2h ago',
  community: 'announcements',
  userVote: null,
};

const mockComments: Comment[] = [
  {
    id: 1,
    author: 'privacy_advocate',
    content: 'This is exactly what we need! Finally a platform that respects user privacy. 🙌',
    votes: 15,
    timestamp: '1h ago',
    userVote: null,
    replies: [
      {
        id: 11,
        author: 'admin',
        content: 'Thanks! We\'re just getting started. More features coming soon!',
        votes: 8,
        timestamp: '45m ago',
        userVote: null,
      },
    ],
  },
  {
    id: 2,
    author: 'tech_enthusiast',
    content: 'Love the self-hosting option. Can\'t wait to deploy my own instance!',
    votes: 12,
    timestamp: '1h ago',
    userVote: 'up',
    replies: [],
  },
  {
    id: 3,
    author: 'developer_123',
    content: 'Is the source code open source? Would love to contribute!',
    votes: 9,
    timestamp: '45m ago',
    userVote: null,
    replies: [
      {
        id: 31,
        author: 'admin',
        content: 'Yes! We\'re on GitHub. Enterprise customers get access to the full source code.',
        votes: 6,
        timestamp: '30m ago',
        userVote: null,
      },
    ],
  },
  {
    id: 4,
    author: 'community_manager',
    content: 'This could be perfect for our healthcare community. HIPAA compliance is crucial for us.',
    votes: 7,
    timestamp: '30m ago',
    userVote: null,
    replies: [],
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(mockPost);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [tgUser, setTgUser] = useState<string>('Guest');

  useEffect(() => {
    // Get Telegram user info
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        setTgUser(user.first_name || user.username || 'User');
      }
      
      // Setup back button
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(() => router.back());

      return () => {
        tg.BackButton.hide();
      };
    }
  }, [router]);

  const handleVote = (voteType: 'up' | 'down') => {
    setPost(prev => {
      let newVotes = prev.votes;
      let newUserVote: 'up' | 'down' | null = voteType;

      if (prev.userVote === 'up') newVotes--;
      if (prev.userVote === 'down') newVotes++;

      if (voteType === 'up' && prev.userVote !== 'up') {
        newVotes++;
      } else if (voteType === 'down' && prev.userVote !== 'down') {
        newVotes--;
      } else {
        newUserVote = null;
      }

      return { ...prev, votes: newVotes, userVote: newUserVote };
    });
  };

  const handleCommentVote = (commentId: number, voteType: 'up' | 'down') => {
    const updateComment = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          let newVotes = comment.votes;
          let newUserVote: 'up' | 'down' | null = voteType;

          if (comment.userVote === 'up') newVotes--;
          if (comment.userVote === 'down') newVotes++;

          if (voteType === 'up' && comment.userVote !== 'up') {
            newVotes++;
          } else if (voteType === 'down' && comment.userVote !== 'down') {
            newVotes--;
          } else {
            newUserVote = null;
          }

          return { ...comment, votes: newVotes, userVote: newUserVote };
        }
        if (comment.replies) {
          return { ...comment, replies: updateComment(comment.replies) };
        }
        return comment;
      });
    };

    setComments(updateComment(comments));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: tgUser.toLowerCase().replace(/\s+/g, '_'),
      content: newComment,
      votes: 1,
      timestamp: 'just now',
      replies: [],
      userVote: 'up',
    };

    if (replyingTo) {
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === replyingTo) {
            return { ...c, replies: [...(c.replies || []), comment] };
          }
          if (c.replies) {
            return { ...c, replies: addReply(c.replies) };
          }
          return c;
        });
      };
      setComments(addReply(comments));
      setReplyingTo(null);
    } else {
      setComments([...comments, comment]);
    }

    setNewComment('');
    setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
  };

  const renderComment = (comment: Comment, depth: number = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        {/* Comment Header */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="font-medium text-gray-700">u/{comment.author}</span>
          <span>•</span>
          <span>{comment.timestamp}</span>
        </div>

        {/* Comment Content */}
        <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCommentVote(comment.id, 'up')}
              className={`p-1 rounded transition-colors ${
                comment.userVote === 'up'
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-orange-500'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <span className={`text-sm font-medium ${
              comment.userVote === 'up' ? 'text-orange-500' :
              comment.userVote === 'down' ? 'text-blue-500' :
              'text-gray-600'
            }`}>
              {comment.votes}
            </span>
            <button
              onClick={() => handleCommentVote(comment.id, 'down')}
              className={`p-1 rounded transition-colors ${
                comment.userVote === 'down'
                  ? 'text-blue-500'
                  : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-gray-200 pl-2">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-8 mt-2 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-700 mb-2">Replying to u/{comment.author}</p>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your reply..."
            rows={2}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => { setReplyingTo(null); setNewComment(''); }}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Post</h1>
            <p className="text-xs text-gray-500">c/{post.community}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Post Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span className="font-medium text-blue-600">c/{post.community}</span>
            <span>•</span>
            <span>u/{post.author}</span>
            <span>•</span>
            <span>{post.timestamp}</span>
          </div>

          {/* Post Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>

          {/* Post Content */}
          <p className="text-gray-700 text-base mb-6 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>

          {/* Post Actions */}
          <div className="flex items-center gap-6 pb-4 border-b border-gray-200 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`p-2 rounded-lg transition-colors ${
                  post.userVote === 'up'
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <span className={`text-base font-bold ${
                post.userVote === 'up' ? 'text-orange-500' :
                post.userVote === 'down' ? 'text-blue-500' :
                'text-gray-700'
              }`}>
                {post.votes}
              </span>
              <button
                onClick={() => handleVote('down')}
                className={`p-2 rounded-lg transition-colors ${
                  post.userVote === 'down'
                    ? 'text-blue-500 bg-blue-50'
                    : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments} comments</span>
            </button>

            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>

            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
              <Bookmark className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>

          {/* Comment Input */}
          {!replyingTo && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Comment as <span className="text-blue-600">u/{tgUser.toLowerCase().replace(/\s+/g, '_')}</span>
              </p>
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={3}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Comments ({comments.length})
          </h3>
          
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-0">
              {comments.map(comment => renderComment(comment))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
