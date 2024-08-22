package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.services.appointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/appointments") // Base URL for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:5173") // Allows cross-origin requests from the specified origin
public class appointmentController {

    @Autowired // Automatically injects the appointmentService bean
    private appointmentService appointmentService;

    // Endpoint to get all appointments
    @GetMapping("")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Endpoint to create a new appointment
    @PostMapping("/save")
    public Appointment newAppointment(@RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

    // Endpoint to update an existing appointment by ID
    @PutMapping("/edit/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable int id, @RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.updateAppointment(id, appointmentDTO);
    }

    // Endpoint to delete an appointment by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable int id) {
        return appointmentService.deleteAppointment(id).getStatusCode() == HttpStatus.NO_CONTENT ?
                new ResponseEntity<>("Deleted!", HttpStatus.NO_CONTENT) :
                new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
    }

    // Endpoint to get a specific appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable int id) {
        return appointmentService.getAppointmentById(id);
    }

    // Endpoint to search for appointments by date and time
    @GetMapping("/search")
    public List<Appointment> getAppointmentsByDateAndTime(
            @RequestParam("appointmentDate") String appointmentDate,
            @RequestParam("appointmentTime") String appointmentTime) {
        System.out.println("Appointment Date: " + appointmentDate);
        System.out.println("Appointment Time: " + appointmentTime);
        return appointmentService.getAppointmentsByDateAndTime(appointmentDate, appointmentTime);
    }

    // Endpoint to get all active appointments
    @GetMapping("/active")
    public List<Appointment> getActiveAppointments() {
        return appointmentService.getActiveAppointments();
    }

    // Endpoint to get all canceled appointments
    @GetMapping("/canceled")
    public List<Appointment> getCanceledAppointments() {
        return appointmentService.getCanceledAppointments();
    }

    // Endpoint to cancel an appointment by ID
    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelAppointment(@PathVariable int id) {
        return appointmentService.cancelAppointment(id).getStatusCode() == HttpStatus.OK ?
                new ResponseEntity<>("Canceled", HttpStatus.OK) :
                new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
    }

    // Endpoint to revive a canceled appointment by ID
    @PutMapping("/revive/{id}")
    public ResponseEntity<?> reviveAppointment(@PathVariable("id") int id) {
        try {
            Appointment appointment = appointmentService.reviveAppointment(id).getBody();
            return ResponseEntity.ok(appointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reviving appointment");
        }
    }

    // Endpoint to replace an existing appointment with a new one
    @PostMapping("/replace")
    public ResponseEntity<?> replaceAppointment(@RequestBody Appointment newAppointment) {
        try {
            Appointment updatedAppointment = appointmentService.replaceAppointment(newAppointment).getBody();
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error replacing appointment");
        }
    }

    // Endpoint to get the total number of appointments
    @GetMapping("/total")
    public Long getTotalAppointments() {
        return appointmentService.getTotalAppointments();
    }

    // Endpoint to get appointments by doctor
    @GetMapping("/by_doctor")
    public Map<String, Long> getAppointmentsByDoctor() {
        return appointmentService.getAppointmentsByDoctor();
    }

    // Endpoint to get appointments by time slot
    @GetMapping("/by_time_slot")
    public Map<String, Long> getAppointmentsByTimeSlot() {
        return appointmentService.getAppointmentsByTimeSlot();
    }

    // Endpoint to get the count of canceled appointments
    @GetMapping("/canceled/count")
    public Long getCanceledAppointmentsCount() {
        return appointmentService.getCanceledAppointmentsCount();
    }
}
