import React from "react";
import { FaLink } from "react-icons/fa";

export default function Sitemap() {
  const links = [
    "Home",
    "About Us",
    "How It Works",
    "Vendors",
    "Riders",
    "Marketplace",
    "Wallet & Payments",
    "Contact Us",
    "FAQ",
    "Privacy Policy",
    "Terms & Conditions",
    "Cookies Policy",
  ];

  return (
    <section className="w-full bg-[#008BE0] py-20 px-6 md:px-20 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 text-[#FFCF71]">Eazy Software Sitemap</h1>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {links.map((link, index) => (
            <li key={index} className="flex items-center gap-2 justify-center">
              <FaLink className="text-[#FFCF71]" /> {link}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
