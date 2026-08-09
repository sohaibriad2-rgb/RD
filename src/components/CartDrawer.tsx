import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, Currency, PageView } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  removeFromCart: (artworkId: string) => void;
  updateFraming: (artworkId: string, framing: string) => void;
  activeCurrency: Currency;
  setCurrentPage: (page: PageView) => void;
}

const FRAMING_OPTIONS = [
  'Museum Standard Unframed',
  '24k Florentine Gilt Wooden Frame',
  'Archival Charcoal Shadow Box',
  'Natural Moroccan Cedar Frame'
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  removeFromCart,
  updateFraming,
  activeCurrency,
  setCurrentPage,
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

  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.artwork.priceUSD * item.quantity, 0);

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
            className="absolute inset-0 bg-[#11100F]/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md h-[100dvh] bg-white text-[#151413] border-l border-[#C5A059]/30 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Header (Shrink 0) */}
              <div className="p-4 sm:p-6 bg-[#FAF8F5] border-b border-[#C5A059]/20 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-[#C5A059]/15 border border-[#C5A059]/40 rounded-sm">
                    <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h2 className="font-serif-display text-xl sm:text-2xl text-[#151413]">Collection Bag</h2>
                    <span className="text-[10px] tracking-widest text-[#C5A059] uppercase block font-medium">
                      {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Selected
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-[#151413] hover:text-[#C5A059] bg-white border border-[#C5A059]/30 rounded-sm transition-colors active:scale-95"
                  title="Close Collection Bag"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Items List (Flex 1) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.artwork.id}
                      className="bg-[#FAF8F5] border border-[#C5A059]/25 p-3.5 sm:p-4 rounded-sm flex gap-3 sm:gap-4 relative group shadow-sm"
                    >
                      <img
                        src={item.artwork.primaryImage}
                        alt={item.artwork.title}
                        referrerPolicy="no-referrer"
                        className="w-20 sm:w-22 h-20 sm:h-22 object-contain p-1 bg-[#11100F] rounded-sm border border-[#C5A059]/30 shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1 font-sans-clean">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[9px] tracking-widest text-[#C5A059] uppercase block font-semibold truncate">
                            {item.artwork.artistName}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.artwork.id)}
                            className="p-1 text-[#8C8983] hover:text-[#C5A059] transition-colors shrink-0"
                            title="Remove from Bag"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="font-serif-display text-sm sm:text-base text-[#151413] truncate leading-snug">
                          {item.artwork.title}
                        </h4>
                        <p className="text-[11px] text-[#5A5650] font-semibold">
                          {formatPrice(item.artwork.priceUSD, activeCurrency)}
                        </p>

                        {/* Custom Framing Selection */}
                        <div className="pt-2">
                          <label className="text-[9px] uppercase tracking-widest text-[#8C8983] block mb-1 font-medium">
                            Custom Framing:
                          </label>
                          <select
                            value={item.customFraming || 'Museum Standard Unframed'}
                            onChange={(e) => updateFraming(item.artwork.id, e.target.value)}
                            className="w-full bg-white border border-[#C5A059]/40 text-[10px] text-[#151413] py-1 px-2 focus:outline-none focus:border-[#C5A059] rounded-sm cursor-pointer"
                          >
                            {FRAMING_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  /* Empty State */
                  <div className="py-16 text-center space-y-4 font-sans-clean my-auto">
                    <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-7 h-7 text-[#C5A059]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif-display text-xl text-[#151413]">Your Collection Bag is Empty</h3>
                      <p className="text-xs text-[#8C8983] max-w-xs mx-auto font-light leading-relaxed">
                        Explore our curated gallery to discover original fine art masterworks for your private collection.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Subtotal & Checkout (Shrink 0) */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-[#C5A059]/20 space-y-3 shrink-0 font-sans-clean">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest text-[#8C8983] font-medium">Acquisition Total</span>
                    <span className="font-serif-display text-xl sm:text-2xl text-[#151413] font-bold">
                      {formatPrice(subtotalUSD, activeCurrency)}
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px] text-[#5A5650]">
                    <div className="flex items-center space-x-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Complimentary Insured White-Glove Shipping</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Stamped Certificate of Authenticity Included</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      setCurrentPage('checkout');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 bg-[#151413] hover:bg-[#C5A059] text-white hover:text-[#151413] text-xs tracking-[0.2em] uppercase font-bold transition-all rounded-sm flex items-center justify-center space-x-2 shadow-lg active:scale-95"
                  >
                    <span>Proceed to Private Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

