import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | YoriGames',
  description: 'Professional privacy policy and data usage documentation for YoriGames.',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-8">
          PRIVACY <span className="text-neon-cyan">POLICY</span>
        </h1>
        
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-16 shadow-[8px_8px_0_0_#000]">
          <div className="font-pixel text-[10px] text-neon-cyan uppercase mb-12 border-b border-[#1B123D] pb-4">
            Last Updated: {lastUpdated}
          </div>

          <div className="font-body text-muted space-y-12">
            <p className="leading-relaxed">
              At YoriGames, accessible from yorigamesonline.online, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by YoriGames and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">1. Information We Collect</h2>
              <p className="leading-relaxed">
                YoriGames follows a standard procedure of using log files. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. We also collect information regarding the device you use to access our services and the specific pages you visit within the platform.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">2. How We Use Information</h2>
              <p className="leading-relaxed">
                We use the information we collect in various ways, including to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you for customer service or updates</li>
                <li>Find and prevent fraud</li>
                <li>Display relevant advertisements and measure their performance</li>
              </ul>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">3. Log Files</h2>
              <p className="leading-relaxed">
                Log files are used for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information. These are not linked to any information that is personally identifiable.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">4. Cookies and Web Beacons</h2>
              <p className="leading-relaxed">
                Like any other website, YoriGames uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">5. Google AdSense</h2>
              <p className="leading-relaxed">
                Google is one of our third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to yorigamesonline.online and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" className="text-neon-cyan hover:underline">https://policies.google.com/technologies/ads</a>
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">6. Analytics</h2>
              <p className="leading-relaxed">
                We use analytics tools, such as Google Analytics and Firebase Analytics, to understand user interaction with our services. These tools help us identify popular games and optimize site performance. The data collected is generally aggregated and anonymized.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">7. Third-Party Privacy Policies</h2>
              <p className="leading-relaxed">
                YoriGames's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">8. Third-Party Services</h2>
              <p className="leading-relaxed">
                To provide our gaming platform, we utilize services from the following third-party providers:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Google AdSense (Advertising)</li>
                <li>Google Analytics (Analytics)</li>
                <li>Firebase (Hosting and Analytics)</li>
                <li>GameMonetize (Game Content Feed)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">9. Data Security</h2>
              <p className="leading-relaxed">
                We take reasonable measures, including encryption and secure hosting protocols, to protect your information from unauthorized access, alteration, or destruction. However, please be aware that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">10. Children's Privacy</h2>
              <p className="leading-relaxed">
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. YoriGames does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">11. Changes to This Policy</h2>
              <p className="leading-relaxed font-body">
                We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">Contact Information</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us via email at: <span className="text-white">yorionlinegames@gmail.com</span>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
