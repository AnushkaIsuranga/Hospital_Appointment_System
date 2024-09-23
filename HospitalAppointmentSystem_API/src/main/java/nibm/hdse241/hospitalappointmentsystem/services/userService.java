package nibm.hdse241.hospitalappointmentsystem.services;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    // Method to find user by username
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
