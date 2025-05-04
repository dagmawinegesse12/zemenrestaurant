import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { API_BASE_URL } from "../utils/api";
const ReservationForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    people: "",
    specialRequest: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL }/api/orders/reservations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        reservation_date: form.date,
        reservation_time: form.time,
        people_count: parseInt(form.people),
        special_request: form.specialRequest
      })
    });

    if (response.ok) {
      Swal.fire({
        title: "Reservation Successful",
        text: "Your reservation has been submitted successfully!",
        icon: "success",
        confirmButtonText: "OK"
      });
      setForm({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        people: "",
        specialRequest: ""
      });
    } else {
      Swal.fire({
        title: "Reservation Failed",
        text: "There was an error submitting your reservation. Please try again.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-2xl mx-auto p-10 bg-white rounded-2xl shadow-2xl"
    >
      <h2 className="text-4xl font-extrabold text-center text-[#5c2f13] mb-6">Reserve a Table</h2>

      <div className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <input name="date" type="date" value={form.date} onChange={handleChange} required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <input name="time" type="time" value={form.time} onChange={handleChange} required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <input name="people" type="number" value={form.people} onChange={handleChange} required placeholder="Number of people"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
        <textarea name="specialRequest" value={form.specialRequest} onChange={handleChange} placeholder="Special Request (optional)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold transition duration-300"
      >
        Submit Reservation
      </motion.button>
    </motion.form>
  );
};

export default ReservationForm;
