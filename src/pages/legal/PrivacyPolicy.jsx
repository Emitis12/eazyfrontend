import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#008BE0] mb-6">Privacy Policy</h1>
        <p className="text-lg mb-6">
          Eazy Software values your privacy and is committed to protecting your personal data.
        </p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">1. Information We Collect</h2>
        <ul className="list-disc ml-8 space-y-2">
          <li>Personal details: name, phone number, email, address</li>
          <li>Order and payment data</li>
          <li>Device and location information</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">2. How We Use Your Data</h2>
        <p>We use your data to process orders, communicate updates, improve our services, and comply with legal obligations.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">3. Data Sharing</h2>
        <p>We may share limited data with vendors, riders, payment processors, or law enforcement when required.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">4. Data Security</h2>
        <p>We apply encryption and access controls to protect your data against unauthorized access or loss.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-8 mb-3">5. Contact Us</h2>
        <p>
          For privacy concerns, contact us at <a href="mailto:privacy@eazysoftware.com" className="text-[#008BE0] underline">privacy@eazysoftware.com</a>
        </p>
      </div>
    </section>
  );
}
