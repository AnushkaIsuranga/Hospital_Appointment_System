import { useState } from 'react'
import './App.css'

import React, { useState } from 'react';
import axios from 'axios';
import './tailwind.css'; 
const SimpleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    date: '',
    timePeriod: '8-11am',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/form', formData);
      alert(response.data);
    } catch (error) {
      console.error('There was an error!', error);
      alert('Error booking appointment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-soft-gray rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-aqua font-semibold mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-tango rounded-md focus-ring-tango"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-aqua font-semibold mb-2">
          NIC Number:
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-tango rounded-md focus-ring-tango"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-aqua font-semibold mb-2">
          Preferred Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-tango rounded-md focus-ring-tango"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-aqua font-semibold mb-2">
          Preferred Time Period:
          <select
            name="timePeriod"
            value={formData.timePeriod}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-tango rounded-md focus-ring-tango"
          >
            <option value="8-11am">8-11am</option>
            <option value="10-1pm">10-1pm</option>
            <option value="1-4pm">1-4pm</option>
            <option value="4-7pm">4-7pm</option>
            <option value="7-10pm">7-10pm</option>
          </select>
        </label>
      </div>
      <button type="submit" className="w-full py-2 bg-tango text-white font-semibold rounded-md hover:bg-tango-dark">
        Submit
      </button>
    </form>
  );
};

export default SimpleForm;
