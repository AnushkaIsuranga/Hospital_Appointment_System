/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../../services/appointmentService';
import mergeSort from '../../services/mergeSort'

// Predefined list of doctors and their available time slots
const doctors = {
  "Dr. Smith": ["9am - 10am", "11am - 12pm", "2pm - 3pm"],
  "Dr. Johnson": ["10am - 11am", "1pm - 2pm", "3pm - 4pm"],
  "Dr. Williams": ["8am - 9am", "12pm - 1pm", "4pm - 5pm"]
};

const ActiveAppointments = () => {
  // State variables for managing appointments and filters
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState(Object.keys(doctors));
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deletedAppointmentId, setDeletedAppointmentId] = useState(null);
  const [canceledAppointmentId, setCanceledAppointmentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetching active appointments from the service
        const response = await AppointmentService.getActiveAppointments();
        // Sorting appointments using merge sort
        const sortedAppointments = mergeSort(response.data);

        setAppointments(sortedAppointments);
        setFilteredAppointments(sortedAppointments);

        // Extract unique time slots based on the selected doctor
        updateTimeSlots(selectedDoctor);
      } catch (error) {
        console.error('Error fetching active appointments:', error);
      }
    };

    // Merge sort function for sorting appointments
    const mergeSort = (array) => {
      if (array.length <= 1) return array;

      const mid = Math.floor(array.length / 2);
      const left = array.slice(0, mid);
      const right = array.slice(mid);

      return merge(mergeSort(left), mergeSort(right));
    };

    fetchAppointments();
    // Set an interval to fetch appointments every minute
    const interval = setInterval(fetchAppointments, 60000);
    return () => clearInterval(interval);
  }, [selectedDoctor]);

  // Merge function used in merge sort
  const merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      const dateA = new Date(left[leftIndex].appointmentDate);
      const dateB = new Date(right[rightIndex].appointmentDate);

      // Compare appointment dates and then patient indexes
      if (dateA < dateB) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else if (dateA > dateB) {
        result.push(right[rightIndex]);
        rightIndex++;
      } else {
        const indexA = parseInt(left[leftIndex].patientIndex.split('-')[1], 10);
        const indexB = parseInt(right[rightIndex].patientIndex.split('-')[1], 10);

        if (indexA > indexB) {
          result.push(left[leftIndex]);
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          rightIndex++;
        }
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  // Function to update available time slots based on the selected doctor
  const updateTimeSlots = (doctor) => {
    if (doctor) {
      setTimeSlots(doctors[doctor]);
    } else {
      setTimeSlots([]);
    }
  };

  // Function to handle filtering appointments based on selected criteria
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

  // Function to handle doctor selection change
  const handleDoctorChange = (e) => {
    const doctor = e.target.value;
    setSelectedDoctor(doctor);
    updateTimeSlots(doctor);
  };

  // Function to handle editing an appointment
  const handleEdit = async (id) => {
    try {
      const response = await AppointmentService.getAppointmentById(id);

      if (response && response.data) {
        navigate(`/edit-appointment/${id}`, { state: { appointment: response.data } });
      } else {
        console.error('Appointment not found');
      }
    } catch (error) {
      console.error('Error editing appointment:', error);
    }
  };

  // Function to handle deleting an appointment
  const handleDelete = async (id) => {
    try {
      await AppointmentService.deleteAppointment(id);
      const updatedAppointments = await AppointmentService.getActiveAppointments();
      const sortedAppointments = mergeSort(updatedAppointments.data);

      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
    
      setDeletedAppointmentId(id);
      setShowAlertDelete(true);
    
      setTimeout(() => {
        setShowAlertDelete(false);
      }, 5000);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  // Function to handle canceling an appointment
  const handleCancel = async (id) => {
    try {
      await AppointmentService.cancelAppointment(id);
      const updatedAppointments = await AppointmentService.getActiveAppointments();
      const sortedAppointments = mergeSort(updatedAppointments.data);

      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
      
      setCanceledAppointmentId(id);
      setShowAlertCancel(true);
      
      setTimeout(() => {
        setShowAlertCancel(false);
      }, 5000);
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  return (
    <div className="p-4 ml-10 mr-10 mb-10">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 cursor-default">Filter Appointments</h1>
        <div className='grid grid-cols-4 gap-10'>
          {/* Dropdown to select a doctor */}
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
          {/* Dropdown to select a time slot */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Time Slot:</label>
            <select
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              value={selectedTimeSlot}
              className="border border-gray-300 p-2 rounded-md w-[100%]"
            >
              <option value="">Select a Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          {/* Date picker for selecting the appointment date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date:</label>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
              className="border border-gray-300 p-2 rounded-md w-[100%]"
            />
          </div>
          {/* Button to apply filters */}
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 h-[70px]"
          >
            Apply Filters
          </button>
        </div>
      </div>
      {/* Table displaying filtered appointments */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto overflow-y-auto max-h-[340px]">
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
          <tbody className="bg-white divide-y divide-gray-200 max-h-28 overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No appointments found</td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.appointmentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.appointmentTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="text-yellow-600 hover:text-yellow-900 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Alert for canceled appointment */}
      {showAlertCancel && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md">
          Appointment {canceledAppointmentId} has been canceled successfully!
        </div>
      )}

      {/* Alert for deleted appointment */}
      {showAlertDelete && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
          Appointment {deletedAppointmentId} has been deleted successfully!
        </div>
      )}
    </div>
  );
};

export default ActiveAppointments;
