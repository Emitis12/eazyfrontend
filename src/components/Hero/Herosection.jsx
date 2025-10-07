import { Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FaMotorcycle } from "react-icons/fa";
import { useEffect, useState } from "react";

// Import images
import img1 from "../../assets/rider.png";
import img2 from "../../assets/groceries.png";
import img3 from "../../assets/junks.png";
import img4 from "../../assets/kits.png";
import img5 from "../../assets/shopping.png";
import img6 from "../../assets/gadgets.png";

const images = [img1, img2, img3, img4, img5, img6];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // Smooth auto-slideshow (1.5s delay + fade/zoom motion)
  useEffect(() => {
    if (window.innerWidth >= 768) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 1500); // each image stays for 1.5 seconds
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <section
      className="relative w-full flex flex-col md:flex-row items-center justify-between text-white overflow-hidden pt-20 pb-10 md:pt-0"
      style={{
        background: "linear-gradient(90deg, #008BE0 50%, #FFCF71 50%)",
      }}
    >
      {/* Mobile view image */}
      <div className="flex md:hidden w-full justify-center items-center mt-6 mb-4">
        <img
          src={img1}
          alt="Eazy Delivery Rider"
          className="w-3/4 max-w-[280px] h-auto object-contain"
        />
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center px-6 md:px-40 py-6 md:py-32 space-y-5 text-center md:text-left">
        <h1 className="text-3xl md:text-6xl font-bold leading-tight text-white drop-shadow-md">
          Easy delivery of food and more!
        </h1>
        <h3 className="text-base md:text-xl font-medium text-gray-100">
          Gadget, groceries, pharmacies? Just mention.
        </h3>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-gray-100 text-gray-800 rounded-t-2xl mt-3 p-2 px-3 w-fit shadow-md flex items-center space-x-2"
        >
          <FaMotorcycle className="text-xl md:text-2xl text-blue-600" />
          <p className="text-xs md:text-sm font-medium whitespace-nowrap">
            You order, we deliver.
          </p>

          <Button
            icon={<ShoppingCartOutlined />}
            className="font-medium text-white rounded-t-xl border-none text-xs md:text-sm"
            style={{
              backgroundColor: "#008BE0",
              padding: "0.3rem 1rem",
              borderRadius: "10px 10px 0 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#006BB3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#008BE0";
            }}
          >
            Order Now
          </Button>
        </motion.div>
      </div>

      {/* Desktop slideshow */}
      <div className="hidden md:flex w-1/2 h-screen overflow-hidden relative justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="absolute w-[45%] h-auto object-contain"
            initial={{ opacity: 0, scale: 1, x: -50 }}
            animate={{
              opacity: 1,
              scale: [1, 1.05],
              x: [0, 40],
            }}
            exit={{ opacity: 0, scale: 1.05, x: 60 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
