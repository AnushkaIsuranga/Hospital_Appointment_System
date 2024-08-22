import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentService from '../services/appointmentService';
import background from '../assets/image4.jpg';

const EditAppointment = () => {
    const { id } = useParams(); // Get the appointment ID from the URL parameters
    const navigate = useNavigate(); // Hook for navigation

    // State to hold the appointment data
    const [appointment, setAppointment] = useState({
        id: "",
        patientName: "",
        doctorName: "",
        patientMobile: "",
        patientEmail: "",
        appointmentTime: "",
        appointmentDate: "",
    });

    const [timeSlots, setTimeSlots] = useState([]); // State for available time slots
    const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
    const [showAlert, setShowAlert] = useState(false); // State for showing an alert message

    // Available doctors and their respective time slots
    const doctors = {
        "Dr. Smith": ["9am - 10am", "11am - 12pm", "2pm - 3pm"],
        "Dr. Johnson": ["10am - 11am", "1pm - 2pm", "3pm - 4pm"],
        "Dr. Williams": ["8am - 9am", "12pm - 1pm", "4pm - 5pm"]
    };

    // Style for the background image
    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    // Fetch the appointment data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await appointmentService.getAppointmentById(id); // Fetch appointment by ID
                const appointmentData = response.data;

                setAppointment(appointmentData); // Set the fetched appointment data

                // If the appointment has a date, set it in the date picker
                if (appointmentData.appointmentDate) {
                    setSelectedDate(new Date(appointmentData.appointmentDate));
                }

                // If a doctor is selected, update the available time slots
                if (appointmentData.doctorName) {
                    setTimeSlots(doctors[appointmentData.doctorName] || []);
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };
        fetchData();
    }, [id]); // Dependency array to run the effect only when the ID changes

    // Handle changes in input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({ ...prev, [name]: value })); // Update the appointment state
    };

    // Handle changes in the doctor selection
    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setAppointment((prev) => ({ ...prev, doctorName: selectedDoctor })); // Update the doctor name in the appointment
        setTimeSlots(doctors[selectedDoctor] || []); // Update the available time slots
    };

    // Handle changes in the date picker
    const handleDateChange = (date) => {
        setSelectedDate(date); // Update the selected date
        setAppointment((prev) => ({
            ...prev,
            appointmentDate: date.toISOString().split('T')[0] // Format the date and update the appointment state
        }));
    };

    // Handle form submission to update the appointment
    const updateAppointment = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validate required fields
        if (!appointment.patientName || !appointment.doctorName || !appointment.patientMobile || !appointment.patientEmail || !appointment.appointmentTime || !appointment.appointmentDate) {
            setShowAlert(true); // Show alert if validation fails
            setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
            return;
        }

        // Send the updated appointment data to the server
        appointmentService.updateAppointment(appointment, appointment.id)
            .then((response) => {
                navigate("/appointment-dash"); // Navigate to the dashboard on success
            })
            .catch((error) => {
                console.error('Error updating appointment:', error);
            });
    };

    // Handle the back button to navigate back to the dashboard
    const back = (e) => {
        e.preventDefault();
        navigate('/appointment-dash'); // Navigate back to the dashboard
    };

    return (
        <div className="display" style={backgroundStyle}>
            <div className="border-solid w-full h-full shadow-0 border-0 rounded-3xl p-6 sm:border-2 sm:w-[600px] sm:h-auto sm:shadow-xl bg-white bg-opacity-75">
                <h1 className="text-cyan-400 text-4xl font-semibold text-center mb-4">Update Appointment</h1>
                <form onSubmit={updateAppointment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Patient Name</label>
                            <input
                                type="text"
                                name="patientName"
                                value={appointment.patientName}
                                onChange={handleChange}
                                className="border-2 border-gray-300 w-full sm:w-full rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Doctor Name</label>
                            <select
                                name="doctorName"
                                value={appointment.doctorName}
                                onChange={handleDoctorChange}
                                className="border-2 border-gray-300 w-full h-7 sm:w-full rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select a Doctor</option>
                                {Object.keys(doctors).map((doctor) => (
                                    <option key={doctor} value={doctor}>
                                        {doctor}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-6 p-2">
                        <label className="pr-3 text-gray-600">Mobile</label>
                        <input
                            type="text"
                            name="patientMobile"
                            value={appointment.patientMobile}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2">
                        <label className="pr-3 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="patientEmail"
                            value={appointment.patientEmail}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <div>
                            <label className="pr-3 text-gray-600">Time Slot</label>
                            <select
                                name="appointmentTime"
                                value={appointment.appointmentTime}
                                onChange={handleChange}
                                className="border-2 border-gray-300 w-full sm:w-full h-7 rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select a Time Slot</option>
                                {timeSlots.map((slot, index) => (
                                    <option key={index} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="pr-3 text-gray-600">Appointment Date</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="border-2 border-gray-300 w-[168px] sm:w-[100%] rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <button
                            type="submit"
                            className="w-full py-2 font-bold bg-cyan-400 text-white rounded-md transition-colors duration-300 hover:bg-cyan-700"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={back}
                            className="w-full py-2 font-bold bg-gray-600 text-white rounded-md transition-colors duration-300 hover:bg-gray-700"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
            {showAlert && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300">
                    <p>Please fill in all the required fields.</p>
                </div>
            )}
        </div>
    );
};

export default EditAppointment;
