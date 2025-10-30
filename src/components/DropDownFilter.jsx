import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DropDownFilter({ name, options, onFilterChange, cleared }) {
  const initialOption = { label: name, value: '' };
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(initialOption);
  const menuOptions = [initialOption, ...options];

  const handleSelect = (option) => {
    setSelectedFilter(option);
    setIsOpen(false);
    if (onFilterChange) onFilterChange(option.value);
  };

  useEffect(() => {
    setSelectedFilter(initialOption);
  }, [cleared]);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-5 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 min-w-[150px]"
      >
        {selectedFilter.label}
        {isOpen ? <ChevronUp className="w-5 ml-2" /> : <ChevronDown className="w-5 ml-2" />}
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {menuOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-2 text-sm transition duration-100 ease-in-out ${
                  selectedFilter.value === option.value
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
