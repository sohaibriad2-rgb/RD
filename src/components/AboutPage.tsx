import React from 'react';
import { ShieldCheck, Award, MapPin, Sparkles, Building2, Globe } from 'lucide-react';
import { PageView } from '../types';
import { Logo } from './Logo';
import teaCeremonyImg from '../assets/images/calssic 2.jpg';
import floralImpastoImg from '../assets/images/worod.jpg';

interface AboutPageProps {
  setCurrentPage: (page: PageView) => void;
  openPrivateViewing: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage, openPrivateViewing }) => {
  return (
    <div className="py-16 bg-[#1C1B19] min-h-screen text-[#E8E6E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <div className="mb-6 inline-block">
            <Logo variant="full" size="lg" />
          </div>
          <span className="text-[#B08D57] text-xs tracking-[0.35em] uppercase font-sans-clean block mb-3">
            Our Sanctuaries & Heritage
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl text-[#E8E6E1] font-normal tracking-[0.05em] mb-4">
            The Philosophy of Riad Fine Art
          </h1>
          <div className="w-16 h-[1px] bg-[#B08D57] mx-auto mb-4" />
          <p className="text-[#8C8983] text-sm font-light font-sans-clean">
            Cultivating silent dialogues between historic architectural sanctuaries and vanguard contemporary fine art.
          </p>
        </div>

        {/* Story Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#B08D57] text-xs tracking-[0.3em] uppercase block font-sans-clean">
              01. The Casablanca Flagship
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#E8E6E1]">
              A Sanctuary of Contemporary Fine Art
            </h2>
            <div className="w-12 h-[1px] bg-[#B08D57]" />
            <p className="text-[#C2C0BA] text-sm font-light leading-relaxed font-sans-clean">
              Located on Boulevard d'Anfa in the vibrant heart of Casablanca, our flagship gallery occupies a modern architectural sanctuary. Featuring soaring gallery walls and natural light, the gallery provides a contemplative setting where fine masterworks interact with shifting daylight throughout the day.
            </p>
            <p className="text-[#8C8983] text-xs font-light leading-relaxed font-sans-clean">
              Collectors visiting Casablanca enjoy private salon viewings accompanied by curated teas, botanical refreshments, and tailored curatorial consultation.
            </p>
          </div>

          <div className="lg:col-span-6 art-frame-glow rounded-sm overflow-hidden border border-[#B08D57]/30 bg-[#121110] p-4">
            <img
              src={teaCeremonyImg}
              alt="Riad Fine Art Original Painting"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-[400px] object-contain hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Story Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 order-2 lg:order-1 art-frame-glow rounded-sm overflow-hidden border border-[#B08D57]/30 bg-[#121110] p-4">
            <img
              src={floralImpastoImg}
              alt="Riad Fine Art Original Painting"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-[400px] object-contain hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-[#B08D57] text-xs tracking-[0.3em] uppercase block font-sans-clean">
              02. Agadir Showroom
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#E8E6E1]">
              The Agadir Fine Art Gallery
            </h2>
            <div className="w-12 h-[1px] bg-[#B08D57]" />
            <p className="text-[#C2C0BA] text-sm font-light leading-relaxed font-sans-clean">
              To serve our coastal and southern collectors, Riad Fine Art maintains a showroom along Avenue Mohammed V in Agadir. We provide collection access, custom museum framing consultations, and digital placement previews.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentPage('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#B08D57] text-[#1C1B19] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#CBB07E] transition-colors rounded-sm"
              >
                Contact Gallery Team
              </button>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="pt-16 border-t border-[#B08D57]/20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#151413] border border-[#B08D57]/20 p-8 rounded-sm art-frame-glow space-y-4">
            <ShieldCheck className="w-8 h-8 text-[#B08D57]" />
            <h3 className="font-serif-display text-2xl text-[#E8E6E1]">Lifetime Provenance</h3>
            <p className="text-xs text-[#8C8983] font-light leading-relaxed font-sans-clean">
              Every single canvas or limited edition in our catalogue is acquired directly from the artist’s studio, fully documented, and accompanied by a stamped certificate of authenticity.
            </p>
          </div>

          <div className="bg-[#151413] border border-[#B08D57]/20 p-8 rounded-sm art-frame-glow space-y-4">
            <Globe className="w-8 h-8 text-[#B08D57]" />
            <h3 className="font-serif-display text-2xl text-[#E8E6E1]">White-Glove Logistics</h3>
            <p className="text-xs text-[#8C8983] font-light leading-relaxed font-sans-clean">
              We coordinate climate-controlled, custom wooden crate packaging and fully insured international courier transit directly to your private estate or corporate collection.
            </p>
          </div>

          <div className="bg-[#151413] border border-[#B08D57]/20 p-8 rounded-sm art-frame-glow space-y-4">
            <Sparkles className="w-8 h-8 text-[#B08D57]" />
            <h3 className="font-serif-display text-2xl text-[#E8E6E1]">Bespoke Framing & Placement</h3>
            <p className="text-xs text-[#8C8983] font-light leading-relaxed font-sans-clean">
              Our master framers offer Italian hand-carved gilt wood and museum UV glass framing tailored to harmonize with your interior architecture.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
