import React from "react";
import { motion } from "framer-motion";

export const AboutSection: React.FC = () => {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-col md:flex-row items-center gap-12 px-8 md:px-24 py-20 bg-[#5c2f13] text-white font-serif"
    >
      <motion.img
        src="/about.png"
        alt="Restaurant interior"
        className="w-full md:w-1/2 rounded-2xl shadow-2xl"
        initial={{ scale: 0.95 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="md:w-1/2 space-y-8 text-center md:text-left">
        <motion.h2
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Zemen Bar and Restaurant
        </motion.h2>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-lg leading-relaxed text-gray-200">
            Located at Belt Line Rd and Jupiter Rd in Richardson, Zemen Bar & Restaurant offers a vibrant and authentic Ethiopian dining experience.
          </p>
          <p className="text-lg leading-relaxed text-gray-200">
            Enjoy classic dishes like <strong>Kitfo</strong> and <strong>Doro Wot</strong>, as well as a variety of vegan and vegetarian options for every palate.
          </p>
          <p className="text-lg leading-relaxed text-gray-200">
            Warm hospitality, flavorful dishes, and a casual, welcoming atmosphere make us your destination for Ethiopian culture and cuisine.
          </p>
          <p className="text-lg leading-relaxed font-semibold text-yellow-300">
            Available for: Dine In · Pick Up · Delivery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {[
            {
              title: "Cuisines",
              items: ["Breakfast", "Fish", "Seafood"],
            },
            {
              title: "Atmosphere",
              items: ["Casual Dining", "Relaxed & Chill"],
            },
            {
              title: "Food Types",
              items: ["Vegan Options", "Vegetarian Options"],
            },
          ].map((info, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-5 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <h4 className="font-semibold uppercase text-yellow-400 mb-3">{info.title}</h4>
              <ul className="space-y-2 text-base">
                {info.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-400 text-lg">•</span>
                    <span className="text-gray-100">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <InfoCard title="Business Hours" items={["Mon & Tue: 10:30 AM – Midnight", "Wed: Closed", "Thu – Sun: 10:30 AM – Midnight"]} />
          <InfoCard title="Carryout Hours" items={["Mon & Tue: 10:30 AM – 10:00 PM", "Wed: Closed", "Thu – Sun: 10:30 AM – 10:00 PM"]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-white/10 p-6 rounded-lg"
        >
          <h4 className="font-semibold text-yellow-400 uppercase mb-2">Contact</h4>
          <p className="text-base text-gray-100 leading-relaxed">
            2148 E Belt Line Rd, Richardson, TX 75081-3930
            <br />
            <a href="tel:2142428859" className="underline hover:text-yellow-300">
              (214) 242-8859
            </a>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

const InfoCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <motion.div
    className="bg-white/10 p-6 rounded-lg"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h4 className="font-semibold text-yellow-400 uppercase mb-3">{title}</h4>
    <ul className="space-y-2 text-base">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="text-yellow-400 text-lg">•</span>
          <span className="text-gray-100">{item}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);
