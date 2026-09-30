import React from 'react';
import { Grid, ShieldAlert, Briefcase, Landmark, CreditCard, ShoppingBag, TrendingUp, Users, Building2, Gift, Headphones, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categories() {
  const categoriesList = [
    {
      title: 'Phishing',
      icon: ShieldAlert,
      color: 'text-red-500 bg-red-500/10',
      description: 'Fake emails or SMS messages impersonating legitimate brands to trick you into entering credentials on fake websites.',
      example: 'KYC expired SMS with insecure lookalike link.'
    },
    {
      title: 'Job & Internship Scams',
      icon: Briefcase,
      color: 'text-amber-500 bg-amber-500/10',
      description: 'Fake job offers or internship position letters demanding registration fees, training charges, or document security deposits.',
      example: 'Pay ₹1,500 registration fee to confirm your internship position.'
    },
    {
      title: 'Banking Scams',
      icon: Landmark,
      color: 'text-blue-500 bg-blue-500/10',
      description: 'Fraudulent communications pretending to be bank officials claiming your debit card, ATM PIN, or account is blocked.',
      example: 'Your HDFC account has been temporarily restricted due to invalid PAN details.'
    },
    {
      title: 'UPI/Payment Scams',
      icon: CreditCard,
      color: 'text-emerald-500 bg-emerald-500/10',
      description: 'Tricking users into scanning QR codes or entering UPI PINs under the pretense of receiving money or processing refunds.',
      example: 'Someone asking for an OTP or PIN to credit ₹5,000 refund.'
    },
    {
      title: 'Shopping Scams',
      icon: ShoppingBag,
      color: 'text-purple-500 bg-purple-500/10',
      description: 'Fake e-commerce websites or social media ads offering unbelievable discounts on electronics, clothes, or gadgets.',
      example: 'iPhone 15 Pro for ₹9,999 — pay upfront via UPI only.'
    },
    {
      title: 'Investment Scams',
      icon: TrendingUp,
      color: 'text-indigo-500 bg-indigo-500/10',
      description: 'Promises of guaranteed double returns, crypto trading bots, or high daily payouts with zero financial risk.',
      example: 'Invest ₹5,000 and get ₹20,000 guaranteed daily profit.'
    },
    {
      title: 'Social Media Scams',
      icon: Users,
      color: 'text-pink-500 bg-pink-500/10',
      description: 'Hacked friend accounts asking for urgent money transfers or fake influencer giveaway contests.',
      example: 'Hey, I am stuck in an emergency. Can you UPI me ₹3,000 immediately?'
    },
    {
      title: 'Government Impersonation',
      icon: Building2,
      color: 'text-cyan-500 bg-cyan-500/10',
      description: 'Scammers posing as Income Tax, Police, Customs, or RBI officials threatening legal action or arrests unless money is paid.',
      example: 'Customs department notice: Pay ₹15,000 clearance tax for international package.'
    },
    {
      title: 'Prize/Lottery Scams',
      icon: Gift,
      color: 'text-amber-500 bg-amber-500/10',
      description: 'Unsolicited notifications claiming you won a lottery or car, requiring a small advance processing fee to release winnings.',
      example: 'You won ₹50,000 reward! Pay ₹299 processing fee immediately.'
    },
    {
      title: 'Fake Customer Support',
      icon: Headphones,
      color: 'text-teal-500 bg-teal-500/10',
      description: 'Fake helpline numbers posted on Google Search or Twitter asking users to install remote management software like AnyDesk.',
      example: 'Call fake airline helpline number and share OTP to get flight refund.'
    },
    {
      title: 'Other Suspicious Activity',
      icon: AlertOctagon,
      color: 'text-slate-500 bg-slate-500/10',
      description: 'General online fraud, unknown file attachments, romance scams, or unclassified suspicious messages.',
      example: 'Unsolicited compressed zip files sent from random external senders.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
          <Grid className="w-4 h-4" />
          <span>THREAT CLASSIFICATION CATALOG</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Supported Scam Categories
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          ScamSniff classifies content across 11 distinct threat categories using hybrid rule patterns and structured AI analysis.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoriesList.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:scale-[1.01]"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {cat.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Sample Threat Pattern:
                  </span>
                  <p className="italic text-slate-600 dark:text-slate-300 font-normal">
                    "{cat.example}"
                  </p>
                </div>
              </div>

              <Link
                to="/"
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Check suspicious content in this category</span>
              </Link>
            </div>
          );
        })}
      </div>

    </div>
  );
}
