// src/services/paymentService.js
import API from "../utils/api";
import { notify } from "../components/common/Notification";

/**
 * Initialize Paystack payment.
 */
export async function initPaystackPayment({ email, amount, orderId }) {
  try {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert to kobo
      currency: "NGN",
      callback: async (response) => {
        await API.post("/orders/paystack/verify", {
          reference: response.reference,
          orderId,
        });
        notify.success("Payment Verified", "Order processing started!");
      },
      onClose: () => notify.info("Payment Cancelled", "You closed the payment window."),
    });

    handler.openIframe();
  } catch (error) {
    console.error("Paystack payment error:", error);
    notify.error("Payment Error", "Unable to initialize Paystack payment.");
  }
}

/**
 * Verify a Paystack payment manually
 */
export async function verifyPaystackPayment(reference, orderId) {
  try {
    const res = await API.post("/orders/paystack/verify", { reference, orderId });
    return res.data;
  } catch (error) {
    console.error("Verification error:", error);
    notify.error("Verification Error", "Payment could not be verified.");
    throw error;
  }
}
