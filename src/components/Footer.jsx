import React from 'react';
import { Link } from 'react-router-dom';
// src/components/Footer.jsx
const Footer = () => (
  <footer className="bg-[#1A1A1A] text-white py-12 px-6">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h3 className="text-xl font-bold mb-4">RECIPE<span className="text-[#FF4500]">ARENA</span></h3>
        <p className="text-gray-400 text-sm">Your go-to place for the most delicious and simple recipes from around the world.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Quick Links</h4>
        <ul className="text-gray-400 text-sm space-y-2 font-light">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-recipe">Add Recipe</Link></li>
          <li><Link to="/auth">Login / Signup</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Newsletter</h4>
        <div className="flex bg-white/10 p-1 rounded-lg">
          <input type="text" placeholder="Your Email" className="bg-transparent flex-1 px-3 text-sm outline-none" />
          <button className="bg-[#FF4500] px-4 py-2 rounded-md text-xs font-bold">JOIN</button>
        </div>
      </div>
    </div>
    <div className="text-center mt-10 pt-6 border-t border-white/5 text-gray-500 text-xs">
      © 2026 RecipeArena. All rights reserved.
    </div>
  </footer>
);

export default Footer;