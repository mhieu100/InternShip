package com.mhieu.auth_service.controller;

import com.mhieu.auth_service.exception.AppException;
import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.PaginationResponse;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.model.mapper.UserMapper;
import com.mhieu.auth_service.service.UserService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
   
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody User user) throws AppException {
        if(userService.existsByEmail(user.getEmail())) {
            throw new AppException(
                    "Email " + user.getEmail() + " đã tồn tại, vui lòng sử dụng email khác.");
        }
        String hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable long id) throws AppException {
        Optional<User> user = userService.findById(id);
        if (user.isEmpty()) {
            throw new AppException("ID invalid");
        }
        return ResponseEntity.status(HttpStatus.OK).body(userMapper.toResponse(user.get()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaginationResponse> getAll(@Filter Specification<User> spec, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findAll(spec, pageable));
    }

    @PutMapping
    public ResponseEntity<UserResponse> update(@RequestBody User user) throws AppException {
        Optional<User> currentUser = userService.findById(user.getId());
        if (currentUser.isEmpty()) {
            throw new AppException("ID invalid to update");
        }
            currentUser.get().setAddress(user.getAddress());
            currentUser.get().setAge(user.getAge());
            currentUser.get().setName(user.getName());
        return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(currentUser.get(), user));
    }

    @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(@PathVariable long id) throws AppException{
        Optional<User> user = userService.findById(id);
        if (user.isEmpty()) {
            throw new AppException("ID invalid");
        }
        userService.deleteUser(user.get());
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
