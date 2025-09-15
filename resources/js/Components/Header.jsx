import React from "react";
import { ShoppingCart, User, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full shadow-md bg-white">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left: Logo */}
        <div className="text-2xl font-bold text-gray-800 cursor-pointer">
          ShopLogo
        </div>

        {/* Middle: Search Bar */}
        <div className="hidden md:flex flex-1 mx-6">
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button className="px-4 bg-gray-100 hover:bg-gray-200">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Right: Nav Items */}
        <div className="flex items-center space-x-6">
          <a href="/shop" className="text-gray-700 hover:text-gray-900 text-sm">
            Shop
          </a>
          <a
            href="/deals"
            className="text-gray-700 hover:text-gray-900 text-sm"
          >
            Deals
          </a>
          <a
            href="/contact"
            className="text-gray-700 hover:text-gray-900 text-sm"
          >
            Contact
          </a>

          {/* User */}
          <a href="/account" className="text-gray-700 hover:text-gray-900">
            <User size={22} />
          </a>

          {/* Cart */}
          <a href="/cart" className="relative text-gray-700 hover:text-gray-900">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              3
            </span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
