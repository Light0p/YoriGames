"use client";

import React, { useState, useRef, useEffect } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { X, ChevronDown, Terminal, ShieldAlert, Zap, Mail, User, MessageSquare } from 'lucide-react';

type UplinkStatus = "IDLE" | "SENDING" | "SUCCESS" | "ERROR";

export default function ContactPage() {
  const [status, setStatus] = useState<UplinkStatus>("IDLE");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("General Support");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const priorities = [
    "General Support",
    "Business Inquiry",
    "DMCA / Legal",
    "Feedback"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("SENDING");

    const formData = new FormData(e.currentTarget);
    const payload = {
      access_key: "4c662864-7bcc-401a-82e9-3440fedbd94b",
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      subject: `[${selectedPriority}] - New Transmission`,
      from_name: "YoriGames Contact System"
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setStatus("SUCCESS");
        (e.target as HTMLFormElement).reset();
        setSelectedPriority("General Support");
      } else {
        setStatus("ERROR");
      }
    } catch (err) {
      setStatus("ERROR");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d051c] font-pixel relative overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full" />
      </div>

      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl text-[#EC4899] uppercase tracking-tighter mb-4 [text-shadow:4px_4px_0px_#00f0ff]">
            TERMINAL INTERFACE
          </h1>
          <div className="inline-block border-2 border-[#2a1744] px-4 py-2 bg-[#160a2c]">
             <span className="text-[#00ff41] text-[10px] uppercase animate-pulse">
               ● UPLINK STATUS: [{status === "SENDING" ? "TRANSMITTING..." : "STANDBY"}]
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Intel & Security */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#160a2c] border-2 border-[#2a1744] p-8 rounded-none shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-4 mb-6 border-b-2 border-[#2a1744] pb-4">
                <Terminal className="text-[#00f0ff] w-5 h-5" />
                <h2 className="text-white text-xs uppercase tracking-widest">{">_"} MANUAL OVERRIDE</h2>
              </div>
              <p className="text-muted text-[10px] leading-relaxed mb-8 uppercase">
                If the automated uplink fails, bypass the terminal and contact Central Command directly via secure frequency.
              </p>
              
              <div className="bg-[#05020a] border-2 border-[#00f0ff] p-4 group hover:bg-[#00f0ff]/5 transition-colors">
                <div className="text-[#00f0ff] text-[8px] uppercase mb-1">Central Command</div>
                <a href="mailto:yorionlinegames@gmail.com" className="text-white text-[10px] break-all">
                  yorionlinegames@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-[#160a2c] border-2 border-[#2a1744] p-8 rounded-none shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-4 mb-6 border-b-2 border-[#2a1744] pb-4">
                <ShieldAlert className="text-red-500 w-5 h-5 animate-pulse" />
                <h2 className="text-red-500 text-xs uppercase tracking-widest">[ ENCRYPTION ACTIVE ]</h2>
              </div>
              <p className="text-muted text-[10px] leading-relaxed uppercase">
                AES-256 SECURE CHANNEL ESTABLISHED. ALL TRANSMISSIONS ARE LOGGED. UNAUTHORIZED INTERCEPTION WILL BE MET WITH COUNTER-MEASURES.
              </p>
            </div>
          </div>

          {/* Right Panel: The Form */}
          <div className="lg:col-span-8">
            <div className="bg-[#160a2c] border-2 border-[#2a1744] p-6 sm:p-10 rounded-none shadow-[12px_12px_0_0_#000]">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-muted text-[8px] uppercase tracking-widest block">Call Sign</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a1744]" />
                       <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="ENTER NAME..."
                        className="w-full bg-[#05020a] border-2 border-[#2a1744] px-12 py-4 text-white placeholder:text-[#2a1744] outline-none focus:border-[#a855f7] transition-colors text-xs rounded-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-muted text-[8px] uppercase tracking-widest block">Frequency (Email)</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a1744]" />
                       <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="NAME@NEXUS.COM"
                        className="w-full bg-[#05020a] border-2 border-[#2a1744] px-12 py-4 text-white placeholder:text-[#2a1744] outline-none focus:border-[#a855f7] transition-colors text-xs rounded-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Pixel-Art Dropdown */}
                <div className="space-y-3" ref={dropdownRef}>
                  <label className="text-muted text-[8px] uppercase tracking-widest block">Transmission Priority</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-[#05020a] border-2 border-[#2a1744] px-4 py-4 flex items-center justify-between cursor-pointer group hover:border-[#a855f7] transition-colors"
                    >
                      <span className="text-white text-xs uppercase">{selectedPriority}</span>
                      <ChevronDown className={cn("text-[#2a1744] w-5 h-5 transition-transform", isDropdownOpen && "rotate-180")} />
                    </div>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full bg-[#05020a] border-2 border-[#2a1744] border-t-0 z-50 shadow-[8px_8px_0_0_#000]">
                        {priorities.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSelectedPriority(option);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-4 text-white text-xs uppercase cursor-pointer hover:bg-[#d11a5a] transition-colors border-b border-[#2a1744] last:border-b-0"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-muted text-[8px] uppercase tracking-widest block">Message Payload</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-[#2a1744]" />
                    <textarea 
                      name="message"
                      required
                      rows={6}
                      placeholder="ENTER SIGNAL DATA..."
                      className="w-full bg-[#05020a] border-2 border-[#2a1744] px-12 py-4 text-white placeholder:text-[#2a1744] outline-none focus:border-[#a855f7] transition-colors text-xs resize-none rounded-none"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={status === "SENDING"}
                  className="w-full bg-[#d11a5a] text-white py-6 px-8 text-xs uppercase tracking-[0.2em] border-b-4 border-r-4 border-black hover:bg-[#ff1e6e] active:translate-y-1 active:border-b-0 active:border-r-0 transition-all shadow-[4px_4px_0_0_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-4">
                    {status === "SENDING" ? (
                      <span className="animate-pulse">INITIALIZING UPLINK...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>INITIATE TRANSMISSION</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Modal Overlay */}
      {status !== "IDLE" && status !== "SENDING" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#140a2c] border-4 border-[#2a1744] w-full max-w-md p-10 text-center relative shadow-[16px_16px_0_0_#000]">
            <button 
              onClick={() => setStatus("IDLE")}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8">
              {status === "SUCCESS" ? (
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-6 animate-bounce">🚀</div>
                  <h2 className="text-[#00ff41] text-xl uppercase mb-4 tracking-tighter">Transmission Successful!</h2>
                  <p className="text-white/60 text-xs uppercase leading-relaxed">
                    Your message has cleared the atmosphere and is being processed by Central Command.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-6xl mb-6 animate-pulse scale-110">💥</div>
                  <h2 className="text-red-500 text-xl uppercase mb-4 tracking-tighter">Uplink Failed!</h2>
                  <p className="text-white/60 text-xs uppercase leading-relaxed">
                    Atmospheric interference detected. The signal was lost in deep space. Please attempt a secondary uplink.
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setStatus("IDLE")}
              className="bg-white text-black px-8 py-4 text-[10px] uppercase tracking-widest border-b-4 border-r-4 border-gray-400 hover:bg-gray-200 active:translate-y-1 active:border-0 transition-all"
            >
              Return to Base
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
