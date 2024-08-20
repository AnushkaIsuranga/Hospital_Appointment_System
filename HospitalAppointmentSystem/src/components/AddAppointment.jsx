import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentService from '../services/appointmentService';
import background from '../assets/image4.jpg';
import '../assets/alert.css';

const AddAppointment = () => {
    const [appointment, setAppointment] = useState({
        patientName: "",
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
        if (appointment.appointmentDate && appointment.appointmentTime) {
            console.log("Fetching appointments for:", appointment.appointmentDate, appointment.appointmentTime);
            appointmentService.getAppointmentsByDateAndTime(appointment.appointmentDate, appointment.appointmentTime)
                .then(response => {
                    const existingAppointments = response.data || [];
                    console.log("Existing appointments:", existingAppointments);
                    const nextIndex = getNextIndex(existingAppointments.length + 1, appointment.appointmentTime);
                    console.log("Next patient index:", nextIndex);
                    setAppointment(prev => ({ ...prev, patientIndex: nextIndex }));
                })
                .catch(error => {
                    console.error("Error fetching appointments:", error);
                });
        }
    }, [appointment.appointmentDate, appointment.appointmentTime]);
    
    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setAppointment(prev => ({ ...prev, doctorName: selectedDoctor, appointmentTime: "" }));
        setTimeSlots(doctors[selectedDoctor] || []);
        setAppointment(prev => ({ ...prev, patientIndex: "" })); // Reset the patient index when doctor changes
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

        const newAppointment = {
            ...appointment,
            isCanceled: false
        };

        appointmentService.saveAppointment(newAppointment)
            .then((response) => {
                console.log(response);
                navigate("/home");
            })
            .catch((error) => {
                console.error('Error adding appointment:', error);
            });
    };

    const back = (e) => {
        e.preventDefault();
        navigate(`/home`)
    };

    const getNextIndex = (count, timeSlot) => {
        const slotNumber = Object.values(doctors).flat().indexOf(timeSlot) + 1;
        const indexNumber = count.toString().padStart(2, '0');
        return `P${slotNumber}-${indexNumber}`;
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
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
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
                                className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
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
                        <label className="pr-3 text-gray-600 text-nowrap">Patient Index</label>
                        <input
                            type="text"
                            name="patientIndex"
                            value={appointment.patientIndex}
                            readOnly
                            className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <button
                            type="submit"
                            className="w-full py-2 bg-cyan-400 text-white rounded-md transition-colors duration-300 hover:bg-cyan-600"
                        >
                            Add
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
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-300 opacity-0">
                    <p>Please fill in all fields</p>
                </div>
            )}
        </div>
    );
};

export default AddAppointment;
