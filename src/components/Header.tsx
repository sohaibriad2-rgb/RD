import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bookmark, Menu, X, Layers, ArrowRight, MessageSquare, Compass, Palette, Info, Home } from 'lucide-react';
import { Currency, PageView, Artwork } from '../types';
import { formatPrice } from '../utils/currency';
import { ARTWORKS } from '../data/artworks';
import { Logo } from './Logo';

interface HeaderProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  openCart: () => void;
  openWishlist: () => void;
  activeCurrency: Currency;
  setActiveCurrency: (currency: Currency) => void;
  onSelectArtwork: (artwork: Artwork) => void;
  openRoomPreview?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  wishlistCount,
  openCart,
  openWishlist,
  activeCurrency,
  onSelectArtwork,
  openRoomPreview
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when Mobile Menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle Escape Key to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? ARTWORKS.filter(art => 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.medium.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Gallery Announcement Strip */}
      <div 
        onClick={() => openRoomPreview?.()}
        className="bg-[#151413] text-[#C5A059] text-[10px] sm:text-[11px] tracking-[0.22em] uppercase py-2 px-3 sm:px-4 text-center border-b border-[#C5A059]/30 font-medium cursor-pointer hover:bg-[#1C1B19] transition-colors flex items-center justify-center space-x-2 group select-none"
      >
        <Layers className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform shrink-0" />
        <span className="truncate">Experience Works in 3D Virtual Gallery Room — Interactive Preview</span>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#C5A059]/30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
          
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-[#151413] hover:text-[#C5A059] active:scale-95 transition-all rounded-sm -ml-1"
            aria-label="Open navigation menu"
            title="Open Menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Gallery Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center justify-center p-1"
          >
            <Logo variant="full" size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase text-[#151413] font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`gold-underline-link py-1 transition-colors ${
                currentPage === 'home' ? 'text-[#C5A059]' : 'hover:text-[#C5A059]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className={`gold-underline-link py-1 transition-colors ${
                currentPage === 'gallery' || currentPage === 'artwork_detail' ? 'text-[#C5A059]' : 'hover:text-[#C5A059]'
              }`}
            >
              Gallery & Collection
            </button>
            <button
              onClick={() => handleNavClick('artists')}
              className={`gold-underline-link py-1 transition-colors ${
                currentPage === 'artists' ? 'text-[#C5A059]' : 'hover:text-[#C5A059]'
              }`}
            >
              Artists
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`gold-underline-link py-1 transition-colors ${
                currentPage === 'about' ? 'text-[#C5A059]' : 'hover:text-[#C5A059]'
              }`}
            >
              The Gallery
            </button>
            <button
              onClick={() => {
                if (openRoomPreview) {
                  openRoomPreview();
                } else {
                  handleNavClick('gallery');
                }
              }}
              className="px-3.5 py-1.5 bg-[#151413] text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-[#151413] transition-all rounded-sm flex items-center space-x-1.5 font-semibold text-[11px] shadow-sm active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Room View</span>
            </button>
          </nav>

          {/* Right Utilities: Search, Wishlist */}
          <div className="flex items-center space-x-1 sm:space-x-4 text-[#151413]">
            
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-[#151413] hover:text-[#C5A059] active:scale-95 transition-all"
              title="Search Artworks"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-[#151413] hover:text-[#C5A059] active:scale-95 transition-all"
              title="Saved Artworks"
              aria-label="Saved Artworks"
            >
              <Bookmark className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C5A059] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search Bar Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FAF8F5] border-b border-[#C5A059]/30 py-4 px-4 sm:px-8 overflow-hidden shadow-inner"
            >
              <div className="max-w-3xl mx-auto relative">
                <div className="flex items-center border-b border-[#C5A059] pb-2">
                  <Search className="w-5 h-5 text-[#C5A059] mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, artist, medium..."
                    className="w-full bg-transparent text-[#151413] placeholder-[#8C8983] text-sm focus:outline-none font-sans-clean"
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-[#8C8983] hover:text-[#C5A059] p-1.5 active:scale-95 transition-transform shrink-0"
                    aria-label="Close Search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Instant Search Results */}
                {searchQuery.trim() !== '' && (
                  <div className="mt-3 bg-white border border-[#C5A059]/30 max-h-80 overflow-y-auto p-2 sm:p-3 shadow-xl rounded-sm">
                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => {
                              onSelectArtwork(art);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center space-x-3 p-2 hover:bg-[#FAF8F5] cursor-pointer transition-colors border-b border-[#C5A059]/10 last:border-0 rounded-sm"
                          >
                            <img
                              src={art.primaryImage}
                              alt={art.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-contain p-0.5 bg-[#11100F] rounded-sm border border-[#C5A059]/30 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif-display text-sm sm:text-base text-[#151413] truncate">{art.title}</h4>
                              <p className="text-[11px] text-[#C5A059] truncate">{art.artistName} · {art.medium}</p>
                            </div>
                            <div className="text-xs font-serif-display text-[#151413] font-semibold shrink-0">
                              {formatPrice(art.priceUSD, activeCurrency)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-[#8C8983] tracking-widest uppercase">
                        No artworks found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Fullscreen Mobile Luxury Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-[#11100F]/85 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[88vw] max-w-sm h-[100dvh] bg-[#151413] text-[#E8E6E1] border-r border-[#C5A059]/40 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Top Header (Shrink 0) */}
              <div className="p-4 sm:p-6 bg-[#11100F] border-b border-[#C5A059]/30 flex items-center justify-between shrink-0">
                <div 
                  onClick={() => handleNavClick('home')}
                  className="cursor-pointer inline-block"
                >
                  <Logo variant="full" size="md" />
                </div>
                
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 text-[#E8E6E1] hover:text-[#C5A059] bg-[#1C1B19] border border-[#C5A059]/30 rounded-sm transition-colors active:scale-95"
                  aria-label="Close navigation menu"
                  title="Close Menu"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Navigation Links List (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 font-sans-clean">
                <div className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-semibold mb-3 pb-2 border-b border-[#C5A059]/20">
                  Navigation Menu
                </div>

                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full py-3 px-3.5 rounded-sm flex items-center justify-between text-left transition-all ${
                    currentPage === 'home'
                      ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 font-bold'
                      : 'hover:bg-[#1C1B19] text-[#E8E6E1] hover:text-[#C5A059]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Home className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif-display text-lg tracking-wider">01. Home</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('gallery')}
                  className={`w-full py-3 px-3.5 rounded-sm flex items-center justify-between text-left transition-all ${
                    currentPage === 'gallery' || currentPage === 'artwork_detail'
                      ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 font-bold'
                      : 'hover:bg-[#1C1B19] text-[#E8E6E1] hover:text-[#C5A059]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Compass className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif-display text-lg tracking-wider">02. Gallery & Collection</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('artists')}
                  className={`w-full py-3 px-3.5 rounded-sm flex items-center justify-between text-left transition-all ${
                    currentPage === 'artists'
                      ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 font-bold'
                      : 'hover:bg-[#1C1B19] text-[#E8E6E1] hover:text-[#C5A059]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Palette className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif-display text-lg tracking-wider">03. Master Artists</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('about')}
                  className={`w-full py-3 px-3.5 rounded-sm flex items-center justify-between text-left transition-all ${
                    currentPage === 'about'
                      ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 font-bold'
                      : 'hover:bg-[#1C1B19] text-[#E8E6E1] hover:text-[#C5A059]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Info className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif-display text-lg tracking-wider">04. The Gallery Story</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60" />
                </button>

                {/* Interactive 3D Room Highlight */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openRoomPreview?.();
                    }}
                    className="w-full p-3.5 bg-[#1C1B19] border border-[#C5A059]/50 hover:border-[#C5A059] text-[#C5A059] rounded-sm flex items-center justify-between transition-all active:scale-95 shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-[#C5A059]/20 rounded-sm">
                        <Layers className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <div className="text-left">
                        <span className="font-serif-display text-base block font-semibold text-[#E8E6E1]">3D Virtual Gallery</span>
                        <span className="text-[10px] text-[#A09D96] block uppercase tracking-wider">Interactive 360° Scale View</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Actions & Gallery Contact (Shrink 0) */}
              <div className="p-4 sm:p-6 bg-[#11100F] border-t border-[#C5A059]/30 space-y-3 shrink-0 font-sans-clean">
                <a
                  href="https://wa.me/212636260361?text=Bonjour%20Riad%20Fine%20Art%2C%20je%20souhaite%20me%20renseigner%20sur%20vos%20oeuvres."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#d4b574] text-[#151413] text-xs uppercase tracking-[0.22em] font-bold transition-all rounded-sm flex items-center justify-center space-x-2 shadow-lg active:scale-95 text-center"
                >
                  <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                  <span>DM pour commander / 3yet lina</span>
                </a>

                <div className="text-center pt-1">
                  <p className="text-[9px] tracking-[0.25em] text-[#8C8983] uppercase">
                    Casablanca &nbsp;·&nbsp; Agadir
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

