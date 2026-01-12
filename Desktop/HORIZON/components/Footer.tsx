import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiMapPin, FiPhone, FiMail as FiEmail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#026CDF] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">EH</span>
              </div>
              <span className="text-xl font-black text-white">EventHorizon</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your gateway to unforgettable live experiences. Discover and book tickets to the hottest events worldwide.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FiFacebook, color: "hover:text-blue-400", href: "#" },
                { icon: FiTwitter, color: "hover:text-sky-400", href: "#" },
                { icon: FiInstagram, color: "hover:text-pink-500", href: "#" },
                { icon: FiYoutube, color: "hover:text-red-500", href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-200 ${social.color} border border-gray-700 hover:border-gray-600`}
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Concerts', href: '/concerts' },
                { name: 'Sports', href: '/sports' },
                { name: 'Festivals', href: '/festivals' },
                { name: 'Theater', href: '/theater' }
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-bold text-lg mb-5">Support</h4>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Contact Us', href: '#' },
                { name: 'FAQs', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' }
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-bold text-lg mb-5">Stay Updated</h4>
            <p className="text-gray-400 mb-5 text-sm leading-relaxed">
              Subscribe to get exclusive deals and early access to tickets
            </p>
            <div className="flex flex-col space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <FiMapPin className="mr-3 text-[#026CDF]" />
                <span>123 Event Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiPhone className="mr-3 text-[#026CDF]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiEmail className="mr-3 text-[#026CDF]" />
                <span>support@eventhorizon.com</span>
              </div>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded-l-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#026CDF] focus:border-[#026CDF] text-sm placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#026CDF] to-[#1E40AF] hover:from-[#0259B3] hover:to-[#1E3A8A] px-5 py-2.5 rounded-r-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiMail className="text-white text-lg" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <p className="text-sm text-gray-400">
                © {currentYear} EventHorizon. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All event images and descriptions are for demonstration purposes only.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center space-x-2 text-sm text-gray-400"
            >
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>for event lovers</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
