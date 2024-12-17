'use client';

import React from 'react';
import { HeadingSection, Heading } from '@/utils/headings';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  ariaLabel?: string;
}

export function Section({
  title,
  description,
  children,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentClassName = '',
  ariaLabel,
}: SectionProps) {
  return (
    <HeadingSection>
      <section
        className={`space-y-4 ${className}`}
        aria-label={ariaLabel}
      >
        <div className="space-y-1">
          <Heading className={titleClassName}>
            {title}
          </Heading>
          
          {description && (
            <p className={`text-gray-600 ${descriptionClassName}`}>
              {description}
            </p>
          )}
        </div>

        <div className={contentClassName}>
          {children}
        </div>
      </section>
    </HeadingSection>
  );
}
