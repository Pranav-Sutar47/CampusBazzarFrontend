import React, { useState, useEffect } from 'react';
import { Heart, Tag, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SignupModal from './auth/SignupModal';
import LoginModal from './auth/LoginModal';

const ProductCard = ({ 
  _id, 
  images, 
  userId,
  price, 
  title, 
  createdAt, 
  category,
  description,
  likeCount,
  isLiked = false,
  isFeatured = false
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const handleCardClick = () => {
    navigate(`/detail`, { state: { images, price, title, createdAt, category, description, likeCount, userId, _id } });
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isLiking || liked) return;
    setIsLiking(true);

    try {
      const response = await fetch(`https://campusbazzarbackend.onrender.com/api/posts/like/${_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setLiked(true);
        toast.success('Product added to favorites!');
        let likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
        
        // Check if the item is already liked (avoid duplicates)
        if (!likedItems.some(item => item._id === _id)) {
          likedItems.push({ _id, title, price, images });
          localStorage.setItem('likedItems', JSON.stringify(likedItems));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add to favorites');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://campusbazzarbackend.onrender.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value
        }),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        toast.success('Successfully logged in!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(data.message || 'Login failed', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        onClick={handleCardClick} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        className="relative flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border border-gray-200"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <motion.img 
            src={images[0]} 
            alt={title} 
            className="w-full h-full object-cover" 
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
          <motion.button 
            onClick={handleLikeClick}
            disabled={liked || isLiking}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-3 right-3 p-2 rounded-full ${liked ? 'bg-red-50' : 'bg-white'} shadow-md hover:shadow-lg transition-all duration-200`}
          >
            <Heart 
              size={18} 
              className={liked ? "text-red-500 fill-red-500" : "text-gray-700"} 
              fill={liked ? "currentColor" : "none"}
            />
          </motion.button>
          {isFeatured && (
            <motion.div 
              className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Featured
            </motion.div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
            {title}
          </h3>
          <div className="flex items-center text-xs text-gray-600">
            <Tag size={14} className="mr-1.5 text-gray-500" />
            <span className="capitalize">{category}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center truncate max-w-[60%]">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{userId?.address || 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{createdAt}</span>
            </div>
          </div>
        </div>
      </motion.div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      {isSignupModalOpen && (
        <SignupModal 
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
          onLoginClick={() => {
            setIsSignupModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
