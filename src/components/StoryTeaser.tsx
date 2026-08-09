import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, Award } from 'lucide-react';
import { PageView } from '../types';
import fantasiaImg from '../assets/images/CLASSICLAL.jpg';
import kasbahReflectionImg from '../assets/images/high.jpg';

interface StoryTeaserProps {
  setCurrentPage: (page: PageView) => void;
  openPrivateViewing: () => void;
}

export const StoryTeaser: React.FC<StoryTeaserProps> = ({ setCurrentPage, openPrivateViewing }) => {
  return (
    <section className="py-24 bg-[#FAF9F6] border-b border-[#C5A059]/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Story Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Spread */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 shadow-lg overflow-hidden rounded-sm border border-[#C5A059]/30 bg-[#121110] p-3">
              <img
                src={fantasiaImg}
                alt="Riad Fine Art Original Masterwork"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-[450px] object-contain hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlapping Secondary Image */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-1/2 z-20 hidden sm:block shadow-xl rounded-sm overflow-hidden border border-[#C5A059]/40 bg-[#121110] p-2">
              <img
                src={kasbahReflectionImg}
                alt="Fine Art Curation Detail"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-contain"
              />
            </div>

            {/* Decorative Gold Frame Corner */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#C5A059]/50 pointer-events-none" />
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#C5A059] text-xs tracking-[0.35em] uppercase font-sans-clean block font-semibold">
              The Sanctuary & Curation Philosophy
            </span>

            <h2 className="font-serif-display text-3xl sm:text-5xl text-[#151413] leading-[1.15] font-normal">
              Where Historic Architecture Meets Contemporary Mastery
            </h2>

            <div className="w-16 h-[1px] bg-[#C5A059]" />

            <p className="text-[#5A5650] text-sm sm:text-base font-normal leading-relaxed font-sans-clean">
              Founded in Casablanca and extending into a private viewing salon in Agadir, <strong className="text-[#151413] font-semibold">Riad Fine Art</strong> represents an international roster of pioneering painters and sculptors.
            </p>

            <p className="text-[#5A5650] text-xs sm:text-sm font-normal leading-relaxed font-sans-clean">
              Our curatorial focus centers on raw tactile materiality—mineral pigments, gold leaf, raw linen, and deep gestural impasto—creating living dialogues between architectural stillness and contemporary abstraction.
            </p>

            {/* Gallery Trust Pillars */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#C5A059]/20">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif-display text-base text-[#151413] font-medium">Certified Provenance</h4>
                  <p className="text-[11px] text-[#8C8983] font-sans-clean">Stamped lifetime certificates of authenticity with every work.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-[#B08D57] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif-display text-base text-[#E8E6E1]">White-Glove Shipping</h4>
                  <p className="text-[11px] text-[#8C8983] font-sans-clean">Climate-controlled international insured transit & installation.</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs tracking-[0.25em] text-[#B08D57] uppercase hover:text-[#E8E6E1] transition-colors flex items-center space-x-2 font-semibold"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs tracking-[0.2em] text-[#E8E6E1] uppercase underline underline-offset-4 decoration-[#B08D57] hover:text-[#B08D57] transition-colors"
              >
                Contact Gallery Team
              </button>
            </div>

          </div>

        </div>

        {/* Press & Collector Trust Strip */}
        <div className="mt-24 pt-10 border-t border-[#B08D57]/15">
          <p className="text-center text-[10px] tracking-[0.35em] text-[#8C8983] uppercase mb-8">
            As Featured In & Trusted By High-End Collectors
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60 grayscale hover:grayscale-0 hover:opacity-90 transition-all text-center">
            <span className="font-serif-display text-xl tracking-[0.2em] text-[#C2C0BA]">ARCHITECTURAL DIGEST</span>
            <span className="font-serif-display text-xl tracking-[0.2em] text-[#C2C0BA]">SOTHEBY'S MAGAZINE</span>
            <span className="font-serif-display text-xl tracking-[0.2em] text-[#C2C0BA]">ARTFORUM</span>
            <span className="font-serif-display text-xl tracking-[0.2em] text-[#C2C0BA]">VOGUE LIVING</span>
          </div>
        </div>

      </div>
    </section>
  );
};
