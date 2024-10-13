package nibm.hdse241.hospitalappointmentsystem.services;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class userService {

    @Autowired
    private userRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Method to register user with encoded password
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getUsers(String username, String email, String role) {
        Specification<User> spec = Specification.where(userSpecifications.usernameContains(username))
                .and(userSpecifications.emailContains(email)) // Add email filter
                .and(userSpecifications.roleEquals(role)); // Role filter
        return userRepository.findAll(spec);
    }

    // Find user by NIC
    public Optional<User> findUserByNic(String nic) {
        return userRepository.findByNic(nic);
    }

    // Find user by email
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Check if the NIC exists and compare details
    public String registerOrValidateUser(User newUser) {
        Optional<User> existingUserOpt = userRepository.findByNic(newUser.getNic());

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Compare the personal data with the existing user
            if (!existingUser.getFullName().equals(newUser.getFullName()) ||
                    !existingUser.getEmail().equals(newUser.getEmail()) ||
                    !existingUser.getPhone().equals(newUser.getPhone())) {
                return "Personal data mismatch for the provided NIC!";
            }

            return "User already registered.";
        }

        // If the user does not exist, create a new user with a generated username
        newUser.setRegistrationDate(LocalDate.now().atStartOfDay());
        newUser.setUsername(generateUsername());
        userRepository.save(newUser);

        return "User successfully registered.";
    }

    // Generate username in the format (U-001, U-002, etc.)
    private String generateUsername() {
        Long userCount = userRepository.count();
        int nextUserId = userCount.intValue() + 1;
        return String.format("U-%03d", nextUserId);
    }

    public boolean deleteUserById(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true; // User deleted successfully
        }
        return false; // User not found
    }

}
