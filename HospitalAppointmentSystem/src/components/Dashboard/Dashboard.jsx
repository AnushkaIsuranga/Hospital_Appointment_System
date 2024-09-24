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
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [role, setRole] = useState(localStorage.getItem('role'));

    // Effect hook to load appointments on component mount
    useEffect(() => {
        loadAppointments();
    }, []);

    const navigate = useNavigate();

    // Ensure this is at the top of your component code

    // Effect for checking authentication
    useEffect(() => {
        const checkAuthentication = () => {
            const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
            const storedRole = localStorage.getItem('role');

            console.log('Checking Authentication:', {
                storedIsAuthenticated,
                storedRole,
            });

            if (storedIsAuthenticated !== 'true' || storedRole !== 'admin') {
                navigate('/login-dash');
                
            } else {
                setIsAuthenticated(true);
                setRole(storedRole);
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleLogout = () => {
        // Clear the authentication state from local storage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        
        // Redirect to the login page
        navigate('/login-dash'); // Change this to your login route
    };

    const doctorRegister = (e) => {
        e.preventDefault();
        navigate(`/register-doctor`);
    };

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
        <div className='relative'>
            
            <div className='w-screen bg-slate-500 p-5 pl-14 pr-14 flex justify-between items-center m-0'>
                <h1 className="text-4xl text-white font-bold mb-2">Dashboard</h1>
                <div className='space-x-6'>
                    <button 
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 hover:font-bold transition-all duration-300 w-40 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={generatePDF}
                    >
                        Generate Report 
                    </button>
                    <button 
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 hover:font-bold transition-all duration-300 w-40 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={doctorRegister}
                    >
                        Register Doctor
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 hover:bg-red-800 hover:font-bold transition-all duration-300 text-white w-24 px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
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