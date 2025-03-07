import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const AnimatedSearchInput = ({ searchQuery, setSearchQuery }) => {
  // Define an array of suggestions to cycle through.
  const suggestions = [
    'Textbooks',
    'Notes & Study Material',
    'Stationery',
    'Second-hand Laptops',
    'Calculators',
    'Backpacks'
  ];
  
  const [placeholder, setPlaceholder] = useState(`Find ${suggestions[0]}...`);

  useEffect(() => {
    let index = 0;
    // Change the placeholder text every 3 seconds
    const intervalId = setInterval(() => {
      index = (index + 1) % suggestions.length;
      setPlaceholder(`Find ${suggestions[index]}...`);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [suggestions]);

  return (
    <div className="flex flex-grow items-center">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full border-2 border-r-0 py-2 px-4 outline-none focus:border-[#23e5db]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="bg-[#002f34] border-2 border-[#002f34] p-2 rounded-r-md"
      >
        <Search size={22} className="text-white" />
      </button>
    </div>
  );
};

export default AnimatedSearchInput;
