// RESPONSIBILITY: Renders a custom searchable popover dropdown for large datasets (Rule 20). Replaces native <select> for all gyms/plans/user selectors.
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Only close if we didn't click inside the fixed menu either
        // Since we are moving the menu to fixed, we should check if the click target is within a portal, 
        // but since we are just using fixed (not portal), the menu is still a child of dropdownRef in the DOM!
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleScroll = (event: Event) => {
      if (isOpen) {
        const target = event.target as Node;
        if (dropdownRef.current && dropdownRef.current.contains(target)) {
          return; // Ignore scroll events originating from inside the dropdown
        }
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // Use capture phase for scroll to catch scroll events on any scrollable container
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleOpen = () => {
    if (disabled) return;
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      
      // Calculate if it should open upwards to prevent falling off the bottom edge
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 250; // Approx max-h-60 + padding
      
      if (spaceBelow < menuHeight && rect.top > menuHeight) {
        // Open upwards
        setMenuStyle({
          position: 'fixed',
          bottom: window.innerHeight - rect.top + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999
        });
      } else {
        // Open downwards
        setMenuStyle({
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999
        });
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        className={`w-full bg-input border border-border rounded-lg px-4 py-2 flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={toggleOpen}
      >
        <span className={`text-sm ${!selectedOption ? 'text-muted-foreground' : 'text-foreground'} truncate`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className="text-muted-foreground" />
      </div>

      {isOpen && !disabled && (
        <div 
          className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden motion-safe:animate-in fade-in zoom-in-95 duration-100"
          style={menuStyle}
        >
          <div className="p-2 border-b border-border relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              className="w-full pl-8 pr-4 py-1.5 text-sm bg-input border border-border rounded-md focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-input ${
                    option.value === value ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && <Check size={14} className="text-primary" />}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
