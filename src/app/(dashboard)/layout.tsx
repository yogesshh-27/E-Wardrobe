'use client';

import React, { useState } from 'react';
import { TopNavbar } from '@/components/navigation/TopNavbar';
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { FloatingStylistButton } from '@/components/chat/FloatingStylistButton';
import { StylistChatDrawer } from '@/components/chat/StylistChatDrawer';
import { VirtualTryOnModal } from '@/components/stylist/VirtualTryOnModal';
import { ItemDetailModal } from '@/components/wardrobe/ItemDetailModal';
import { useWardrobeStore } from '@/store/useWardrobeStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedItem, setSelectedItem } = useWardrobeStore();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col">
      {/* Sidebar */}
      <DesktopSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <TopNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileBottomNav />

      {/* AI Assistant Floating Button & Chat Drawer */}
      <FloatingStylistButton />
      <StylistChatDrawer />

      {/* Global Virtual Try-on Simulation Modal */}
      <VirtualTryOnModal />

      {/* Global Wardrobe Item Details Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
