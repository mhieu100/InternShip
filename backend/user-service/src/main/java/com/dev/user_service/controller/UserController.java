package com.dev.user_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dev.user_service.anotation.Message;
import com.dev.user_service.dto.request.UserRequest;
import com.dev.user_service.dto.response.Pagination;
import com.dev.user_service.dto.response.UserResponse;
import com.dev.user_service.exception.AppException;
import com.dev.user_service.model.User;
import com.dev.user_service.service.UserService;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Message("create new user")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Message("get all users")
    public ResponseEntity<Pagination> getUsers(@Filter Specification<User> specification, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers(specification, pageable));
    }

    @GetMapping("/{id}")
    @Message("get user by id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Long id) {

        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @Message("update user")
    public ResponseEntity<UserResponse> update(@PathVariable long id, @Valid @RequestBody UserRequest request)
            throws AppException {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Message("delete user")
    public ResponseEntity<Void> delete(@PathVariable long id) throws AppException {
        this.userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }
}
