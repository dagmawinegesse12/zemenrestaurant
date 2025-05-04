import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState("");

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!cardholderName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the cardholder name.",
        confirmButtonText: "OK",
      });
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/thank-you",  // ✅ Redirects after successful payment
        payment_method_data: {
          billing_details: {
            name: cardholderName,
          },
        },
      },
    });

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: result.error.message,
        confirmButtonText: "OK",
      });
      
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4 border p-4 rounded bg-gray-50">
      
      <label className="block mb-2 font-semibold text-left">Cardholder Name</label>
      <input
        type="text"
        placeholder="Enter name as on card"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        className="w-full border rounded p-3 mb-4"
        required
      />

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded w-full"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentForm;
