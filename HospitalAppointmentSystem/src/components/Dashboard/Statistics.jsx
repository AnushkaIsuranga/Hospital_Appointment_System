/* eslint-disable no-unused-vars */ // Disable eslint rule for unused variables, if any

import React, { useEffect, useState } from 'react'; // Import React and hooks
import AppointmentService from '../../services/appointmentService'; // Import the appointment service

const Statistics = () => {
  // State variables for holding statistics data
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [appointmentsByDoctor, setAppointmentsByDoctor] = useState({});
  const [appointmentsByTimeSlot, setAppointmentsByTimeSlot] = useState({});
  const [canceledAppointments, setCanceledAppointments] = useState(0);

  // Function to fetch statistics data from the API
  const fetchStatistics = async () => {
    try {
      const totalResponse = await AppointmentService.getTotalAppointments(); // Fetch total appointments
      setTotalAppointments(totalResponse.data || 0); // Set total appointments

      const doctorResponse = await AppointmentService.getAppointmentsByDoctor(); // Fetch appointments by doctor
      setAppointmentsByDoctor(doctorResponse.data); // Set appointments by doctor

      const timeSlotResponse = await AppointmentService.getAppointmentsByTimeSlot(); // Fetch appointments by time slot
      setAppointmentsByTimeSlot(timeSlotResponse.data); // Set appointments by time slot

      const canceledResponse = await AppointmentService.getCanceledAppointmentsCount(); // Fetch canceled appointments count
      setCanceledAppointments(canceledResponse.data || 0); // Set canceled appointments count
    } catch (error) {
      console.error('Error fetching statistics:', error); // Handle error
    }
  };

  // Fetch statistics data on component mount and set up polling every 60 seconds
  useEffect(() => {
    fetchStatistics(); // Fetch data initially
    const interval = setInterval(fetchStatistics, 60000); // Poll data every 60 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Render statistics data in a grid layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 cursor-default ml-10 mr-10 mt-10">
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Total Appointments</h2>
        <p className="text-3xl font-bold">{totalAppointments || 0}</p> {/* Display total appointments */}
      </div>
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Appointments by Doctor</h2>
        <ul>
          {Object.entries(appointmentsByDoctor).map(([doctor, count]) => (
            <li key={doctor} className="text-sm">{doctor}: <span className='font-bold'>{count}</span></li>
          ))}
        </ul> {/* Display appointments by doctor */}
      </div>
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Appointments by Time Slot</h2>
        <ul>
          {Object.entries(appointmentsByTimeSlot).map(([slot, count]) => (
            <li key={slot} className="text-sm">{slot}: <span className='font-bold'>{count}</span></li>
          ))}
        </ul> {/* Display appointments by time slot */}
      </div>
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Canceled Appointments</h2>
        <p className="text-3xl font-bold">{canceledAppointments || 0}</p> {/* Display canceled appointments */}
      </div>
    </div>
  );
};

export default Statistics;
