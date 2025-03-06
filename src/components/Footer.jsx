import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#002f34] text-white py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {/* Campus Bazaar Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Campus Bazaar</h3>
          <p className="text-sm text-gray-300">Your go-to platform for buying and selling books, stationery, and essentials within your campus community.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-gray-400">About Us</a></li>
            <li><a href="/blog" className="hover:text-gray-400">Blog</a></li>
            <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
            <li><a href="/help" className="hover:text-gray-400">Help & Support</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><a href="/category/books" className="hover:text-gray-400">Books</a></li>
            <li><a href="/category/stationery" className="hover:text-gray-400">Stationery</a></li>
            <li><a href="/category/electronics" className="hover:text-gray-400">Electronics</a></li>
            <li><a href="/category/others" className="hover:text-gray-400">Others</a></li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <p className="text-sm text-gray-300 mb-4">Join our community and never miss out on great deals!</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
            <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm mt-8 border-t border-gray-600 pt-4">
        © 2025 Campus Bazaar. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
