"use client"

import React, { useState } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, Shield, User, Loader2, Radio } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { TransmissionModal } from '@/components/contact/TransmissionModal';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [result, setResult] = useState<"IDLE" | "SENDING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamBio = "We are indie developers building YoriGames as a passion project. We love creating browser-native experiences that are fun, fast, and accessible to everyone.";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult("SENDING");
    setIsModalOpen(true);
    
    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      
      const resData = await response.json();
      
      if (resData.success) {
        setResult("SUCCESS");
        (e.target as HTMLFormElement).reset();
      } else {
        setResult("ERROR");
        setErrorMessage(resData.message || "Transmission failed.");
      }
    } catch (error) {
      setResult("ERROR");
      setErrorMessage("Network anomaly detected.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setResult("IDLE");
      setErrorMessage("");
    }, 300);
  };

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="text-center mb-16">
          <div className="font-pixel text-[10px] text-neon-pink uppercase tracking-widest mb-4">ESTABLISH UPLINK</div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            CONTACT <span className="text-neon-pink">US</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Info Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-neon-purple p-2 border-b-2 border-r-2 border-black">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-pixel text-xs text-white uppercase">The Team</h2>
              </div>
              <p className="font-body text-sm text-muted leading-relaxed mb-8">
                {teamBio}
              </p>
              
              <div className="pt-8 border-t border-[#1B123D]">
                 <div className="flex items-center gap-3 mb-4">
                    <Radio className="w-4 h-4 text-neon-cyan animate-pulse" />
                    <span className="font-pixel text-[8px] text-neon-cyan uppercase tracking-widest">Central Command</span>
                 </div>
                 <div className="bg-[#09061B] border-2 border-[#1B123D] p-4 group hover:border-neon-pink transition-colors">
                    <div className="font-pixel text-[6px] text-muted uppercase mb-1">Direct Frequency</div>
                    <a href="mailto:yorionlinegames@gmail.com" className="font-body text-sm text-white hover:text-neon-pink transition-colors break-all">
                      yorionlinegames@gmail.com
                    </a>
                 </div>
              </div>
            </div>

            <div className="bg-[#140A2E]/50 border-2 border-dashed border-[#1B123D] p-6 text-center">
               <Shield className="w-8 h-8 text-neon-gold mx-auto mb-4 opacity-40" />
               <p className="font-pixel text-[6px] text-muted uppercase leading-relaxed">
                 End-to-end encrypted signals.<br />All transmissions monitored for protocol safety.
               </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-12 shadow-[8px_8px_0_0_#000]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-[#1B123D] pb-6">
                <h2 className="font-pixel text-xl text-white uppercase">Send Transmission</h2>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    result === "SENDING" ? "bg-neon-gold animate-ping" : "bg-green-500"
                  )} />
                  <span className="font-pixel text-[8px] text-muted uppercase tracking-widest">
                    UPLINK STATUS: <span className={result === "SENDING" ? "text-neon-gold" : "text-green-500"}>
                      {result === "SENDING" ? "[TRANSMITTING...]" : "[STANDBY]"}
                    </span>
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <input type="hidden" name="access_key" value="4c662864-7bcc-401a-82e9-3440fedbd94b" />
                <input type="hidden" name="subject" value="New Transmission: YoriGames Contact Form" />
                <input type="hidden" name="from_name" value="YoriGames Contact System" />
                <input type="hidden" name="replyto" value="@{email}" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-muted uppercase tracking-widest">Player Call Sign</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="ENTER NAME..."
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-4 text-white font-body focus:outline-none focus:border-neon-pink transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-muted uppercase tracking-widest">Comm Frequency (Email)</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="YOUR@EMAIL.COM"
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-4 text-white font-body focus:outline-none focus:border-neon-pink transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-pixel text-[8px] text-muted uppercase tracking-widest">Transmission Priority</label>
                  <select 
                    name="priority"
                    required
                    className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-4 text-white font-body focus:outline-none focus:border-neon-pink appearance-none cursor-pointer transition-colors"
                  >
                    <option value="General Support">GENERAL SUPPORT</option>
                    <option value="Business Inquiry">BUSINESS INQUIRY</option>
                    <option value="DMCA / Legal">DMCA / LEGAL</option>
                    <option value="Feedback">FEEDBACK</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-pixel text-[8px] text-muted uppercase tracking-widest">Message Payload</label>
                  <textarea 
                    name="message"
                    required
                    rows={6}
                    placeholder="ENTER YOUR MESSAGE..."
                    className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-4 text-white font-body focus:outline-none focus:border-neon-pink resize-none transition-colors"
                  ></textarea>
                </div>
                
                <PixelButton 
                  type="submit" 
                  variant="secondary" 
                  className="w-full py-6"
                  disabled={result === "SENDING"}
                >
                  {result === "SENDING" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    "INITIATE TRANSMISSION"
                  )}
                </PixelButton>
              </form>
            </div>
          </div>
        </div>
      </div>

      <TransmissionModal 
        isOpen={isModalOpen}
        status={result === "IDLE" ? "SENDING" : result}
        error={errorMessage}
        onClose={closeModal}
      />

      <Footer />
    </main>
  );
}
