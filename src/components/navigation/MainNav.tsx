'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heading } from '@/utils/headings';

interface NavItem {
  href: string;
  label: string;
  description?: string;
}

interface MainNavProps {
  items?: NavItem[];
}

export function MainNav({ items = [] }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="px-4">
      <Heading className="sr-only">Main Navigation</Heading>
      
      <ul
        role="list"
        className="flex items-center space-x-4"
      >
        {items.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span>{item.label}</span>
                {item.description && (
                  <span className="sr-only">, {item.description}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
