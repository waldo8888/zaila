import React, { useRef } from 'react';
import { withAria } from '@/components/hoc/withAria';
import { useAriaAnnounce } from '@/utils/aria';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import FocusTrap from './FocusTrap';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(({
  isOpen,
  onClose,
  title,
  children,
  description,
  ...props
}, ref) => {
  const { announceRef, announceMessage } = useAriaAnnounce();
  const dialogRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      announceMessage(`Dialog opened: ${title}`);
    }
  }, [isOpen, title, announceMessage]);

  if (!isOpen) return null;

  return (
    <FocusTrap isActive={isOpen} onEscape={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          ref={dialogRef}
          className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
        >
          <h2 id="dialog-title" className="text-xl font-bold text-white">
            {title}
          </h2>
          {description && (
            <p id="dialog-description" className="mt-2 text-gray-300">
              {description}
            </p>
          )}
          <div className="mt-4">{children}</div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        <div ref={announceRef} className="sr-only" />
      </div>
    </FocusTrap>
  );
});

Dialog.displayName = 'Dialog';

export default withAria(Dialog, 'dialog');
