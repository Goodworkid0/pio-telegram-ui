export default function CTA() {
  const telegramDeepLink = 'https://t.me/piogg_bot/app';
  
  return (
    <section className="py-24 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Own Your Community Data
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join organizations that prioritize privacy and data ownership
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={telegramDeepLink}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-gray-100 text-blue-600 font-semibold text-lg shadow-lg transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.764 8.317c-.132.589-.475.732-.963.456l-2.66-1.96-1.282 1.234c-.142.142-.26.26-.533.26l.19-2.7 4.906-4.433c.213-.19-.047-.295-.33-.106l-6.062 3.817-2.613-.817c-.568-.177-.578-.568.119-.843l10.215-3.939c.474-.177.889.106.737.843z"/>
            </svg>
            Start Free (Cloud)
          </a>
          <a
            href="/docs/self-hosted"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold text-lg transition-all"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Self-Host (On-Premise)
          </a>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>HIPAA Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>SOC 2 Type II</span>
          </div>
        </div>
      </div>
    </section>
  );
}
