import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
import { showToast } from "./ToastComponent";
import apiRequest from "../utils/ApiRequest";


const PostAdForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price:0,
    description: "",
    category: "",
    images: null,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : files ? files : value,
    }));
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

  useEffect(()=>{

    const verifyUser = async()=>{
      const isUserValid = await checkUserDetails(); //  Wait for the response
      if (!isUserValid) {
        showToast("Please Login or Update the User Details","error");
        navigate('/');
      }
    }
    verifyUser();
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);

      Array.from(formData.images || []).forEach((image) => {
        data.append("images", image);
      });

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://campusbazzarbackend.onrender.com/api/posts/add",
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        // toast.success("Ad Posted Successfully!");
        showToast("Ad Posted Successfully!","success");
        setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
      } else {
        showToast("Failed to post the ad. Please try again.","error");
        // toast.error("Failed to post the ad. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong!","error");
      // toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-12">

      <h2 className="text-3xl font-bold mb-6 text-center">Post Your Ad</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
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
            type="number"
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
  <option value="study-tools-electronics">Study Tools &amp; Electronics</option>
  <option value="uniforms-apparel">Uniforms &amp; Apparel</option>
  <option value="educational-accessories">Educational Accessories</option>
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
            "Post Add"
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

