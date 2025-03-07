import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    mobileNo: '',
    address: '',
    college: '',
    prn: '',
    profileImage: '',
    createdAt: ''
  });
  const [image, setImage] = useState('');
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [likedItemsLoading, setLikedItemsLoading] = useState(false);

  // Base API URL from environment variable
  const baseUrl = process.env.REACT_APP_BACKEND;

  // Fetch User Information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view profile');
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseUrl}/api/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setUserInfo(data.user);
          setFormData(data.user);
          // Save user address to localStorage
          localStorage.setItem('userAddress', data.user.address || '');
        } else {
          setError(data.message || 'Failed to fetch user information');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [baseUrl]);

  // Fetch Liked Items from API
  useEffect(() => {
    const fetchLikedItems = async () => {
      setLikedItemsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch(`${baseUrl}/api/posts/getLikedPost`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setLikedItems(data.posts || []);
        } else {
          console.error('Failed to fetch liked items:', data.message);
        }
      } catch (err) {
        console.error('Error fetching liked items:', err);
      } finally {
        setLikedItemsLoading(false);
      }
    };

    fetchLikedItems();
  }, [baseUrl]);

  // Handle Profile Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setImageLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/user/profileImage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set Content-Type header when sending FormData
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setImage(data.imageUrl);
        setShow((prev => !prev));
        setUpdateMessage('Profile image updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile image');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  // Toggle Edit Mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFormData(userInfo);
    setUpdateMessage('');
  };

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for mobile number (digits only, max 10)
    if (name === 'mobileNo' && !/^\d{0,10}$/.test(value)) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to update profile');
        return;
      }
      
      // Validation checks
      if (formData.mobileNo && formData.mobileNo.length !== 10) {
        setUpdateMessage('Mobile number must be exactly 10 digits');
        setUpdateLoading(false);
        return;
      }
      
      const response = await fetch(`${baseUrl}/api/user/updateDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          college: formData.college,
          prn: formData.prn,
          address: formData.address,
          mobileNo: formData.mobileNo
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setUserInfo({...userInfo, ...formData});
        // Update address in localStorage when profile is updated
        localStorage.setItem('userAddress', formData.address || '');
        setUpdateMessage('Profile updated successfully!');
        setTimeout(() => setEditMode(false), 1500);
      } else {
        setUpdateMessage(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setUpdateMessage('Something went wrong. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <Spinner></Spinner>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden relative">
          {/* Edit Button - Now on the right side */}
          <button 
            onClick={toggleEditMode}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100 transition-colors"
            aria-label={editMode ? "Cancel editing" : "Edit profile"}
          >
            {editMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </button>
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#002f34] to-[#065a62] px-8 py-10 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-gray-300 border-4 border-white overflow-hidden">
                  {imageLoading ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <span className="text-sm text-gray-600">Loading...</span>
                    </div>
                  ) : userInfo.profileImage ? (
                    <img 
                      src={show ? image : userInfo.profileImage} 
                      alt={userInfo.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <span className="text-3xl text-gray-600">
                        {userInfo.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userInfo.name}</h1>
                <p className="text-gray-200 mt-1">{userInfo.email}</p>
                {updateMessage && (
                  <div className={`mt-2 px-3 py-1 rounded text-sm ${updateMessage.includes('success') ? 'bg-green-500' : 'bg-red-500'}`}>
                    {updateMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${editMode ? 'bg-white border border-gray-300' : 'bg-gray-50'}`}>
                    <h2 className="text-sm font-semibold text-gray-600">Mobile Number</h2>
                    {editMode ? (
                      <input
                        type="text"
                        name="mobileNo"
                        value={formData.mobileNo || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#002f34]"
                        placeholder="Enter 10 digit mobile number"
                        maxLength={10}
                      />
                    ) : (
                      <p className="text-lg mt-1">{userInfo.mobileNo}</p>
                    )}
                    {editMode && formData.mobileNo && formData.mobileNo.length !== 10 && (
                      <p className="text-red-500 text-xs mt-1">Mobile number must be exactly 10 digits</p>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg ${editMode ? 'bg-white border border-gray-300' : 'bg-gray-50'}`}>
                    <h2 className="text-sm font-semibold text-gray-600">College</h2>
                    {editMode ? (
                      <input
                        type="text"
                        name="college"
                        value={formData.college || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#002f34]"
                        placeholder="Enter your college name"
                      />
                    ) : (
                      <p className="text-lg mt-1">{userInfo.college}</p>
                    )}
                  </div>
                  
                  {/* Member Since section moved to the left column */}
                  {!editMode && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h2 className="text-sm font-semibold text-gray-600">Member Since</h2>
                      <p className="text-lg mt-1">
                        {new Date(userInfo.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${editMode ? 'bg-white border border-gray-300' : 'bg-gray-50'}`}>
                    <h2 className="text-sm font-semibold text-gray-600">Address</h2>
                    {editMode ? (
                      <textarea
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#002f34]"
                        placeholder="Enter your address"
                        rows="3"
                      />
                    ) : (
                      <p className="text-lg mt-1">{userInfo.address}</p>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-lg ${editMode ? 'bg-white border border-gray-300' : 'bg-gray-50'}`}>
                    <h2 className="text-sm font-semibold text-gray-600">PRN</h2>
                    {editMode ? (
                      <input
                        type="text"
                        name="prn"
                        value={formData.prn || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#002f34]"
                        placeholder="Enter your PRN"
                      />
                    ) : (
                      <p className="text-lg mt-1">{userInfo.prn}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {editMode && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="bg-[#002f34] text-white px-6 py-2 rounded-lg hover:bg-[#065a62] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002f34] disabled:opacity-50"
                  >
                    {updateLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Liked Items Section */}
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold">Liked Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {likedItemsLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <p className="text-gray-500">Loading liked items...</p>
                </div>
              ) : likedItems.length > 0 ? (
                likedItems.map(item => (
                  <div key={item._id} className="border rounded-lg p-4 shadow-md">
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'} 
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                    <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">₹ {item.price}</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-gray-500 text-center py-4">No liked items yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
