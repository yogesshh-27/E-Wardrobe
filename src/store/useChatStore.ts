import { create } from 'zustand';
import { ChatMessage, Outfit, ProductItem, WardrobeItem, UserProfile } from '@/types';
import { stylistService } from '@/services/stylistService';

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;

  // Actions
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  sendMessage: (
    text: string,
    wardrobe: WardrobeItem[],
    userProfile: UserProfile
  ) => Promise<void>;
  clearChat: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: "Hello! I am your AI Personal Stylist. I've analyzed your wardrobe preferences and silhouettes. Ask me for an outfit combination, event styling, or travel recommendations!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: INITIAL_MESSAGES,
  isTyping: false,

  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  sendMessage: async (text, wardrobe, userProfile) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));

    try {
      const response = await stylistService.chat(text, get().messages, wardrobe, userProfile);
      const assistantMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedOutfits: response.outfits,
        suggestedProducts: response.products,
      };
      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
      }));
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: "I couldn't process that styling request right now. Let's try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isTyping: false,
      }));
    }
  },

  clearChat: () => set({ messages: INITIAL_MESSAGES }),
}));
