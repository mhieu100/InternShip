package com.mhieu.boiler_template_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mhieu.boiler_template_service.annotation.ApiMessage;
import com.mhieu.boiler_template_service.dto.request.UserRequest;
import com.mhieu.boiler_template_service.dto.response.PaginationResponse;
import com.mhieu.boiler_template_service.dto.response.UserResponse;
import com.mhieu.boiler_template_service.model.User;
import com.mhieu.boiler_template_service.service.UserService;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;

    @PostMapping
    @ApiMessage("create new user")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    @GetMapping("/{id}")
    @ApiMessage("get user by id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @ApiMessage("get all users")
    public ResponseEntity<PaginationResponse> getAllUsers(@Filter Specification<User> specification, Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(specification, pageable));
    }

    @PutMapping("/{id}")
    @ApiMessage("update user")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("delete user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}