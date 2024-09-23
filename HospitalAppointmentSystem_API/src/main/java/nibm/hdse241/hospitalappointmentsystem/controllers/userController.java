package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import nibm.hdse241.hospitalappointmentsystem.services.userService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class userController {

    @Autowired
    private userService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User newUser = userService.registerUser(user);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }
}
