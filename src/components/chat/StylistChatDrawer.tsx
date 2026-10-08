'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, ExternalLink } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOutfitStore } from '@/store/useOutfitStore';

const SUGGESTED_PROMPTS = [
  'What should I wear tomorrow?',
  'What should I wear to a wedding?',
  'Make an outfit using my black jeans.',
  'I am going to Goa. What should I pack?',
  'I want an old-money look.',
  'Suggest an outfit under ₹3000.',
];

export const StylistChatDrawer: React.FC = () => {
  const { isOpen, setIsOpen, messages, isTyping, sendMessage, clearChat } = useChatStore();
  const { items } = useWardrobeStore();
  const { user } = useAuthStore();
  const { saveOutfit, openTryOn } = useOutfitStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || !user) return;
    sendMessage(text.trim(), items, user);
    if (!textToSend) setInput('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[#E7E0D6] bg-[#FAF8F5] shadow-2xl animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#E7E0D6] px-5 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B4533C] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-[#1C1917]">
              AI Personal Stylist
            </h3>
            <p className="text-[11px] text-[#78716C]">
              Syncs with your {items.length} wardrobe pieces
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-[11px] text-[#78716C] hover:text-[#B4533C] transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-[#57534E] hover:bg-[#F4EFEA] transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B4533C]/10 text-[#B4533C]">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#B4533C] text-white shadow-xs'
                  : 'bg-white border border-[#E7E0D6] text-[#1C1917] shadow-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Inline Outfit Suggestions if present */}
              {msg.suggestedOutfits && msg.suggestedOutfits.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-[#E7E0D6] pt-2.5">
                  {msg.suggestedOutfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      className="rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-2.5"
                    >
                      <p className="font-bold text-xs text-[#1C1917]">{outfit.name}</p>
                      <p className="text-[11px] text-[#57534E] mt-0.5">{outfit.reason}</p>
                      <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                        {outfit.items.map((i) => (
                          <img
                            key={i.id}
                            src={i.image}
                            alt={i.name}
                            className="h-10 w-10 rounded-md object-cover border border-[#E7E0D6]"
                            title={i.name}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => saveOutfit(outfit)}
                          className="flex-1 rounded-lg bg-[#B4533C] py-1 text-[10px] font-semibold text-white shadow-2xs hover:bg-[#9E4530]"
                        >
                          Save Look
                        </button>
                        <button
                          onClick={() => openTryOn(outfit)}
                          className="flex-1 rounded-lg border border-[#E7E0D6] bg-white py-1 text-[10px] font-semibold text-[#1C1917] hover:bg-[#F4EFEA]"
                        >
                          Virtual Try-On
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline Product Recommendations if present */}
              {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-[#E7E0D6] pt-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                    Recommended Pieces
                  </p>
                  {msg.suggestedProducts.map((p) => (
                    <a
                      key={p.id}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-[#E7E0D6] bg-[#FAF8F5] p-2 hover:bg-white transition-colors"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-9 w-9 rounded-md object-cover border border-[#E7E0D6]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#1C1917] truncate">{p.name}</p>
                        <p className="text-[10px] text-[#B4533C] font-semibold">
                          ₹{p.price.toLocaleString('en-IN')} on {p.platform}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-[#78716C]" />
                    </a>
                  ))}
                </div>
              )}

              <span
                className={`text-[9px] mt-1 block text-right ${
                  msg.sender === 'user' ? 'text-white/80' : 'text-[#78716C]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E7E0D6] text-[#57534E]">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#78716C] bg-white border border-[#E7E0D6] w-fit rounded-full px-3 py-1.5 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#B4533C] animate-spin" />
            <span>AI Stylist is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="border-t border-[#E7E0D6] bg-white px-3 py-2">
        <p className="text-[10px] font-semibold text-[#78716C] mb-1.5">Quick Inspiration</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="shrink-0 rounded-full border border-[#E7E0D6] bg-[#FAF8F5] px-2.5 py-1 text-[11px] text-[#57534E] hover:border-[#B4533C] hover:text-[#B4533C] hover:bg-white transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-[#E7E0D6] p-3 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your stylist anything..."
            className="flex-1 rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1C1917] placeholder-[#78716C] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B4533C] text-white disabled:opacity-50 hover:bg-[#9E4530] transition-colors"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
