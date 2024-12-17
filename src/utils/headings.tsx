'use client';

import React, { createContext, useContext, useState } from 'react';

interface HeadingLevelContextType {
  level: number;
  increment: () => void;
  decrement: () => void;
}

const HeadingLevelContext = createContext<HeadingLevelContextType>({
  level: 1,
  increment: () => {},
  decrement: () => {},
});

interface HeadingLevelProviderProps {
  children: React.ReactNode;
  initialLevel?: number;
}

export function HeadingLevelProvider({ children, initialLevel = 1 }: HeadingLevelProviderProps) {
  const [level, setLevel] = useState(initialLevel);

  const increment = () => setLevel((prev) => Math.min(prev + 1, 6));
  const decrement = () => setLevel((prev) => Math.max(prev - 1, 1));

  return (
    <HeadingLevelContext.Provider value={{ level, increment, decrement }}>
      {children}
    </HeadingLevelContext.Provider>
  );
}

export function useHeadingLevel() {
  const context = useContext(HeadingLevelContext);
  if (!context) {
    throw new Error('useHeadingLevel must be used within a HeadingLevelProvider');
  }
  return context;
}

interface HeadingSectionProps {
  children: React.ReactNode;
  increment?: boolean;
}

export function HeadingSection({ children, increment = true }: HeadingSectionProps) {
  const { level, increment: inc, decrement } = useHeadingLevel();

  React.useEffect(() => {
    if (increment) {
      inc();
      return () => decrement();
    }
  }, [increment, inc, decrement]);

  return <>{children}</>;
}

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Heading({ children, className = '', ...props }: HeadingProps) {
  const { level } = useHeadingLevel();
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return React.createElement(
    Tag,
    {
      className: `heading-${level} ${className}`,
      ...props
    },
    children
  );
}
