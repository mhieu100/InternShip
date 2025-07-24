package com.mhieu.auth_service.controller;

import com.mhieu.auth_service.annotation.Message;
import com.mhieu.auth_service.exception.AppException;
import com.mhieu.auth_service.model.User;
import com.mhieu.auth_service.model.dto.PaginationResponse;
import com.mhieu.auth_service.model.dto.UserChatResponse;
import com.mhieu.auth_service.model.dto.UserResponse;
import com.mhieu.auth_service.service.UserService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody User user) throws AppException {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable long id) throws AppException {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getUserById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Message("get all user (by admin)")
    public ResponseEntity<PaginationResponse> getAll(@Filter Specification<User> spec, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findAll(spec, pageable));
    }

    @GetMapping("chat")
    public ResponseEntity<List<UserChatResponse>> getAllUserForChat() {
        return ResponseEntity.ok(this.userService.getAllUserChat());
    }

    @PutMapping
    public ResponseEntity<UserResponse> update(@RequestBody User user) throws AppException {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.updateUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) throws AppException {
        this.userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
