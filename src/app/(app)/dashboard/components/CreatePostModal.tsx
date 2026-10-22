'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Link as LinkIcon, Hash } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: { title: string; content: string; community: string }) => void;
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [community, setCommunity] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const communities = [
    { id: 'general', name: 'General', emoji: '💬' },
    { id: 'tech', name: 'Tech', emoji: '💻' },
    { id: 'privacy', name: 'Privacy', emoji: '🔒' },
    { id: 'announcements', name: 'Announcements', emoji: '📣' },
    { id: 'feedback', name: 'Feedback', emoji: '💡' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit({ title, content, community });
    
    // Reset form
    setTitle('');
    setContent('');
    setCommunity('general');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Modal */}
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Community Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="inline w-4 h-4 mr-1" />
              Community
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {communities.map((comm) => (
                <button
                  key={comm.id}
                  type="button"
                  onClick={() => setCommunity(comm.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    community === comm.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mr-2">{comm.emoji}</span>
                  <span className="font-medium text-sm">{comm.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An interesting title for your post..."
              required
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/300</p>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your thoughts with the community..."
              required
              rows={6}
              maxLength={10000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/10,000</p>
          </div>

          {/* Media Buttons (Coming Soon) */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Add to post</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled
                className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <ImageIcon className="inline w-4 h-4 mr-1" />
                Image
              </button>
              <button
                type="button"
                disabled
                className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <LinkIcon className="inline w-4 h-4 mr-1" />
                Link
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">⏳ Media uploads coming soon!</p>
          </div>

          {/* Privacy Notice */}
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              🔒 <strong>Privacy-first:</strong> Your post is end-to-end encrypted and only visible to community members. We never sell your data.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
