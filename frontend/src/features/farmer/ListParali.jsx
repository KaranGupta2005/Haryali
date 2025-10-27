import { useState } from "react";
import { motion } from "motion/react";

export default function ListParali() {
  const [formData, setFormData] = useState({
    farmerName: "",
    location: "",
    cropType: "",
    quantity: "",
    contact: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.location || !formData.cropType || !formData.quantity || !formData.contact) {
      alert("Please fill all fields before submitting.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6"
    >
      <motion.div
        className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 border border-green-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Parali Listing Form</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Farmer Name</label>
              <input
                type="text"
                name="farmerName"
                value={formData.farmerName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter village or district"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Crop Type</label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <option value="">Select crop</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (in tons)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter mobile number"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition"
            >
              Submit Listing
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-2">Listing Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you, {formData.farmerName}. Your Parali listing has been received.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSubmitted(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
            >
              Add Another Listing
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
