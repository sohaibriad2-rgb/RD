import React, { useEffect } from 'react';
import { Artwork } from '../types';
import { ThreeDGalleryRoom } from './ThreeDGalleryRoom';

interface RoomPreviewModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  formattedPrice?: string;
}

export const RoomPreviewModal: React.FC<RoomPreviewModalProps> = ({ artwork, onClose, formattedPrice }) => {
  // Lock body scrolling when 3D modal is active
  useEffect(() => {
    if (artwork) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [artwork]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && artwork) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artwork, onClose]);

  if (!artwork) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#11100F] xl:bg-[#11100F]/90 xl:backdrop-blur-md flex items-center justify-center p-0 xl:p-4 h-[100dvh] w-screen animate-fadeIn overflow-hidden touch-none overscroll-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full h-[100dvh] xl:h-[92vh] xl:max-w-7xl bg-[#151413] xl:border xl:border-[#B08D57]/40 xl:rounded-sm overflow-hidden shadow-2xl flex flex-col touch-none overscroll-none">
        <ThreeDGalleryRoom artwork={artwork} onClose={onClose} formattedPrice={formattedPrice} />
      </div>
    </div>
  );
};

