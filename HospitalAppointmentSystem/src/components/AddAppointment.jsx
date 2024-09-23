import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import sendAppointmentEmail from '../services/emailService';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentService from '../services/appointmentService';
import doctorService from '../services/doctorService'; // Import the doctor service
import background from '../assets/image4.jpg';

const AddAppointment = () => {
    const [appointment, setAppointment] = useState({
        doctorName: "",
        patientMobile: "",
        patientEmail: "",
        appointmentTime: "",
        appointmentDate: "",
        patientIndex: "", 
        isCanceled: false,
    });

    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [doctors, setDoctors] = useState([]); // State for doctors
    const navigate = useNavigate();

    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    // Fetch registered doctors on component mount
    useEffect(() => {
        doctorService.getDoctors()
            .then(response => {
                setDoctors(response.data);
            })
            .catch(error => {
                console.error("Error fetching doctors:", error);
            });
    }, []);

    useEffect(() => {
        if (appointment.appointmentDate && appointment.appointmentTime) {
            appointmentService.getAppointmentsByDateAndTime(appointment.appointmentDate, appointment.appointmentTime)
                .then(response => {
                    const existingAppointments = response.data || [];
                    const nextIndex = getNextIndex(existingAppointments.length + 1, appointment.appointmentTime);
                    setAppointment(prev => ({ ...prev, patientIndex: nextIndex }));
                })
                .catch(error => {
                    console.error("Error fetching appointments:", error);
                });
        }
    }, [appointment.appointmentDate, appointment.appointmentTime]);

    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setAppointment((prev) => ({
            ...prev,
            doctorName: selectedDoctor,
            appointmentTime: "",
            patientIndex: ""
        }));
        
        // Find the selected doctor from the fetched doctors
        const doctor = doctors.find(doc => doc.name === selectedDoctor);
        setTimeSlots(doctor ? doctor.timeSlots : []); // Update available time slots
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setAppointment((prev) => ({ ...prev, appointmentDate: date.toISOString().split('T')[0] }));
    };

    const addAppointment = (e) => {
        e.preventDefault();
        if (!appointment.patientName || !appointment.doctorName || !appointment.patientMobile || !appointment.patientEmail || !appointment.appointmentTime || !appointment.appointmentDate) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            return;
        }

        const newAppointment = { ...appointment, isCanceled: false };
        appointmentService.saveAppointment(newAppointment)
            .then(async (response) => {
                try {
                    await sendAppointmentEmail({ ...newAppointment, id: response.data.id });
                    navigate("/home");
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            })
            .catch((error) => {
                console.error('Error adding appointment:', error);
            });
    };

    const back = (e) => {
        e.preventDefault();
        navigate(`/home`)
    };

    return (
        <div className="display" style={backgroundStyle}>
            <div className="border-solid w-full h-full shadow-0 border-0 rounded-3xl p-6 sm:border-2 sm:w-[600px] sm:h-auto sm:shadow-xl bg-white bg-opacity-75 hover-scale-none transition-transform sm:hover-scale-up">
                <h1 className="text-cyan-400 text-4xl font-semibold text-center mb-4">Add New Appointment</h1>
                <form onSubmit={addAppointment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Patient Name</label>
                            <input
                                type="text"
                                name="patientName"
                                value={appointment.patientName}
                                onChange={handleChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Doctor Name</label>
                            <select
                                name="doctorName"
                                value={appointment.doctorName}
                                onChange={handleDoctorChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg pl-2 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select a Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Mobile</label>
                        <input
                            type="text"
                            name="patientMobile"
                            value={appointment.patientMobile}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="patientEmail"
                            value={appointment.patientEmail}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <div>
                            <label className="pr-3 text-gray-600">Time Slot</label>
                            <select
                                name="appointmentTime"
                                value={appointment.appointmentTime}
                                onChange={handleChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg pl-2 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
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
                                className="border-2 border-gray-300 w-[168px] sm:w-[100%] h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Patient Index</label>
                        <input
                            type="text"
                            name="patientIndex"
                            value={appointment.patientIndex}
                            readOnly
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    {showAlert && (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            Please fill in all fields before submitting the form.
                        </div>
                    )}
                    <div className="flex justify-between pt-2 xs:pt-6 gap-4">
                        <button onClick={back} className="bg-red-500 w-full transition-colors duration-300 hover:bg-red-600 text-white font-bold py-2 rounded-lg">
                            Back
                        </button>
                        <button type="submit" className="bg-blue-500 w-full transition-colors duration-300 hover:bg-blue-600 text-white font-bold py-2 rounded-lg">
                            Add Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAppointment;
