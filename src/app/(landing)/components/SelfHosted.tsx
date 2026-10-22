'use client';

import { motion } from 'framer-motion';
import { Server, Download, Shield, Zap, Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Download Docker Image',
    description: 'Pull the official pio.gg Docker image from our registry',
    command: 'docker pull pio.gg/community-server:latest'
  },
  {
    number: '02',
    title: 'Configure Environment',
    description: 'Set up your database, Redis, and storage',
    command: 'cp .env.example .env && vim .env'
  },
  {
    number: '03',
    title: 'Launch Container',
    description: 'Start the server with docker-compose',
    command: 'docker-compose up -d'
  },
  {
    number: '04',
    title: 'Connect to Telegram',
    description: 'Link your self-hosted instance to Telegram Bot',
    command: 'Visit https://your-domain.com/setup'
  }
];

const benefits = [
  'Full data sovereignty - data never leaves your infrastructure',
  'GDPR/HIPAA compliance - perfect for regulated industries',
  'No monthly fees - one-time license, yours forever',
  'Custom domain - brand it as your own',
  'Air-gapped deployment - works offline',
  'Source code access (Enterprise plan)',
];

export default function SelfHosted() {
  return (
    <section id="self-hosted" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Server className="w-4 h-4" />
            <span>Self-Hosted Deployment</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Host on{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Infrastructure
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Deploy pio.gg on-premise or in your cloud. Complete control over data, security, and compliance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Steps */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Deploy in 5 minutes
              </h3>
              
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg z-10">
                      {step.number}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {step.description}
                      </p>
                      
                      {/* Command */}
                      <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 font-mono text-sm text-green-400">
                        <span className="text-gray-500">$ </span>
                        {step.command}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 flex gap-4"
            >
              <a
                href="/docs/self-hosted"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Setup Guide
              </a>
              <a
                href="/docs/docker"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-500 text-gray-900 dark:text-white font-semibold transition-colors"
              >
                View Docker Docs
              </a>
            </motion.div>
          </div>

          {/* Right: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Why Self-Host?
                </h3>
              </div>
              
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-3"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>
              
              {/* System Requirements */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  MINIMUM REQUIREMENTS
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">CPU</p>
                    <p className="font-medium text-gray-900 dark:text-white">2 cores</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">RAM</p>
                    <p className="font-medium text-gray-900 dark:text-white">4 GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Storage</p>
                    <p className="font-medium text-gray-900 dark:text-white">20 GB SSD</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">OS</p>
                    <p className="font-medium text-gray-900 dark:text-white">Docker 20+</p>
                  </div>
                </div>
              </div>
              
              {/* Performance Badge */}
              <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Handles <strong>10,000+ concurrent users</strong> per instance
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
