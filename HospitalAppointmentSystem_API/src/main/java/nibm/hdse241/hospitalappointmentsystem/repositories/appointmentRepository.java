package nibm.hdse241.hospitalappointmentsystem.repositories;

import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface appointmentRepository extends JpaRepository<Appointment, Integer> {
}
