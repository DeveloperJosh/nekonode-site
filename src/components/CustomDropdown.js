import React, { useState } from 'react';

const CustomDropdown = ({ label, options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const uniqueOptions = [...new Set(options)]; // Deduplicate options

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            {uniqueOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`${
                  selectedOption === option ? 'bg-yellow-500 text-gray-800' : 'bg-gray-700 text-gray-300'
                } group flex rounded-md items-center w-full px-4 py-2 text-sm hover:bg-yellow-600 hover:text-gray-800`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
