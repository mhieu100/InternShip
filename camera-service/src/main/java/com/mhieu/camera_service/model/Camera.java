package com.mhieu.camera_service.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Table(name = "cameras")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String name;

    @Column(name = "ip_address", nullable = false)
    String ipAddress;

    @Column(nullable = false)
    String location;

    @Column(nullable = false)
    String resolution;

    @Column(nullable = false)
    Integer fps;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;

    @Column(name = "last_updated")
    Instant lastUpdated;

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = Instant.now();
    }

    public enum Status {
        ACTIVE,
        OFFLINE,
        ERROR
    }

}