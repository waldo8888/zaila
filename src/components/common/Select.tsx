import React, { useState, useRef, useEffect } from 'react';
import { withAria } from '@/components/hoc/withAria';
import { useAriaExpanded, useAriaSelectable } from '@/utils/aria';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(({
  options,
  value,
  onChange,
  label,
  id,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = `${id}-listbox`;
  const [expandedProps, setExpanded] = useAriaExpanded(listboxId, false);
  const { announce } = useAccessibility();

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    announce(`Selected ${options.find(opt => opt.value === optionValue)?.label}`);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={ref} className="relative" {...props}>
      <label id={`${id}-label`} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <button
        type="button"
        aria-labelledby={`${id}-label`}
        {...expandedProps}
        onClick={() => {
          setIsOpen(!isOpen);
          setExpanded(!isOpen);
        }}
        className="mt-1 relative w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
      >
        <span className="block truncate">{selectedOption?.label}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute z-10 mt-1 w-full bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          {options.map((option) => {
            const [selectableProps] = useAriaSelectable(option.value === value);
            return (
              <li
                key={option.value}
                role="option"
                {...selectableProps}
                onClick={() => handleSelect(option.value)}
                className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                  option.value === value
                    ? 'text-white bg-gray-600'
                    : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="block truncate">{option.label}</span>
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default withAria(Select, 'combobox');
