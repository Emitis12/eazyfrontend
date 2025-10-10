import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import deliveryMap from "../../assets/globe.png"; // replace with your actual image

const cities = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Calabar",
  "Kano",
  "Ibadan",
  "Enugu",
  "Kaduna",
  "Benin City",
  "Maiduguri",
  "Jos",
  "Ilorin",
  "Aba",
  "Warri",
  "Owerri",
];

export default function Cities() {
  return (
    <section className="w-full bg-[#008BE0] py-16 flex flex-col items-center justify-center px-6 md:px-20 gap-10">
      {/* Image at top */}
      <div className="flex justify-center">
        <img
          src={deliveryMap}
          alt="Delivery Map"
          className="w-1/2 sm:w-2/5 md:w-1/3 lg:w-1/2 max-w-xs rounded-lg"
        />
      </div>

      {/* Text & Cities List */}
      <div className="text-white text-center w-full max-w-4xl">
        <h2 className="text-3xl sm:text-5xl font-bold mb-6">
          Cities we deliver to
        </h2>
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 sm:gap-6 text-lg sm:text-xl md:text-2xl justify-items-center">
          {cities.map((city, index) => (
            <li key={index} className="flex items-center gap-2 font-medium">
              <FaMapMarkerAlt className="text-[#FFCF71] flex-shrink-0" />
              {city}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
