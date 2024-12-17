import React from 'react';

interface SkipLinkProps {
  targetId: string;
  className?: string;
}

export default function SkipLink({ targetId, className = '' }: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-50
        bg-gray-900 text-white
        px-4 py-2 rounded-md
        shadow-lg
        focus:outline-none focus:ring-2 focus:ring-white
        ${className}
      `}
    >
      Skip to main content
    </a>
  );
}
