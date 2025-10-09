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

export default function CitiesSection() {
  return (
    <section className="w-full bg-[#008BE0] py-20 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 gap-12">
      {/* Image */}
      <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
        <img
          src={deliveryMap}
          alt="Delivery Map"
          className="w-2/3 md:w-3/4 lg:w-2/3 max-w-sm md:max-w-md rounded-lg"
        />
      </div>

      {/* Text & Cities List */}
      <div className="md:w-1/2 text-white">
        <h2 className="text-4xl font-bold mb-8 text-center md:text-left">
          Cities we deliver to
        </h2>
        <ul className="grid grid-cols-4 md:grid-cols-5 gap-4 text-lg">
          {cities.map((city, index) => (
            <li key={index} className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-400 flex-shrink-0" />
              {city}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
