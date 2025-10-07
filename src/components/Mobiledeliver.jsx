import React from "react";
import { FaMobileAlt } from "react-icons/fa";
import mobileAppImg from "../assets/phone.png";

export default function MobileOrderSection() {
  return (
    <section className="w-full bg-white py-20 flex flex-col items-center px-6 md:px-20 gap-8">
       {/* Image */}
      <div className="flex justify-center w-full">
        <img
          src={mobileAppImg}
          alt="Mobile App"
          className="w-4/5 md:w-2/3 lg:w-1/2 max-w-lg "
        />
      </div>
      
      {/* Phone Icon on Top */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-4xl font-bold text-center">Your Order is Mobile</h2>
        <p className="text-lg text-center text-gray-800 max-w-xl">
          Order from your phone, track your rider, get it at your delivery at your doorstep.
        </p>
      </div>


      {/* Mobile App Coming Soon */}
      <div className="flex flex-col items-center gap-2 mt-4 text-yellow-500 font-semibold text-lg">
        <FaMobileAlt className="text-3xl" />
        Mobile App Coming Soon
      </div>
    </section>
  );
}
