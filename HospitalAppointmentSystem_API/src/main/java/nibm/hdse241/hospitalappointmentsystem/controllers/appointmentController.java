package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.services.appointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/appointments")
public class appointmentController {
    @Autowired
    private appointmentService appointmentService;

    @GetMapping("/get-appointments")
    public List<appointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping("/new-appointment")
    public appointmentDTO newAppointment(@RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.saveUser(appointmentDTO);
    }

    @PutMapping("/update-appointment")
    public appointmentDTO updateAppointment(@PathVariable int id, @RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.updateAppointment(id, appointmentDTO);
    }

    @DeleteMapping("/delete-appointment")
    public String deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
        return "Deleted!";
    }

    @GetMapping("/get-appointment/{id}")
    public appointmentDTO getAppointment(@PathVariable int id) {
        return appointmentService.getAppointment(id);
    }
}
