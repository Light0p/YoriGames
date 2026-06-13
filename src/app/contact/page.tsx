
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { ChevronDown, Terminal, Radio, User, Mail, MessageSquare, Shield } from 'lucide-react';

type UplinkStatus = "STANDBY" | "TRANSMITTING..." | "ESTABLISHED!" | "FAILED";

export default function ContactPage() {
  const [uplinkStatus, setUplinkStatus] = useState<UplinkStatus>("STANDBY");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedOption] = useState("General Support");
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
    setUplinkStatus("TRANSMITTING...");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    // Add custom fields to payload
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
        setUplinkStatus("ESTABLISHED!");
        (e.target as HTMLFormElement).reset();
        setSelectedOption("General Support");
      } else {
        setUplinkStatus("FAILED");
        setErrorMessage(data.message || "Transmission Interrupted.");
      }
    } catch (err) {
      setUplinkStatus("FAILED");
      setErrorMessage("Network Anomaly Detected.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d051c] font-pixel selection:bg-[#00f0ff] selection:text-black relative">
      <SpaceBackground />
      <Navbar />

      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block border-2 border-[#2a1744] px-4 py-2 mb-6 bg-[#160a2c]">
             <span className="text-[#00ff41] animate-pulse">● UPLINK STATUS: [{uplinkStatus}]</span>
          </div>
          <h1 className="text-3xl sm:text-5xl text-white uppercase tracking-tighter mb-4 [text-shadow:4px_4px_0px_#d11a5a]">
            TERMINAL <span className="text-[#00f0ff]">INTERFACE</span>
          </h1>
          <p className="text-[#8e7fbe] text-[10px] uppercase tracking-widest">Sector 7 Communications Hub</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar: Mission Intel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#160a2c] border-2 border-[#2a1744] p-8 rounded-none shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-4 mb-6 border-b-2 border-[#2a1744] pb-4">
                <Terminal className="text-[#00f0ff] w-6 h-6" />
                <h2 className="text-white text-xs uppercase">Mission Intel</h2>
              </div>
              <p className="text-[#8e7fbe] text-[10px] leading-relaxed mb-8 uppercase">
                We are independent developers building YoriGames as a passion project. We focus on zero-install, high-performance browser magic.
              </p>
              
              <div className="space-y-4">
                <div className="bg-[#05020a] border-2 border-[#2a1744] p-4 group hover:border-[#00f0ff] transition-colors">
                  <div className="text-[#8e7fbe] text-[8px] uppercase mb-1">Central Command</div>
                  <a href="mailto:yorionlinegames@gmail.com" className="text-[#00ff41] text-[10px] break-all">
                    yorionlinegames@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-[#8e7fbe] text-[8px] px-2 uppercase">
                  <Radio className="w-3 h-3 animate-pulse text-[#d11a5a]" />
                  <span>Signals Encrypted (AES-256)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#160a2c]/50 border-2 border-dashed border-[#2a1744] p-6 text-center rounded-none">
               <Shield className="w-8 h-8 text-[#2a1744] mx-auto mb-4" />
               <p className="text-[#8e7fbe] text-[8px] uppercase leading-relaxed">
                 All transmissions are logged for safety protocols.
               </p>
            </div>
          </div>

          {/* Main Panel: Send Transmission */}
          <div className="lg:col-span-8">
            <div className="bg-[#160a2c] border-2 border-[#2a1744] p-6 sm:p-10 rounded-none shadow-[12px_12px_0_0_#000]">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[#8e7fbe] text-[8px] uppercase tracking-widest block">Call Sign</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a1744]" />
                       <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="ENTER NAME..."
                        className="w-full bg-[#05020a] border-2 border-[#2a1744] px-12 py-4 text-[#00ff41] placeholder:text-[#2a1744] outline-none focus:border-[#00f0ff] transition-colors text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[#8e7fbe] text-[8px] uppercase tracking-widest block">Freq (Email)</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2a1744]" />
                       <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="NAME@NEXUS.COM"
                        className="w-full bg-[#05020a] border-2 border-[#2a1744] px-12 py-4 text-[#00ff41] placeholder:text-[#2a1744] outline-none focus:border-[#00f0ff] transition-colors text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Pixel-Art Dropdown */}
                <div className="space-y-3" ref={dropdownRef}>
                  <label className="text-[#8e7fbe] text-[8px] uppercase tracking-widest block">Transmission Priority</label>
                  <div className="relative">
                    <div 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-[#05020a] border-2 border-[#2a1744] px-4 py-4 flex items-center justify-between cursor-pointer group hover:border-[#00f0ff] transition-colors"
                    >
                      <span className="text-[#00ff41] text-xs uppercase">{selectedPriority}</span>
                      <ChevronDown className={cn("text-[#2a1744] w-5 h-5 transition-transform", isDropdownOpen && "rotate-180")} />
                    </div>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full bg-[#05020a] border-2 border-[#2a1744] border-t-0 z-50 shadow-[8px_8px_0_0_#000]">
                        {priorities.map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setSelectedOption(option);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-4 text-[#00ff41] text-xs uppercase cursor-pointer hover:bg-[#d11a5a] hover:text-white transition-colors border-b border-[#2a1744] last:border-b-0"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[#8e7fbe] text-[8px] uppercase tracking-widest block">Message Payload</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-[#2a1744]" />
                    <textarea 
                      name="message"
                      required
                      rows={6}
                      placeholder="ENTER SIGNAL DATA..."
                      className="w-full bg-[#05020a] border-2 border-[#2a1744] px-12 py-4 text-[#00ff41] placeholder:text-[#2a1744] outline-none focus:border-[#00f0ff] transition-colors text-xs resize-none"
                    ></textarea>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border-2 border-red-500 p-4 text-red-500 text-[8px] uppercase">
                    ERROR: {errorMessage}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={uplinkStatus === "TRANSMITTING..."}
                  className="w-full bg-[#d11a5a] text-white py-6 px-8 text-xs uppercase tracking-[0.2em] border-b-4 border-r-4 border-black hover:bg-[#ff1e6e] active:translate-y-1 active:border-b-0 active:border-r-0 transition-all shadow-[4px_4px_0_0_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-4">
                    {uplinkStatus === "TRANSMITTING..." ? (
                      <span className="animate-pulse">INITIALIZING UPLINK...</span>
                    ) : (
                      "INITIATE TRANSMISSION"
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
