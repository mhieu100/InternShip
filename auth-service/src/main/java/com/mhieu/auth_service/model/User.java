package com.mhieu.auth_service.model;

import com.mhieu.auth_service.utils.RoleEnum;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    @NotBlank(message = "email không được để trống")
    String email;
    @NotBlank(message = "password không được để trống")
    String password;
    RoleEnum role;
    Integer age;
    String address;

    @Column(columnDefinition = "TEXT")
    String refreshToken;
    Instant createdAt;
    Instant updatedAt;

    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }
}
