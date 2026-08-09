import React, { useState } from 'react';
import { Bookmark, Eye, ArrowRight, Filter, Layers } from 'lucide-react';
import { ARTWORKS } from '../data/artworks';
import { Artwork, Currency, PageView } from '../types';
import { formatPrice } from '../utils/currency';

interface FeaturedCollectionProps {
  onSelectArtwork: (artwork: Artwork) => void;
  setCurrentPage: (page: PageView) => void;
  wishlistIds: string[];
  toggleWishlist: (artworkId: string) => void;
  activeCurrency: Currency;
  openQuickView: (artwork: Artwork) => void;
  openRoomPreview?: (artwork: Artwork) => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  onSelectArtwork,
  setCurrentPage,
  wishlistIds,
  toggleWishlist,
  activeCurrency,
  openQuickView,
  openRoomPreview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Oil Canvas', 'Mineral Relief', 'Limited Edition', 'Bronze & Relief'];

  const filteredArtworks = ARTWORKS.filter((art) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Oil Canvas') return art.medium.toLowerCase().includes('oil');
    if (selectedCategory === 'Mineral Relief') return art.medium.toLowerCase().includes('mineral') || art.medium.toLowerCase().includes('relief');
    if (selectedCategory === 'Limited Edition') return art.editionInfo.toLowerCase().includes('edition');
    if (selectedCategory === 'Bronze & Relief') return art.medium.toLowerCase().includes('bronze') || art.medium.toLowerCase().includes('sculpture');
    return true;
  });

  const displayedWorks = filteredArtworks.slice(0, 6);

  return (
    <section className="py-20 bg-white relative border-b border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 border-b border-[#C5A059]/20 pb-8">
          <div>
            <span className="text-[#C5A059] text-xs tracking-[0.35em] uppercase font-sans-clean block mb-3 font-semibold">
              Curated Masterpieces
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#151413] tracking-[0.05em] font-normal">
              Featured Gallery Collection
            </h2>
          </div>
          <p className="text-[#5A5650] text-xs sm:text-sm font-normal max-w-md mt-4 lg:mt-0 leading-relaxed font-sans-clean">
            Hand-selected original canvases, mineral pigment reliefs, and limited-edition prints available for private acquisition.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-6 mb-10 scrollbar-none">
          <Filter className="w-4 h-4 text-[#C5A059] shrink-0 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all rounded-sm shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#151413] text-white shadow-md'
                  : 'bg-[#FAF8F5] text-[#5A5650] border border-[#C5A059]/30 hover:border-[#C5A059] hover:text-[#151413]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {displayedWorks.map((art, index) => {
            const isSaved = wishlistIds.includes(art.id);
            const isTall = index % 3 === 0;

            return (
              <div
                key={art.id}
                className="group flex flex-col justify-between bg-[#FAF8F5] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all duration-500 rounded-sm overflow-hidden p-4 shadow-sm hover:shadow-md"
              >
                {/* Artwork Image Container */}
                <div className="relative overflow-hidden cursor-pointer bg-white mb-5 rounded-sm">
                  <div className={`w-full ${isTall ? 'aspect-[3/4]' : 'aspect-square'} overflow-hidden relative`}>
                    <img
                      src={art.primaryImage}
                      alt={art.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
                      onClick={() => onSelectArtwork(art)}
                    />

                    {/* Overlay Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(art.id);
                        }}
                        className={`p-2.5 rounded-full transition-all duration-300 backdrop-blur-md shadow-sm ${
                          isSaved
                            ? 'bg-[#C5A059] text-white'
                            : 'bg-white/90 text-[#151413] hover:bg-[#C5A059] hover:text-white border border-[#C5A059]/30'
                        }`}
                        title={isSaved ? 'Saved in Collection' : 'Save to Collection'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickView(art);
                        }}
                        className="p-2.5 rounded-full bg-white/90 text-[#151413] hover:bg-[#C5A059] hover:text-white border border-[#C5A059]/30 transition-all duration-300 backdrop-blur-md shadow-sm"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {openRoomPreview && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRoomPreview(art);
                          }}
                          className="p-2.5 rounded-full bg-[#151413] text-[#C5A059] hover:bg-[#C5A059] hover:text-white border border-[#C5A059]/30 transition-all duration-300 backdrop-blur-md shadow-sm"
                          title="View in 3D Gallery Room"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Edition Tag */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-[#C5A059]/30 px-2.5 py-1 text-[10px] tracking-[0.15em] text-[#C5A059] uppercase font-sans-clean font-semibold shadow-xs">
                      {art.editionInfo}
                    </div>
                  </div>
                </div>

                {/* Artwork Information */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase block mb-1 font-sans-clean font-semibold">
                      {art.artistName}
                    </span>
                    <h3 
                      onClick={() => onSelectArtwork(art)}
                      className="font-serif-display text-xl text-[#151413] group-hover:text-[#C5A059] transition-colors cursor-pointer mb-2 leading-snug font-medium"
                    >
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#5A5650] font-normal mb-3 font-sans-clean">
                      {art.medium} · {art.dimensions}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#C5A059]/20">
                    <span className="font-serif-display text-lg text-[#151413] font-semibold">
                      {formatPrice(art.priceUSD, activeCurrency)}
                    </span>
                    <button
                      onClick={() => onSelectArtwork(art)}
                      className="text-xs tracking-[0.2em] text-[#C5A059] font-semibold uppercase hover:text-[#151413] transition-colors flex items-center space-x-1 group/btn"
                    >
                      <span>Acquire</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* View Full Gallery Link */}
        <div className="mt-16 text-center">
          <button
            onClick={() => {
              setCurrentPage('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-3 px-10 py-4 border border-[#151413] text-[#151413] hover:bg-[#151413] hover:text-white text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 rounded-sm shadow-sm"
          >
            <span>View All Works in Gallery ({ARTWORKS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
