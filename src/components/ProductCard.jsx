import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SignupModal from './auth/SignupModal';
import LoginModal from './auth/LoginModal'; // Make sure to import your LoginModal component

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

  // Check if user has already liked this post on component mount
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
    console.log("e -> ",e);
    
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
        toast.success('Post liked successfully!');
  
        // Get existing liked items from localStorage
        let likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
        
        // Check if the item is already liked (avoid duplicates)
        if (!likedItems.some(item => item._id === _id)) {
          likedItems.push({ _id, title, price, images });
          localStorage.setItem('likedItems', JSON.stringify(likedItems));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
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
        console.log(data.status)
  
        if (data.status) {
          localStorage.setItem('token', data.token);
          console.log(localStorage.getItem('token'))
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
      <div 
        onClick={handleCardClick} 
        className="relative flex flex-col border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={handleLikeClick}
            disabled={liked || isLiking}
            className={`absolute top-2 right-2 p-1 rounded-full ${liked ? 'bg-red-50' : 'bg-white'} shadow-md ${!liked && 'hover:bg-gray-100'} transition-colors`}
          >
            <Heart 
              size={20} 
              className={liked ? "text-red-500 fill-red-500" : "text-gray-700"} 
              fill={liked ? "currentColor" : "none"}
            />
          </button>
          {isFeatured && (
            <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 uppercase">
              Featured
            </div>
          )}
        </div>
        <div className="p-3 pb-1">
          <div className="text-xl font-bold text-[#002f34]">
            ₹ {price.toLocaleString()}
          </div>
        </div>
        <div className="px-3 pb-1">
          <p className="text-sm text-[#002f34] line-clamp-2 h-10">
            {title}
          </p>
        </div>
        <div className="px-3 pb-3 mt-auto flex justify-between text-xs text-gray-500">
          <span className="uppercase truncate max-w-[60%]">{userId?.address}</span>
          <span className="uppercase">{createdAt}</span>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
        error={error}
        loading={loading}
        handleLogin={handleLogin}
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

// const ProductList = ({ title, products }) => {
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {title && (
//         <h2 className="text-2xl font-bold text-[#002f34] mb-4">
//           {title}
//         </h2>
//       )}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {products.map((product) => (
//           <ProductCard 
//             key={product._id}
//             {...product}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

export default ProductCard;