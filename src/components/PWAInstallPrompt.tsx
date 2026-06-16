'use client';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [slid, setSlid] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa_prompt_dismissed') === 'true') return;
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 4 seconds of engagement
      setTimeout(() => {
        setVisible(true);
        setTimeout(() => setSlid(true), 60);
      }, 4000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    setSlid(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setTimeout(() => setVisible(false), 300);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') dismiss();
  };

  if (!visible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[100] px-4 pb-8 transition-transform duration-500 ease-out ${slid ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-md mx-auto bg-[#140A2E] border-4 border-[#1B123D] p-6 shadow-[10px_10px_0_0_#000]">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-neon-purple p-2 border-2 border-black mr-4">
            <span className="text-xl">🎮</span>
          </div>
          <div className="flex-1">
            <h3 className="font-pixel text-[10px] text-white uppercase mb-1">
              Install YoriGames
            </h3>
            <p className="font-body text-[10px] text-muted uppercase leading-tight">
              Play offline · Faster · No browser UI
            </p>
          </div>
          <button onClick={dismiss} className="text-muted hover:text-white p-1" aria-label="Close">
            ✕
          </button>
        </div>
        <button 
          onClick={install}
          className="w-full bg-neon-cyan text-black font-pixel text-[10px] py-4 border-b-4 border-r-4 border-[#0891B2] hover:bg-[#0E7490] transition-colors mb-3 uppercase"
        >
          Add to Home Screen
        </button>
        <button 
          onClick={dismiss}
          className="w-full bg-[#1B123D] text-muted font-pixel text-[8px] py-2 uppercase hover:text-white transition-colors"
        >
          Not now, maybe later
        </button>
      </div>
    </div>
  );
}
