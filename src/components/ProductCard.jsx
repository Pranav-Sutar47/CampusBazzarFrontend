// import React, { useState, useEffect } from 'react';
// import { Heart } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import SignupModal from './auth/SignupModal';
// import LoginModal from './auth/LoginModal'; // Make sure to import your LoginModal component

// const ProductCard = ({ 
//   _id, 
//   images, 
//   userId,
//   price, 
//   title, 
//   createdAt, 
//   category,
//   description,
//   likeCount,
//   isLiked = false,
//   isFeatured = false
// }) => {
//   const navigate = useNavigate();
//   const [liked, setLiked] = useState(isLiked);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Check if user has already liked this post on component mount
//   useEffect(() => {
//     setLiked(isLiked);
//   }, [isLiked]);

//   const handleCardClick = () => {
//     navigate(`/detail`, { state: { images, price, title, createdAt, category, description, likeCount, userId, _id } });
//   };

//   const handleLikeClick = async (e) => {
//     e.stopPropagation();
    
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setIsLoginModalOpen(true);
//       return;
//     }
    
//     if (isLiking || liked) return;
    
//     setIsLiking(true);
//     console.log("e -> ",e);
    
//     try {
//       const response = await fetch(`https://campusbazzarbackend.onrender.com/api/posts/like/${_id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
  
//       if (response.ok) {
//         setLiked(true);
//         toast.success('Post liked successfully!');
  
//         // Get existing liked items from localStorage
//         let likedItems = JSON.parse(localStorage.getItem('likedItems')) || [];
        
//         // Check if the item is already liked (avoid duplicates)
//         if (!likedItems.some(item => item._id === _id)) {
//           likedItems.push({ _id, title, price, images });
//           localStorage.setItem('likedItems', JSON.stringify(likedItems));
//         }
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || 'Failed to like post');
//       }
//     } catch (error) {
//       console.error('Error liking post:', error);
//       toast.error('Something went wrong. Please try again.');
//     } finally {
//       setIsLiking(false);
//     }
//   };
  


//   const handleLogin = async (e) => {
//       e.preventDefault();
//       setError('');
//       setLoading(true);
  
//       try {
//         const response = await fetch('https://campusbazzarbackend.onrender.com/api/user/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             email: e.target.email.value,
//             password: e.target.password.value
//           }),
//         });
  
//         const data = await response.json();
//         console.log(data.status)
  
//         if (data.status) {
//           localStorage.setItem('token', data.token);
//           console.log(localStorage.getItem('token'))
//           setIsLoggedIn(true);
//           setIsLoginModalOpen(false);
//           toast.success('Successfully logged in!', {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//         } else {
//           toast.error(data.message || 'Login failed', {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//           setError(data.message || 'Login failed');
//         }
//       } catch (err) {
//         toast.error('Something went wrong. Please try again.', {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//         setError('Something went wrong. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//   return (
//     <>
//       <div 
//         onClick={handleCardClick} 
//         className="relative flex flex-col border rounded-md overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
//       >
//         <div className="relative aspect-square overflow-hidden bg-gray-100">
//           <img 
//             src={images[0]} 
//             alt={title} 
//             className="w-full h-full object-cover"
//           />
//           <button 
//             onClick={handleLikeClick}
//             disabled={liked || isLiking}
//             className={`absolute top-2 right-2 p-1 rounded-full ${liked ? 'bg-red-50' : 'bg-white'} shadow-md ${!liked && 'hover:bg-gray-100'} transition-colors`}
//           >
//             <Heart 
//               size={20} 
//               className={liked ? "text-red-500 fill-red-500" : "text-gray-700"} 
//               fill={liked ? "currentColor" : "none"}
//             />
//           </button>
//           {isFeatured && (
//             <div className="absolute bottom-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 uppercase">
//               Featured
//             </div>
//           )}
//         </div>
//         <div className="p-3 pb-1">
//           <div className="text-xl font-bold text-[#002f34]">
//             ₹ {price.toLocaleString()}
//           </div>
//         </div>
//         <div className="px-3 pb-1">
//           <p className="text-sm text-[#002f34] line-clamp-2 h-10">
//             {title}
//           </p>
//         </div>
//         <div className="px-3 pb-3 mt-auto flex justify-between text-xs text-gray-500">
//           <span className="uppercase truncate max-w-[60%]">{userId?.address}</span>
//           <span className="uppercase">{createdAt}</span>
//         </div>
//       </div>

