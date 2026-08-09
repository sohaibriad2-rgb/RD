import React, { useState } from 'react';
import { X, Send, CheckCircle, ShieldCheck, MessageSquare } from 'lucide-react';
import { Artwork } from '../types';

interface PrivateEnquiryModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const PrivateEnquiryModal: React.FC<PrivateEnquiryModalProps> = ({ artwork, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!artwork) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#11100F]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#151413] border border-[#B08D57]/40 rounded-sm p-6 sm:p-10 art-frame-glow">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#E8E6E1] hover:text-[#B08D57] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <span className="text-[10px] tracking-[0.3em] text-[#B08D57] uppercase block mb-1 font-sans-clean">
          Private Acquisition Advisory
        </span>
        <h3 className="font-serif-display text-3xl text-[#E8E6E1] mb-2">
          Enquire: "{artwork.title}"
        </h3>
        <p className="text-xs text-[#8C8983] mb-6 font-sans-clean">
          {artwork.artistName} · {artwork.medium} ({artwork.dimensions})
        </p>

        {isSubmitted ? (
          <div className="bg-[#B08D57]/10 border border-[#B08D57]/40 p-8 text-center rounded-sm space-y-4 animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-[#B08D57] mx-auto" />
            <h4 className="font-serif-display text-2xl text-[#E8E6E1]">Inquiry Transmitted</h4>
            <p className="text-xs text-[#C2C0BA] font-light leading-relaxed font-sans-clean">
              Thank you, {name}. A senior gallery director at Riad Fine Art will review your inquiry regarding "{artwork.title}" and reach out to you within 12 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#B08D57] text-[#1C1B19] text-xs uppercase tracking-widest font-semibold rounded-sm"
            >
              Return to Gallery
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans-clean">
            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord / Lady / Dr. / Full Name"
                className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@domain.com"
                className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">
                Telephone / WhatsApp (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 20 7946 0912"
                className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs px-4 py-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block mb-1">
                Private Note or Location Preference
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inquire about shipping estimate, custom framing, or scheduling a viewing in Casablanca or Agadir..."
                className="w-full bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] text-xs p-3 focus:outline-none focus:border-[#B08D57] rounded-sm"
              />
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-[#8C8983]">
              <ShieldCheck className="w-4 h-4 text-[#B08D57]" />
              <span>Strictly Confidential & Confidential Correspondence</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#CBB07E] transition-all rounded-sm flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Form</span>
              </button>

              <a
                href={`https://wa.me/212636260361?text=${encodeURIComponent(`Hello Riad Fine Art, I would like to inquire directly about "${artwork.title}" by ${artwork.artistName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366]/15 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-sm flex items-center justify-center space-x-2 text-center"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Message WhatsApp</span>
              </a>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
