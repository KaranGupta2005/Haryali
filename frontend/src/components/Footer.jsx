import React from "react";
import { Facebook, Instagram, Twitter, Phone, Mail } from "lucide-react";

export default function Footer() {
  const socials = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      href: "#", 
      color: "hover:text-lime-300",
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      href: "#",
      color: "hover:text-emerald-300",
    },
    {
      name: "X",
      icon: <Twitter size={20} />,
      href: "#",
      color: "hover:text-green-200",
    },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-green-950 via-emerald-900 to-green-800 text-green-100 pt-12 pb-8 relative z-50 font-sans border-t border-green-700/40">
      
      {/* Logo & Tagline */}
      <div className="flex flex-col items-center mx-auto text-center px-4">
        <div className="flex items-center gap-3">
          <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full border-4 border-lime-400 overflow-hidden flex items-center justify-center bg-white/10">
            <img
              src="/logo.png"
              alt="Haryali Logo"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-lime-400">Haryali</h2>
        </div>
        <p className="text-emerald-300 text-base lg:text-lg mt-2 text-center">
          Turning Smoke into Sustainable Income 🌿
        </p>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mt-12 px-6">

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-lime-300 mb-4 border-b border-green-700 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-3 text-base">
            {["Home", "About", "Features", "Dashboard", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="hover:text-emerald-300 transition duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-lime-300 mb-4 border-b border-green-700 pb-2">
            Follow Us
          </h3>
          <div className="flex flex-col gap-3 text-base">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-green-800/60 hover:bg-green-700/60 transition ${social.color}`}
              >
                {social.icon}
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-lime-300 mb-4 border-b border-green-700 pb-2">
            Contact Us
          </h3>
          <div className="space-y-2 text-base">
            <p className="flex items-center gap-2">
              <Phone size={18} className="text-lime-400" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} className="text-lime-400" /> contact@haryali.in
            </p>
          </div>
          <p className="text-base mt-4 leading-6 text-emerald-200">
            Delhi Technological University, Delhi, India
          </p>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-lime-300 mb-4 border-b border-green-700 pb-2">
            Stay Updated
          </h3>
          <p className="text-base mb-3 text-emerald-200">
            Subscribe for latest updates on sustainable farming & green tech.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Your Name"
              className="px-3 py-3 bg-green-800/60 rounded-lg text-base text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-3 py-3 bg-green-800/60 rounded-lg text-base text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            <button
              type="submit"
              className="bg-lime-400 hover:bg-lime-500 text-black text-base py-3 rounded-lg transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-green-700 mt-12 pt-5 text-center text-sm lg:text-base text-emerald-200">
        <p>&copy; {new Date().getFullYear()} Haryali. All rights reserved.</p>
        <p className="mt-1">Crafted with 💚 by Team Haryali</p>
      </div>
    </footer>
  );
}
