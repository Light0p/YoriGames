"use client"

import React, { useState, useEffect } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { PixelGamepad } from '@/components/pixel/PixelGamepad';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithRedirect, 
  GoogleAuthProvider,
  getRedirectResult,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  AuthCredential,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useUser, useFirestore } from '@/firebase';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingCred, setPendingCred] = useState<AuthCredential | null>(null);
  
  const auth = useAuth();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const syncUserToFirestore = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const displayName = user.displayName || 'Unnamed Player';
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName,
        searchName: displayName.toLowerCase(),
        photoURL: user.photoURL || '',
        email: user.email || '',
        lastSeen: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Firestore sync failed", err);
    }
  };

  // Immediate redirect if already logged in
  useEffect(() => {
    if (user && !authLoading && !pendingCred) {
      router.push('/');
    }
  }, [user, authLoading, router, pendingCred]);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await syncUserToFirestore(result.user);
          router.push('/');
        }
      } catch (err: any) {
        setLoading(false);
        if (err.code === 'auth/account-exists-with-different-credential') {
          const credential = GoogleAuthProvider.credentialFromError(err);
          setPendingCred(credential);
          if (err.customData?.email) {
            setEmail(err.customData.email);
            try {
              await fetchSignInMethodsForEmail(auth, err.customData.email);
            } catch (fetchErr) {
              console.error("Method fetch failed", fetchErr);
            }
          }
          setError("AN ACCOUNT ALREADY EXISTS WITH THIS EMAIL. PLEASE SIGN IN WITH YOUR PASSWORD TO LINK YOUR GOOGLE ACCOUNT.");
          setIsRegistering(false);
        } else {
          setError(err.message || 'AUTHENTICATION FAILED');
        }
      }
    };
    handleRedirect();
  }, [auth, router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(result.user);
        // Redirect handled by useEffect
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserToFirestore(userCredential.user);
        
        if (pendingCred) {
          await linkWithCredential(userCredential.user, pendingCred);
          setPendingCred(null);
          setSuccess("GOOGLE ACCOUNT LINKED SUCCESSFULLY! REDIRECTING...");
          setTimeout(() => router.push('/'), 2000);
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'AUTHENTICATION FAILED');
    } finally {
      // Ensure loading is cleared regardless of outcome if we haven't redirected
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // Page will redirect away, so no need for setLoading(false) here unless redirect fails
    } catch (err: any) {
      setError(err.message || 'GOOGLE AUTHENTICATION FAILED');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceBackground />
        <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-neon-purple p-3 border-b-4 border-r-4 border-black mb-6">
              <PixelGamepad className="w-10 h-10" />
            </div>
            <h1 className="font-pixel text-2xl text-white uppercase tracking-tighter text-center">
              {isRegistering ? 'NEW PLAYER' : 'PLAYER LOGIN'}
            </h1>
            <p className="font-pixel text-[8px] text-muted mt-2 uppercase tracking-widest text-center">
              {isRegistering ? 'START YOUR ADVENTURE' : 'CONTINUE YOUR ADVENTURE'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive flex items-center gap-3 text-destructive font-pixel text-[10px] uppercase leading-tight">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border-2 border-green-500 flex items-center gap-3 text-green-500 font-pixel text-[10px] uppercase">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div>
              <label className="block font-pixel text-[10px] text-muted uppercase mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#09061B] border-2 border-[#1B123D] px-10 py-3 text-white font-body focus:outline-none focus:border-neon-purple"
                  placeholder="name@nexus.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-muted uppercase mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#09061B] border-2 border-[#1B123D] px-10 py-3 text-white font-body focus:outline-none focus:border-neon-purple"
                  placeholder="********"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <PixelButton 
              variant="primary" 
              className="w-full py-4 mt-4" 
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegistering ? 'REGISTER' : (pendingCred ? 'VERIFY & LINK' : 'SIGN IN'))}
            </PixelButton>
          </form>

          {!pendingCred && (
            <div className="mt-8 flex flex-col gap-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1B123D]"></div></div>
                <span className="relative bg-[#140A2E] px-4 font-pixel text-[8px] text-muted uppercase">OR LOGIN WITH</span>
              </div>

              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-white text-black font-pixel text-[10px] py-4 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                GOOGLE ACCOUNT
              </button>
            </div>
          )}

          <div className="mt-8 text-center font-pixel text-[8px] text-muted uppercase">
            {isRegistering ? (
              <>Already have an account? <button onClick={() => setIsRegistering(false)} className="text-neon-pink hover:underline">Sign In</button></>
            ) : (
              <>Don't have an account? <button onClick={() => setIsRegistering(true)} className="text-neon-pink hover:underline">Register now</button></>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
