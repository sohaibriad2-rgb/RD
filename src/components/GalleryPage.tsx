import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Bookmark,
  Eye,
  Layers,
  ArrowLeft,
  ArrowRight,
  X,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ARTWORKS } from '../data/artworks';
import { Artwork, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface GalleryPageProps {
  onSelectArtwork: (artwork: Artwork) => void;
  wishlistIds: string[];
  toggleWishlist: (artworkId: string) => void;
  activeCurrency: Currency;
  openQuickView: (artwork: Artwork) => void;
  openRoomPreview?: (artwork: Artwork) => void;
}

type CategoryFilter = 'all' | 'oil_impasto' | 'archways_gold' | 'azure_coastal' | 'available' | 'acquired';

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Works' },
  { id: 'oil_impasto', label: 'Impasto & Oil' },
  { id: 'archways_gold', label: 'Gold Leaf & Archways' },
  { id: 'azure_coastal', label: 'Azure & Coastal' },
  { id: 'available', label: 'Available Masterworks' },
  { id: 'acquired', label: 'Private Collection' },
];

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onSelectArtwork,
  wishlistIds,
  toggleWishlist,
  activeCurrency,
  openQuickView,
  openRoomPreview,
}) => {
  // Category & Search State
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-desc' | 'price-asc' | 'newest'>('featured');

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Touch Swipe Gesture Tracking for Lightbox
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Filter artworks based on Category & Search
  const filteredArtworks = useMemo(() => {
    return ARTWORKS.filter((art) => {
      // Category filter
      if (activeCategory === 'available' && !art.isAvailable) return false;
      if (activeCategory === 'acquired' && art.isAvailable) return false;
      if (activeCategory === 'oil_impasto') {
        const isOil = art.medium.toLowerCase().includes('oil') || art.medium.toLowerCase().includes('impasto');
        if (!isOil) return false;
      }
      if (activeCategory === 'archways_gold') {
        const isGold = art.medium.toLowerCase().includes('gold') || art.tags.some(t => t.toLowerCase().includes('gold') || t.toLowerCase().includes('arch'));
        if (!isGold) return false;
      }
      if (activeCategory === 'azure_coastal') {
        const isAzure = art.tags.some(t => t.toLowerCase().includes('blue') || t.toLowerCase().includes('ultramarine') || t.toLowerCase().includes('coast'));
        if (!isAzure) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(query);
        const matchesArtist = art.artistName.toLowerCase().includes(query);
        const matchesMedium = art.medium.toLowerCase().includes(query);
        const matchesTags = art.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesArtist && !matchesMedium && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'newest') return b.year - a.year;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [activeCategory, searchQuery, sortBy]);

  // Current Lightbox Artwork
  const currentLightboxArtwork = useMemo(() => {
    if (lightboxIndex === null || lightboxIndex < 0 || lightboxIndex >= filteredArtworks.length) {
      return null;
    }
    return filteredArtworks[lightboxIndex];
  }, [lightboxIndex, filteredArtworks]);

  // Lightbox Navigation Functions
  const handleNextArtwork = useCallback(() => {
    if (lightboxIndex === null || filteredArtworks.length === 0) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredArtworks.length - 1 ? prev + 1 : 0));
  }, [lightboxIndex, filteredArtworks.length]);

  const handlePrevArtwork = useCallback(() => {
    if (lightboxIndex === null || filteredArtworks.length === 0) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredArtworks.length - 1));
  }, [lightboxIndex, filteredArtworks.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for Lightbox (Esc, Left Arrow, Right Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') handleNextArtwork();
      if (e.key === 'ArrowLeft') handlePrevArtwork();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, handleNextArtwork, handlePrevArtwork]);

  // Handle Touch Swipe on Mobile for Lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // Only switch artwork if movement was clearly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaY) < 35) {
      if (deltaX > 0) {
        handleNextArtwork();
      } else {
        handlePrevArtwork();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
    setTouchStartY(null);
    setTouchEndY(null);
  };

  // WhatsApp Order Link generator
  const getWhatsAppLink = (art: Artwork) => {
    const text = `Bonjour Riad Fine Art, I would like to order / enquire about the masterwork "${art.title}" (${art.medium}, ${art.dimensions}) listed at ${formatPrice(art.priceUSD, activeCurrency)}. Please guide me regarding acquisition and delivery.`;
    return `https://wa.me/212636260361?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#1A1A1A] min-h-screen text-[#F5F0E6] py-10 sm:py-16 selection:bg-[#C6A664] selection:text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Gallery Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#C6A664] text-[11px] sm:text-xs tracking-[0.35em] uppercase block mb-3 font-semibold">
            Riad Fine Art · Atelier Collection
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F5F0E6] font-normal tracking-wide mb-4 leading-tight">
            Curated Works & Masterpieces
          </h1>
          <div className="w-12 h-[1px] bg-[#C6A664] mx-auto mb-5" />
          <p className="text-[#A09D96] text-xs sm:text-sm font-light leading-relaxed max-w-xl mx-auto">
            Discover heavy impasto oils, mineral pigments, and 24K gold embellished architectural forms crafted in Morocco for international collectors.
          </p>
        </div>

        {/* Minimal Luxury Filter Bar */}
        <div className="mb-12 border-b border-[#C6A664]/20 pb-6">
          
          {/* Category Filter Pills with Animated Gold Underline */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar space-x-6 sm:space-x-8 mb-8 pb-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative text-xs tracking-[0.2em] uppercase transition-colors whitespace-nowrap py-2 font-medium ${
                    isActive ? 'text-[#C6A664]' : 'text-[#A09D96] hover:text-[#F5F0E6]'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C6A664]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input & Sorting Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#C6A664] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, medium, tag..."
                className="w-full bg-[#242424] border border-[#C6A664]/30 text-[#F5F0E6] placeholder-[#807D77] text-xs pl-10 pr-8 py-2.5 rounded-sm focus:outline-none focus:border-[#C6A664] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09D96] hover:text-[#F5F0E6]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Sort & Count */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
              <span className="text-[11px] tracking-widest text-[#807D77] uppercase">
                {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Work' : 'Works'}
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#242424] border border-[#C6A664]/30 text-[#F5F0E6] text-xs tracking-wider py-2 px-3 rounded-sm focus:outline-none focus:border-[#C6A664] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

          </div>

        </div>

        {/* Responsive Justified/Masonry Gallery Grid (Preserves Natural Aspect Ratio) */}
        {filteredArtworks.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredArtworks.map((art, index) => {
              const isSaved = wishlistIds.includes(art.id);

              return (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid inline-block w-full group relative bg-[#222222] border border-[#C6A664]/20 hover:border-[#C6A664]/70 transition-all duration-500 rounded-sm overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(198,166,100,0.15)]"
                >
                  {/* Image Frame Container (Natural Aspect Ratio) */}
                  <div
                    className="relative w-full cursor-pointer overflow-hidden bg-[#151515]"
                    onClick={() => onSelectArtwork(art)}
                  >
                    <img
                      src={art.primaryImage}
                      alt={`${art.title} by ${art.artistName}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col space-y-1">
                      <span className="bg-[#1A1A1A]/90 backdrop-blur-md border border-[#C6A664]/40 px-2.5 py-1 text-[9px] tracking-[0.2em] text-[#C6A664] uppercase font-semibold rounded-sm shadow-md">
                        {art.isAvailable ? art.editionInfo : 'Acquired'}
                      </span>
                    </div>

                    {/* Quick Action Overlay Buttons (Top Right) */}
                    <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(index);
                        }}
                        className="p-2 rounded-full bg-[#1A1A1A]/80 text-[#F5F0E6] hover:bg-[#C6A664] hover:text-[#1A1A1A] border border-[#C6A664]/40 backdrop-blur-md shadow-md transition-all active:scale-95"
                        title="Quick Zoom Lightbox"
                        aria-label="Quick Zoom"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(art.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all active:scale-95 ${
                          isSaved
                            ? 'bg-[#C6A664] text-[#1A1A1A]'
                            : 'bg-[#1A1A1A]/80 text-[#F5F0E6] hover:bg-[#C6A664] hover:text-[#1A1A1A] border border-[#C6A664]/40'
                        }`}
                        title={isSaved ? 'Remove from Saved' : 'Save to Collection'}
                        aria-label="Wishlist"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Desktop Hover Overlay (Soft Dark Blur with Details & View Cue) */}
                    <div className="absolute inset-0 bg-[#1A1A1A]/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 hidden md:flex flex-col justify-between pointer-events-none">
                      <div>
                        <span className="text-[10px] tracking-[0.25em] text-[#C6A664] uppercase font-semibold block mb-1">
                          {art.artistName} · {art.year}
                        </span>
                        <h3 className="font-serif text-2xl text-[#F5F0E6] leading-snug font-normal mb-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-[#A09D96] font-light mb-1">
                          {art.medium}
                        </p>
                        <p className="text-[11px] text-[#807D77]">
                          {art.dimensions}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#C6A664]/30 flex items-center justify-between">
                        <span className="font-serif text-lg text-[#F5F0E6] font-semibold">
                          {formatPrice(art.priceUSD, activeCurrency)}
                        </span>

                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#C6A664] text-[#1A1A1A] text-[10px] tracking-[0.2em] uppercase font-bold rounded-sm shadow-md">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Artwork</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Meta Content (Clean, Spacious & Responsive) */}
                  <div
                    className="p-4 md:hidden border-t border-[#C6A664]/15 bg-[#222222] cursor-pointer"
                    onClick={() => onSelectArtwork(art)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] tracking-[0.2em] text-[#C6A664] uppercase font-semibold">
                        {art.artistName} · {art.year}
                      </span>
                      <span className="text-xs font-serif font-bold text-[#F5F0E6]">
                        {formatPrice(art.priceUSD, activeCurrency)}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-[#F5F0E6] font-normal leading-snug mb-1">
                      {art.title}
                    </h3>

                    <p className="text-[11px] text-[#A09D96] font-light truncate mb-3">
                      {art.medium} · {art.dimensions}
                    </p>

                    <div className="flex items-center space-x-2 pt-2.5 border-t border-[#C6A664]/15">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArtwork(art);
                        }}
                        className="flex-1 py-2.5 bg-[#C6A664] text-[#1A1A1A] text-[10px] tracking-[0.2em] uppercase font-bold rounded-sm text-center shadow-md active:scale-95 transition-all"
                      >
                        View Artwork
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(index);
                        }}
                        className="p-2.5 border border-[#C6A664]/40 text-[#C6A664] rounded-sm hover:bg-[#C6A664] hover:text-[#1A1A1A] active:scale-95 transition-all"
                        title="Quick Zoom Lightbox"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {openRoomPreview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRoomPreview(art);
                          }}
                          className="p-2.5 border border-[#C6A664]/40 text-[#C6A664] rounded-sm hover:bg-[#C6A664] hover:text-[#1A1A1A] active:scale-95 transition-all"
                          title="View in 3D Gallery Room"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-[#222222] border border-[#C6A664]/30 rounded-sm p-8 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl text-[#F5F0E6] mb-2">No Artworks Found</h3>
            <p className="text-xs text-[#A09D96] font-light mb-6">
              No gallery pieces match your active filter or search query. Try clearing filters to view the full collection.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#C6A664] text-[#1A1A1A] text-xs uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#d4b574] transition-colors"
            >
              Reset Gallery Filter
            </button>
          </div>
        )}

      </div>

      {/* FULLSCREEN LIGHTBOX / DETAIL VIEW */}
      <AnimatePresence>
        {currentLightboxArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-xl flex flex-col h-[100dvh] w-screen overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            {/* Top Exit Control Bar */}
            <div className="w-full bg-[#151515]/95 border-b border-[#C6A664]/30 px-4 sm:px-8 py-3 flex items-center justify-between z-30 shrink-0 shadow-lg">
              <div className="flex items-center space-x-2.5 truncate max-w-[65%]">
                <span className="w-2 h-2 rounded-full bg-[#C6A664] animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#C6A664] uppercase font-semibold truncate">
                  {currentLightboxArtwork.title}
                </span>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-[11px] text-[#A09D96] tracking-widest uppercase font-medium">
                  {(lightboxIndex ?? 0) + 1} / {filteredArtworks.length}
                </span>

                <button
                  onClick={closeLightbox}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C6A664] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#d4b574] active:scale-95 transition-all shadow-md"
                  title="Close Lightbox (Esc)"
                  aria-label="Close Lightbox"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Exit View</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              </div>
            </div>

            {/* Main Center Area: Image & Details */}
            <div className="flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start lg:justify-center">
              {/* Previous Arrow Button (Desktop/Tablet) */}
              <button
                onClick={handlePrevArtwork}
                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#242424]/90 text-[#F5F0E6] hover:bg-[#C6A664] hover:text-[#1A1A1A] border border-[#C6A664]/40 transition-all z-20 shadow-xl active:scale-95"
                title="Previous Artwork (Left Arrow)"
                aria-label="Previous Artwork"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Arrow Button (Desktop/Tablet) */}
              <button
                onClick={handleNextArtwork}
                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-[#242424]/90 text-[#F5F0E6] hover:bg-[#C6A664] hover:text-[#1A1A1A] border border-[#C6A664]/40 transition-all z-20 shadow-xl active:scale-95"
                title="Next Artwork (Right Arrow)"
                aria-label="Next Artwork"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Content Grid */}
              <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto">
                
                {/* Artwork Image Container with Touch Swipe Handlers */}
                <div
                  className="lg:col-span-7 flex items-center justify-center relative min-h-[220px] sm:min-h-[380px] lg:min-h-[480px] touch-pan-y"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <motion.img
                    key={currentLightboxArtwork.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    src={currentLightboxArtwork.primaryImage}
                    alt={currentLightboxArtwork.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[38vh] sm:max-h-[52vh] lg:max-h-[68vh] w-auto max-w-full object-contain rounded-sm shadow-2xl border border-[#C6A664]/30 select-none"
                  />
                </div>

                {/* Artwork Detail Specifications */}
                <div className="lg:col-span-5 bg-[#222222] border border-[#C6A664]/30 p-5 sm:p-7 rounded-sm text-left font-sans flex flex-col justify-between space-y-5 shadow-2xl">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-[0.25em] text-[#C6A664] uppercase font-semibold">
                        {currentLightboxArtwork.artistName} · {currentLightboxArtwork.year}
                      </span>
                      <span className="text-[10px] tracking-widest text-[#C6A664] uppercase border border-[#C6A664]/40 px-2 py-0.5 rounded-sm">
                        {currentLightboxArtwork.isAvailable ? currentLightboxArtwork.editionInfo : 'Acquired'}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F5F0E6] font-normal leading-tight mb-2">
                      {currentLightboxArtwork.title}
                    </h2>

                    <p className="text-xs text-[#A09D96] font-light mb-1">
                      {currentLightboxArtwork.medium}
                    </p>
                    <p className="text-xs text-[#807D77] font-light mb-3">
                      Dimensions: {currentLightboxArtwork.dimensions}
                    </p>

                    <div className="py-2.5 border-y border-[#C6A664]/20 flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[9px] text-[#807D77] uppercase tracking-wider block">Acquisition Value</span>
                        <span className="font-serif text-xl sm:text-2xl text-[#F5F0E6] font-semibold">
                          {formatPrice(currentLightboxArtwork.priceUSD, activeCurrency)}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#C6A664] uppercase font-medium tracking-wider">
                        Certificate Included
                      </span>
                    </div>

                    <p className="text-xs text-[#C8C5BE] font-light leading-relaxed mb-4 line-clamp-3 sm:line-clamp-4">
                      {currentLightboxArtwork.story}
                    </p>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="space-y-2.5 pt-1">
                    
                    {/* "DM pour commander / 3yet lina" Prominent Antique-Gold Button */}
                    <a
                      href={getWhatsAppLink(currentLightboxArtwork)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 sm:py-4 bg-[#C6A664] hover:bg-[#d4b574] text-[#1A1A1A] text-xs uppercase tracking-[0.22em] font-bold transition-all rounded-sm flex items-center justify-center space-x-2 shadow-xl active:scale-95 text-center"
                    >
                      <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                      <span>DM pour commander / 3yet lina</span>
                    </a>

                    {/* Secondary Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      {openRoomPreview && (
                        <button
                          onClick={() => {
                            closeLightbox();
                            openRoomPreview(currentLightboxArtwork);
                          }}
                          className="py-2.5 px-2 border border-[#C6A664]/40 hover:border-[#C6A664] text-[#F5F0E6] text-[10px] tracking-widest uppercase font-medium rounded-sm flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#C6A664]" />
                          <span>3D Room Scale</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleWishlist(currentLightboxArtwork.id)}
                        className={`py-2.5 px-2 border text-[10px] tracking-widest uppercase font-medium rounded-sm flex items-center justify-center space-x-1.5 transition-colors active:scale-95 ${
                          wishlistIds.includes(currentLightboxArtwork.id)
                            ? 'bg-[#C6A664]/20 border-[#C6A664] text-[#C6A664]'
                            : 'border-[#C6A664]/40 text-[#F5F0E6]'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{wishlistIds.includes(currentLightboxArtwork.id) ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        closeLightbox();
                        onSelectArtwork(currentLightboxArtwork);
                      }}
                      className="w-full text-center text-[10px] tracking-[0.2em] text-[#807D77] hover:text-[#C6A664] uppercase pt-1 transition-colors"
                    >
                      View Full Museum Archival Record →
                    </button>

                  </div>

                </div>

              </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="w-full bg-[#151515] border-t border-[#C6A664]/20 px-4 py-2.5 flex md:hidden items-center justify-between shrink-0 shadow-lg">
              <button
                onClick={handlePrevArtwork}
                className="flex items-center space-x-1.5 text-xs text-[#C6A664] uppercase tracking-wider font-semibold py-1 px-2.5 bg-[#222222] border border-[#C6A664]/30 rounded-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Work</span>
              </button>

              <span className="text-[11px] text-[#A09D96] font-medium">
                {(lightboxIndex ?? 0) + 1} / {filteredArtworks.length}
              </span>

              <button
                onClick={handleNextArtwork}
                className="flex items-center space-x-1.5 text-xs text-[#C6A664] uppercase tracking-wider font-semibold py-1 px-2.5 bg-[#222222] border border-[#C6A664]/30 rounded-sm active:scale-95"
              >
                <span>Next Work</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
