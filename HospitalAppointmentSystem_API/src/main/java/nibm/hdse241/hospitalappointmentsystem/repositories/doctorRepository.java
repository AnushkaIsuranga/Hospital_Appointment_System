package nibm.hdse241.hospitalappointmentsystem.repositories;

import nibm.hdse241.hospitalappointmentsystem.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface doctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByNameContainingAndSpecializationContaining(String name, String specialization);
    List<Doctor> findByTimeSlotsContaining(String timeSlot);
}
