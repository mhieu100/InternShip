package com.dev.user_service.model;

import java.time.Instant;

import com.dev.user_service.utils.RoleEnum;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@Data
@Builder
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
