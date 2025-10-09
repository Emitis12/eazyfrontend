import React from "react";

export default function TermsAndConditions() {
  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#008BE0] mb-6">Terms & Conditions</h1>
        <p className="mb-6 text-lg">
          Welcome to <strong>Eazy Software</strong> — a platform connecting customers,
          vendors, and riders for fast and reliable food delivery. By using this
          platform, you agree to these Terms and Conditions.
        </p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-10 mb-3">1. Service Use</h2>
        <p>You must be at least 18 years old to use our services. You agree to provide accurate and complete information when registering.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-10 mb-3">2. Orders & Payments</h2>
        <p>Orders and payments are processed via secure gateways (e.g., Paystack). Refunds are subject to vendor and Eazy Software policies.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-10 mb-3">3. Wallet & Payouts</h2>
        <p>Users may maintain wallet balances. Vendors and riders can withdraw funds via Paystack or approved payout partners.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-10 mb-3">4. Liability & Ownership</h2>
        <p>All platform content is owned or licensed by Eazy Software. We are not liable for indirect or incidental damages.</p>

        <h2 className="text-2xl font-semibold text-[#008BE0] mt-10 mb-3">5. Governing Law</h2>
        <p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p>
      </div>
    </section>
  );
}
