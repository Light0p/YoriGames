import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'FAQ | YoriGames',
  description: 'Frequently asked questions about the YoriGames platform.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Is YoriGames free to play?",
      answer: "Yes! All games on YoriGames are free to play instantly in your browser. We support our developers through optional cosmetic purchases in our upcoming store and minimal, non-intrusive advertisements."
    },
    {
      question: "Do I need to download anything?",
      answer: "Never. Every game on YoriGames is built to run directly in modern web browsers using HTML5 and WebGL technologies. Just click and play."
    },
    {
      question: "Can I save my progress?",
      answer: "Most games utilize local browser storage to save your progress. For a more permanent and cross-device experience, we recommend creating a YoriGames account."
    },
    {
      question: "How can I submit my own game?",
      answer: "We love indie developers! Check out our Developer portal (linked in the footer) to find our SDK and submission guidelines."
    },
    {
      question: "What platforms are supported?",
      answer: "YoriGames works on Desktop, Tablets, and Mobile devices. As long as you have a modern browser (Chrome, Safari, Firefox, or Edge), you're ready to play."
    }
  ];

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="flex items-center gap-6 mb-16">
          <div className="bg-neon-purple p-4 border-b-4 border-r-4 border-black">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-pixel text-4xl text-white uppercase tracking-tighter">
              F.A.<span className="text-neon-purple">Q.</span>
            </h1>
            <p className="font-headline text-muted uppercase">Answers to common transmission queries.</p>
          </div>
        </div>

        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-12 shadow-[8px_8px_0_0_#000]">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-[#1B123D] py-2">
                <AccordionTrigger className="font-headline text-lg text-white uppercase hover:text-neon-purple transition-colors text-left py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Footer />
    </main>
  );
}