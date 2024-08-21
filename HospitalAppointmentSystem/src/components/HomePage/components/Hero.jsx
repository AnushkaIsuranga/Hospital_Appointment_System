import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate();

  const addAppointment = (e) => {
    e.preventDefault();
    navigate(`/add-appointment`);
  };

  return (
    <section className="hero bg-aqua text-white py-20 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4 text-center">Welcome to Our Hospital</h2>
      <p className="text-lg mb-8 text-center">Your health is our priority</p>
      <button 
        onClick={addAppointment} 
        className="bg-tango text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-tango-dark transition duration-300"
      >
        Make an Appointment
      </button>
    </section>
  );
};

export default Hero;
