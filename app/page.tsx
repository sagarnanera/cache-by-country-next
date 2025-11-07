// app/pricing/page.tsx (Server Component - SSR with geo data)
import { headers } from 'next/headers';
import PricingClient from './Components/PricingClient';

// Pricing configuration
const PRICING_DATA = {
  'US': { price: 99, currency: 'USD', symbol: '$', yearlyPrice: 990 },
  'IN': { price: 4999, currency: 'INR', symbol: '₹', yearlyPrice: 49990 },
  'GB': { price: 79, currency: 'GBP', symbol: '£', yearlyPrice: 790 },
  'DE': { price: 89, currency: 'EUR', symbol: '€', yearlyPrice: 890 },
  'FR': { price: 89, currency: 'EUR', symbol: '€', yearlyPrice: 890 },
  'AU': { price: 129, currency: 'AUD', symbol: 'A$', yearlyPrice: 1290 },
  'CA': { price: 119, currency: 'CAD', symbol: 'C$', yearlyPrice: 1190 },
  'JP': { price: 10900, currency: 'JPY', symbol: '¥', yearlyPrice: 109000 },
  'BR': { price: 499, currency: 'BRL', symbol: 'R$', yearlyPrice: 4990 },
  'MX': { price: 1999, currency: 'MXN', symbol: 'MX$', yearlyPrice: 19990 },
} as const;

const DEFAULT_PRICING = { price: 100, currency: 'USD', symbol: '$', yearlyPrice: 1000 };

const features = [
  { icon: '🚀', title: 'Unlimited API Calls', description: 'No rate limits, scale freely' },
  { icon: '⚡', title: '99.99% Uptime SLA', description: 'Enterprise-grade reliability' },
  { icon: '🛡️', title: 'Advanced Security', description: 'SOC 2 & GDPR compliant' },
  { icon: '📊', title: 'Real-time Analytics', description: 'Detailed usage insights' },
  { icon: '🌍', title: 'Global CDN', description: 'Lightning-fast worldwide' },
  { icon: '💬', title: '24/7 Priority Support', description: 'Expert help anytime' },
  { icon: '🔧', title: 'Custom Integrations', description: 'Webhooks & API access' },
  { icon: '👥', title: 'Unlimited Team Members', description: 'Collaborate seamlessly' },
];

export default async function PricingPage() {
  // Read geo data from headers (set by middleware)
  const headersList = await headers();
  const country = headersList.get('x-user-country') || 'US';
  const city = headersList.get('x-user-city') || 'Unknown';
  const region = headersList.get('x-user-region') || '';
  
  // Get pricing for user's country
  const pricing = PRICING_DATA[country as keyof typeof PRICING_DATA] || DEFAULT_PRICING;
  
  const geoData = {
    country,
    city,
    region,
    locationName: city !== 'Unknown' ? `${city}, ${country}` : country,
  };

  // Calculate savings for yearly plan
  const monthlyCost = pricing.price * 12;
  const savings = monthlyCost - pricing.yearlyPrice;
  const savingsPercent = Math.round((savings / monthlyCost) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-2xl">📍</span>
            <span className="text-white/90">Showing prices for {geoData.locationName}</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join thousands of developers building the future. Start free, scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Monthly Plan */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="text-white/60 text-sm font-semibold uppercase tracking-wide mb-4">
              Monthly
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-6xl font-bold text-white">{pricing.symbol}{pricing.price}</span>
              <span className="text-white/60 text-xl">/month</span>
            </div>
            <p className="text-white/70 mb-8">Perfect for getting started and testing the waters</p>
            <PricingClient 
              pricing={pricing} 
              geoData={geoData} 
              plan="monthly"
              buttonText="Start Monthly Plan"
              buttonStyle="outline"
            />
          </div>

          {/* Yearly Plan - Featured */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 relative overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
            {/* Best Value Badge */}
            <div className="absolute top-6 right-6 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
              Save {savingsPercent}%
            </div>
            
            <div className="text-white/90 text-sm font-semibold uppercase tracking-wide mb-4">
              Yearly
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold text-white">{pricing.symbol}{Math.round(pricing.yearlyPrice / 12)}</span>
              <span className="text-white/90 text-xl">/month</span>
            </div>
            <p className="text-white/80 mb-6">
              Billed annually at {pricing.symbol}{pricing.yearlyPrice}
            </p>
            <p className="text-white/90 mb-8 font-medium">
              🎉 Save {pricing.symbol}{savings} compared to monthly billing
            </p>
            <PricingClient 
              pricing={pricing} 
              geoData={geoData} 
              plan="yearly"
              buttonText="Start Yearly Plan"
              buttonStyle="solid"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Everything included
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">10k+</div>
              <div className="text-white/60">Active Developers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">99.99%</div>
              <div className="text-white/60">Uptime SLA</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">1B+</div>
              <div className="text-white/60">API Calls/Month</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers."
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Start with a 14-day free trial. No credit card required to get started."
              }
            ].map((faq, idx) => (
              <details 
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              >
                <summary className="text-white font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-2xl group-open:rotate-180 transition-transform">›</span>
                </summary>
                <p className="text-white/70 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <div className="text-white/60 text-sm font-mono">
            <div className="font-semibold text-white mb-3">🔍 Server-Side Rendered Data:</div>
            <div className="space-y-1">
              <div>Country: <span className="text-purple-400">{country}</span></div>
              <div>City: <span className="text-purple-400">{city}</span></div>
              <div>Region: <span className="text-purple-400">{region}</span></div>
              <div className="mt-3 text-xs text-white/40 italic">
                ✅ Prices calculated server-side • Cached per country • Edge optimized
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cache this page per country for 1 hour
export const revalidate = 3600;