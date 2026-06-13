"use client"

import React, { useState } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MessageSquare, Shield, Briefcase, User, Loader2 } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { TransmissionModal } from '@/components/contact/TransmissionModal';

export default function ContactPage() {
  const [result, setResult] = useState<"IDLE" | "SENDING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contactOptions = [
    { title: "General Support", email: "support@yorigamesonline.online", icon: <MessageSquare className="w-5 h-5" /> },
    { title: "Business Inquiries", email: "business@yorigamesonline.online", icon: <Briefcase className="w-5 h-5" /> },
    { title: "DMCA / Legal", email: "dmca@yorigamesonline.online", icon: <Shield className="w-5 h-5" /> },
    { title: "Feedback", email: "feedback@yorigamesonline.online", icon: <Mail className="w-5 h-5" /> },
  ];

  const teamBio = "We are a small team of indie developers building YoriGames as a passion project. We love creating things on the internet, learning new technologies, and experimenting with ideas around gaming and web development. This project is built for the experience, the challenge, and because we genuinely enjoy building cool stuff that people can use.";

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
    // Reset state after animation finishes
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 shadow-[8px_8px_0_0_#000]">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-neon-purple p-2 border-b-2 border-r-2 border-black">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-pixel text-xs text-white uppercase">The Team</h2>
              </div>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                {teamBio}
              </p>
              <div className="pt-6 border-t border-[#1B123D]">
                 <div className="font-pixel text-[8px] text-neon-purple uppercase mb-2">Primary Contact</div>
                 <a href="mailto:yorionlinegames@gmail.com" className="font-body text-white hover:text-neon-pink transition-colors break-all">yorionlinegames@gmail.com</a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {contactOptions.map((opt, i) => (
                <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-6 hover:border-neon-pink transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="text-neon-pink group-hover:scale-110 transition-transform">{opt.icon}</div>
                    <div>
                      <h3 className="font-pixel text-[8px] text-white uppercase mb-1">{opt.title}</h3>
                      <p className="font-body text-xs text-muted">{opt.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-12 shadow-[8px_8px_0_0_#000]">
              <h2 className="font-pixel text-xl text-white uppercase mb-8">Send Transmission</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="access_key" value="4c662864-7bcc-401a-82e9-3440fedbd94b" />
                <input type="hidden" name="subject" value="New Transmission: YoriGames Contact Form" />
                <input type="hidden" name="from_name" value="YoriGames Contact System" />
                <input type="hidden" name="replyto" value="@{email}" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-muted uppercase">Player Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="ENTER CALL SIGN..."
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-body focus:outline-none focus:border-neon-pink"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-muted uppercase">Comm Frequency (Email)</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      placeholder="YOUR@EMAIL.COM"
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-body focus:outline-none focus:border-neon-pink"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[8px] text-muted uppercase">Message Payload</label>
                  <textarea 
                    name="message"
                    required
                    rows={6}
                    placeholder="ENTER YOUR MESSAGE..."
                    className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-body focus:outline-none focus:border-neon-pink resize-none"
                  ></textarea>
                </div>
                
                <PixelButton 
                  type="submit" 
                  variant="secondary" 
                  className="w-full py-5"
                  disabled={result === "SENDING"}
                >
                  {result === "SENDING" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>TRANSMITTING...</span>
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

      {/* Animation Overlay */}
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
