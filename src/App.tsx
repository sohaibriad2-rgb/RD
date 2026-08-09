import React, { useState, useEffect, lazy, Suspense } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCollection } from './components/FeaturedCollection';
import { StoryTeaser } from './components/StoryTeaser';
import { NewsletterInvitation } from './components/NewsletterInvitation';
import { GalleryPage } from './components/GalleryPage';
import { ArtworkDetailPage } from './components/ArtworkDetailPage';
import { ArtistsPage } from './components/ArtistsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PWAInstallBanner } from './components/PWAInstallBanner';

import { Artwork, CartItem, Currency, PageView } from './types';
import { ARTWORKS } from './data/artworks';

// Lazy loaded heavy components & modals for optimal bundle splitting
const RoomPreviewModal = lazy(() => import('./components/RoomPreviewModal').then(m => ({ default: m.RoomPreviewModal })));
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const QuickViewModal = lazy(() => import('./components/QuickViewModal').then(m => ({ default: m.QuickViewModal })));
const PrivateEnquiryModal = lazy(() => import('./components/PrivateEnquiryModal').then(m => ({ default: m.PrivateEnquiryModal })));

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['solitude-gold-horizon']);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('USD');

  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewArtwork, setQuickViewArtwork] = useState<Artwork | null>(null);
  const [roomPreviewArtwork, setRoomPreviewArtwork] = useState<Artwork | null>(null);
  const [privateEnquiryArtwork, setPrivateEnquiryArtwork] = useState<Artwork | null>(null);

  // Cart operations
  const addToCart = (artwork: Artwork, editionType: 'original' | 'limited_print' = 'original') => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.artwork.id === artwork.id);
      if (existing) {
        return prev.map((item) =>
          item.artwork.id === artwork.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { artwork, editionType, quantity: 1, customFraming: 'Museum Standard Unframed' }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (artworkId: string) => {
    setCartItems((prev) => prev.filter((item) => item.artwork.id !== artworkId));
  };

  const updateFraming = (artworkId: string, customFraming: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.artwork.id === artworkId ? { ...item, customFraming } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  // Wishlist operations
  const toggleWishlist = (artworkId: string) => {
    setWishlistIds((prev) =>
      prev.includes(artworkId) ? prev.filter((id) => id !== artworkId) : [...prev, artworkId]
    );
  };

  const handleSelectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setCurrentPage('artwork_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPrivateViewing = () => {
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Dynamic SEO Page Meta & Title Management
  useEffect(() => {
    let title = "RD Fine Art — Galerie d'Art Marocaine | Tableaux Peinture & Feuille d'Or";
    let metaDesc = "Galerie d'art de prestige au Maroc. Découvrez notre collection exclusive de tableaux d'art originaux, peintures à l'huile et oeuvres à la feuille d'or par l'artiste Aziz Riad. Livraison sécurisée à Casablanca, Rabat, Marrakech et partout au Maroc.";

    switch (currentPage) {
      case 'gallery':
        title = "Collection de Tableaux d'Art & Peintures de Luxe | RD Fine Art Maroc";
        metaDesc = "Explorez notre galerie en ligne de tableaux marocains originaux. Oeuvres d'art sur toile, textures relief et éditions limitées dorées. Expédition à Casablanca, Rabat, Marrakech.";
        break;
      case 'artists':
        title = "Aziz Riad — Artiste Peintre & Maître de la Feuille d'Or | RD Fine Art";
        metaDesc = "Découvrez le parcours de l'artiste maître Aziz Riad. Vingt ans d'art abstrait et figuratif marocain mêlant huiles impasto, lapis-lazuli et feuille d'or 24K.";
        break;
      case 'about':
        title = "À Propos de la Galerie | RD Fine Art Casablanca & Agadir";
        metaDesc = "Maison d'art d'exception célébrant le patrimoine pictural marocain, le travail de la feuille d'or et l'authenticité artistique au Maroc.";
        break;
      case 'contact':
        title = "Contact & Conciergerie Privée | RD Fine Art (+212 636-260361)";
        metaDesc = "Contactez le maître conciergerie de la galerie RD Fine Art sur WhatsApp ou visitez notre atelier à Casablanca. Réservation de visite privée et commande sur mesure.";
        break;
      case 'checkout':
        title = "Acquisition Sécurisée & Commande d'Art | RD Fine Art Maroc";
        metaDesc = "Finalisez votre acquisition d'oeuvre d'art originale. Paiement sécurisé à la livraison au Maroc ou virement bancaire.";
        break;
      case 'artwork_detail':
        if (selectedArtwork) {
          title = `${selectedArtwork.title} — Tableau par ${selectedArtwork.artistName} | RD Fine Art`;
          metaDesc = `${selectedArtwork.title} (${selectedArtwork.medium}, ${selectedArtwork.dimensions}). ${selectedArtwork.story.slice(0, 130)}... Disponible chez RD Fine Art avec livraison au Maroc.`;
        }
        break;
      default:
        break;
    }

    document.title = title;
    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', metaDesc);
    }
  }, [currentPage, selectedArtwork]);

  return (
    <div className="min-h-screen bg-white text-[#151413] font-sans-clean selection:bg-[#C5A059] selection:text-white">
      {/* Desktop Custom Luxury Gold Cursor */}
      <CustomCursor />

      {/* Main Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => setIsWishlistOpen(true)}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
        onSelectArtwork={handleSelectArtwork}
        openRoomPreview={() => setRoomPreviewArtwork(selectedArtwork || ARTWORKS[0])}
      />

      {/* Dynamic Page Views */}
      <main className="min-h-[70vh]">
        {currentPage === 'home' && (
          <>
            <Hero
              onSelectArtwork={handleSelectArtwork}
              setCurrentPage={setCurrentPage}
              activeCurrency={activeCurrency}
              openPrivateViewing={openPrivateViewing}
              openRoomPreview={(art) => setRoomPreviewArtwork(art || selectedArtwork || ARTWORKS[0])}
            />
            <FeaturedCollection
              onSelectArtwork={handleSelectArtwork}
              setCurrentPage={setCurrentPage}
              wishlistIds={wishlistIds}
              toggleWishlist={toggleWishlist}
              activeCurrency={activeCurrency}
              openQuickView={(art) => setQuickViewArtwork(art)}
              openRoomPreview={(art) => setRoomPreviewArtwork(art)}
            />
            <StoryTeaser
              setCurrentPage={setCurrentPage}
              openPrivateViewing={openPrivateViewing}
            />
            <NewsletterInvitation />
          </>
        )}

        {currentPage === 'gallery' && (
          <GalleryPage
            onSelectArtwork={handleSelectArtwork}
            wishlistIds={wishlistIds}
            toggleWishlist={toggleWishlist}
            activeCurrency={activeCurrency}
            openQuickView={(art) => setQuickViewArtwork(art)}
            openRoomPreview={(art) => setRoomPreviewArtwork(art)}
          />
        )}

        {currentPage === 'artwork_detail' && selectedArtwork && (
          <ArtworkDetailPage
            artwork={selectedArtwork}
            onBackToGallery={() => setCurrentPage('gallery')}
            onSelectArtwork={handleSelectArtwork}
            addToCart={addToCart}
            wishlistIds={wishlistIds}
            toggleWishlist={toggleWishlist}
            activeCurrency={activeCurrency}
            openEnquiryModal={(art) => setPrivateEnquiryArtwork(art)}
            openRoomPreview={(art) => setRoomPreviewArtwork(art)}
          />
        )}

        {currentPage === 'artists' && (
          <ArtistsPage
            onSelectArtwork={handleSelectArtwork}
            setCurrentPage={setCurrentPage}
            activeCurrency={activeCurrency}
            openEnquiryModal={(art) => setPrivateEnquiryArtwork(art)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            setCurrentPage={setCurrentPage}
            openPrivateViewing={openPrivateViewing}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'checkout' && (
          <Suspense fallback={<div className="py-20 text-center text-[#C5A059] font-serif-display text-xl">Loading Private Checkout...</div>}>
            <CheckoutPage
              cartItems={cartItems}
              clearCart={clearCart}
              activeCurrency={activeCurrency}
              setCurrentPage={setCurrentPage}
            />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        openPrivateViewing={openPrivateViewing}
      />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateFraming={updateFraming}
        activeCurrency={activeCurrency}
        setCurrentPage={setCurrentPage}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        toggleWishlist={toggleWishlist}
        onSelectArtwork={handleSelectArtwork}
        addToCart={addToCart}
        activeCurrency={activeCurrency}
      />

      <Suspense fallback={null}>
        <QuickViewModal
          artwork={quickViewArtwork}
          onClose={() => setQuickViewArtwork(null)}
          onSelectArtwork={handleSelectArtwork}
          addToCart={addToCart}
          wishlistIds={wishlistIds}
          toggleWishlist={toggleWishlist}
          activeCurrency={activeCurrency}
          openRoomPreview={(art) => setRoomPreviewArtwork(art)}
        />

        <RoomPreviewModal
          artwork={roomPreviewArtwork}
          onClose={() => setRoomPreviewArtwork(null)}
        />

        <PrivateEnquiryModal
          artwork={privateEnquiryArtwork}
          onClose={() => setPrivateEnquiryArtwork(null)}
        />
      </Suspense>

      {/* Persistent Floating WhatsApp Concierge Button & PWA Banner */}
      <FloatingWhatsApp />
      <PWAInstallBanner />
    </div>
  );
}
