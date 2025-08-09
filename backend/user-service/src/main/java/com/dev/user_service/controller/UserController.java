package com.dev.user_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dev.user_service.dto.UserDto;
import com.dev.user_service.model.User;
import com.dev.user_service.repository.UserRepository;
import com.dev.user_service.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    
    @GetMapping("oke")
    public String user() {
        return "User";
    }

    @GetMapping("oke2")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin() {
        return "Admin";
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

}
