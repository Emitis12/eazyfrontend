import React from "react";
import img1 from "../../assets/gdeli.png";
import img2 from "../../assets/sendre.png";
import img3 from "../../assets/groce.png";

const deliveryOptions = [
  {
    img: img1,
    title: "Food from Top Restaurants",
    description: (
      <>
        Different variaties of delicious meals, delievered <span className="bg-blue-200 px-1 rounded">fast and fresh</span> to your doorstep.
      </>
    ),
  },
  {
    img: img2,
    title: "Send, Order & Recieve",
    description: (
      <>
        Order, send and recieve <span className="bg-blue-200 px-1 rounded">anything and anytime,</span> to and from your doorstop.
      </>
    ),
  },
  {
    img: img3,
    title: "Groceries and other deliveries",
    description: (
      <>
        Shop from your favourite store, and have delivered <span className="bg-blue-200 px-1 rounded">fast and easy</span> for your home or office with ease and convenience.
      </>
    ),
  },
];

export default function DeliverAnything() {
  return (
    <section className="w-full bg-white py-20 flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold text-[#008BE0] mb-16 text-center">
        You Order, We Deliver
      </h2>

      <div className="flex flex-col md:flex-row gap-12 md:gap-8 justify-center items-start w-full px-6 md:px-20">
        {deliveryOptions.map((option, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center max-w-xs md:max-w-sm"
          >
            <img
              src={option.img}
              alt={option.title}
              className="w-48 h-48 mb-4"
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {option.title}
            </h3>
            <p className="text-gray-700 text-base">{option.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
