import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, ExternalLink, Sparkles, Send, Calendar, HelpCircle, Palette } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '212636260361';
  const displayPhone = '+212 636-260361';

  const sendWhatsAppMessage = (textMessage: string) => {
    const encoded = encodeURIComponent(textMessage);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quickTopics = [
    {
      icon: HelpCircle,
      label: 'Artwork Price & Availability',
      message: 'Bonjour Riad Fine Art, I would like to inquire about artwork pricing and worldwide availability.',
    },
    {
      icon: Calendar,
      label: 'Book Private Gallery Viewing',
      message: 'Bonjour Riad Fine Art, I am interested in scheduling a private viewing at your gallery.',
    },
    {
      icon: Palette,
      label: 'Custom Artwork Commission',
      message: 'Bonjour Riad Fine Art, I would like to discuss a custom gold-leaf oil painting commission.',
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end font-sans-clean select-none">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-88 bg-[#151413] border border-[#C5A059]/40 text-[#E8E6E1] p-4 sm:p-5 rounded-sm shadow-2xl art-frame-glow overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between border-b border-[#C5A059]/20 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#1C1B19] border border-[#C5A059]/50 flex items-center justify-center font-serif-display text-[#C5A059] font-bold text-sm shadow-inner">
                    RFA
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#151413]" />
                </div>
                <div>
                  <h4 className="font-serif-display text-base text-[#E8E6E1] leading-tight">Curator Concierge</h4>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-[#C5A059] tracking-wider uppercase font-semibold">
                      Online &nbsp;·&nbsp; Replies in &lt; 5m
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8C8983] hover:text-[#E8E6E1] p-1.5 bg-[#1C1B19] border border-[#C5A059]/30 rounded-sm transition-colors active:scale-95"
                aria-label="Close Concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Welcome Greeting */}
            <div className="bg-[#1C1B19] p-3 rounded-sm border border-[#C5A059]/15 mb-3 space-y-1">
              <div className="flex items-center space-x-1 text-[#C5A059] text-[10px] tracking-wider uppercase font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Riad Fine Art Gallery</span>
              </div>
              <p className="text-xs text-[#C2C0BA] font-light leading-relaxed">
                Welcome. How can our gallery curator assist your art collection today?
              </p>
            </div>

            {/* Quick Topic Buttons */}
            <div className="space-y-2 mb-4">
              <span className="text-[9px] tracking-widest text-[#8C8983] uppercase font-semibold block px-1">
                Select Quick Inquiry
              </span>
              {quickTopics.map((topic, idx) => {
                const IconComponent = topic.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => sendWhatsAppMessage(topic.message)}
                    className="w-full text-left p-2.5 bg-[#1C1B19] hover:bg-[#22201D] border border-[#C5A059]/20 hover:border-[#C5A059]/60 rounded-sm transition-all group flex items-center justify-between active:scale-[0.98]"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <IconComponent className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span className="text-xs text-[#E8E6E1] group-hover:text-[#C5A059] transition-colors truncate">
                        {topic.label}
                      </span>
                    </div>
                    <Send className="w-3 h-3 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => sendWhatsAppMessage('Bonjour Riad Fine Art, I would like to inquire about your collection.')}
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs tracking-wider uppercase rounded-sm flex items-center justify-center space-x-2 transition-all shadow-lg active:scale-95 group"
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span>Start Direct Chat ({displayPhone})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button Pill / Badge */}
      <div className="flex items-center space-x-2">
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center space-x-2 bg-[#151413]/95 text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] text-[10px] tracking-[0.2em] uppercase font-semibold px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat on WhatsApp</span>
          </motion.button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-[#151413] hover:bg-[#1C1B19] border-2 border-[#C5A059] text-[#25D366] shadow-2xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group relative"
          title="Chat with Riad Fine Art Curator"
          aria-label="Open WhatsApp Chat"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#151413] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#151413]" />
          
          <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110 fill-current" />
        </button>
      </div>
    </div>
  );
};

