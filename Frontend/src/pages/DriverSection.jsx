import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FaClock, FaCalendarWeek, FaCalendarAlt, FaCarSide } from "react-icons/fa";

const DriverSection = () => {
  const navigate = useNavigate();

  return (
    <div className="driver-section p-4">
      <Helmet>
        <title>Book a Driver</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Book a Driver</h1>
      <div className="driver-options grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="driver-card p-4 border rounded-lg shadow hover:shadow-lg transition">
          <FaClock className="text-3xl text-blue-500 mb-2" />
          <h2 className="text-xl font-semibold">Hourly Driver</h2>
          <p className="mb-4">Hire a driver on an hourly basis.</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/hourly-driver")}
          >
            Book Now
          </button>
        </div>

        <div className="driver-card p-4 border rounded-lg shadow hover:shadow-lg transition">
          <FaCalendarWeek className="text-3xl text-green-500 mb-2" />
          <h2 className="text-xl font-semibold">Weekly Driver</h2>
          <p className="mb-4">Hire a driver for a whole week.</p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => navigate("/weekly-driver")}
          >
            Book Now
          </button>
        </div>

        <div className="driver-card p-4 border rounded-lg shadow hover:shadow-lg transition">
          <FaCalendarAlt className="text-3xl text-purple-500 mb-2" />
          <h2 className="text-xl font-semibold">Monthly Driver</h2>
          <p className="mb-4">Hire a driver for a month with ease.</p>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            onClick={() => navigate("/monthly-driver")}
          >
            Book Now
          </button>
        </div>

        <div className="driver-card p-4 border rounded-lg shadow hover:shadow-lg transition">
          <FaCarSide className="text-3xl text-orange-500 mb-2" />
          <h2 className="text-xl font-semibold">Ondemand Driver</h2>
          <p className="mb-4">Book a driver as per your need.</p>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={() => navigate("/ondemand-driver")}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverSection;
