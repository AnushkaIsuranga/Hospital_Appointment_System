import React, { useState } from 'react';
import axios from 'axios';
import './app.css'; 

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    date: '',
    timePeriod: '8-11am',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request to submit the form data
      const response = await axios.post('http://localhost:5000/api/form', formData);

      // Show success alert
      alert('Appointment booked successfully!');
    } catch (error) {
      // Log error and show error alert
      console.error('There was an error booking the appointment:', error);
      alert('There was an error booking your appointment. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="mb-4">
        <label htmlFor="name" className="block text-blue-600 font-semibold mb-2">
          Name:
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border border-blue-400 rounded-md focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="nic" className="block text-blue-600 font-semibold mb-2">
          NIC Number:
        </label>
        <input
          type="text"
          name="nic"
          id="nic"
          value={formData.nic}
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border border-blue-400 rounded-md focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-blue-600 font-semibold mb-2">
          Preferred Date:
        </label>
        <input
          type="date"
          name="date"
          id="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border border-blue-400 rounded-md focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="timePeriod" className="block text-blue-600 font-semibold mb-2">
          Preferred Time Period:
        </label>
        <select
          name="timePeriod"
          id="timePeriod"
          value={formData.timePeriod}
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border border-blue-400 rounded-md focus:ring-blue-400"
        >
          <option value="8-11am">8-11am</option>
          <option value="10-1pm">10-1pm</option>
          <option value="1-4pm">1-4pm</option>
          <option value="4-7pm">4-7pm</option>
          <option value="7-10pm">7-10pm</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default SimpleForm;
