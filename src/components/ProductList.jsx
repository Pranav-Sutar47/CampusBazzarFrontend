// import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import ProductCard from './ProductCard';
// import AppContext from '../context/AppContext';
// import Spinner from './Spinner';

// const ProductList = () => {
//   const { products, setProducts } = useContext(AppContext);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const observer = useRef();
//   const isLoadingRef = useRef(false);
//   const reachedEndRef = useRef(false);

//   const loadMoreProducts = useCallback(async () => {
//     // Don't fetch if already loading, if there are no more posts, or if we've reached the end
//     if (isLoadingRef.current || !hasMore || reachedEndRef.current) return;

//     try {
//       isLoadingRef.current = true;
//       setLoading(true);

//       // Fetch products for the current page
//       const response = await fetch(
//         `${process.env.REACT_APP_BACKEND}/api/posts/get?page=${page}&limit=12`
//       );

//       // Handle HTTP errors
//       if (!response.ok) {
//         if (response.status === 404) {
//           console.log("No more posts available (404 response)");
//           setHasMore(false);
//           reachedEndRef.current = true;
//           return;
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Handle the API response
//       if (Array.isArray(data)) {
//         // No more posts if the array is empty
//         if (data.length === 0) {
//           console.log("No more posts available (empty array)");
//           setHasMore(false);
//           reachedEndRef.current = true;
//         } else {
//           // Append new posts to the existing list
//           setProducts((prevProducts) => (page === 1 ? data : [...prevProducts, ...data]));

//           // If fewer than 12 posts are returned, we've reached the end
//           if (data.length < 12) {
//             console.log("No more posts available (fewer than limit)");
//             setHasMore(false);
//             reachedEndRef.current = true;
//           }
//         }
//       } else if (data && Array.isArray(data.posts)) {
//         // Handle case when API returns an object with posts and pagination info
//         const newPosts = data.posts;

//         if (newPosts.length === 0) {
//           console.log("No more posts available (empty posts array)");
//           setHasMore(false);
//           reachedEndRef.current = true;
//         } else {
//           // Append new posts to the existing list
//           setProducts((prevProducts) => (page === 1 ? newPosts : [...prevProducts, ...newPosts]));

//           // Check if we've reached the end using explicit total pages or fewer posts than limit
//           if ((data.totalPages && page >= data.totalPages) || newPosts.length < 12) {
//             console.log("No more posts available (reached total pages or fewer than limit)");
//             setHasMore(false);
//             reachedEndRef.current = true;
//           }
//         }
//       } else {
//         console.error('Unexpected API response format:', data);
//         setHasMore(false);
//         reachedEndRef.current = true;
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error.message);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, [page, hasMore, setProducts]);

//   // Initial load
//   useEffect(() => {
//     loadMoreProducts();
//   }, []);

//   // Load more when page changes
//   useEffect(() => {
//     if (page > 1) {
//       loadMoreProducts();
//     }
//   }, [page, loadMoreProducts]);

