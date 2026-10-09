'use client';

import React from 'react';
import LoginPage from '@/app/(auth)/login/page';

export default function RootLandingPage() {
  // Root landing page ALWAYS displays the login window
  return <LoginPage />;
}
