package com.mhieu.auth_service.model;

import com.mhieu.auth_service.utils.RoleEnum;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String email;
    String password;

    @Enumerated(EnumType.STRING)
    RoleEnum role;
    String address;

    @Column(columnDefinition = "TEXT")
    String refreshToken;
    Instant createdAt;
    Instant updatedAt;

    
    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleBeforeUpdate() {
        this.updatedAt = Instant.now();
    }
}
