import React from 'react';
import { X, ArrowRight, ShoppingBag, Bookmark, ShieldCheck, Layers } from 'lucide-react';
import { Artwork, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface QuickViewModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
  addToCart: (artwork: Artwork) => void;
  wishlistIds: string[];
  toggleWishlist: (artworkId: string) => void;
  activeCurrency: Currency;
  openRoomPreview: (artwork: Artwork) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  artwork,
  onClose,
  onSelectArtwork,
  addToCart,
  wishlistIds,
  toggleWishlist,
  activeCurrency,
  openRoomPreview,
}) => {
  if (!artwork) return null;

  const isSaved = wishlistIds.includes(artwork.id);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#11100F]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-8 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-[#151413] border border-[#B08D57]/40 rounded-sm overflow-hidden art-frame-glow flex flex-col max-h-[92vh]">
        
        {/* Top Header Exit Bar */}
        <div
          onClick={onClose}
          className="bg-[#1C1B19] border-b border-[#B08D57]/30 px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#252320] transition-colors select-none"
          title="Click bar to Exit / Close"
        >
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#B08D57]" />
            <span className="text-[11px] tracking-[0.2em] text-[#B08D57] uppercase font-semibold">
              Artwork Inspection
            </span>
            <span className="text-xs text-[#8C8983] hidden sm:inline">— {artwork.title}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#B08D57] text-[#151413] font-bold text-[10px] uppercase tracking-wider rounded-sm hover:bg-[#CBB07E] active:scale-95 transition-all shadow-md shrink-0"
            title="Close Quick View"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 stroke-[3]" />
            <span>Close / Exit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Image Column */}
          <div className="md:col-span-6 bg-[#11100F] p-6 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#B08D57]/20">
            <img
              src={artwork.primaryImage}
              alt={artwork.title}
              referrerPolicy="no-referrer"
              className="max-h-[360px] w-full object-contain rounded-sm"
            />

            <button
              onClick={() => {
                onClose();
                openRoomPreview(artwork);
              }}
              className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#1C1B19]/90 border border-[#B08D57]/50 text-[#B08D57] text-[10px] tracking-widest uppercase rounded-sm flex items-center space-x-1 hover:bg-[#B08D57] hover:text-[#1C1B19] transition-all shadow-lg font-semibold"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Room Scale View</span>
            </button>
          </div>

          {/* Content Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between font-sans-clean">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] text-[#B08D57] uppercase block font-semibold">
                {artwork.artistName}
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#E8E6E1] leading-tight">
                {artwork.title}
              </h3>
              <p className="text-xs text-[#8C8983] font-light">
                {artwork.medium} &nbsp;·&nbsp; {artwork.dimensions} &nbsp;·&nbsp; {artwork.year}
              </p>

              <div className="py-3 border-y border-[#B08D57]/20 flex justify-between items-center">
                <span className="font-serif-display text-2xl text-[#E8E6E1] font-semibold">
                  {formatPrice(artwork.priceUSD, activeCurrency)}
                </span>
                <span className="text-[10px] tracking-widest text-[#B08D57] uppercase font-medium">
                  {artwork.editionInfo}
                </span>
              </div>

              <p className="text-xs text-[#C2C0BA] font-light leading-relaxed line-clamp-3">
                {artwork.story}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#B08D57]/20 mt-6">
              <button
                onClick={() => {
                  addToCart(artwork);
                  onClose();
                }}
                className="w-full py-3.5 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#CBB07E] transition-all rounded-sm flex items-center justify-center space-x-2 active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Collection Bag</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onSelectArtwork(artwork);
                  }}
                  className="py-2.5 px-3 border border-[#B08D57]/40 text-[#E8E6E1] text-[10px] tracking-widest uppercase hover:border-[#B08D57] text-center rounded-sm transition-colors"
                >
                  Inspect Full Record
                </button>

                <button
                  onClick={() => toggleWishlist(artwork.id)}
                  className={`py-2.5 px-3 border text-[10px] tracking-widest uppercase rounded-sm flex items-center justify-center space-x-1.5 transition-colors ${
                    isSaved ? 'bg-[#B08D57]/20 border-[#B08D57] text-[#B08D57]' : 'border-[#B08D57]/40 text-[#E8E6E1]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
