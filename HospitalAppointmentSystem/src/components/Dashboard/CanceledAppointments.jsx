import React, { useEffect, useState } from 'react';
import AppointmentService from '../../services/appointmentService';

const CanceledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [revivedAppointmentId, setRevivedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AppointmentService.getCanceledAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching canceled appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleRevive = async (id) => {
    try {
      await AppointmentService.reviveAppointment(id);
      setAppointments(appointments.filter(app => app.id !== id));
      setRevivedAppointmentId(id);
      setShowAlert(true);
      setTimeout(() => {
          setShowAlert(false);
      }, 5000);
      return;
    } catch (error) {
      console.error('Error reviving appointment:', error);
    }
  };

  return (
    <div className="p-4 ml-10 mr-10 mb-10">
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 hover:cursor-default">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Index</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
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
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No canceled appointments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showAlert && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                    <p>Revived Successfuly! ID:{revivedAppointmentId}</p>
                </div>
            )}
    </div>
  );
};

export default CanceledAppointments;