//   // Set up intersection observer for infinite scroll
//   const lastProductRef = useCallback(
//     (node) => {
//       if (loading || !hasMore || reachedEndRef.current) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver(
//         (entries) => {
//           if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !reachedEndRef.current) {
//             setPage((prevPage) => prevPage + 1);
//           }
//         },
//         { rootMargin: '100px', threshold: 0.1 }
//       );

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   return (
//     <section className="bg-gray-100 py-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Latest Listings</h1>
//         {loading && products.length === 0 ? (
//           <div className="flex justify-center">
//             <Spinner />
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products && products.length > 0 ? (
//               products.map((product, index) => {
//                 if (products.length === index + 1 && hasMore && !reachedEndRef.current) {
//                   return (
//                     <motion.div
//                       ref={lastProductRef}
//                       key={product._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1, duration: 0.3 }}
//                     >
//                       <ProductCard {...product} />
//                     </motion.div>
//                   );
//                 } else {
//                   return (
//                     <motion.div
//                       key={product._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1, duration: 0.3 }}
//                     >
//                       <ProductCard {...product} />
//                     </motion.div>
//                   );
//                 }
//               })
//             ) : (
//               <div className="col-span-full text-center py-10 text-gray-500">
//                 No products found
//               </div>
//             )}
//           </div>
//         )}

//         {/* Loading indicator for additional pages */}
//         {loading && products.length > 0 && (
//           <div className="mt-8 flex justify-center">
//             <Spinner />
//           </div>
//         )}

//         {/* No more products message */}
//         {(reachedEndRef.current || !hasMore) && products.length > 0 && !loading && (
//           <p className="text-center mt-8 text-gray-500">You've reached the end of the listings</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ProductList;

import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import AppContext from '../context/AppContext';
import Spinner from './Spinner';

const ProductList = () => {
  const { products, setProducts } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const totalFetchedPosts = useRef([]); // Keep track of all fetched posts
  
  // Debug helper - log when page changes
  useEffect(() => {
    console.log("Current page:", page);
  }, [page]);

  const loadMoreProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Fetching page ${page}...`);

      // Fetch products for the current page
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/posts/get?getpage=${page}&limit=12`
      );

      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No more posts available (404 response)");
          setHasMore(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Received data for page ${page}:`, data);

      // Based on your log, we need to handle this specific response structure
      if (data && data.posts && Array.isArray(data.posts)) {
        const newPosts = data.posts;
        
        // Add the new posts to our internal tracking
        totalFetchedPosts.current = [...totalFetchedPosts.current, ...newPosts];
        
        // Update the products state with ALL fetched posts so far
        setProducts(totalFetchedPosts.current);
        console.log(`Total posts fetched so far: ${totalFetchedPosts.current.length}`);
        
        // Check if we've reached the last page
        if (data.totalPages && page >= data.totalPages) {
          console.log(`Reached last page (${page} of ${data.totalPages})`);
          setHasMore(false);
        } else if (newPosts.length === 0) {
          console.log("No more posts available (empty results)");
          setHasMore(false);
        }
      } else {
        console.error('Unexpected API response format:', data);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, setProducts]);

  // Function to reset everything
  const resetProducts = useCallback(() => {
    totalFetchedPosts.current = [];
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [setProducts]);

  // Initial load on component mount
  useEffect(() => {
    resetProducts(); // Start fresh
    loadMoreProducts();
  }, []);  // Empty dependency array for initial load only
  
  useEffect(() => {
    // Skip the initial render when this effect runs first time
    if (page > 1) {
      loadMoreProducts();
    }
  }, [page, loadMoreProducts]);

  // Intersection observer for infinite scroll
  const lastProductRef = useCallback(node => {
    if (loading || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log("Last item visible, loading more...");
        setPage(prevPage => prevPage + 1);
      }
    }, { rootMargin: '200px' });  // Increased rootMargin for earlier detection
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Manual load more function (as a backup)
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Latest Listings</h1>
        
        {/* Debug info - remove in production
        <div className="mb-4 text-sm text-gray-500 text-center">
          Page: {page} | Total fetched: {totalFetchedPosts.current.length} | Has more: {hasMore ? 'Yes' : 'No'}
        </div> */}
        
        {loading && products.length === 0 ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products && products.length > 0 ? (
                products.map((product, index) => {
                  // Check if this is the last item
                  const isLastItem = index === products.length - 1;
                  
                  return (
                    <motion.div
                      ref={isLastItem && hasMore ? lastProductRef : null}
                      key={`${product._id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.3 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No products found
                </div>
              )}
            </div>

            {/* Manual load more button as a backup */}
            {hasMore && !loading && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}

        {/* Loading indicator for additional pages */}
        {loading && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Spinner />
          </div>
        )}

        {/* No more products message */}
        {/* {!hasMore && products.length > 0 && !loading && (
          <p className="text-center mt-8 text-gray-500">You've reached the end of the listings</p>
        )} */}
      </div>
    </section>
  );
};

export default ProductList;