import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, Trash2, ArrowRight, ShoppingBag, Eye, MessageSquare, Sparkles } from 'lucide-react';
import { ARTWORKS } from '../data/artworks';
import { Artwork, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  toggleWishlist: (artworkId: string) => void;
  onSelectArtwork: (artwork: Artwork) => void;
  addToCart: (artwork: Artwork) => void;
  activeCurrency: Currency;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  toggleWishlist,
  onSelectArtwork,
  addToCart,
  activeCurrency,
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const savedArtworks = ARTWORKS.filter((art) => wishlistIds.includes(art.id));

  // WhatsApp link for all saved artworks
  const getWhatsAppCollectionLink = () => {
    const titles = savedArtworks.map((a) => `"${a.title}"`).join(', ');
    const text = `Bonjour Riad Fine Art, I am interested in acquiring pieces from my Saved Collection: ${titles}. Please provide acquisition details and guidance.`;
    return `https://wa.me/212636260361?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#11100F]/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md h-[100dvh] bg-[#1C1B19] text-[#E8E6E1] border-l border-[#B08D57]/40 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header (Shrink 0) */}
              <div className="p-4 sm:p-6 bg-[#151413] border-b border-[#B08D57]/30 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-[#B08D57]/15 border border-[#B08D57]/40 rounded-sm">
                    <Bookmark className="w-4 h-4 text-[#B08D57] fill-current" />
                  </div>
                  <div>
                    <h2 className="font-serif-display text-xl sm:text-2xl text-[#E8E6E1]">Saved Collection</h2>
                    <span className="text-[10px] tracking-widest text-[#B08D57] uppercase block font-medium">
                      {savedArtworks.length} {savedArtworks.length === 1 ? 'Masterwork' : 'Masterworks'} Saved
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-[#E8E6E1] hover:text-[#B08D57] bg-[#1C1B19] border border-[#B08D57]/30 rounded-sm transition-colors active:scale-95"
                  title="Close Saved Collection"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Scrollable Items Container (Flex 1) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {savedArtworks.length > 0 ? (
                  savedArtworks.map((art) => (
                    <div
                      key={art.id}
                      className="bg-[#151413] border border-[#B08D57]/30 hover:border-[#B08D57]/70 p-3.5 sm:p-4 rounded-sm flex gap-3 sm:gap-4 relative group shadow-md transition-all"
                    >
                      {/* Image Thumbnail */}
                      <div
                        onClick={() => {
                          onClose();
                          onSelectArtwork(art);
                        }}
                        className="w-20 sm:w-22 h-20 sm:h-22 bg-[#0E0D0C] p-1 rounded-sm border border-[#B08D57]/30 shrink-0 cursor-pointer overflow-hidden relative group/img"
                      >
                        <img
                          src={art.primaryImage}
                          alt={art.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-110"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between font-sans-clean">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[9px] tracking-widest text-[#B08D57] uppercase font-semibold block truncate">
                              {art.artistName}
                            </span>
                            <button
                              onClick={() => toggleWishlist(art.id)}
                              className="p-1 text-[#8C8983] hover:text-[#B08D57] transition-colors shrink-0"
                              title="Remove from Saved"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h4
                            onClick={() => {
                              onClose();
                              onSelectArtwork(art);
                            }}
                            className="font-serif-display text-sm sm:text-base text-[#E8E6E1] truncate cursor-pointer hover:text-[#B08D57] transition-colors leading-snug"
                          >
                            {art.title}
                          </h4>

                          <p className="text-[11px] text-[#A09D96] font-medium mt-0.5">
                            {formatPrice(art.priceUSD, activeCurrency)}
                          </p>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="pt-2 flex items-center space-x-2">
                          <button
                            onClick={() => {
                              addToCart(art);
                              toggleWishlist(art.id);
                            }}
                            className="flex-1 py-1.5 px-2.5 bg-[#B08D57] text-[#1C1B19] text-[9px] sm:text-[10px] tracking-wider uppercase font-bold hover:bg-[#CBB07E] transition-all rounded-sm flex items-center justify-center space-x-1 shadow-sm active:scale-95"
                          >
                            <ShoppingBag className="w-3 h-3 shrink-0" />
                            <span>Move to Bag</span>
                          </button>

                          <button
                            onClick={() => {
                              onClose();
                              onSelectArtwork(art);
                            }}
                            className="p-1.5 border border-[#B08D57]/40 text-[#E8E6E1] hover:border-[#B08D57] hover:text-[#B08D57] transition-all rounded-sm shrink-0 active:scale-95"
                            title="Inspect Artwork Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Empty State */
                  <div className="py-16 text-center space-y-4 font-sans-clean my-auto">
                    <div className="w-16 h-16 rounded-full bg-[#B08D57]/10 border border-[#B08D57]/30 flex items-center justify-center mx-auto">
                      <Bookmark className="w-7 h-7 text-[#B08D57]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif-display text-xl text-[#E8E6E1]">Your Saved Collection is Empty</h3>
                      <p className="text-xs text-[#A09D96] max-w-xs mx-auto font-light leading-relaxed">
                        Tap the bookmark icon on any oil painting, gold-leaf piece, or sculpture to curate your personal acquisition wishlist.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions (Shrink 0) */}
              <div className="p-4 sm:p-6 bg-[#151413] border-t border-[#B08D57]/30 space-y-2.5 shrink-0 font-sans-clean">
                {savedArtworks.length > 0 && (
                  <a
                    href={getWhatsAppCollectionLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#B08D57] hover:bg-[#CBB07E] text-[#1C1B19] text-xs tracking-[0.2em] uppercase font-bold transition-all rounded-sm flex items-center justify-center space-x-2 shadow-lg active:scale-95 text-center"
                  >
                    <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                    <span>Enquire All via WhatsApp</span>
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-transparent border border-[#B08D57]/50 text-[#E8E6E1] text-xs tracking-[0.2em] uppercase font-semibold hover:border-[#B08D57] hover:text-[#B08D57] transition-all rounded-sm text-center active:scale-95"
                >
                  Continue Browsing Gallery
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

