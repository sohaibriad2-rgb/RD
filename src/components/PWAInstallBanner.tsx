import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosInstructions, setShowIosInstructions] = useState<boolean>(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed prompt in this session
    const dismissedSession = sessionStorage.getItem('rd_pwa_dismissed');
    if (dismissedSession === 'true') {
      setIsDismissed(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    // Capture Chrome/Android/Desktop install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Track app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('[PWA] App successfully installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('rd_pwa_dismissed', 'true');
  };

  // Don't render if already installed, dismissed, or prompt not available (and not iOS)
  if (isInstalled || isDismissed || (!deferredPrompt && !isIos)) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom PWA Install Bar */}
      <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-[80] animate-fadeIn">
        <div className="bg-[#151413]/98 backdrop-blur-xl border border-[#B08D57]/60 p-3 sm:p-3.5 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3">
          {/* Gallery Logo / Icon */}
          <div className="relative shrink-0">
            <img
              src="/favicon.png"
              alt="RD Fine Art Logo"
              className="w-10 h-10 object-contain rounded-sm border border-[#B08D57]/40 bg-[#1C1B19] p-1"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#B08D57] p-0.5 rounded-full text-[#151413]">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif-display text-xs sm:text-sm text-[#E8E6E1] font-semibold tracking-wide truncate">
              RD Fine Art App
            </h4>
            <p className="text-[10px] text-[#A6A29A] truncate font-light">
              Install for instant access & offline 3D view
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-[#B08D57] hover:bg-[#CBB07E] text-[#151413] text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-md active:scale-95 flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1 text-[#8C8983] hover:text-[#E8E6E1] rounded-sm transition-colors"
              title="Dismiss"
              aria-label="Dismiss Install Prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-[100] bg-[#11100F]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#151413] border border-[#B08D57]/60 p-5 rounded-sm max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#B08D57]/30 pb-3">
              <div className="flex items-center space-x-2">
                <img src="/favicon.png" alt="RD Fine Art" className="w-6 h-6 object-contain" />
                <h3 className="font-serif-display text-base text-[#E8E6E1] font-semibold">
                  Install RD Fine Art on iOS
                </h3>
              </div>
              <button
                onClick={() => setShowIosInstructions(false)}
                className="text-[#8C8983] hover:text-[#E8E6E1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#A6A29A] leading-relaxed">
              To install RD Fine Art on your iPhone or iPad, follow these simple steps in Safari:
            </p>

            <ol className="space-y-3 text-xs text-[#E8E6E1]">
              <li className="flex items-center space-x-3 bg-[#1C1B19] p-2.5 rounded-sm border border-[#B08D57]/20">
                <Share className="w-5 h-5 text-[#B08D57] shrink-0" />
                <span>1. Tap the <strong>Share</strong> button in Safari's bottom toolbar.</span>
              </li>
              <li className="flex items-center space-x-3 bg-[#1C1B19] p-2.5 rounded-sm border border-[#B08D57]/20">
                <PlusSquare className="w-5 h-5 text-[#B08D57] shrink-0" />
                <span>2. Scroll down and select <strong>Add to Home Screen</strong>.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIosInstructions(false)}
              className="w-full py-2 bg-[#B08D57] text-[#151413] font-bold text-xs uppercase tracking-widest rounded-sm"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
