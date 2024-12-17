'use client';

import React from 'react';
import { HeadingLevelProvider } from '@/utils/headings';
import SkipLink from '../common/SkipLink';

interface LayoutProps {
  children: React.ReactNode;
  navigation?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Layout({ children, navigation, sidebar }: LayoutProps) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col">
        <SkipLink targetId="main-content" />
        
        {navigation && (
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="bg-white shadow-sm"
          >
            {navigation}
          </nav>
        )}

        <div className="flex-1 flex">
          {sidebar && (
            <aside
              role="complementary"
              aria-label="Sidebar"
              className="w-64 bg-gray-50 border-r"
            >
              {sidebar}
            </aside>
          )}

          <main
            id="main-content"
            role="main"
            className="flex-1 p-6"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>

        <footer
          role="contentinfo"
          className="bg-gray-100 py-4 px-6 border-t"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Zaila. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </HeadingLevelProvider>
  );
}
