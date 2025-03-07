import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Inline Related Product Card component
const RelatedProductCard = ({ product }) => {
  return (
    <motion.div
      className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-cover rounded"
        />
      )}
      <h4 className="text-gray-800 font-semibold mt-2">{product.title}</h4>
      <p className="text-gray-600">₹{product.price}</p>
    </motion.div>
  );
};


const CardDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  // Example related products data
  const relatedProductsData = [
    { id: 1, title: "Product 1", price: 1200, image: "url-to-image1.jpg" },
    { id: 2, title: "Product 2", price: 1500, image: "url-to-image2.jpg" },
    { id: 3, title: "Product 3", price: 1800, image: "url-to-image3.jpg" },
  ];

  const {
    images = [],
    price = 0,
    title = "",
    description = "",
    userId = {},
    _id = "",
  } = state;

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!location.state) {
      navigate("/"); // Redirect if state is not given
    }
  }, [location, navigate]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleChat = () => {
    console.log("clicked on chat now");
  };

  const imageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8">
      {/* Header Section */}
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Product Details
        </h1>
      </header>

      {/* Main Product Detail Card */}
      <motion.div
        className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side - Image Slider */}
        <div className="relative w-full md:w-1/2 flex-1">
          {images.length > 0 && (
            <div className="h-96 relative overflow-hidden rounded-lg">
              <AnimatePresence exitBeforeEnter>
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  alt="Product"
                  className="w-full h-full object-fit"
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
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right Side - Product Details */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-between flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Product Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">₹{price}</h2>
            <p className="text-gray-600 mt-3">{description}</p>
          </div>

          {/* Seller Information */}
          <motion.div
            className="mt-6 p-4 border-t flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Seller Information
              </h3>
              <p className="text-gray-700">
                {userId?.name || "Unknown Seller"}
              </p>
              <p className="text-gray-700 flex items-center">
                📞 {userId?.mobileNo || "N/A"}
              </p>
              <p className="text-gray-500 flex items-center">
                <MapPin size={16} className="mr-1 text-red-500" />
                {userId?.address || "Location not available"}
              </p>
            </div>
            <motion.button
              onClick={handleChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Chat With Seller
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Related Products Section */}
      <div className="max-w-5xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Related Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedProductsData.map((product) => (
            <RelatedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
