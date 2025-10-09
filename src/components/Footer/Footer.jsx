import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import logoSrc from "../../assets/logoblue.png"; // replace with your logo path

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-6">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="space-y-4">
            <img src={logoSrc} alt="Eazy Software Logo" className="h-10" />
            <p className="text-sm">
              Fast, Fresh, Eazy - Delivering Happiness To Your Yoor.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/vendors" className="hover:text-white">Become a Vendor</a></li>
              <li><a href="/riders" className="hover:text-white">Join as a Rider</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/faq" className="hover:text-white">FAQs</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/track" className="hover:text-white">Track Order</a></li>
            </ul>
          </div>

          {/* Legal + Social */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
            </ul>

            <div className="mt-6 flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Eazy Software. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-gray-300">Privacy</a>
            <a href="/terms" className="hover:text-gray-300">Terms</a>
            <a href="/sitemap" className="hover:text-gray-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
