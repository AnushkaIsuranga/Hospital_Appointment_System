import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-soft-gray text-gray-800 py-4 px-6 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-bold text-tango">Hospital Name</h1>
      <ul className="flex space-x-6">
        <li>
          <a href="#services" className="hover:text-tango-dark transition-colors duration-300">Services</a>
        </li>
        <li>
          <a href="#doctors" className="hover:text-tango-dark transition-colors duration-300">Doctors</a>
        </li>
        <li>
          <a href="#contact" className="hover:text-tango-dark transition-colors duration-300">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
