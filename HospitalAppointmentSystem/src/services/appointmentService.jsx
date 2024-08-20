import axios from 'axios';

const API_URL = "http://localhost:8080/api";

class AppointmentService {
    saveAppointment(appointment) {
        return axios.post(`${API_URL}/appointments`, appointment);
    }

    getAppointments() {
        return axios.get(`${API_URL}/appointments`);
    }

    deleteAppointment(id) {
        return axios.delete(`${API_URL}/appointments/${id}`);
    }

    getAppointmentById(id) {
        return axios.get(`${API_URL}/appointments/${id}`);
    }

    updateAppointment(appointment, id) {
        return axios.put(`${API_URL}/appointments/${id}`, appointment);
    }

    getAppointmentsByDateAndTime(appointmentDate, appointmentTime) {
        return axios.get(`${API_URL}/appointments/search`, {
            params: {
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime.trim()
            }
        });
    }

    getActiveAppointments() {
        return axios.get(`${API_URL}/appointments/active`);
    }

    getCanceledAppointments() {
        return axios.get(`${API_URL}/appointments/canceled`);
    }

    cancelAppointment(id) {
        return axios.put(`${API_URL}/appointments/cancel/${id}`);
    }

    reviveAppointment(id) {
        return axios.put(`${API_URL}/appointments/revive/${id}`);
    }

    replaceAppointment(appointment) {
        return axios.post(`${API_URL}/appointments/replace`, appointment);
    }
}

export default new AppointmentService();
