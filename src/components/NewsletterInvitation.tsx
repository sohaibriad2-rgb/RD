import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export const NewsletterInvitation: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Invitation Card */}
        <div className="bg-[#FAF8F5] border border-[#C5A059]/40 p-8 sm:p-14 text-center relative rounded-sm shadow-md">
          
          {/* Decorative Corner Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#C5A059]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#C5A059]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#C5A059]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#C5A059]" />

          <span className="text-[#C5A059] text-[10px] tracking-[0.4em] uppercase font-sans-clean block mb-4 font-semibold">
            Private Correspondence
          </span>

          <h3 className="font-serif-display text-3xl sm:text-4xl text-[#151413] tracking-[0.05em] mb-4">
            Join The Collector's Circle
          </h3>

          <div className="w-12 h-[1px] bg-[#C5A059] mx-auto mb-6" />

          <p className="text-[#5A5650] text-xs sm:text-sm font-normal max-w-lg mx-auto leading-relaxed mb-8 font-sans-clean">
            Receive exclusive private previews of newly unveiled original canvases, invitations to confidential salon viewings in Casablanca and Agadir, and bi-monthly curatorial essays.
          </p>

          {isSubmitted ? (
            <div className="inline-flex items-center space-x-3 text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-6 py-4 rounded-sm animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span className="text-xs tracking-[0.18em] uppercase font-sans-clean font-medium">
                Your invitation request has been received. Welcome to the Circle.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#C5A059] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-white border border-[#C5A059]/40 text-[#151413] placeholder-[#8C8983] text-xs pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#C5A059] transition-colors rounded-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#151413] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#C5A059] transition-all rounded-sm shadow-sm shrink-0"
              >
                Request Access
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#8C8983] tracking-widest uppercase mt-6 font-sans-clean">
            Strict Privacy Assured &nbsp;·&nbsp; No Unsolicited Frequency
          </p>

        </div>

      </div>
    </section>
  );
};
