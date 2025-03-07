import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import apiRequest from '../utils/ApiRequest';
import { showToast } from './ToastComponent';
import ProductCard from './ProductCard'; // Assume you have this component

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');
  const searchLocation = searchParams.get('location');

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery, searchLocation]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url;
      if (searchQuery) {
        // If we're on a search page
        url = `${process.env.REACT_APP_BACKEND}/api/posts/search?query=${encodeURIComponent(searchQuery)}`;
        if (searchLocation) {
          url += `&location=${encodeURIComponent(searchLocation)}`;
        }
      } else {
        // If we're on a category page
        url = `${process.env.REACT_APP_BACKEND}/api/search/cat/${category}`;
      }

      const { resStatus, data, error } = await apiRequest(url, 'GET');
      
      if (resStatus) {
        setProducts(data);
      } else {
        showToast(error?.message || 'Failed to fetch products', 'error');
      }
    } catch (err) {
      showToast('Error fetching products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"${searchLocation ? ` in ${searchLocation}` : ''}`;
    }
    
    switch(category) {
      case 'textbooks': return 'Textbooks';
      case 'notes': return 'Notes';
      case 'stationery': return 'Stationery';
      case 'calculators': return 'Calculators';
      case 'uniforms': return 'Uniforms';
      default: return 'Products';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{getPageTitle()}</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3a77ff]"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">No products found</h2>
          <p className="mt-2 text-gray-500">
            {searchQuery ? 'Try a different search term or location' : 'Check back later for new listings in this category'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;