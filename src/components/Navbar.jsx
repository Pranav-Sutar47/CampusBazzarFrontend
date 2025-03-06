import { useState, useEffect,useRef, useContext } from 'react';
import { Search, Plus, ChevronDown, Heart, User, Menu, X, LogOut } from 'lucide-react';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppContext from '../context/AppContext';
import apiRequest from '../utils/ApiRequest';
import { showToast } from './ToastComponent';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState('India');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(true);
  const dropdownRef = useRef(null);


  const locations = ['PCCOE','DYP','COEP'];

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setIsLocationDropdownOpen(false);
  };

  const {login,setLogin} = useContext(AppContext);

  // Add useEffect to check login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [login]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Updated login handler
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
      //console.log(data.status)

      if (data.status) {
        localStorage.setItem('token', data.token);
        //console.log(localStorage.getItem('token'))
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

  // Updated signup handler
  const handleSignup = async (data) => {
    //console.log('data',data);
   // if (e?.preventDefault) e.preventDefault(); // Safely check if e exists
  
    setError('');
    setLoading(true);
  
    try {
     // console.log(data);


      const response = await fetch('https://campusbazzarbackend.onrender.com/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
     // console.log(result);

      if (response.ok) {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
        toast.success('Successfully signed up! Please login.');
      } else {
        setError(data.message || 'Signup failed');
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const checkUserDetails = async()=>{

      let url = String(process.env.REACT_APP_BACKEND) ;
      url+= "/api/user/checkUser";

      const {resStatus,data,error} = await apiRequest(url,'GET',{
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      });

      if(resStatus)
        return true;
      else{
        showToast(error.message,'error');
        return false;
      }
  }

  // Modified sell button handler
  const handleSellClick = async(e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      if(await checkUserDetails())
        navigate('/post-ad');
    }
  };

  const handleLogout = () => {
    setLogin(false);
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    showToast('Successfully logged out','success');
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="w-full border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-[#002f34] text-3xl font-bold">
                <span className="text-[#3a77ff]">Campus</span>
                <span className="text-[#ffce32]">Bazzar</span>
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Desktop Search and Location */}
            <div className="hidden md:flex flex-grow mx-6">
              <div className="flex w-full">
                {/* Location selector */}
                <div className="relative">
                  <div 
                    className="flex items-center border-2 border-r-0 rounded-l-md px-3 py-2 bg-white h-full cursor-pointer"
                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  >
                    <span className="outline-none w-20 sm:w-28 text-[#002f34]">
                      {location}
                    </span>
                    <ChevronDown size={20} className="text-[#002f34]" />
                  </div>
                  
                  {/* Location dropdown */}
                  {isLocationDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                      {locations.map((loc) => (
                        <div 
                          key={loc} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleLocationSelect(loc)}
                        >
                          {loc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Search input */}
                <div className="flex flex-grow items-center">
                  <input 
                    type="text" 
                    placeholder="Find Cars, Mobile Phones and more..."
                    className="w-full border-2 border-r-0 py-2 px-4 outline-none focus:border-[#23e5db]"
                  />
                  <button className="bg-[#002f34] border-2 border-[#002f34] p-2 rounded-r-md">
                    <Search size={22} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right side links */}
            <div className="hidden md:flex items-center space-x-5">
              {/* Language selector */}
              <div className="relative">
              </div>
              
              {/* Only show login button if not logged in */}
              {!isLoggedIn && (
                <button 
                  onClick={() => setIsLoginModalOpen(true)} 
                  className="text-[#002f34] font-semibold"
                >
                  Login
                </button>
              )}
              
              {isLoggedIn && (
  <div className="relative">
    {/* User Icon with Dropdown Toggle */}
    <button
      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
      className="flex items-center space-x-2 text-[#002f34] hover:text-[#3a77ff]"
    >
      <User size={24} />
      <ChevronDown size={16} />
    </button>

    {/* Dropdown Menu */}
    {isUserDropdownOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
        <Link 
          to="/user-profile" 
          className="block px-4 py-2 w-full text-left hover:bg-gray-100"
        >
          Profile
        </Link>
        <Link 
          to="/my-posts" 
          className="block px-4 py-2 w-full text-left hover:bg-gray-100"
        >
          My Posts
        </Link>
        <button 
          onClick={handleLogout}
          className="block px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100"
        >
          <LogOut size={20} className="inline-block mr-2" />
          Logout
        </button>
      </div>
    )}
  </div>
)}

              {/* Modified Sell button */}
              <button 
                onClick={handleSellClick}
                className="flex items-center bg-[#fff7e6] hover:bg-[#ffce32] text-[#002f34] font-semibold px-4 py-2 rounded-full border-2 border-[#ffce32]"
              >
                <Plus size={20} className="mr-1" /> SELL
              </button>
            </div>
          </div>
          
          {/* Mobile Search - visible on mobile only */}
          <div className="mt-3 md:hidden">
            <div className="flex w-full">
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full border-2 border-r-0 py-2 px-4 outline-none"
              />
              <button className="bg-[#002f34] border-2 border-[#002f34] p-2 rounded-r-md">
                <Search size={22} className="text-white" />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 py-2 space-y-3">
              {!isLoggedIn && (
                <button 
                  onClick={() => setIsLoginModalOpen(true)} 
                  className="block py-2 text-[#002f34] font-medium"
                >
                  Login
                </button>
              )}

              {isLoggedIn && (
                <>
                  <div className="relative">
  <button
    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
    className="flex items-center space-x-2 text-[#002f34] hover:text-[#3a77ff]"
  >
    <User size={24} />
    <ChevronDown size={16} />
  </button>

  {isUserDropdownOpen && (
    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20">
      <button
        onClick={() => navigate('/user-profile')}
        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
      >
        Profile
      </button>
      <button
        onClick={() => navigate('/my-posts')}
        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
      >
        My Posts
      </button>
    </div>
  )}
</div>

                  <button 
                    onClick={handleLogout}
                    className="flex items-center py-2 text-red-600 font-medium w-full"
                  >
                    <LogOut size={20} className="mr-2" />
                    Logout
                  </button>
                </>
              )}

              <button 
                onClick={handleSellClick}
                className="inline-flex items-center bg-[#fff7e6] hover:bg-[#ffce32] text-[#002f34] font-medium px-4 py-2 rounded-full border-2 border-[#ffce32]"
              >
                <Plus size={20} className="mr-1" /> SELL
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Categories bar - MODIFIED to show only fixed categories without dropdown */}
      <div className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-2 space-x-6 text-sm no-scrollbar">
            <a href="/textbooks" className="whitespace-nowrap text-[#002f34] hover:text-[#3a77ff] font-medium">Textbooks</a>
            <a href="/notes" className="whitespace-nowrap text-[#002f34] hover:text-[#3a77ff] font-medium">Notes</a>
            <a href="/stationery" className="whitespace-nowrap text-[#002f34] hover:text-[#3a77ff] font-medium">Stationery</a>
            <a href="/calculators" className="whitespace-nowrap text-[#002f34] hover:text-[#3a77ff] font-medium">Calculators</a>
            <a href="/uniforms" className="whitespace-nowrap text-[#002f34] hover:text-[#3a77ff] font-medium">Uniforms</a>
          </div>
        </div>
      </div>

      {/* Replace modal components with imported ones */}
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
      
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        error={error}
        loading={loading}
        handleSignup={handleSignup}
      />
    </div>
  );
};

export default Navbar;