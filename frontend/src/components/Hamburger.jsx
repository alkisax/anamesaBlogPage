import { useState } from "react";

const Hamburger = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-blue-500">
      <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
        {/* Logo */}
        <a className="text-3xl font-bold leading-none" href="#">
          <svg className="h-10" alt="logo" viewBox="0 0 10240 10240">
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M8284 9162 c-2 -207 ... z"
            ></path>
          </svg>
        </a>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="navbar-burger flex items-center text-blue-600 p-3"
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <ul className="hidden lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
          <li>
            <a className="text-sm text-gray-400 hover:text-gray-500" href="#">
              Home
            </a>
          </li>
          <li>
            <a className="text-sm text-blue-600 font-bold" href="#">
              About Us
            </a>
          </li>
          <li>
            <a className="text-sm text-gray-400 hover:text-gray-500" href="#">
              Services
            </a>
          </li>
          <li>
            <a className="text-sm text-gray-400 hover:text-gray-500" href="#">
              Pricing
            </a>
          </li>
          <li>
            <a className="text-sm text-gray-400 hover:text-gray-500" href="#">
              Contact
            </a>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex lg:items-center">
          <a
            className="lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
            href="#"
          >
            Sign In
          </a>
          <a
            className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
            href="#"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50">
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
              <a className="mr-auto text-3xl font-bold leading-none" href="#">
                <svg className="h-12" alt="logo" viewBox="0 0 10240 10240">
                  <path d="M8284 9162 c-2 -207 ... z"></path>
                </svg>
              </a>
              <button
                onClick={() => setMenuOpen(false)}
                className="navbar-close"
              >
                <svg
                  className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Links */}
            <ul>
              {["Home", "About Us", "Services", "Pricing", "Contact"].map(
                (item) => (
                  <li key={item} className="mb-1">
                    <a
                      className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                      href="#"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>

            {/* Footer */}
            <div className="mt-auto pt-6">
              <a
                className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold bg-gray-50 hover:bg-gray-100 rounded-xl"
                href="#"
              >
                Sign in
              </a>
              <a
                className="block px-4 py-3 mb-2 text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl"
                href="#"
              >
                Sign Up
              </a>
              <p className="my-4 text-xs text-center text-gray-400">
                Copyright © 2025
              </p>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Hamburger;