//       {/* Login Modal */}
//       <LoginModal 
//         isOpen={isLoginModalOpen} 
//         onClose={() => setIsLoginModalOpen(false)}
//         onSignupClick={() => {
//           setIsLoginModalOpen(false);
//           setIsSignupModalOpen(true);
//         }}
//         error={error}
//         loading={loading}
//         handleLogin={handleLogin}
//       />

//       {isSignupModalOpen && (
//         <SignupModal 
//           isOpen={isSignupModalOpen}
//           onClose={() => setIsSignupModalOpen(false)}
//           onLoginClick={() => {
//             setIsSignupModalOpen(false);
//             setIsLoginModalOpen(true);
//           }}
//         />
//       )}
//     </>
//   );
// };

// // const ProductList = ({ title, products }) => {
// //   return (
// //     <div className="max-w-7xl mx-auto px-4 py-6">
// //       {title && (
// //         <h2 className="text-2xl font-bold text-[#002f34] mb-4">
// //           {title}
// //         </h2>
// //       )}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// //         {products.map((product) => (
// //           <ProductCard 
// //             key={product._id}
// //             {...product}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// export default ProductCard;

import React, { useState, useEffect } from 'react';
import { Heart, Tag, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  
        // Get existing liked items from localStorage
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
      console.error('Error liking product:', error);
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
      <div 
        onClick={handleCardClick} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border border-gray-200"
      >
        {/* Image container with overlay effect */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            src={images[0]} 
            alt={title} 
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300`}></div>
          
          {/* Like button */}
          <button 
            onClick={handleLikeClick}
            disabled={liked || isLiking}
            className={`absolute top-3 right-3 p-2 rounded-full ${liked ? 'bg-red-50' : 'bg-white'} shadow-md hover:shadow-lg ${!liked && 'hover:bg-gray-100'} transition-all duration-200 transform ${isHovered ? 'scale-110' : 'scale-100'}`}
            aria-label="Add to favorites"
          >
            <Heart 
              size={18} 
              className={liked ? "text-red-500 fill-red-500" : "text-gray-700"} 
              fill={liked ? "currentColor" : "none"}
            />
          </button>
          
          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-xs font-bold px-3 py-1 rounded-full text-white shadow-md">
              Featured
            </div>
          )}
          
          {/* Price tag */}
          <div className="absolute bottom-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm text-lg font-bold px-3 py-1 rounded-md shadow-sm text-gray-900 transition-all duration-300 group-hover:bg-opacity-100">
            ₹{price.toLocaleString()}
          </div>
        </div>
        
        {/* Product details */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 h-12 mb-2">
            {title}
          </h3>
          
          <div className="mt-auto space-y-2">
            {/* Category */}
            <div className="flex items-center text-xs text-gray-600">
              <Tag size={14} className="mr-1.5 text-gray-500" />
              <span className="capitalize">{category}</span>
            </div>
            
            {/* Location and Time */}
            <div className="flex items-center justify-between text-xs text-gray-500">
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
        </div>
        
        {/* Quick view overlay that appears on hover */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="bg-white text-gray-900 font-medium py-2 px-4 rounded-md shadow-lg transform transition-transform duration-300
            ${isHovered ? 'translate-y-0' : 'translate-y-4'}">
            View Details
          </span>
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

      {/* Signup Modal */}
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

