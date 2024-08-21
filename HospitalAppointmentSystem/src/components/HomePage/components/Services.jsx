import React from 'react';

const Services = () => {
  return (
    <section id="services" className="bg-aqua text-white py-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-tango">Our Services</h2>
        <ul className="space-y-4 text-lg">
          <li className="hover:text-tango-dark transition-colors duration-300">Emergency Care</li>
          <li className="hover:text-tango-dark transition-colors duration-300">Cardiology</li>
          <li className="hover:text-tango-dark transition-colors duration-300">Pediatrics</li>
          <li className="hover:text-tango-dark transition-colors duration-300">Neurology</li>
        </ul>
      </div>
    </section>
  );
};

export default Services;
