import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
import { showToast } from "./ToastComponent";
import apiRequest from "../utils/ApiRequest";

const PostAdForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    tags: [],
    category: "",
    images: null,
  });

  const [inputTag, setInputTag] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "price" && !/^\d*\.?\d*$/.test(value)) {
      return; // Reject invalid input (only numbers and one decimal point allowed)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? value : files ? files : value,
    }));
  };

  const handleTagChange = (e) => {
    setInputTag(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && inputTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(inputTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, inputTag.trim()],
        }));
      }
      setInputTag(""); // Clear input field after adding tag
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const checkUserDetails = async () => {
    let url = String(process.env.REACT_APP_BACKEND);
    url += "/api/user/checkUser";

    const { resStatus, data, error } = await apiRequest(url, "GET", {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    if (resStatus) return true;
    else {
      showToast(error.message, "error");
      return false;
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const isUserValid = await checkUserDetails(); //  Wait for the response
      if (!isUserValid) {
        showToast("Please Login or Update the User Details", "error");
        navigate("/");
      }
    };
    verifyUser();
  }, []);

  // console.log(process.env.REACT_APP_BACKEND);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //get user data to add tags college and address
      const token = localStorage.getItem("token");

      if (!token) {
        // setError("Please login to view profile");
        setLoading(false);
        return;
      }
      const userdataResponse = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/user/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userdata = await userdataResponse.json();

      formData.tags.push(userdata.user.address);
      formData.tags.push(userdata.user.college);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", Number(formData.price));
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("tags", formData.tags);

      Array.from(formData.images || []).forEach((image) => {
        data.append("images", image);
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/api/posts/add`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // toast.success("Ad Posted Successfully!");
        showToast("Ad Posted Successfully!", "success");
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
      } else {
        showToast("Failed to post the ad. Please try again.", "error");
        // toast.error("Failed to post the ad. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!", "error");
      // toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg h-28"
            required
          />
        </div>
        <div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags{" "}
              <p className="text-gray-600">
                ex: Book, HC Verma, etc. Add all the related tags to increase
                the reach of your product.
              </p>
            </label>

            <div className="border p-2 rounded-lg w-full h-auto min-h-28">
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#3A77FF] text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-white font-bold"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>

              {/* Textarea for Input */}
              <textarea
                name="tags"
                value={inputTag}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                className="w-full border p-2 rounded-lg h-16 focus:outline-none"
                placeholder="Type a tag and press Enter..."
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            required
          >
            <option value="">Select a category</option>
            <option value="books-stationery">Books &amp; Stationery</option>
            <option value="study-tools-electronics">
              Study Tools &amp; Electronics
            </option>
            <option value="uniforms-apparel">Uniforms &amp; Apparel</option>
            <option value="educational-accessories">
              Educational Accessories
            </option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <input
            type="file"
            name="images"
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            multiple
            accept="image/*"
          />
        </div>
        <button
          type="submit"
          className="bg-[#002f34] text-white px-5 py-2 rounded-lg w-full flex justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="spinner border-t-4 border-blue-500 border-solid rounded-full h-5 w-5 animate-spin"></div>
          ) : (
            "Add"
          )}
        </button>
      </form>
      <button
        onClick={() => navigate("/")}
        className="mt-5 text-sm text-gray-500 w-full text-center"
      >
        Cancel
      </button>
    </div>
  );
};

export default PostAdForm;
