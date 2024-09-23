package nibm.hdse241.hospitalappointmentsystem.repositories;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface userRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}
