import React from 'react';
import Contact from './components/Contact';
import Doctors from './components/Doctors';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Services from './components/Services';

const HomePage = () => {
  return (
    <div className="font-sans text-gray-900">
        <Navbar />
      {/* </header> */}

      {/* Hero Section */}
      {/* <section className="bg-soft-gray text-center py-20 px-4 sm:px-8"> */}
        <Hero />
      {/* </section> */}

      {/* Services Section */}
      {/* <section className="py-12 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          <Services />
        {/* </div> */}
      {/* </section> */}

      {/* Doctors Section */}
      {/* <section className="bg-soft-gray py-12 text-gray-800"> */}
        {/* <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          <Doctors />
        {/* </div>
      </section> */}

      {/* Contact Sectio */}
      {/* <section className="bg-white py-12 text-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          <Contact />
        {/* </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="bg-tango text-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          <Footer />
        {/* </div>
      </footer> */}

      {/* Extra content or placeholder */}
      {/* <div className="text-center py-4 text-tango font-semibold"> */}
        abc
      </div>
    // </div>
  );
}

export default HomePage;
