
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem("token");

  // State for modal & editing form
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    images: []
  });

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/api/posts/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.status) {
          setPosts(response.data.posts);
        } else {
          setError("No posts found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load posts. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

  const openEditModal = (post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      price: post.price,
      description: post.description,
      category: post.category,
      images: [] // Start with an empty array for new images
    });
    setImagePreview(post.images.length > 0 ? post.images[0] : null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setEditForm({ ...editForm, images: files });
    
    // Generate preview for first selected image
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("price", editForm.price);
    formData.append("description", editForm.description);
    formData.append("category", editForm.category);

    if (editForm.images.length > 0) {
      for (let i = 0; i < editForm.images.length; i++) {
        formData.append("images", editForm.images[i]);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/posts/editPost/${selectedPost._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? response.data.post : post
          )
        );
        toast.success("Post updated successfully!", toastConfig);
        setIsModalOpen(false);
        setSelectedPost(null);
        setImagePreview(null);
      } else {
        toast.error(response.data.message || "Failed to update post", toastConfig);
      }
    } catch (error) {
      console.error("Edit error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update post. Please try again.", 
        toastConfig
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      setDeletingId(id);
      
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/posts/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.status) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
        toast.success("Post deleted successfully!", toastConfig);
      } else {
        toast.error(response.data.message || "Failed to delete post", toastConfig);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete post. Please try again.", 
        toastConfig
      );
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Confirmation dialog for delete
  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      handleDelete(id);
    }
  };

  // Reset form when modal closes
  const closeModal = () => {
    if (!isSaving) {
      setIsModalOpen(false);
      setSelectedPost(null);
      setImagePreview(null);
      setTimeout(() => {
        setEditForm({
          title: "",
          price: "",
          description: "",
          category: "",
          images: []
        });
      }, 300);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg max-w-5xl mx-auto my-8 shadow-sm">
      <div className="flex flex-col items-center">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-lg font-medium mb-2">Error Loading Posts</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer />
      
      <h2 className="text-2xl font-semibold mb-6">My Posts</h2>
      
      {posts.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center shadow-sm">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p className="text-gray-500 mb-3">No posts found.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className="border bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="text-gray-300" size={48} />
                  </div>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{post.title}</h3>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="text-blue-500 hover:text-blue-700 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                      aria-label="Edit post"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(post._id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                      disabled={isDeleting && deletingId === post._id}
                      aria-label="Delete post"
                    >
                      {isDeleting && deletingId === post._id ? (
                        <div className="h-4 w-4 border-2 border-t-red-500 border-r-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <FaTrash size={16} />
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3 text-sm line-clamp-2 flex-grow">{post.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-gray-700 font-semibold">₹ {post.price}</p>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">{post.category}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                  <p>Likes: {post.likeCount || 0}</p>
                  <p>Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Modal with Image Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-5 pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Edit Post</h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isSaving}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Image Preview Section */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Current Image</label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Preview+Not+Available';
                          }}
                        />
                      ) : (
                        <div className="text-center p-4">
                          <FaImage size={32} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">No image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows="3"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Images</label>
                    <div className="relative">
                      <input
                        type="file"
                        name="images"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                        multiple
                        disabled={isSaving}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Upload new images to replace existing ones</p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;