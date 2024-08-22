package nibm.hdse241.hospitalappointmentsystem.repositories;

import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface appointmentRepository extends JpaRepository<Appointment, Integer> {

    // Find appointments by date and time
    List<Appointment> findByAppointmentDateAndAppointmentTime(String appointmentDate, String appointmentTime);

    // Find appointments that are not canceled
    List<Appointment> findByIsCanceledFalse();

    // Find appointments that are canceled
    List<Appointment> findByIsCanceledTrue();

    // Count the number of canceled appointments
    Long countByIsCanceledTrue();
}
