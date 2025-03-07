import React, { useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react';
import AppContext from '../context/AppContext';

const AnimatedSearchInput = ({ searchQuery, setSearchQuery }) => {
  const { setProducts } = useContext(AppContext);

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
    const intervalId = setInterval(() => {
      index = (index + 1) % suggestions.length;
      setPlaceholder(`Find ${suggestions[index]}...`);
    }, 1800);

    return () => clearInterval(intervalId);
  }, [suggestions]);

  // Function to hit the search API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Adjust the URL if needed (for instance, adding a base URL or a prefix like "/api")
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/search?title=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      console.log("searchign data --> ",data);

      if (data.status) {
        setProducts(data.posts);
      } else {
        // Optionally handle the case where no matching posts are found
        setProducts([]);
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-grow items-center">
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full border-2 border-r-0 py-2 px-4 outline-none focus:border-[#23e5db] transition-all duration-200"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
      <button 
        type="submit"
        className="bg-[#002f34] border-2 border-[#002f34] p-2 rounded-r-md"
      >
        <Search size={22} className="text-white" />
      </button>
    </form>
  );
};

export default AnimatedSearchInput;
