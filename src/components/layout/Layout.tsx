import React from 'react';
import SkipLink from '../common/SkipLink';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <SkipLink targetId="main-content" />
      
      <div className="min-h-screen bg-gray-900">
        <header
          role="banner"
          className="fixed top-0 left-0 right-0 z-40 bg-gray-800/80 backdrop-blur-lg"
        >
          {/* Header content */}
        </header>

        <main
          id="main-content"
          role="main"
          tabIndex={-1}
          className="pt-16 focus:outline-none"
          // Add a subtle focus style that doesn't interfere with content
          style={{ outline: 'none' }}
        >
          {children}
        </main>

        <footer
          role="contentinfo"
          className="bg-gray-800 text-white py-8"
        >
          {/* Footer content */}
        </footer>
      </div>
    </>
  );
}
