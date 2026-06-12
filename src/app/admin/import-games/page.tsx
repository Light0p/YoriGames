"use client"

import React, { useState } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { importGameMonetizeFeed } from '@/lib/gamemonetize';
import { Loader2, Download, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useUser } from '@/firebase';
import { notFound } from 'next/navigation';

export default function AdminImportPage() {
  const { user, loading: authLoading } = useUser();
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple admin protection (Replace with your actual admin UID or role check)
  const isAdmin = user?.email === 'yogeshyadav0630@gmail.com'; 

  if (authLoading) return null;
  if (!isAdmin && user) return notFound();

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setResults(null);
    try {
      const stats = await importGameMonetizeFeed();
      setResults(stats);
    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-12 shadow-[8px_8px_0_0_#000]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-neon-cyan p-3 border-4 border-black">
              <Database className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-pixel text-2xl text-white uppercase">Data Control</h1>
              <p className="font-pixel text-[8px] text-neon-cyan uppercase mt-1">GameMonetize Uplink</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#09061B] border-2 border-[#1B123D] p-6">
              <h3 className="font-pixel text-[10px] text-white uppercase mb-4 tracking-widest">Import Subsystems</h3>
              <p className="font-body text-sm text-muted mb-6">
                Connect to GameMonetize Feed (Format 0) to synchronize the latest 50 games. 
                Existing games will be updated; new games will be added to the registry.
              </p>
              
              <PixelButton 
                variant="accent" 
                onClick={handleImport} 
                disabled={importing}
                className="w-full sm:w-auto"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SYNCHRONIZING...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>IMPORT LATEST FEED</span>
                  </>
                )}
              </PixelButton>
            </div>

            {results && (
              <div className="p-6 bg-green-500/10 border-2 border-green-500 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 text-green-500 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-pixel text-[10px] uppercase">Sync Successful</span>
                </div>
                <div className="grid grid-cols-3 gap-4 font-pixel text-[8px] text-white uppercase">
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Processed</div>
                    <div className="text-lg">{results.imported + results.failed}</div>
                  </div>
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Success</div>
                    <div className="text-lg text-neon-cyan">{results.imported}</div>
                  </div>
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Failed</div>
                    <div className="text-lg text-neon-pink">{results.failed}</div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-6 bg-destructive/10 border-2 border-destructive flex items-center gap-3 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span className="font-pixel text-[10px] uppercase">{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
