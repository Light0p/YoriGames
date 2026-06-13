
"use client"

import React, { useState, useEffect } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Loader2, Download, CheckCircle2, AlertCircle, Database, BarChart3, RefreshCw, Layers, History, FastForward } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { notFound } from 'next/navigation';
import { getTotalGameCount } from '@/lib/games';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export default function AdminImportPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ 
    imported: number; 
    failed: number; 
    pages: number;
    skipped: number;
    retries: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalGames, setTotalGames] = useState<number | null>(null);
  const [currentSyncPage, setCurrentSyncPage] = useState<number>(0);
  const [retryStatus, setRetryStatus] = useState<string | null>(null);

  const isAdmin = user?.email === 'yorionlinegames@gmail.com'; 

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const count = await getTotalGameCount();
      setTotalGames(count);
    } catch (err) {
      console.error("Failed to fetch game count", err);
    }
  };

  if (authLoading) return null;
  if (!isAdmin && user) return notFound();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleImport = async () => {
    setImporting(true);
    setError(null);
    setResults({ imported: 0, failed: 0, pages: 0, skipped: 0, retries: 0 });
    setCurrentSyncPage(1);
    
    let totalImported = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    let totalRetries = 0;
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        setCurrentSyncPage(page);
        
        let attempt = 0;
        let success = false;
        let games = [];

        // Retry Loop for Rate Limiting
        while (attempt <= 3 && !success) {
          if (attempt > 0) {
            const backoff = attempt === 1 ? 5000 : attempt === 2 ? 10000 : 20000;
            setRetryStatus(`Rate limited. Backing off for ${backoff/1000}s (Attempt ${attempt}/3)...`);
            totalRetries++;
            await sleep(backoff);
          }

          try {
            const response = await fetch(`/api/admin/import-games?page=${page}`, {
              method: 'POST'
            });
            
            if (response.status === 429) {
              attempt++;
              continue;
            }

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Server fetch failed on page ${page}`);
            }
            
            const data = await response.json();
            games = data.games;
            success = true;
            setRetryStatus(null);
          } catch (err: any) {
            console.error(`Attempt ${attempt} failed:`, err);
            attempt++;
            if (attempt > 3) break;
          }
        }
        
        if (!success) {
          console.warn(`Skipping page ${page} after 3 failed attempts.`);
          totalSkipped++;
          page++;
          // Still update progress for visibility
          setResults(prev => prev ? { ...prev, skipped: totalSkipped, pages: page - 1 } : null);
          continue;
        }
        
        if (!Array.isArray(games) || games.length === 0) {
          hasMore = false;
          break;
        }

        // Mutation Loop
        const importPromises = games.map(async (game: any) => {
          const gameRef = doc(db, 'games', `gm_${game.gameId}`);
          try {
            await setDoc(gameRef, {
              ...game,
              lastImportedAt: serverTimestamp()
            }, { merge: true });
            totalImported++;
          } catch (err: any) {
            totalFailed++;
            const permissionError = new FirestorePermissionError({
              path: gameRef.path,
              operation: 'write',
              requestResourceData: game,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
          }
        });

        await Promise.all(importPromises);
        
        // Final condition: if we got less than 100 games, it's the last page
        if (games.length < 100) {
          hasMore = false;
        } else {
          page++;
        }

        // Progress Update
        setResults({ 
          imported: totalImported, 
          failed: totalFailed, 
          pages: page - 1,
          skipped: totalSkipped,
          retries: totalRetries
        });

        // Base cooldown to prevent hitting rate limits
        await sleep(2500); 
      }
      
      fetchStats(); 
    } catch (err: any) {
      setError(err.message || 'Import process interrupted by critical error.');
    } finally {
      setImporting(false);
      setCurrentSyncPage(0);
      setRetryStatus(null);
    }
  };

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-12 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-neon-cyan p-3 border-4 border-black">
                <Database className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="font-pixel text-2xl text-white uppercase">Arcade Control</h1>
                <p className="font-pixel text-[8px] text-neon-cyan uppercase mt-1">Status: Mission Command Active</p>
              </div>
            </div>
            
            <div className="bg-[#09061B] border-2 border-[#1B123D] p-4 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-pixel text-[6px] text-muted uppercase mb-1">Total Games</span>
                <span className="font-pixel text-lg text-white">
                  {totalGames !== null ? totalGames : '...'}
                </span>
              </div>
              <BarChart3 className="w-6 h-6 text-neon-purple opacity-40" />
              <button onClick={fetchStats} className="hover:text-neon-cyan transition-colors" title="Refresh Stats">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#09061B] border-2 border-[#1B123D] p-6">
              <h3 className="font-pixel text-[10px] text-white uppercase mb-4 tracking-widest">Global Synchronization</h3>
              <p className="font-body text-sm text-muted mb-6 leading-relaxed">
                Connect to the GameMonetize uplink to synchronize the entire game library. This process handles rate limits with exponential backoff and automatic cooldowns between requests.
              </p>
              
              <div className="flex flex-col gap-4">
                <PixelButton 
                  variant="accent" 
                  onClick={handleImport} 
                  disabled={importing}
                  className="w-full sm:w-auto"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SYNCING PAGE {currentSyncPage}...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>START FULL SYNC</span>
                    </>
                  )}
                </PixelButton>

                {importing && (
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-[#1B123D] border border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-neon-cyan animate-loading-bar" />
                    </div>
                    {retryStatus && (
                      <div className="flex items-center gap-2 text-neon-gold animate-pulse">
                        <History className="w-3 h-3" />
                        <span className="font-pixel text-[6px] uppercase">{retryStatus}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {results && (
              <div className="p-6 bg-green-500/10 border-2 border-green-500 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 text-green-500 mb-6 border-b border-green-500/30 pb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-pixel text-[10px] uppercase">
                    {importing ? 'Synchronizing Universe...' : 'Mission Accomplished'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 font-pixel text-[8px] text-white uppercase">
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Pages Done</div>
                    <div className="text-lg text-neon-purple">{results.pages}</div>
                  </div>
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Unique Titles</div>
                    <div className="text-lg text-neon-cyan">{results.imported}</div>
                  </div>
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Retries</div>
                    <div className="text-lg text-neon-gold">{results.retries}</div>
                  </div>
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Skipped</div>
                    <div className="text-lg text-neon-pink">{results.skipped}</div>
                  </div>
                  <div className="bg-black/20 p-4 border border-green-500/30">
                    <div className="text-muted mb-2">Failed</div>
                    <div className="text-lg text-destructive">{results.failed}</div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-6 bg-destructive/10 border-2 border-destructive flex items-center gap-3 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <div className="flex-1">
                  <span className="font-pixel text-[10px] uppercase block mb-1">Uplink Interrupted</span>
                  <p className="font-body text-xs opacity-80">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
