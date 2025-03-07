import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
          setError("No post found");
        }
      } catch (err) {
        setError("Failed to load posts.");
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
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleFileChange = (e) => {
    setEditForm({ ...editForm, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          },
        }
      );

      if (response.data.status) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? response.data.post : post
          )
        );
      }
      setIsModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/api/posts/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <p className="text-center">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="border p-4 rounded-lg shadow relative">
              {/* Action Icons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => openEditModal(post)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
              </div>
              {post.images.length > 0 && (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <h3 className="text-xl font-bold mt-2">{post.title}</h3>
              <p className="text-gray-600">{post.description}</p>
              <p className="text-gray-700 font-semibold">Price: ${post.price}</p>
              <p className="text-sm text-gray-500">Category: {post.category}</p>
              <p className="text-sm text-gray-400">Likes: {post.likeCount}</p>
              <p className="text-xs text-gray-400">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Beautified Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 transition-opacity duration-300">
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedPost(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center">Edit Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-1">Images</label>
                <input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  multiple
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPost(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
