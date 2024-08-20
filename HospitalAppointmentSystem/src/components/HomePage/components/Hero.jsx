import React from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate();

    const addAppointment = (e) => {
        e.preventDefault();
        navigate(`/add-appointment`);
    };

  return (
    <section className="hero">
      <h2>Welcome to Our Hospital</h2>
      <p>Your health is our priority</p>
      <button onClick={addAppointment}>Make an Appointment</button>
    </section>
  );
};

export default Hero;