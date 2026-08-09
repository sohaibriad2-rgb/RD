import React from 'react';
import { Mail, MapPin, Phone, ArrowUp, Instagram, MessageSquare } from 'lucide-react';
import { PageView } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  openPrivateViewing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, openPrivateViewing }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: PageView) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <footer className="bg-[#151413] text-[#E8E6E1] border-t border-[#C5A059]/30 pt-16 pb-12 font-sans-clean relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#C5A059]/20">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => handleNav('home')} 
              className="inline-block cursor-pointer transition-transform hover:scale-105"
            >
              <Logo variant="full" size="md" lightMode={false} />
            </div>
            <p className="text-xs text-[#8C8983] font-light max-w-sm leading-relaxed pt-2">
              An international fine art gallery and private viewing sanctuary representing original oil canvases, mineral pigment reliefs, and limited-edition prints to discerning global collectors.
            </p>
            <div className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase pt-2 font-semibold">
              CASABLANCA &nbsp;·&nbsp; AGADIR
            </div>

            {/* Social Channels */}
            <div className="pt-3 flex items-center space-x-3">
              <a
                href="https://wa.me/212636260361?text=Hello%20Riad%20Fine%20Art,%20I%20would%20like%20to%20inquire%20about%20your%20artworks."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#1C1B19] border border-[#C5A059]/30 text-[#25D366] hover:bg-[#C5A059] hover:text-[#151413] transition-colors rounded-sm flex items-center space-x-2 text-xs"
                title="WhatsApp Concierge"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span className="text-[11px] font-medium font-sans-clean text-[#E8E6E1]">WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/rd_fine_art/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#1C1B19] border border-[#C5A059]/30 text-[#E8E6E1] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors rounded-sm flex items-center space-x-2 text-xs"
                title="Instagram @rd_fine_art"
              >
                <Instagram className="w-4 h-4" />
                <span className="text-[11px] font-medium font-sans-clean">Instagram</span>
              </a>

              <a
                href="https://www.tiktok.com/@riad.fine.art"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#1C1B19] border border-[#C5A059]/30 text-[#E8E6E1] hover:text-[#C5A059] hover:border-[#C5A059] transition-colors rounded-sm flex items-center space-x-2 text-xs"
                title="TikTok @riad.fine.art"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-5.2-1.74 2.89 2.89 0 012.31-1.26V9.2A6.33 6.33 0 003 15.53 6.34 6.34 0 009.34 21.87 6.34 6.34 0 0015.68 15.53V9.2a8.16 8.16 0 004.91 1.62V7.37a4.85 4.85 0 01-1-.68z" />
                </svg>
                <span className="text-[11px] font-medium font-sans-clean">TikTok</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-xs tracking-[0.18em] uppercase">
            <h4 className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">Explore Gallery</h4>
            <ul className="space-y-2 text-[#C2C0BA]">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-[#C5A059] transition-colors">
                  01. Main Salon
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-[#C5A059] transition-colors">
                  02. Art Collection
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('artists')} className="hover:text-[#C5A059] transition-colors">
                  03. Represented Roster
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#C5A059] transition-colors">
                  04. The Gallery Story
                </button>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">Sanctuaries</h4>
            <div className="space-y-3 text-[#C2C0BA] font-light">
              <div>
                <strong className="block text-[#E8E6E1] font-serif-display text-sm">Casablanca Gallery</strong>
                <p className="text-[11px] text-[#8C8983]">Boulevard d'Anfa, Casablanca</p>
              </div>
              <div>
                <strong className="block text-[#E8E6E1] font-serif-display text-sm">Agadir Showroom</strong>
                <p className="text-[11px] text-[#8C8983]">Avenue Mohammed V, Agadir</p>
              </div>
            </div>
          </div>

          {/* Gallery Inquiries */}
          <div className="space-y-3 text-xs">
            <h4 className="text-[#C5A059] text-[10px] tracking-[0.3em] uppercase font-semibold mb-2">Gallery Inquiries</h4>
            <p className="text-[#C2C0BA] text-xs font-light">
              Connect with our curators for custom framing advice, master commissions, and shipping inquiries.
            </p>
            <button
              onClick={() => handleNav('contact')}
              className="px-4 py-3 bg-[#C5A059] text-[#151413] text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-[#D4B26F] transition-colors rounded-sm block w-full text-center"
            >
              Contact Gallery
            </button>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C8983] space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Riad Fine Art. All Rights Reserved. Masterworks, Imagery & Cataloguing.</p>
          
          <div className="flex items-center space-x-6">
            <button onClick={openPrivateViewing} className="hover:text-[#C5A059] transition-colors">
              Privacy & Provenance Protocols
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#151413] transition-colors rounded-sm flex items-center space-x-1"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
