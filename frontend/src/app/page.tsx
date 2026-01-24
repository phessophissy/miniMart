'use client';

import dynamic from 'next/dynamic';

// Dynamically import the main content to avoid SSR issues with @stacks packages
const MainContent = dynamic(() => import('@/components/MainContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin w-8 h-8 rounded-full border-2 border-yellow-500 border-t-transparent" />
    </div>
  ),
});

export default function Home() {
  return <MainContent />;
}
