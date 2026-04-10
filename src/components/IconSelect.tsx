import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const IconSelect: React.FC<IconSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className} focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500/50 transition-all`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between text-left focus:outline-none outline-none rounded-inherit"
      >
        <div className="flex items-center gap-3 w-full">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <div className="text-white/30 flex-shrink-0">{selectedOption.icon}</div>
              )}
              <span className="text-white/70 block truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-white/40 block w-full truncate">{placeholder}</span>
          )}
        </div>
        <FiChevronDown
          className={`text-white/30 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 min-w-[max-content] bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                value === option.value
                  ? "bg-red-500/10 text-red-500"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {option.icon && (
                <div
                  className={`${
                    value === option.value ? "text-red-500" : "text-white/30"
                  }`}
                >
                  {option.icon}
                </div>
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconSelect;
