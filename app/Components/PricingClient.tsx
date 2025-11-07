// app/pricing/PricingClient.tsx
'use client';

import { useState } from 'react';

interface PricingProps {
  pricing: {
    price: number;
    currency: string;
    symbol: string;
    yearlyPrice: number;
  };
  geoData: {
    country: string;
    city: string;
    locationName: string;
  };
  plan: 'monthly' | 'yearly';
  buttonText: string;
  buttonStyle: 'solid' | 'outline';
}

export default function PricingClient({ 
  pricing, 
  geoData, 
  plan, 
  buttonText,
  buttonStyle 
}: PricingProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const amount = plan === 'yearly' ? pricing.yearlyPrice : pricing.price;
    const period = plan === 'yearly' ? 'year' : 'month';
    
    alert(
      `🎉 Starting ${plan} plan!\n\n` +
      `Amount: ${pricing.symbol}${amount} ${pricing.currency}/${period}\n` +
      `Location: ${geoData.locationName}\n\n` +
      `Click OK to proceed to checkout...`
    );
    
    setIsLoading(false);
    
    // In real app, redirect to payment gateway
    // window.location.href = `/checkout?plan=${plan}&country=${geoData.country}&amount=${amount}`;
  };

  const baseClasses = "w-full font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const styleClasses = buttonStyle === 'solid'
    ? "bg-white text-purple-600 hover:bg-white/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
    : "bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50";

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`${baseClasses} ${styleClasses}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {buttonText}
          <span className="text-xl">→</span>
        </>
      )}
    </button>
  );
}