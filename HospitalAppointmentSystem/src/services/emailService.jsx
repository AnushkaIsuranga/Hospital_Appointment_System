import emailjs from 'emailjs-com';

// Define constants for EmailJS service, template, and user IDs.
const SERVICE_ID = 'service_70cs3vc';
const TEMPLATE_ID = 'template_8wvqqa8';
const USER_ID = 'user_nDNf3GocCkCuyD2ii';

// Function to send an appointment email.
const sendAppointmentEmail = async (appointment) => {
    const { patientName, patientEmail, doctorName, appointmentDate, appointmentTime, patientIndex } = appointment;
    
    // Set up email template parameters.
    const templateParams = {
        patient_name: patientName,
        patient_email: patientEmail,
        doctor_name: doctorName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        patient_index: patientIndex
    };

    try {
        // Send email using EmailJS.
        const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
        return result;
    } catch (error) {
        // Log and rethrow any errors.
        console.error('Failed to send email:', error);
        throw error;
    }
};

// Export the sendAppointmentEmail function as default.
export default sendAppointmentEmail;
