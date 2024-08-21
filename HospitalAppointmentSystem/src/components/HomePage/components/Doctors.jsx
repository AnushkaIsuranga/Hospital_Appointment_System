import React from 'react';

const Doctors = () => {
  return (
    <section id="doctors" className="doctors bg-soft-gray py-12 px-4 sm:px-8 text-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-tango mb-12">Meet Our Doctors</h2>
        <div className="doctor-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="doctor bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Doctor 1" 
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Smith</h3>
            <p className="text-tango">Cardiologist</p>
          </div>
          <div className="doctor bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Doctor 2" 
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Brown</h3>
            <p className="text-tango">Pediatrician</p>
          </div>
          <div className="doctor bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img 
              src="https://via.placeholder.com/150" 
              alt="Doctor 3" 
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Johnson</h3>
            <p className="text-tango">Neurologist</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
