import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowRight, Sparkles, Filter, ExternalLink, Award, ShieldCheck } from 'lucide-react';
import { ARTISTS } from '../data/artists';
import { ARTWORKS } from '../data/artworks';
import { Artwork, Currency, PageView } from '../types';
import { formatPrice } from '../utils/currency';

interface ArtistsPageProps {
  onSelectArtwork: (artwork: Artwork) => void;
  setCurrentPage: (page: PageView) => void;
  activeCurrency: Currency;
  openEnquiryModal: (artwork: Artwork) => void;
}

export const ArtistsPage: React.FC<ArtistsPageProps> = ({
  onSelectArtwork,
  setCurrentPage,
  activeCurrency,
  openEnquiryModal,
}) => {
  const masterArtist = ARTISTS[0]; // Aziz Riad
  const worksSectionRef = useRef<HTMLDivElement>(null);
  const [selectedMediumFilter, setSelectedMediumFilter] = useState<string>('all');

  // Filter artworks by Aziz Riad
  const masterWorks = ARTWORKS.filter(
    (art) => art.artistId === masterArtist.id || art.artistName === 'Aziz Riad'
  );

  const filteredWorks = selectedMediumFilter === 'all'
    ? masterWorks
    : masterWorks.filter((art) => art.medium.toLowerCase().includes(selectedMediumFilter.toLowerCase()));

  const scrollToWorks = () => {
    if (worksSectionRef.current) {
      worksSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const timelineMilestones = [
    { year: '2004', label: 'Began Studio Practice in Medina' },
    { year: '2015', label: 'First Solo Retrospective Showcase' },
    { year: 'Today', label: 'Represented Exclusively by Riad Fine Art' },
  ];

  return (
    <div className="bg-[#1C1B19] min-h-screen text-[#E8E6E1] font-sans-clean selection:bg-[#B08D57] selection:text-[#1C1B19]">
      
      {/* Editorial Header Bar */}
      <div className="border-b border-[#B08D57]/20 bg-[#151413]/80 backdrop-blur-md py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#B08D57] animate-pulse" />
            <span className="text-[#B08D57] text-[10px] sm:text-xs tracking-[0.35em] uppercase font-semibold">
              Riad Fine Art · Solo Master Spotlight
            </span>
          </div>
          <div className="text-xs text-[#8C8983] font-light flex items-center space-x-2">
            <span className="font-serif-display italic text-[#B08D57]">Museum Catalog N°01</span>
            <span>·</span>
            <span>Casablanca &amp; Agadir</span>
          </div>
        </div>
      </div>

      {/* Main Container: Editorial Master Feature Section (No Image) */}
      <section className="relative overflow-hidden py-12 lg:py-20 border-b border-[#B08D57]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="border border-[#B08D57]/30 bg-[#151413] rounded-sm shadow-2xl p-8 sm:p-12 lg:p-16 art-frame-glow relative overflow-hidden space-y-10">
            
            {/* Background Subtle Gold Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#B08D57]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#B08D57]/40 pointer-events-none" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#B08D57]/40 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#B08D57]/40 pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#B08D57]/40 pointer-events-none" />

            {/* Top Catalog Eyebrow Tag */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#B08D57]/20 pb-6 relative z-10">
              <div className="flex items-center space-x-3">
                <span className="bg-[#B08D57]/10 border border-[#B08D57]/40 text-[#B08D57] px-3.5 py-1 text-[11px] font-serif-display uppercase tracking-[0.25em] rounded-sm">
                  ARTIST N°01
                </span>
                <span className="text-xs text-[#8C8983] tracking-[0.2em] uppercase font-light">
                  Exclusively Represented Master
                </span>
              </div>
              <div className="inline-flex items-center space-x-2 bg-[#B08D57]/10 border border-[#B08D57]/40 px-3.5 py-1 rounded-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
                <span className="text-[#B08D57] text-[11px] sm:text-xs tracking-[0.3em] uppercase font-semibold">
                  20+ Years of Artistic Mastery
                </span>
              </div>
            </div>

            {/* Title & Specialty Header */}
            <div className="space-y-3 relative z-10 text-center sm:text-left">
              <motion.h1 
                initial={{ opacity: 0, letterSpacing: '0.15em' }}
                animate={{ opacity: 1, letterSpacing: '0.04em' }}
                transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E8E6E1] font-normal leading-tight tracking-[0.04em]"
              >
                Aziz Riad
              </motion.h1>
              <p className="text-xs sm:text-sm tracking-[0.25em] text-[#B08D57] uppercase font-medium">
                {masterArtist.specialty}
              </p>
            </div>

            <div className="w-24 h-[1px] bg-[#B08D57]/60" />

            {/* Editorial Bio Text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-5 text-[#C2C0BA] text-sm sm:text-base lg:text-lg font-light leading-relaxed relative z-10"
            >
              <p>
                For over two decades, Aziz Riad has cultivated an unmistakable visual language at the intersection of North African architectural heritage and contemporary material abstraction. Working in solitary discipline with heavy impasto oil, 24-karat gold leaf, and hand-ground Atlas minerals, his canvases map the quiet conversations between ancient stone and shifting desert light.
              </p>
              <p className="text-xs sm:text-sm text-[#8C8983]">
                Represented exclusively by Riad Fine Art, his original works and limited editions are held in distinguished private collections across Europe, North America, and the Middle East.
              </p>
            </motion.div>

            {/* Philosophy Quote Callout Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="p-6 sm:p-8 bg-[#1C1B19] border-l-2 border-[#B08D57] text-sm sm:text-base text-[#E8E6E1] italic font-serif-display leading-relaxed shadow-inner rounded-r-sm relative z-10"
            >
              "{masterArtist.philosophy}"
            </motion.div>

            {/* Timeline Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="pt-6 border-t border-[#B08D57]/20 space-y-4 relative z-10"
            >
              <span className="text-[10px] tracking-[0.3em] text-[#B08D57] uppercase block font-semibold">
                Artistic Journey &amp; Milestones
              </span>

              <div className="relative">
                <div className="hidden sm:block absolute top-3 left-0 right-0 h-[1px] bg-[#B08D57]/30 z-0" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                  {timelineMilestones.map((item, idx) => (
                    <div key={idx} className="flex sm:flex-col items-start space-x-3 sm:space-x-0 sm:space-y-1 bg-[#1C1B19] sm:bg-transparent p-3 sm:p-0 rounded-sm sm:rounded-none border sm:border-0 border-[#B08D57]/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#B08D57] border-2 border-[#151413] shrink-0 sm:mb-1" />
                      <div>
                        <span className="font-serif-display text-xs sm:text-sm text-[#E8E6E1] font-semibold block">
                          {item.year}
                        </span>
                        <span className="text-[11px] text-[#8C8983] font-light leading-tight block">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Selected Museum Exhibitions & Provenance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#B08D57]/20 text-xs text-[#8C8983]">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#B08D57] shrink-0" />
                <span>Featured in Institut du Monde Arabe &amp; Venice Biennale</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B08D57] shrink-0" />
                <span>Stamped with Official Riad Fine Art Certificate of Authenticity</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 relative z-10"
            >
              <button
                onClick={scrollToWorks}
                className="group relative px-8 py-4 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.25em] uppercase font-semibold transition-all rounded-sm flex items-center justify-center space-x-3 hover:bg-[#CBB07E] shadow-lg hover:shadow-xl"
              >
                <span>View Available Works ({masterWorks.length})</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="https://wa.me/212636260361?text=Hello%20Riad%20Fine%20Art,%20I%20would%20like%20to%20inquire%20about%20Aziz%20Riad's%20artworks."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-[#25D366]/15 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-sm text-center flex items-center justify-center space-x-2"
              >
                <span>WhatsApp Concierge</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Available Works Portfolio Showcase Section */}
      <section ref={worksSectionRef} className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#B08D57]/20 pb-6 gap-6">
          <div>
            <span className="text-[#B08D57] text-xs tracking-[0.35em] uppercase block font-semibold mb-2">
              Master Collection · Aziz Riad
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#E8E6E1]">
              Available Masterworks ({masterWorks.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#8C8983] font-light mt-2 max-w-xl">
              Each original oil painting and limited fine art edition by Aziz Riad comes with an authenticated certificate of provenance and lifetime authenticity seal.
            </p>
          </div>

          {/* Medium Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#8C8983] flex items-center space-x-1 mr-2">
              <Filter className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>Medium:</span>
            </span>
            {[
              { id: 'all', label: 'All Works' },
              { id: 'impasto', label: 'Impasto Oil' },
              { id: 'gold', label: 'Gold Leaf' },
              { id: 'print', label: 'Limited Prints' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedMediumFilter(filter.id)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors rounded-sm ${
                  selectedMediumFilter === filter.id
                    ? 'bg-[#B08D57] text-[#1C1B19] font-semibold'
                    : 'bg-[#151413] border border-[#B08D57]/30 text-[#C2C0BA] hover:border-[#B08D57]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              className="group bg-[#151413] border border-[#B08D57]/20 hover:border-[#B08D57] p-5 rounded-sm cursor-pointer transition-all duration-500 art-frame-glow flex flex-col justify-between"
            >
              <div>
                {/* Artwork Canvas View */}
                <div className="relative w-full h-72 bg-[#11100F] border border-[#B08D57]/20 rounded-sm mb-5 p-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={art.primaryImage}
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-[#1C1B19]/90 border border-[#B08D57]/30 text-[10px] tracking-wider text-[#B08D57] px-2.5 py-1 uppercase rounded-sm backdrop-blur-sm">
                    {art.editionInfo}
                  </div>
                </div>

                {/* Title & Medium */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block font-semibold">
                    {art.year} · Aziz Riad
                  </span>
                  <h3 className="font-serif-display text-2xl text-[#E8E6E1] group-hover:text-[#B08D57] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#8C8983] font-light">
                    {art.medium}
                  </p>
                  <p className="text-[11px] text-[#6E6B65] font-light">
                    {art.dimensions}
                  </p>
                </div>
              </div>

              {/* Price & Acquisition Footer */}
              <div className="pt-4 border-t border-[#B08D57]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8C8983] uppercase tracking-wider block">Acquisition Price</span>
                  <span className="font-serif-display text-lg text-[#E8E6E1] font-semibold">
                    {formatPrice(art.priceUSD, activeCurrency)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEnquiryModal(art);
                    }}
                    className="px-3 py-2 bg-[#B08D57]/15 border border-[#B08D57]/50 text-[#B08D57] hover:bg-[#B08D57] hover:text-[#1C1B19] text-[10px] tracking-wider uppercase font-semibold transition-colors rounded-sm"
                  >
                    Enquire
                  </button>

                  <button
                    onClick={() => onSelectArtwork(art)}
                    className="p-2 bg-[#1C1B19] border border-[#B08D57]/30 text-[#E8E6E1] hover:text-[#B08D57] hover:border-[#B08D57] transition-colors rounded-sm"
                    title="View Artwork Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Editorial Banner */}
        <div className="mt-16 bg-[#151413] border border-[#B08D57]/30 p-8 sm:p-12 rounded-sm text-center art-frame-glow max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] tracking-[0.35em] text-[#B08D57] uppercase block font-semibold">
            Private Commissions &amp; Bespoke Works
          </span>
          <h3 className="font-serif-display text-2xl sm:text-4xl text-[#E8E6E1]">
            Commission an Original Masterpiece by Aziz Riad
          </h3>
          <p className="text-xs sm:text-sm text-[#C2C0BA] font-light max-w-2xl mx-auto leading-relaxed">
            Aziz Riad accepts a limited number of private architectural scale commissions each year. Contact our Casablanca concierge to discuss custom dimensions, palette preferences, or private salon appointments.
          </p>
          <div className="pt-4 flex justify-center">
            <a
              href="https://wa.me/212636260361?text=Hello%20Riad%20Fine%20Art,%20I%20would%20like%20to%20inquire%20about%20commissioning%20a%20work%20by%20Aziz%20Riad."
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 bg-[#25D366]/15 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-sm inline-flex items-center space-x-2"
            >
              <span>Inquire via WhatsApp Concierge (+212 636-260361)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </section>

    </div>
  );
};
