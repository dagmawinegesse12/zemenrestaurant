import React from "react";
import { motion } from "framer-motion";

export const Reviews: React.FC = () => {
  return (
    <motion.section
      id="reviews"
      className="px-8 md:px-24 py-20 bg-[#fefaf3] text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-5xl font-extrabold mb-12 text-[#5c2f13]">What Our Customers Say</h2>
      
      <div className="grid gap-10 md:grid-cols-3 text-left">
        {[
          {
            text: `Probably the best Ethiopian restaurant I’ve visited in the USA. The service is fantastic, the food is very well seasoned and the portions are excellent at the price point.
The tibs and kitfo are made to perfection. The addition of Asmara beer, zibib and home made Tej complete a great experience. This is an excellent addition to the DFW area.`,
            author: "★★★★★ Google Review"
          },
          {
            text: `My wife, our daughters, and I ate at Zemen this past Saturday evening... I have eaten Ethiopian food in Ethiopia, DC, New York, LA, and Phoenix. 
The food at Zemen is excellently prepared, nicely presented, surprisingly inexpensive, and absolutely delicious. The service was warm, gracious, and efficient, and the atmosphere was familial.`,
            author: "★★★★★ Google Review"
          },
          {
            text: `Walked in and was greeted immediately, service was just as awesome as the food. I had the Juicy beef Tibs and Sambusa, there was 5 but ate before I remembered to take a picture. Will be back!`,
            author: "★★★★★ Google Review"
          }
        ].map((review, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 shadow-lg rounded-2xl transition transform duration-300"
          >
            <p className="italic text-gray-700 leading-relaxed">{review.text}</p>
            <p className="mt-6 font-semibold text-sm text-gray-500">{review.author}</p>
          </motion.div>
        ))}
      </div>

      <motion.a
        href="https://www.google.com/maps/place/Zemen+Bar+%26+Restaurant/@32.9441783,-96.6857156,1664m/data=!3m2!1e3!4b1!4m6!3m5!1s0x864c1fbbad67628d:0x275ef7e49ac47b81!8m2!3d32.9441738!4d-96.6831407!16s%2Fg%2F11y9dqx4vj?entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        className="inline-block mt-12 text-yellow-700 underline font-semibold text-lg"
      >
        Read more reviews on Google
      </motion.a>
    </motion.section>
  );
};
