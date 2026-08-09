import React, { useState, useEffect } from 'react';
import { Bookmark, ShoppingBag, Eye, ShieldCheck, Maximize2, Share2, Check, ArrowLeft, Layers, MapPin, MessageSquare, X } from 'lucide-react';
import { Artwork, Currency, PageView } from '../types';
import { formatPrice } from '../utils/currency';
import { ARTWORKS } from '../data/artworks';

interface ArtworkDetailPageProps {
  artwork: Artwork;
  onBackToGallery: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
  addToCart: (artwork: Artwork, editionType?: 'original' | 'limited_print') => void;
  wishlistIds: string[];
  toggleWishlist: (artworkId: string) => void;
  activeCurrency: Currency;
  openEnquiryModal: (artwork: Artwork) => void;
  openRoomPreview: (artwork: Artwork) => void;
}

export const ArtworkDetailPage: React.FC<ArtworkDetailPageProps> = ({
  artwork,
  onBackToGallery,
  onSelectArtwork,
  addToCart,
  wishlistIds,
  toggleWishlist,
  activeCurrency,
  openEnquiryModal,
  openRoomPreview,
}) => {
  const [activeImage, setActiveImage] = useState(artwork.primaryImage);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'provenance' | 'certificate'>('story');
  const [isCopied, setIsCopied] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    setActiveImage(artwork.primaryImage);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [artwork.id]);

  // Inject Product JSON-LD Schema for SEO
  useEffect(() => {
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": artwork.title,
      "image": [artwork.primaryImage],
      "description": `${artwork.title} par ${artwork.artistName}. ${artwork.medium}, ${artwork.dimensions}. ${artwork.story}`,
      "sku": artwork.id,
      "brand": {
        "@type": "Brand",
        "name": "RD Fine Art"
      },
      "artist": {
        "@type": "Person",
        "name": artwork.artistName
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD",
        "price": artwork.priceUSD,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": artwork.isSold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "RD Fine Art"
        }
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema-jsonld';
    script.text = JSON.stringify(productSchema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('product-schema-jsonld');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [artwork]);

  const isSaved = wishlistIds.includes(artwork.id);
  const allImages = artwork.detailImages?.length ? artwork.detailImages : [artwork.primaryImage];

  const handleAddToCart = () => {
    addToCart(artwork, 'original');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const similarWorks = ARTWORKS.filter(
    (art) => art.id !== artwork.id && (art.artistId === artwork.artistId || art.medium === artwork.medium)
  ).slice(0, 3);

  return (
    <div className="py-6 sm:py-12 bg-[#1C1B19] min-h-screen text-[#E8E6E1]">
      {/* Sticky Responsive Sub-Header Exit Bar */}
      <div className="sticky top-[56px] sm:top-[60px] lg:top-[64px] z-30 bg-[#151413] border-b border-[#B08D57]/40 py-2.5 px-4 mb-6 shadow-xl transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToGallery}
            className="inline-flex items-center space-x-2 text-xs tracking-[0.2em] text-[#B08D57] uppercase hover:text-[#E8E6E1] transition-colors group px-3 py-1.5 bg-[#1C1B19] border border-[#B08D57]/40 rounded-sm active:scale-95 shadow-md shrink-0"
            title="Return to Gallery Collection"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
            <span className="hidden sm:inline">Return to Gallery</span>
            <span className="sm:hidden">Gallery</span>
          </button>

          <div className="flex items-center space-x-2 truncate max-w-[160px] sm:max-w-md px-2">
            <span className="w-2 h-2 rounded-full bg-[#B08D57] shrink-0 animate-pulse" />
            <span className="text-xs font-serif-display font-semibold text-[#E8E6E1] truncate">
              {artwork.title}
            </span>
          </div>

          <button
            onClick={onBackToGallery}
            className="p-1.5 text-[#E8E6E1] hover:text-[#B08D57] bg-[#1C1B19] border border-white/10 hover:border-[#B08D57] rounded-sm transition-all active:scale-95 shrink-0"
            title="Exit View & Return to Gallery"
            aria-label="Exit View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Primary Artwork Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Left Column: Image Gallery & Lightbox */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main High-Res Image Box */}
            <div className="relative bg-[#11100F] border border-[#B08D57]/30 rounded-sm overflow-hidden art-frame-glow group">
              <img
                src={activeImage}
                alt={artwork.title}
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-[520px] sm:h-[640px] object-contain p-4 cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Lightbox Zoom & Room Preview Controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                <button
                  onClick={() => openRoomPreview(artwork)}
                  className="px-3 py-2 bg-[#1C1B19]/80 backdrop-blur-md border border-[#B08D57]/40 text-[#B08D57] text-[10px] tracking-[0.18em] uppercase hover:bg-[#B08D57] hover:text-[#1C1B19] transition-all rounded-sm flex items-center space-x-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View in Room</span>
                </button>

                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-2 bg-[#1C1B19]/80 backdrop-blur-md border border-[#B08D57]/40 text-[#B08D57] hover:bg-[#B08D57] hover:text-[#1C1B19] transition-all rounded-sm"
                  title="Expand Full Resolution"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Edition Tag */}
              <div className="absolute top-4 left-4 bg-[#1C1B19]/85 border border-[#B08D57]/30 px-3 py-1 text-[10px] tracking-[0.2em] text-[#B08D57] uppercase">
                {artwork.editionInfo}
              </div>
            </div>

            {/* Thumbnails Row */}
            {allImages.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-sm overflow-hidden border shrink-0 transition-all ${
                      activeImage === img ? 'border-[#B08D57] scale-105' : 'border-[#B08D57]/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-contain p-1 bg-[#11100F]" />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Right Column: Acquisition Details & Specification */}
          <div className="lg:col-span-5 space-y-8">
            
            <div>
              <span className="text-[#B08D57] text-xs tracking-[0.35em] uppercase font-sans-clean block mb-2">
                {artwork.artistName}
              </span>
              <h1 className="font-serif-display text-3xl sm:text-5xl text-[#E8E6E1] font-normal leading-tight mb-3">
                {artwork.title}
              </h1>
              <p className="text-xs text-[#8C8983] font-light">
                Created in {artwork.year} &nbsp;·&nbsp; {artwork.medium}
              </p>
            </div>

            <div className="py-4 border-y border-[#B08D57]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-[#8C8983] uppercase block mb-1">
                  Acquisition Value
                </span>
                <span className="font-serif-display text-3xl text-[#E8E6E1] font-semibold">
                  {formatPrice(artwork.priceUSD, activeCurrency)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block">
                  {artwork.isAvailable ? 'Available for Acquisition' : 'Acquired in Private Collection'}
                </span>
                <span className="text-xs text-[#8C8983] font-light">
                  {artwork.dimensions}
                </span>
              </div>
            </div>

            {/* Primary Action CTA Buttons */}
            <div className="space-y-4">
              {artwork.isAvailable ? (
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-6 text-xs tracking-[0.25em] uppercase font-semibold transition-all duration-300 flex items-center justify-center space-x-3 rounded-sm shadow-xl ${
                    addedAnimation
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-[#B08D57] text-[#1C1B19] hover:bg-[#CBB07E]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedAnimation ? 'Added to Collection Bag' : 'Add to Collection Bag'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 bg-[#252320] text-[#8C8983] border border-[#B08D57]/20 text-xs tracking-[0.25em] uppercase rounded-sm cursor-not-allowed text-center"
                >
                  Work Acquired (In Private Collection)
                </button>
              )}

              {/* Prominent 3D Room Experience CTA */}
              <button
                onClick={() => openRoomPreview(artwork)}
                className="w-full py-3.5 px-4 bg-[#151413] border border-[#B08D57] text-[#B08D57] hover:bg-[#B08D57] hover:text-[#1C1B19] text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-sm flex items-center justify-center space-x-2.5 shadow-md"
              >
                <Layers className="w-4 h-4" />
                <span>Experience artwork in 3D Gallery Room</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openEnquiryModal(artwork)}
                  className="py-3.5 px-4 bg-transparent border border-[#B08D57]/60 text-[#E8E6E1] hover:bg-[#B08D57]/10 text-[10px] tracking-[0.2em] uppercase transition-colors rounded-sm text-center font-medium"
                >
                  Enquire via Form
                </button>

                <a
                  href={`https://wa.me/212636260361?text=${encodeURIComponent(`Hello Riad Fine Art, I am interested in inquiring about "${artwork.title}" by ${artwork.artistName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 bg-[#25D366]/15 border border-[#25D366]/60 text-[#25D366] hover:bg-[#25D366] hover:text-black text-[10px] tracking-[0.2em] uppercase transition-all rounded-sm flex items-center justify-center space-x-2 text-center font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Curator</span>
                </a>
              </div>

              <button
                onClick={() => toggleWishlist(artwork.id)}
                className={`w-full py-3 px-4 border text-[10px] tracking-[0.2em] uppercase transition-colors rounded-sm flex items-center justify-center space-x-2 ${
                  isSaved
                    ? 'bg-[#B08D57]/20 border-[#B08D57] text-[#B08D57]'
                    : 'border-[#B08D57]/30 text-[#E8E6E1] hover:border-[#B08D57]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved in Collection Wishlist' : 'Save to Private Collection Wishlist'}</span>
              </button>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="bg-[#151413] border border-[#B08D57]/20 p-4 rounded-sm space-y-2 text-xs font-sans-clean">
              <div className="flex items-center text-[#C2C0BA] space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B08D57]" />
                <span>Certificate of Authenticity signed by {artwork.artistName} included</span>
              </div>
              <div className="flex items-center text-[#C2C0BA] space-x-2">
                <Check className="w-4 h-4 text-[#B08D57]" />
                <span>Insured White-Glove International Delivery in custom wooden crate</span>
              </div>
            </div>

            {/* Share link */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleShare}
                className="text-xs text-[#8C8983] hover:text-[#B08D57] transition-colors flex items-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Link Copied to Clipboard' : 'Share Artwork Record'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Narrative & Provenance Accordion / Tabs */}
        <div className="max-w-4xl mx-auto mb-24 bg-[#151413] border border-[#B08D57]/30 rounded-sm p-6 sm:p-10 art-frame-glow">
          <div className="flex border-b border-[#B08D57]/20 pb-4 mb-8 space-x-8 text-xs tracking-[0.2em] uppercase">
            <button
              onClick={() => setActiveTab('story')}
              className={`pb-2 transition-colors ${
                activeTab === 'story' ? 'text-[#B08D57] border-b-2 border-[#B08D57]' : 'text-[#8C8983] hover:text-[#E8E6E1]'
              }`}
            >
              Curatorial Narrative
            </button>
            <button
              onClick={() => setActiveTab('provenance')}
              className={`pb-2 transition-colors ${
                activeTab === 'provenance' ? 'text-[#B08D57] border-b-2 border-[#B08D57]' : 'text-[#8C8983] hover:text-[#E8E6E1]'
              }`}
            >
              Provenance & History
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`pb-2 transition-colors ${
                activeTab === 'certificate' ? 'text-[#B08D57] border-b-2 border-[#B08D57]' : 'text-[#8C8983] hover:text-[#E8E6E1]'
              }`}
            >
              Authenticity Seal
            </button>
          </div>

          {activeTab === 'story' && (
            <div className="space-y-4 text-sm font-light leading-relaxed text-[#C2C0BA] font-sans-clean">
              <p>{artwork.story}</p>
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#B08D57]/15">
                <div>
                  <span className="text-[10px] uppercase text-[#B08D57] tracking-widest block mb-1">Medium</span>
                  <span className="text-xs text-[#E8E6E1]">{artwork.medium}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#B08D57] tracking-widest block mb-1">Dimensions</span>
                  <span className="text-xs text-[#E8E6E1]">{artwork.dimensions}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#B08D57] tracking-widest block mb-1">Creation Year</span>
                  <span className="text-xs text-[#E8E6E1]">{artwork.year}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'provenance' && (
            <div className="space-y-4 text-sm font-light leading-relaxed text-[#C2C0BA] font-sans-clean">
              <p>{artwork.provenance}</p>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="space-y-4 text-sm font-light leading-relaxed text-[#C2C0BA] font-sans-clean flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full border-2 border-[#B08D57] flex items-center justify-center p-2 shrink-0">
                <ShieldCheck className="w-10 h-10 text-[#B08D57]" />
              </div>
              <div>
                <h4 className="font-serif-display text-xl text-[#E8E6E1] mb-1">Official Gallery Certificate of Authenticity</h4>
                <p className="text-xs text-[#8C8983]">
                  Every acquisition from Riad Fine Art includes a physical embossed wax-stamped Certificate of Authenticity specifying title, artist signature verification, unique catalogue number, and edition verification.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Similar Artworks Carousel */}
        {similarWorks.length > 0 && (
          <div className="pt-12 border-t border-[#B08D57]/20">
            <h3 className="font-serif-display text-3xl text-[#E8E6E1] mb-8">Related Masterworks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarWorks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectArtwork(art)}
                  className="bg-[#151413] border border-[#B08D57]/20 p-4 rounded-sm cursor-pointer hover:border-[#B08D57] transition-all art-frame-glow group"
                >
                  <img
                    src={art.primaryImage}
                    alt={art.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-64 object-contain p-2 bg-[#11100F] rounded-sm mb-4"
                  />
                  <span className="text-[10px] tracking-[0.2em] text-[#B08D57] uppercase block">{art.artistName}</span>
                  <h4 className="font-serif-display text-lg text-[#E8E6E1] group-hover:text-[#B08D57] transition-colors">{art.title}</h4>
                  <p className="text-xs text-[#8C8983] font-serif-display mt-2">{formatPrice(art.priceUSD, activeCurrency)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Zoom Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#11100F]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              src={activeImage}
              alt={artwork.title}
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full object-contain rounded-sm shadow-2xl border border-[#B08D57]/40"
            />
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 px-4 py-2 bg-[#1C1B19] text-[#B08D57] border border-[#B08D57] text-xs uppercase tracking-widest hover:bg-[#B08D57] hover:text-[#1C1B19] transition-colors rounded-sm"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
