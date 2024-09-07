import React, { useEffect, useState } from 'react'; 
import AppointmentService from '../../services/appointmentService'; 

const Statistics = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [appointmentsByDoctor, setAppointmentsByDoctor] = useState({});
  const [appointmentsByTimeSlot, setAppointmentsByTimeSlot] = useState({});
  const [canceledAppointments, setCanceledAppointments] = useState(0);

  const fetchStatistics = async () => {
    try {
      const totalResponse = await AppointmentService.getTotalAppointments();
      setTotalAppointments(totalResponse.data || 0);
  
      const doctorResponse = await AppointmentService.getAppointmentsByDoctor();
      console.log("Doctor Response:", doctorResponse.data); // Log to verify structure
      setAppointmentsByDoctor(doctorResponse.data);
  
      const timeSlotResponse = await AppointmentService.getAppointmentsByTimeSlot();
      console.log("Time Slot Response:", timeSlotResponse.data); // Log to verify structure
      setAppointmentsByTimeSlot(timeSlotResponse.data);
  
      const canceledResponse = await AppointmentService.getCanceledAppointmentsCount();
      console.log("Canceled Appointments Response:", canceledResponse.data); // Log to verify structure
      setCanceledAppointments(canceledResponse.data || 0);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 cursor-default ml-10 mr-10 mt-10">
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Total Appointments</h2>
        <p className="text-3xl font-bold">{totalAppointments || 0}</p>
      </div>
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Appointments by Doctor</h2>
        <ul>
          {appointmentsByDoctor && Object.entries(appointmentsByDoctor).length > 0 ? (
            Object.entries(appointmentsByDoctor).map(([doctor, count]) => (
              <li key={doctor} className="text-sm">{doctor}: <span className='font-bold'>{count}</span></li>
            ))
          ) : (
            <li>No data available</li>
          )}
        </ul>
      </div>
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Appointments by Time Slot</h2>
        <ul>
          {appointmentsByTimeSlot && Object.entries(appointmentsByTimeSlot).length > 0 ? (
            Object.entries(appointmentsByTimeSlot).map(([slot, count]) => (
              <li key={slot} className="text-sm">{slot}: <span className='font-bold'>{count}</span></li>
            ))
          ) : (
            <li>No data available</li>
          )}
        </ul>
      </div>
      <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
        <h2 className="text-lg font-bold">Canceled Appointments</h2>
        <p className="text-3xl font-bold">{canceledAppointments || 0}</p>
      </div>
    </div>
  );
};

export default Statistics;
