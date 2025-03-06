// src/components/ProductList.jsx
import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import AppContext from '../context/AppContext';
import Spinner from './Spinner';

const ProductList = () => {
  const { products, fetchProducts } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    // Lower rotation strength for the parent container
    const rotateX = (-y / rect.height) * 10;
    const rotateY = (x / rect.width) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Dynamic shadow style for the parent container
  const shadowStyle = {
    boxShadow: `${-tilt.y / 4}px ${tilt.x / 4}px 20px rgba(0,0,0,0.2)`
  };

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Latest Listings</h1>
        {loading ? (
          <Spinner />
        ) : (
          // Apply the tilt effect to the grid container
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.1s ease-out',
              ...shadowStyle
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                // Prevent the motion wrapper from intercepting mouse events
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ pointerEvents: 'auto' }}>
                  <ProductCard {...product} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
