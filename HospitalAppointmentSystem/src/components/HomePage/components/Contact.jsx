import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact bg-white py-12 px-4 sm:px-8 text-gray-800">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-tango mb-6">Contact Us</h2>
        <p className="text-lg mb-4">
          <span className="font-medium text-gray-900">Email:</span> 
          <a href="mailto:info@hospital.com" className="text-aqua hover:underline">
            info@hospital.com
          </a>
        </p>
        <p className="text-lg mb-4">
          <span className="font-medium text-gray-900">Phone:</span> 
          <a href="tel:+15551234567" className="text-aqua hover:underline">
            +1 (555) 123-4567
          </a>
        </p>
        <p className="text-lg">
          <span className="font-medium text-gray-900">Address:</span> 
          123 Medical St., Health City, Country
        </p>
      </div>
    </section>
  );
};

export default Contact;
