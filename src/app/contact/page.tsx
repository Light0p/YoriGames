import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MessageSquare, Shield, Briefcase, User } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';

export const metadata: Metadata = {
  title: 'Contact Us | YoriGames',
  description: 'Reach out to the YoriGames team for support, business inquiries, or feedback.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const contactOptions = [
    { title: "General Support", email: "support@yorigamesonline.online", icon: <MessageSquare className="w-5 h-5" /> },
    { title: "Business Inquiries", email: "business@yorigamesonline.online", icon: <Briefcase className="w-5 h-5" /> },
    { title: "DMCA / Legal", email: "dmca@yorigamesonline.online", icon: <Shield className="w-5 h-5" /> },
    { title: "Feedback", email: "feedback@yorigamesonline.online", icon: <Mail className="w-5 h-5" /> },
  ];

  const yogeshBio = "Hey! I'm Yogesh, a 19-year-old indie developer building YoriGames as a passion project. I love creating things on the internet, learning new technologies, and experimenting with ideas around gaming and web development. Most of this project is being built and managed by me, from the design and coding to deployment and optimization. I'm doing this for the experience, the challenge, and because I genuinely enjoy building cool stuff that people can use. Thanks for checking out the project, and feel free to reach out with feedback, suggestions, or just to say hi!";

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
                <h2 className="font-pixel text-xs text-white uppercase">The Developer</h2>
              </div>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                {yogeshBio}
              </p>
              <div className="pt-6 border-t border-[#1B123D]">
                 <div className="font-pixel text-[8px] text-neon-purple uppercase mb-2">Primary Contact</div>
                 <div className="font-body text-white">yogeshyadav0630@gmail.com</div>
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-muted uppercase">Player Name</label>
                    <input 
                      type="text" 
                      defaultValue="Yogesh Yadav"
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-body focus:outline-none focus:border-neon-pink"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-muted uppercase">Comm Frequency (Email)</label>
                    <input 
                      type="email" 
                      defaultValue="yogeshyadav0630@gmail.com"
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-body focus:outline-none focus:border-neon-pink"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[8px] text-muted uppercase">Message Payload</label>
                  <textarea 
                    rows={6}
                    defaultValue={yogeshBio}
                    className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-body focus:outline-none focus:border-neon-pink resize-none"
                  ></textarea>
                </div>
                <PixelButton variant="secondary" className="w-full py-5">
                  INITIATE TRANSMISSION
                </PixelButton>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
