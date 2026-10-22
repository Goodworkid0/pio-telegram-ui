'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Server, 
  Lock,
  Database,
  Eye,
  FileKey,
  MessageSquare,
  Users,
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '100% Data Ownership',
    description: 'Your community data belongs to you. Export anytime, delete anytime. No vendor lock-in.',
    color: 'green',
    featured: true
  },
  {
    icon: Server,
    title: 'Self-Hosted Option',
    description: 'Run pio.gg on your own infrastructure. Docker deployment in minutes. Full control.',
    color: 'blue',
    featured: true
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Optional E2E encryption for sensitive communities. Your messages, your keys.',
    color: 'purple',
    featured: true
  },
  {
    icon: Database,
    title: 'GDPR & HIPAA Ready',
    description: 'Built-in compliance tools. Data residency options. Perfect for regulated industries.',
    color: 'red'
  },
  {
    icon: Eye,
    title: 'Privacy by Default',
    description: 'No tracking, no ads, no data mining. We never sell your data. Period.',
    color: 'indigo'
  },
  {
    icon: FileKey,
    title: 'Audit Logs',
    description: 'Complete transparency. See exactly who accessed what and when.',
    color: 'yellow'
  },
  {
    icon: MessageSquare,
    title: 'Reddit-style Discussions',
    description: 'Posts, comments, nested replies with upvotes. Familiar UX, better privacy.',
    color: 'blue'
  },
  {
    icon: Users,
    title: 'Private Communities',
    description: 'Invite-only mode. Member vetting. Access control. Your space, your rules.',
    color: 'pink'
  },
  {
    icon: BarChart3,
    title: 'Analytics You Control',
    description: 'Community insights without tracking users. Aggregate data only.',
    color: 'green'
  }
];

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  indigo: 'from-indigo-500 to-indigo-600',
  yellow: 'from-yellow-500 to-yellow-600',
  pink: 'from-pink-500 to-pink-600',
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Privacy-First by Design</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Community,{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Your Data
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Built for organizations that care about privacy, security, and data ownership
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                feature.featured 
                  ? 'border-green-500 dark:border-green-500 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
              }`}
            >
              {/* Featured Badge */}
              {feature.featured && (
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                  KEY FEATURE
                </div>
              )}
              
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorMap[feature.color as keyof typeof colorMap]} mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Privacy Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-start gap-3 px-6 py-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Privacy Guarantee
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We <strong>never</strong> sell your data. We <strong>never</strong> track users for advertising.{' '}
                We <strong>never</strong> share data with third parties without your explicit consent.{' '}
                <a href="/privacy" className="text-green-600 dark:text-green-400 hover:underline">
                  Read our privacy policy →
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
