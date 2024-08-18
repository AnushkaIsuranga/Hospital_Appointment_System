package nibm.hdse241.hospitalappointmentsystem.services;

import jakarta.transaction.Transactional;
import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.repositories.appointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class appointmentService {
    @Autowired
    private appointmentRepository appointmentRepository;
    public appointmentDTO saveAppointment(appointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        appointment.setPatientIndex(appointmentDTO.getPatientIndex());
        appointment.setPatientName(appointmentDTO.getPatientName());
        appointment.setDoctorName(appointmentDTO.getDoctorName());
        appointment.setPatientMobile(appointmentDTO.getPatientMobile());
        appointment.setPatientEmail(appointmentDTO.getPatientEmail());
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointment.setAppointmentStatus(appointmentDTO.isAppointmentStatus());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        appointmentDTO.setId(savedAppointment.getId());
        return appointmentDTO;
    }

    public List<appointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<appointmentDTO> appointmentDTOs = new ArrayList<>();
        for (Appointment appointment : appointments) {
            appointmentDTO appointmentDTO = new appointmentDTO();
            appointmentDTO.setId(appointment.getId());
            appointmentDTO.setPatientIndex(appointment.getPatientIndex());
            appointmentDTO.setPatientName(appointment.getPatientName());
            appointmentDTO.setDoctorName(appointment.getDoctorName());
            appointmentDTO.setPatientMobile(appointment.getPatientMobile());
            appointmentDTO.setPatientEmail(appointment.getPatientEmail());
            appointmentDTO.setAppointmentTime(appointment.getAppointmentTime());
            appointmentDTO.setAppointmentDate(appointment.getAppointmentDate());
            appointmentDTO.setAppointmentStatus(appointment.isAppointmentStatus());
            appointmentDTOs.add(appointmentDTO);
        }
        return appointmentDTOs;
    }


    public appointmentDTO updateAppointment(int id, appointmentDTO appointmentDTO) {
        Appointment appointment = appointmentRepository.findById(id).orElse(new Appointment());
        appointment.setPatientIndex(appointmentDTO.getPatientIndex());
        appointment.setPatientName(appointmentDTO.getPatientName());
        appointment.setDoctorName(appointmentDTO.getDoctorName());
        appointment.setPatientMobile(appointmentDTO.getPatientMobile());  // Correct method
        appointment.setPatientEmail(appointmentDTO.getPatientEmail());    // Correct method
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointment.setAppointmentStatus(appointmentDTO.isAppointmentStatus());
        appointmentRepository.save(appointment);
        return appointmentDTO;
    }

    public void deleteAppointment(int id){
        appointmentRepository.deleteById(id);
    }

    public appointmentDTO getAppointment(int id) {
        Appointment appointment = appointmentRepository.findById(id).orElse(new Appointment());
        appointmentDTO appointmentDTO = new appointmentDTO();
        appointmentDTO.setPatientIndex(appointment.getPatientIndex());
        appointmentDTO.setPatientName(appointment.getPatientName());
        appointmentDTO.setDoctorName(appointment.getDoctorName());
        appointment.getPatientMobile(appointmentDTO.getPatientMobile());
        appointment.getPatientEmail(appointmentDTO.getPatientEmail());
        appointmentDTO.setAppointmentTime(appointment.getAppointmentTime());
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointmentDTO.setAppointmentStatus(appointment.isAppointmentStatus());
        return appointmentDTO;
    }
}
