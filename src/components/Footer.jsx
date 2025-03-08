import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Books & Stationery', path: '/books-stationery' },
    { name: 'Study Tools & Electronics', path: '/study-tools-electronics' },
    { name: 'Uniforms & Apparel', path: '/uniforms-apparel' },
    { name: 'Educational Accessories', path: '/educational-accessories' },
    { name: 'Other', path: '/other' }
  ];

  return (
    <footer className="bg-[#002f34] text-white py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Campus Bazaar Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            <span className="text-[#3a77ff]">Campus</span>
            <span className="text-[#ffce32]">Bazzar</span>
          </h3>
          <p className="text-sm text-gray-300">
            Your trusted platform for buying and selling campus essentials. Connect with fellow students and find great deals on educational materials and more.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.path}>
                <button
                  onClick={() => navigate(category.path)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/recommendation')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Recommendations
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/post-ad')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sell Item
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/user-profile')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                My Profile
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mt-8 border-t border-gray-600 pt-4">
        © {new Date().getFullYear()} CampusBazzar. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
