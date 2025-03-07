import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RelatedProductCard = ({ product }) => {
  let navigate=useNavigate();
  // Use the first image from product.images if available
  const productImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "";
      
  return (
    <motion.div
      onClick={() =>
        navigate(`/detail`, {
          state: {
            ...product,
            // Spread all product properties if you want to pass them
          },
        })
      }
      className="p-4 bg-gray-50 rounded-xl overflow-hidden shadow border border-gray-200 cursor-pointer transition-transform"
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", y: -3 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {productImage && (
          <motion.img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          />
        )}
      </div>
      <div className="p-2">
        <h4 className="text-gray-800 font-semibold text-base line-clamp-2">{product.title}</h4>
        <p className="text-gray-600 text-sm mt-1">₹{product.price}</p>
      </div>
    </motion.div>
  );
};

const CardDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  
  const {
    images = [],
    price = 0,
    title = "",
    description = "",
    category = "other",
    userId = {},
    _id = "",
    createdAt = new Date().toISOString(),
  } = state;
  
  const [currentImage, setCurrentImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location, navigate]);
  
  // Fetch similar posts using axios
  useEffect(() => {
    console.log("Fetching similar products for _id:", _id);
    if (_id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND}/api/posts/getSimilarPost/${_id}`)
        .then((response) => {
          const data = response.data;
          console.log("Similar products data:", data);
          if (data.status) {
            setRelatedProducts(data.data);
          } else {
            console.error("Failed to fetch similar posts");
          }
        })
        .catch((error) => console.error("Error fetching similar posts:", error));
    }
  }, [_id]);
  
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const formattedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString("en-GB", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
  }, [createdAt]);
  
  const imageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Product Details
        </h1>
      </header>
      
      {/* Main Detail Card */}
      <motion.div
        className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Slider */}
        <div className="relative w-full md:w-1/2 flex-1">
          {images.length > 0 && (
            <div className="h-96 relative overflow-hidden rounded-xl">
              <AnimatePresence exitBeforeEnter>
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            </div>
          )}
          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow hover:bg-gray-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow hover:bg-gray-700 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Product Details */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-between flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">₹{price}</h2>
            <h3 className="text-xl font-semibold mt-2">{title}</h3>
            <p className="text-gray-600 mt-3">{description}</p>
          </div>
          <motion.div
            className="mt-6 p-4 border-t border-gray-200 flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              Seller Information
            </h3>
            <p className="text-gray-700">{userId?.name || "Unknown Seller"}</p>
            <p className="text-gray-700 flex items-center">📞 {userId?.mobileNo || "N/A"}</p>
            <p className="text-gray-500 flex items-center">
              <MapPin size={16} className="mr-1 text-red-500" />{" "}
              {userId?.address || "Location not available"}
            </p>
            <p className="text-gray-500 text-xs mt-1">📅 {formattedDate}</p>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Related Products */}
      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((prod) => (
              <RelatedProductCard key={prod._id || prod.id} product={prod} />
            ))
          ) : (
            <p className="text-gray-600 text-sm">No related products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
