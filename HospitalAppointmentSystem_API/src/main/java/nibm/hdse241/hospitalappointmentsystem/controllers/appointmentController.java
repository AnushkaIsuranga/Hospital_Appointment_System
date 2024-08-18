package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.services.appointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class appointmentController {
    @Autowired
    private appointmentService appointmentService;
    @Autowired
    private nibm.hdse241.hospitalappointmentsystem.repositories.appointmentRepository appointmentRepository;

    @GetMapping("/appointments")
    public List<appointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping("/appointments")
    public appointmentDTO newAppointment(@RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.saveAppointment(appointmentDTO);
    }

    @PutMapping("/appointments/{id}")
    public appointmentDTO updateAppointment(@PathVariable int id, @RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.updateAppointment(id, appointmentDTO);
    }

    @DeleteMapping("/appointments/{id}")
    public String deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
        return "Deleted!";
    }

    @GetMapping("/appointments/{id}")
    public appointmentDTO getAppointment(@PathVariable int id) {
        return appointmentService.getAppointment(id);
    }
}
