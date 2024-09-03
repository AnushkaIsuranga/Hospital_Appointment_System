import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import appointmentService from '../../services/appointmentService';
import ActiveAppointments from './ActiveAppointments';
import CanceledAppointments from './CanceledAppointments';
import Statistics from './Statistics';
import GenerateReport from './GenerateReport';

function Dashboard() {
    // State for active and canceled appointments
    const [appointments, setAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [error, setError] = useState(''); // State for handling errors
    const [activeTab, setActiveTab] = useState('active'); // State to toggle between active and canceled appointments

    // Effect hook to load appointments on component mount
    useEffect(() => {
        loadAppointments();
    }, []);

    // Function to fetch active and canceled appointments
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

    // Function to replace an appointment
    const replaceAppointment = async (appointment) => {
        try {
            await appointmentService.replaceAppointment(appointment);
            loadAppointments(); // Refresh the lists after replacing an appointment
        } catch (error) {
            setError('Error replacing appointment.');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    // Reference for the report element
    const reportRef = useRef();

    // Formatting date for the report
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedDateTime = today.toLocaleString(); 
    const reportName = `Report-${formattedDate}.pdf`; // Name of the report file

    // Function to generate and download the PDF report
    const generatePDF = () => {
        const element = reportRef.current;

        const options = {
            margin: 0.5,
            filename: reportName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <div className=''>
            <div className='w-screen bg-slate-500 p-5 pl-14 pr-14 flex justify-between items-center'>
                <h1 className="text-4xl text-white font-bold mb-4">Dashboard</h1>
                <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600  transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={generatePDF}
                >
                    Generate Report 
                </button> 
            </div>

            <Statistics />
            <div className="flex mt-5 border-b border-gray-300 ml-10 mr-10">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'active'
                            ? 'border-b-2 border-blue-500 transition-colors duration-300 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Available Appointments
                </button>
                <button
                    onClick={() => setActiveTab('canceled')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'canceled'
                            ? 'border-b-2 border-blue-500 transition-colors duration-300 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Canceled Appointments
                </button>
            </div>
            <div className="mt-4">
                {/* Render the appropriate component based on the active tab */}
                {activeTab === 'active' && <ActiveAppointments />}
                {activeTab === 'canceled' && <CanceledAppointments canceledAppointments={canceledAppointments} replaceAppointment={replaceAppointment} />}
            </div>

            {error && <div className="error-message">{error}</div>} {/* Display error message if any */}

            {/* Hidden content for PDF generation */}
            <div style={{ display: 'none' }}>
                <GenerateReport 
                    ref={reportRef}
                    totalAppointments={appointments.length}
                    canceledAppointments={canceledAppointments.length}
                />
            </div>
        </div>
    );
}

export default Dashboard;
