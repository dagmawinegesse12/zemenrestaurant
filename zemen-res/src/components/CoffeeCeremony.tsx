import React from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
export const CoffeeCeremony: React.FC = () => {
  return (
    <motion.section
      id="coffee-ceremony"
      className="flex flex-col md:flex-row items-center px-8 md:px-24 py-20 bg-[#5c2f13] text-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src="/coffee.png"
        alt="Coffee ceremony"
        className="w-full md:w-1/2 rounded-2xl shadow-2xl mb-8 md:mb-0"
        initial={{ scale: 0.95 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="md:ml-12 text-center md:text-left space-y-6">
        <div className="flex items-center justify-center md:justify-start space-x-3">
          <Coffee className="w-8 h-8 text-yellow-400 animate-pulse" />
          <h2 className="text-4xl font-extrabold">Traditional Ethiopian Coffee Ceremony</h2>
        </div>

        <p className="text-lg leading-relaxed text-gray-200">
          Experience the rich aroma and ritual of Ethiopia's treasured coffee tradition — where every cup tells a story.
        </p>
        <p className="text-lg leading-relaxed text-gray-200">
          The ceremony is a central part of Ethiopian hospitality. Freshly roasted beans are ground and brewed slowly, then served gracefully in multiple rounds, inviting conversation and connection.
        </p>
        <p className="text-lg leading-relaxed text-gray-200">
          Enjoy the warmth, incense, and authentic flavors as our skilled hosts welcome you into this timeless cultural experience.
        </p>

        {/* <motion.a
          href="#reservations"
          className="inline-block mt-6 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow hover:bg-yellow-400 transition"
          whileHover={{ scale: 1.05 }}
        >
          Reserve Your Coffee Experience
        </motion.a> */}
      </div>
    </motion.section>
  );
};
