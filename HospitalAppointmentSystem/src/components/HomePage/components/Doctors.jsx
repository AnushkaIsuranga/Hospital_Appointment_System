import React from 'react';
import './Doctors.css';

const Doctors = () => {
  return (
    <section id="doctors" className="doctors">
      <h2>Meet Our Doctors</h2>
      <div className="doctor-list">
        <div className="doctor">
          <img src="https://via.placeholder.com/150" alt="Doctor 1" />
          <h3>Dr. Smith</h3>
          <p>Cardiologist</p>
        </div>
        <div className="doctor">
          <img src="https://via.placeholder.com/150" alt="Doctor 2" />
          <h3>Dr. Brown</h3>
          <p>Pediatrician</p>
        </div>
        <div className="doctor">
          <img src="https://via.placeholder.com/150" alt="Doctor 3" />
          <h3>Dr. Johnson</h3>
          <p>Neurologist</p>
        </div>
      </div>
    </section>
  );
};

export default Doctors;