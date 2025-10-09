import React from "react";
import { FaArrowRight } from "react-icons/fa";
import mainImage from "../../assets/shake.png"; // main image
import riderImage from "../../assets/ride.png"; // rider image
import partnerImage from "../../assets/chef.png"; // partner image

export default function WorkTogetherSection() {
  return (
    <section className="w-full bg-gray-100 py-20 flex flex-col items-center px-6 md:px-20 gap-12 relative">
      {/* Main Image overlapping top */}
      <div className="flex flex-col items-center gap-6 -mt-28 sm:-mt-32 md:-mt-40">
        <img
          src={mainImage}
          alt="Let's Work Together"
          className="w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/3 max-w-xs sm:max-w-sm md:max-w-md"
        />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Let's Work Together
        </h2>
      </div>

      {/* Two Cards: Rider and Partner */}
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
        {/* Become a Rider */}
        <div className="flex flex-col items-center bg-gray-100 p-6 md:w-1/2 gap-4">
          <img src={riderImage} alt="Become a Rider" className="w-64 h-64" />
          <h3 className="text-2xl font-semibold text-gray-800">Become a Rider</h3>
          <p className="text-gray-600 text-center">
            Join our delivery team and start earning by <br /> delivering meals to customers in your area.
          </p>
          <button
            className="flex items-center gap-2 bg-[#008BE0] text-white px-6 py-2 rounded-full hover:bg-[#0072B8] transition"
          >
            Register Here <FaArrowRight />
          </button>
        </div>

        {/* Become a Partner */}
        <div className="flex flex-col items-center bg-gray-100 p-6 md:w-1/2 gap-4">
          <img src={partnerImage} alt="Become a Partner" className="w-64 h-64" />
          <h3 className="text-2xl font-semibold text-gray-800">Become a Partner</h3>
          <p className="text-gray-600 text-center">
            Partner with us to showcase your meals and <br /> reach more customers in your city.
          </p>
          <button
            className="flex items-center gap-2 bg-[#008BE0] text-white px-6 py-2 rounded-full hover:bg-[#0072B8] transition"
          >
            Register Here <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
