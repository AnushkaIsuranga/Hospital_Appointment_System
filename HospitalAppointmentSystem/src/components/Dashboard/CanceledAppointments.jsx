/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import AppointmentService from '../../services/appointmentService';

const CanceledAppointments = () => {
  // Object to store doctors and their available time slots
  const doctors = {
    "Dr. Smith": ["9am - 10am", "11am - 12pm", "2pm - 3pm"],
    "Dr. Johnson": ["10am - 11am", "1pm - 2pm", "3pm - 4pm"],
    "Dr. Williams": ["8am - 9am", "12pm - 1pm", "4pm - 5pm"]
  };

  // State variables to manage appointments, filters, and UI elements
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState(Object.keys(doctors));
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [revivedAppointmentId, setRevivedAppointmentId] = useState(null);

  // Function to update available time slots based on selected doctor
  const updateTimeSlots = (doctor) => {
    if (doctor) {
      setTimeSlots(doctors[doctor]);
    } else {
      setTimeSlots([]);
    }
  };

  // Function to filter appointments based on selected criteria
  const handleFilter = () => {
    let filtered = appointments;

    if (selectedDoctor) {
      filtered = filtered.filter(app => app.doctorName === selectedDoctor);
    }
    if (selectedTimeSlot) {
      filtered = filtered.filter(app => app.appointmentTime === selectedTimeSlot);
    }
    if (selectedDate) {
      filtered = filtered.filter(app => app.appointmentDate === selectedDate);
    }

    setFilteredAppointments(filtered);
  };

  // Function to handle doctor selection change and update time slots
  const handleDoctorChange = (e) => {
    const doctor = e.target.value;
    setSelectedDoctor(doctor);
    updateTimeSlots(doctor);
  };

  // Fetch canceled appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AppointmentService.getCanceledAppointments();
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Error fetching canceled appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Function to handle reviving an appointment
  const handleRevive = async (id) => {
    try {
      await AppointmentService.reviveAppointment(id);
      setAppointments(appointments.filter(app => app.id !== id));
      setRevivedAppointmentId(id);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      console.error('Error reviving appointment:', error);
    }
  };

  return (
    <div className="p-4 ml-10 mr-10 mb-10">
      {/* Filter section */}
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 cursor-default">Filter Appointments</h1>
        <div className='grid grid-cols-4 gap-10'>
          {/* Doctor selection */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Doctor:</label>
            <select
              onChange={handleDoctorChange}
              value={selectedDoctor}
              className="border border-gray-300 p-2 rounded-md w-[100%]"
            >
              <option value="">Select a Doctor</option>
              {doctorsList.map((doctor) => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          {/* Time slot selection */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Time Slot:</label>
            <select
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              value={selectedTimeSlot}
              className="border border-gray-300 p-2 rounded-md  w-[100%]"
            >
              <option value="">Select a Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Date selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date:</label>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
              className="border border-gray-300 p-2 rounded-md  w-[100%]"
            />
          </div>

          {/* Apply Filters button */}
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 h-[70px]"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table of canceled appointments */}
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 cursor-default">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Index</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patientIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <button
                      className="font-bold text-green-500 hover:text-green-700 transition-colors duration-300"
                      onClick={() => handleRevive(appointment.id)}
                    >
                      Revive
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No canceled appointments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Alert for successfully revived appointment */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Revived Successfully! ID: {revivedAppointmentId}
        </div>
      )}
    </div>
  );
};

export default CanceledAppointments;
