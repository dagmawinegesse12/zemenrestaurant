import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage: React.FC = () => {
  return (
    <section className="px-8 md:px-24 py-32 bg-white text-gray-900 text-center min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-6 text-green-700">🎉 Thank You for Your Order!</h1>
      <p className="text-lg mb-4">
        We have received your order and payment successfully.
      </p>
      <p className="text-lg mb-8">
        Our team will begin preparing your delicious meal right away!
      </p>
      <Link
        to="/"
        className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default ThankYouPage;
