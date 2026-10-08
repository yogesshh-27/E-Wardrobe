'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Mail,
  Send,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does the AI vision auto-tagging work?',
    a: 'When you upload an item from your gallery or camera, our vision service processes visual traits including weave texture, collar lines, color shades, and cut formality. It auto-tags the category and occasions, but you always have the final say on the confirmation screen.',
  },
  {
    q: 'Does E-Wardrobe force me to upload my entire wardrobe at once?',
    a: 'Never. The platform is designed around the "wardrobe-first, growth-friendly" UX philosophy. It works whether you have 0 items, 3 items, or 50 items. As your wardrobe catalog expands, recommendation accuracy and color harmony improve naturally.',
  },
  {
    q: 'How does Virtual Try-On work in this prototype?',
    a: 'This version provides a simulated preview overlay that composites styled outfit pieces over your full-body photo with a Before/After toggle. A production diffusion try-on model can be integrated via our service interface adapter.',
  },
  {
    q: 'Where do the shopping links lead?',
    a: 'When an ensemble has a missing piece, our shopping engine creates direct links to product searches on Myntra, Amazon, Flipkart, and Meesho so you can effortlessly complete your capsule.',
  },
  {
    q: 'How is my private data handled?',
    a: 'All photos and style details are held securely in your local browser storage. You can delete individual photos, items, or wipe your entire account and data at any time from your Profile.',
  },
];

export default function HelpPage() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E0D6] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Help & Support
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Frequently asked questions, styling guidance, and support inquiries.
        </p>
      </div>

      {/* FAQs Section */}
      <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-5">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="h-5 w-5 text-[#B4533C]" />
          <h2 className="font-serif text-xl font-bold text-[#1C1917]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 divide-y divide-[#F4EFEA]">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="pt-3">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-xs sm:text-sm font-bold text-[#1C1917] hover:text-[#B4533C] py-2 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[#78716C]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#78716C]" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-[#57534E] leading-relaxed pb-3 pt-1 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Contact Form */}
      <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-5">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-[#5F6F52]" />
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Contact Concierge Styling Support
            </h2>
            <p className="text-xs text-[#57534E]">
              Have a question or feedback regarding outfit suggestions? Drop us a note.
            </p>
          </div>
        </div>

        {isSent ? (
          <div className="rounded-2xl bg-[#5F6F52]/10 border border-[#5F6F52]/30 p-6 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-[#5F6F52] mx-auto" />
            <h4 className="font-serif font-bold text-base text-[#1C1917]">
              Message Received!
            </h4>
            <p className="text-xs text-[#57534E]">
              Thank you for reaching out. Our fashion concierge team will review your message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitContact} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                Your Message / Question
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our styling team help you today?..."
                className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
