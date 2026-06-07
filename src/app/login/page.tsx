
"use client"

import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { User, Mail, Lock, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-neon-purple p-3 border-b-4 border-r-4 border-black mb-6">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-pixel text-2xl text-white uppercase tracking-tighter">PLAYER LOGIN</h1>
            <p className="font-pixel text-[8px] text-muted mt-2 uppercase tracking-widest">CONTINUE YOUR ADVENTURE</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block font-pixel text-[10px] text-muted uppercase mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
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
                  className="w-full bg-[#09061B] border-2 border-[#1B123D] px-10 py-3 text-white font-body focus:outline-none focus:border-neon-purple"
                  placeholder="********"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              </div>
            </div>

            <PixelButton variant="primary" className="w-full py-4 mt-4">
              SIGN IN
            </PixelButton>
          </form>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1B123D]"></div></div>
              <span className="relative bg-[#140A2E] px-4 font-pixel text-[8px] text-muted uppercase">OR LOGIN WITH</span>
            </div>

            <button className="w-full bg-white text-black font-pixel text-[10px] py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              GOOGLE ACCOUNT
            </button>
          </div>

          <div className="mt-8 text-center font-pixel text-[8px] text-muted uppercase">
            Don't have an account? <Link href="/register" className="text-neon-pink hover:underline">Register now</Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
