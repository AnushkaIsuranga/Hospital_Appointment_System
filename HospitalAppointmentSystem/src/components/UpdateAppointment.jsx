import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentService from '../services/appointmentService';
import background from '../assets/image4.jpg';
import '../assets/alert.css';

const UpdateAppointment = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState({
        id: "",
        patientName: "",
        doctorName: "",
        patientMobile: "",
        patientEmail: "",
        appointmentTime: "",
        appointmentDate: "",
    });

    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const doctors = {
        "Dr. Smith": ["9am - 10am", "11am - 12pm", "2pm - 3pm"],
        "Dr. Johnson": ["10am - 11am", "1pm - 2pm", "3pm - 4pm"],
        "Dr. Williams": ["8am - 9am", "12pm - 1pm", "4pm - 5pm"]
    };

    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await appointmentService.getAppointmentById(id);
                const appointmentData = response.data;
                
                // Update state with fetched appointment data
                setAppointment(appointmentData);

                // Set selected date if appointment date is present
                if (appointmentData.appointmentDate) {
                    setSelectedDate(new Date(appointmentData.appointmentDate));
                }

                // Set available time slots based on the doctor
                if (appointmentData.doctorName) {
                    setTimeSlots(doctors[appointmentData.doctorName] || []);
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setAppointment((prev) => ({ ...prev, doctorName: selectedDoctor }));
        setTimeSlots(doctors[selectedDoctor] || []);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setAppointment((prev) => ({
            ...prev,
            appointmentDate: date.toISOString().split('T')[0]
        }));
    };

    const updateAppointment = (e) => {
        e.preventDefault();

        if (!appointment.patientName || !appointment.doctorName || !appointment.patientMobile || !appointment.patientEmail || !appointment.appointmentTime || !appointment.appointmentDate) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            return;
        }

        appointmentService.updateAppointment(appointment, appointment.id)
            .then((response) => {
                navigate("/appointment-dash");
            })
            .catch((error) => {
                console.error('Error updating appointment:', error);
            });
    };

    const back = (e) => {
        e.preventDefault();
        navigate('/appointment-dash');
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
                            className="w-full py-2 bg-cyan-400 text-white rounded-md transition-colors duration-300 hover:bg-blue-700"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={back}
                            className="w-full py-2 bg-gray-600 text-white rounded-md transition-colors duration-300 hover:bg-gray-700"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
            {showAlert && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300">
                    <p>Please fill in all required fields.</p>
                </div>
            )}
        </div>
    );
};

export default UpdateAppointment;
