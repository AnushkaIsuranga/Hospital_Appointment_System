package nibm.hdse241.hospitalappointmentsystem.services;

import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.repositories.appointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Stack;
import java.util.stream.Collectors;

@Service // Marks this class as a service component
public class appointmentService {

    @Autowired // Automatically injects the appointmentRepository bean
    private appointmentRepository appointmentRepository;

    // Stack to manage canceled appointments
    private Stack<Appointment> canceledAppointmentsStack = new Stack<>();

    // Create a new appointment
    public Appointment createAppointment(appointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        // Convert DTO to Entity
        appointment.setPatientIndex(appointmentDTO.getPatientIndex());
        appointment.setPatientName(appointmentDTO.getPatientName());
        appointment.setDoctorName(appointmentDTO.getDoctorName());
        appointment.setPatientMobile(appointmentDTO.getPatientMobile());
        appointment.setPatientEmail(appointmentDTO.getPatientEmail());
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointment.setCanceled(false);
        return appointmentRepository.save(appointment);
    }

    // Get all appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Get active appointments (i.e., not canceled)
    public List<Appointment> getActiveAppointments() {
        return appointmentRepository.findByIsCanceledFalse();
    }

    // Get canceled appointments
    public List<Appointment> getCanceledAppointments() {
        return appointmentRepository.findByIsCanceledTrue();
    }

    // Get an appointment by ID
    public ResponseEntity<Appointment> getAppointmentById(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            return new ResponseEntity<>(appointment.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update an existing appointment by ID
    public ResponseEntity<Appointment> updateAppointment(int id, appointmentDTO appointmentDTO) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(id);
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();
            appointment.setPatientIndex(appointmentDTO.getPatientIndex());
            appointment.setPatientName(appointmentDTO.getPatientName());
            appointment.setDoctorName(appointmentDTO.getDoctorName());
            appointment.setPatientMobile(appointmentDTO.getPatientMobile());
            appointment.setPatientEmail(appointmentDTO.getPatientEmail());
            appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
            appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
            return new ResponseEntity<>(appointmentRepository.save(appointment), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete an appointment by ID
    public ResponseEntity<HttpStatus> deleteAppointment(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointmentRepository.delete(appointment.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Cancel an appointment by ID
    public ResponseEntity<Appointment> cancelAppointment(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment app = appointment.get();
            app.setCanceled(true); // Mark the appointment as canceled
            appointmentRepository.save(app); // Save to database
            canceledAppointmentsStack.push(app); // Push to stack
            return new ResponseEntity<>(app, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Revive a canceled appointment by ID
    public ResponseEntity<Appointment> reviveAppointment(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment app = appointment.get();
            if (app.isCanceled()) {
                canceledAppointmentsStack.remove(app); // Remove from stack if present
                app.setCanceled(false); // Mark the appointment as not canceled
                return new ResponseEntity<>(appointmentRepository.save(app), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Not canceled
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // No such appointment
        }
    }

    // Replace an existing appointment with a new one
    public ResponseEntity<Appointment> replaceAppointment(Appointment newAppointment) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(newAppointment.getId());
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();
            appointment.setPatientIndex(newAppointment.getPatientIndex());
            appointment.setPatientName(newAppointment.getPatientName());
            appointment.setDoctorName(newAppointment.getDoctorName());
            appointment.setPatientMobile(newAppointment.getPatientMobile());
            appointment.setPatientEmail(newAppointment.getPatientEmail());
            appointment.setAppointmentTime(newAppointment.getAppointmentTime());
            appointment.setAppointmentDate(newAppointment.getAppointmentDate());
            return new ResponseEntity<>(appointmentRepository.save(appointment), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get appointments by date and time
    public List<Appointment> getAppointmentsByDateAndTime(String appointmentDate, String appointmentTime) {
        return appointmentRepository.findByAppointmentDateAndAppointmentTime(appointmentDate.trim(), appointmentTime.trim());
    }

    // Get the total number of appointments
    public Long getTotalAppointments() {
        return appointmentRepository.count();
    }

    // Get the number of active appointments grouped by doctor
    public Map<String, Long> getAppointmentsByDoctor() {
            // Logic to group appointments by doctor
            return appointmentRepository.findAll().stream()
                    .collect(Collectors.groupingBy(Appointment::getDoctorName, Collectors.counting()));
        }

    // Get the number of all appointments grouped by time slot
    public Map<String, Long> getAppointmentsByTimeSlot() {
        return appointmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentTime(),
                        Collectors.counting()
                ));
    }

    // Get the count of canceled appointments
    public Long getCanceledAppointmentsCount() {
        return appointmentRepository.countByIsCanceledTrue();
    }

    // Get the number of active appointments grouped by doctor
    public Map<String, Long> getActiveAppointmentsByDoctor() {
        // Logic to group appointments by doctor
        return appointmentRepository.findAll().stream()
                .filter(appointment -> !appointment.isCanceled())
                .collect(Collectors.groupingBy(Appointment::getDoctorName, Collectors.counting()));
    }

    // Get the number of active appointments grouped by time slot
    public Map<String, Long> getActiveAppointmentsByTimeSlot() {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> !appointment.isCanceled())
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentTime(),
                        Collectors.counting()
                ));
    }

    // Get the number of canceled appointments grouped by doctor
    public Map<String, Long> getCanceledAppointmentsByDoctor() {
        // Logic to group appointments by doctor
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.isCanceled())
                .collect(Collectors.groupingBy(Appointment::getDoctorName, Collectors.counting()));
    }

    // Get the number of canceled appointments grouped by time slot
    public Map<String, Long> getCanceledAppointmentsByTimeSlot() {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.isCanceled())
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentTime(),
                        Collectors.counting()
                ));
    }
}
