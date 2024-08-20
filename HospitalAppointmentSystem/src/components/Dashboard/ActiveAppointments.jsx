import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../../services/appointmentService'; // Adjust path if necessary

const ActiveAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deletedAppointmentId, setDeletedAppointmentId] = useState(null);
  const [canceledAppointmentId, setCanceledAppointmentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AppointmentService.getActiveAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching active appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleEdit = async (id) => {
    try {
      await AppointmentService.getAppointment(id);
      setAppointments(appointments.filter(app => app.id !== id));

    } catch (error) {
      console.error('Error reviving appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await AppointmentService.deleteAppointment(id);
      setAppointments(appointments.filter(app => app.id !== id));
      setDeletedAppointmentId(id);
      setShowAlertDelete(true);
      setTimeout(() => {
        setShowAlertDelete(false);
      }, 5000);
      return;
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await AppointmentService.cancelAppointment(id);
      setAppointments(appointments.filter(app => app.id !== id));
      setCanceledAppointmentId(id);
      setShowAlertCancel(true);
      setTimeout(() => {
          setShowAlertCancel(false);
      }, 5000);
      return;
    } catch (error) {
      console.error('Error canceling appointment:', error);
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
                      className="font-bold text-blue-500 hover:text-blue-700 px-2 transition-colors duration-300"
                      onClick={() => handleEdit(appointment.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="font-bold text-red-500 hover:text-red-700 px-2 transition-colors duration-300"
                      onClick={() => handleDelete(appointment.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="font-bold text-gray-500 hover:text-gray-700 px-2 transition-colors duration-300"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No active appointments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showAlertDelete && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
              <p>Deleted Successfully! ID:{deletedAppointmentId}</p>
          </div>
      )}
      {showAlertCancel && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
              <p>Canceled Successfully! ID:{canceledAppointmentId}</p>
          </div>
      )}  
    </div>
  );
};

export default ActiveAppointments;