
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { useAuth, useUser, useStorage, useFirestore } from '@/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, User, Mail, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { compressImage } from '@/lib/image-compression';

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const auth = useAuth();
  const storage = useStorage();
  const db = useFirestore();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
    if (user) {
      setUsername(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, authLoading, router]);

  const syncToFirestore = async (name: string, url: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: name,
      username: name.toLowerCase(), // Added for case-insensitive search
      photoURL: url,
      email: user.email || '',
      lastUpdated: serverTimestamp()
    }, { merge: true });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL
      });
      await syncToFirestore(username, photoURL);
      setSuccess('PROFILE DATA UPDATED SUCCESSFULLY');
    } catch (err: any) {
      setError(err.message || 'FAILED TO UPDATE PROFILE');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    try {
      const compressedBlob = await compressImage(file);
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, compressedBlob);
      const url = await getDownloadURL(storageRef);
      setPhotoURL(url);
      await updateProfile(user, { photoURL: url });
      await syncToFirestore(username || user.displayName || '', url);
      setSuccess('AVATAR TRANSMITTED SUCCESSFULLY');
    } catch (err: any) {
      setError(err.message || 'FAILED TO UPLOAD AVATAR');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (authLoading || !user) {
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

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-6 sm:p-10 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <AvatarImage src={photoURL} />
                <AvatarFallback className="bg-neon-purple text-white font-pixel text-xl uppercase">
                  {username.charAt(0) || user.email?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-neon-pink p-2 border-2 border-black hover:scale-110 transition-transform disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Camera className="w-4 h-4 text-white" />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl text-white uppercase mt-6 tracking-tighter">
              PLAYER DOSSIER
            </h1>
            <p className="font-pixel text-[8px] text-muted mt-2 uppercase tracking-widest">
              SYSTEM ID: {user.uid.substring(0, 12)}...
            </p>
          </div>

          {success && (
            <div className="mb-8 p-4 bg-green-500/10 border-2 border-green-500 flex items-center gap-3 text-green-500 font-pixel text-[10px] uppercase">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border-2 border-destructive flex items-center gap-3 text-destructive font-pixel text-[10px] uppercase">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-muted uppercase tracking-widest">
                Email Frequency (READ-ONLY)
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={user.email || ''} 
                  readOnly 
                  className="w-full bg-[#09061B] border-2 border-[#1B123D] px-12 py-4 text-white font-body opacity-60 cursor-not-allowed"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-pixel text-[10px] text-muted uppercase tracking-widest">
                Call Sign (USERNAME)
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#09061B] border-2 border-[#1B123D] px-12 py-4 text-white font-body focus:outline-none focus:border-neon-purple transition-colors"
                  placeholder="CHOOSE YOUR NAME..."
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <PixelButton 
                variant="primary" 
                className="flex-1 py-5" 
                type="submit"
                disabled={saving}
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SAVE CHANGES'}
              </PixelButton>
              
              <PixelButton 
                variant="secondary" 
                className="sm:w-auto py-5 px-8" 
                type="button"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>EXIT SYSTEM</span>
              </PixelButton>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
