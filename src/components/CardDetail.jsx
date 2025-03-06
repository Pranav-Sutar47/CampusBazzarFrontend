import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const CardDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {}; 
  const { images = [], price = 0, title = "", description = "", userId = {}, _id = "" } = state;
  
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!location.state) {
      navigate("/"); // Redirect jar  state is not given
    }
  }, [location, navigate]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    if (!likedItems.some((item) => item._id === _id)) {
      likedItems.push({ _id, title, price, images });
      localStorage.setItem("likedItems", JSON.stringify(likedItems));
      alert("Added to Cart!");
    } else {
      alert("Already in Cart!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
      {/* Left Side - Image Slider */}
      <div className="relative w-full md:w-1/2">
        {images.length > 0 && (
          <img
            src={images[currentImage]}
            alt="Product"
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
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
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        {/* Product Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">₹{price}</h2>
          <p className="text-gray-600 mt-3">{description}</p>
        </div>

        {/* Owner Information */}
        <div className="mt-6 p-4 border-t flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Seller Information</h3>
            <p className="text-gray-700">{userId?.name || "Unknown Seller"}</p>
            <p className="text-gray-500">📞 {userId?.mobileNo || "N/A"}</p>
            <p className="text-gray-500 flex items-center">
              <MapPin size={16} className="mr-1 text-red-500" /> {userId?.address || "Location not available"}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
