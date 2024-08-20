import React, { useEffect, useState } from 'react';
import appointmentService from '../../services/appointmentService';
import ActiveAppointments from './ActiveAppointments';
import CanceledAppointments from './CanceledAppointments';

function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const activeResponse = await appointmentService.getActiveAppointments();
            const canceledResponse = await appointmentService.getCanceledAppointments();
            setAppointments(activeResponse.data);
            setCanceledAppointments(canceledResponse.data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    };

    const replaceAppointment = async (appointment) => {
        try {
            await appointmentService.replaceAppointment(appointment);
            loadAppointments(); // Refresh the lists
        } catch (error) {
            setError('Error replacing appointment.');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div>
            <div className="flex ml-10 mr-10 mt-10 border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'active'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Available Appointments
                </button>
                <button
                    onClick={() => setActiveTab('canceled')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'canceled'
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Canceled Appointments
                </button>
            </div>
            <div className="mt-4">
                {activeTab === 'active' && <ActiveAppointments />}
                {activeTab === 'canceled' && <CanceledAppointments canceledAppointments={canceledAppointments} replaceAppointment={replaceAppointment} />}
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default Dashboard;
