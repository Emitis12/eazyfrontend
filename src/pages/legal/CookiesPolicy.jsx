import React from "react";

export default function CookiesPolicy() {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#008BE0] mb-6">Cookies Policy</h1>
        <p className="text-lg mb-6">
          This Cookies Policy explains how Eazy Software uses cookies and similar technologies to enhance your browsing experience.
        </p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">1. What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device to help us remember your preferences and improve our service.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">2. Types of Cookies We Use</h2>
        <ul className="list-disc ml-8 space-y-2">
          <li>Essential: Enable core site functions</li>
          <li>Performance: Measure traffic and performance</li>
          <li>Functional: Store user preferences</li>
          <li>Advertising: Display relevant offers and promotions</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">3. Managing Cookies</h2>
        <p>
          You can disable cookies in your browser settings, but some site features may not work properly.
        </p>
      </div>
    </section>
  );
}
