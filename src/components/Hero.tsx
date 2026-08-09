import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles, Layers } from 'lucide-react';
import { ARTWORKS } from '../data/artworks';
import { Artwork, Currency, PageView } from '../types';
import { formatPrice } from '../utils/currency';

interface HeroProps {
  onSelectArtwork: (artwork: Artwork) => void;
  setCurrentPage: (page: PageView) => void;
  activeCurrency: Currency;
  openPrivateViewing: () => void;
  openRoomPreview?: (artwork: Artwork) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectArtwork,
  setCurrentPage,
  activeCurrency,
  openPrivateViewing,
  openRoomPreview,
}) => {
  const featuredArtworks = ARTWORKS.filter((art) => art.isFeatured);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const SLIDE_DURATION = 2000; // 2 seconds auto-slide duration

  // Check prefers-reduced-motion for accessibility
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    setProgress(0);
    const stepTime = 100;
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (SLIDE_DURATION / stepTime)), 100));
    }, stepTime);

    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArtworks.length);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(slideTimer);
      clearInterval(progressInterval);
    };
  }, [currentSlide, featuredArtworks.length, isPaused, prefersReducedMotion]);

  const activeArt = featuredArtworks[currentSlide] || ARTWORKS[0];

  const handleNext = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev + 1) % featuredArtworks.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentSlide((prev) => (prev - 1 + featuredArtworks.length) % featuredArtworks.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section 
      className="relative w-full bg-[#1C1B19] text-white border-b border-[#B08D57]/30 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Clean Museum Background - Pure Dark Gallery Architecture (No stretched or blurred background images) */}
      <div className="absolute inset-0 bg-[#161514] pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(176,141,87,0.12)_0%,rgba(22,21,20,1)_70%)]" />
      </div>

      {/* Split Gallery Wall Layout (Fully Responsive for Mobile & Desktop) */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-[580px] lg:h-[85vh] lg:max-h-[920px]">
        
        {/* ========================================================= */}
        {/* LEFT / MAIN ZONE: ARTWORK DISPLAY PANEL                   */}
        {/* ========================================================= */}
        <div className="relative w-full lg:w-[66%] overflow-hidden flex items-center justify-center p-3 sm:p-6 lg:p-10 h-[48vh] min-h-[300px] sm:h-[55vh] lg:h-auto lg:max-h-none group/canvas bg-[#0E0D0C]/90">
          
          {/* Subtle Gallery Lighting Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(176,141,87,0.12)_0%,rgba(14,13,12,0)_80%)] pointer-events-none" />

          {/* Museum Frame & Matting Structure */}
          <div className="relative w-full h-full max-w-4xl max-h-[720px] flex items-center justify-center">
            
            {/* Outer Faint Gold Frame Line */}
            <div className="absolute -inset-2 sm:-inset-3 border border-[#B08D57]/30 pointer-events-none rounded-xs shadow-2xl" />

            {/* Inner Gallery Canvas Box - Pure Original Artwork Presentation */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xs border border-[#B08D57]/40 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] bg-[#0A0A09]">
              
              {featuredArtworks.map((art, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div
                    key={art.id}
                    className={`absolute inset-0 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    {/* Pure, unedited original photograph of the painting - 100% proportional fit */}
                    <img
                      src={art.primaryImage}
                      alt={art.title}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                    />
                  </div>
                );
              })}

              {/* Minimal Hover Overlay - Click to Inspect Artwork */}
              <button
                onClick={() => onSelectArtwork(activeArt)}
                className="absolute inset-0 bg-black/0 hover:bg-black/15 transition-all duration-300 flex items-center justify-center group z-20 cursor-pointer"
                aria-label={`View ${activeArt.title}`}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-5 py-2.5 bg-[#1C1B19]/95 border border-[#B08D57] text-[#B08D57] text-xs uppercase tracking-[0.25em] font-medium backdrop-blur-md shadow-2xl flex items-center space-x-2">
                  <span>Inspect Masterwork</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B08D57]" />
                </span>
              </button>

            </div>

          </div>

          {/* Navigation Arrows (Visible on Desktop hover & Mobile tap) */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 text-[#B08D57] hover:text-white bg-[#1C1B19]/80 sm:bg-[#1C1B19]/90 border border-[#B08D57]/50 hover:border-[#B08D57] backdrop-blur-md transition-all duration-300 rounded-full shadow-2xl flex opacity-90 sm:opacity-0 sm:group-hover/canvas:opacity-100 items-center justify-center active:scale-95"
            aria-label="Previous Artwork"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 text-[#B08D57] hover:text-white bg-[#1C1B19]/80 sm:bg-[#1C1B19]/90 border border-[#B08D57]/50 hover:border-[#B08D57] backdrop-blur-md transition-all duration-300 rounded-full shadow-2xl flex opacity-90 sm:opacity-0 sm:group-hover/canvas:opacity-100 items-center justify-center active:scale-95"
            aria-label="Next Artwork"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Mobile Swipe Hint */}
          <div className="absolute top-3 right-3 z-30 sm:hidden px-2.5 py-1 bg-[#1C1B19]/80 border border-[#B08D57]/30 rounded text-[9px] uppercase tracking-widest text-[#B08D57]">
            Swipe ↔
          </div>

          {/* Signature Progress Bar at bottom of artwork panel */}
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 z-30">
            <div 
              className="h-full bg-[#B08D57] transition-all duration-100 ease-linear shadow-[0_0_10px_#B08D57]"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* ========================================================= */}
        {/* VERTICAL / HORIZONTAL SIGNATURE HAIRLINE GOLD DIVIDER     */}
        {/* ========================================================= */}
        <div className="w-full h-[1px] lg:w-[1px] lg:h-auto bg-gradient-to-r lg:bg-gradient-to-b from-[#B08D57]/20 via-[#B08D57] to-[#B08D57]/20 shrink-0 z-20" />

        {/* ========================================================= */}
        {/* RIGHT ZONE (~34% on Desktop): FROSTED MUSEUM WALL LABEL PANEL */}
        {/* Text is cleanly isolated in its own dedicated space      */}
        {/* ========================================================= */}
        <div className="relative w-full lg:w-[34%] bg-[#1C1B19]/90 backdrop-blur-md p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10 border-l border-[#B08D57]/20">
          
          {/* Tactile Texture Grain Layer (Low Opacity Micro-Pattern) */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' h='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* TOP SECTION: Gallery Catalog Number & Status */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#B08D57]/25 pb-4 mb-4">
            
            {/* Catalog Number e.g. "N°01 / 05" */}
            <div className="font-serif-display text-xs sm:text-sm tracking-[0.3em] text-[#B08D57] uppercase font-light">
              N°{String(currentSlide + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(featuredArtworks.length).padStart(2, '0')}
            </div>

            {/* Play/Pause Control Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase text-[#A3A09A] hover:text-[#B08D57] transition-colors px-2 py-1 bg-white/5 rounded border border-[#B08D57]/20"
              title={isPaused ? 'Resume Auto-Slide' : 'Pause Auto-Slide'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 text-[#B08D57]" />
                  <span>Paused</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-[#B08D57]" />
                  <span>Slideshow Live</span>
                </>
              )}
            </button>

          </div>

          {/* MIDDLE SECTION: Museum Wall Label Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center space-y-5 py-2">
            
            {/* Gallery Eyebrow */}
            <div className="inline-flex items-center space-x-2 text-[#B08D57] text-[10px] sm:text-xs tracking-[0.35em] uppercase font-sans-clean font-semibold">
              <Sparkles className="w-3 h-3 text-[#B08D57]" />
              <span>Current Exhibition Highlight</span>
            </div>

            {/* Animated Title & Details Panel (Quick fade/slide effect) */}
            <div 
              key={activeArt.id}
              className="animate-fadeIn transition-all duration-500 ease-out space-y-3.5"
            >
              
              {/* Artist Name */}
              <p className="text-xs uppercase tracking-[0.3em] text-[#B08D57] font-semibold">
                {activeArt.artistName}
              </p>

              {/* Artwork Title with tracking-tighten effect */}
              <h2 
                onClick={() => onSelectArtwork(activeArt)}
                className="font-serif-display text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-white font-normal leading-[1.18] tracking-[0.02em] hover:text-[#B08D57] cursor-pointer transition-colors"
              >
                {activeArt.title}
              </h2>

              {/* Thin Hairline Accent */}
              <div className="w-12 h-[1px] bg-[#B08D57]/60 my-2" />

              {/* Medium & Dimensions */}
              <div className="space-y-1 text-xs text-[#C8C5BF] font-sans-clean leading-relaxed">
                <p className="font-medium text-[#E8E6E1]">{activeArt.medium}</p>
                <p className="text-[11px] text-[#A3A09A] tracking-wider">{activeArt.dimensions} &nbsp;·&nbsp; {activeArt.year}</p>
              </div>

              {/* Edition & Price Box */}
              <div className="pt-3 flex items-baseline justify-between border-t border-[#B08D57]/20">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A3A09A] block">
                    Provenance
                  </span>
                  <span className="text-xs text-[#E8E6E1] font-medium">
                    {activeArt.editionInfo}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A3A09A] block">
                    Acquisition Price
                  </span>
                  <span className="font-serif-display text-lg sm:text-xl text-[#B08D57] font-semibold">
                    {formatPrice(activeArt.priceUSD, activeCurrency)}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM SECTION: Thumbnail Carousel Selector & Actions */}
          <div className="relative z-10 pt-4 border-t border-[#B08D57]/20 space-y-4">
            
            {/* Exhibition Artworks Thumbnail Selector */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8983] block font-medium">
                Exhibition Masterworks ({featuredArtworks.length})
              </span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {featuredArtworks.map((art, idx) => {
                  const isSelected = idx === currentSlide;
                  return (
                    <button
                      key={`thumb-${art.id}`}
                      onClick={() => {
                        setProgress(0);
                        setCurrentSlide(idx);
                      }}
                      className={`relative shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'border-[#B08D57] scale-105 shadow-[0_0_12px_rgba(176,141,87,0.5)]' 
                          : 'border-white/20 opacity-60 hover:opacity-100 hover:border-[#B08D57]/60'
                      }`}
                      title={art.title}
                    >
                      <img 
                        src={art.primaryImage} 
                        alt={art.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-0.5 bg-[#0D0C0B]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions: View Masterwork, View in 3D, & Enquire */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                onClick={() => onSelectArtwork(activeArt)}
                className="group relative inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-white hover:text-[#B08D57] transition-colors py-1 cursor-pointer"
              >
                <span className="font-medium">Inspect Work</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B08D57] group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              {openRoomPreview && (
                <button
                  onClick={() => openRoomPreview(activeArt)}
                  className="px-3 py-1.5 bg-[#B08D57]/20 border border-[#B08D57]/60 hover:bg-[#B08D57] hover:text-[#1C1B19] text-[#B08D57] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all rounded-sm flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D Room Scale View</span>
                </button>
              )}

              <button
                onClick={openPrivateViewing}
                className="text-[11px] uppercase tracking-[0.2em] text-[#A3A09A] hover:text-white transition-colors cursor-pointer border-b border-[#A3A09A]/40 hover:border-white pb-0.5 text-right sm:text-left"
              >
                Enquire
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
