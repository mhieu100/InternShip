package com.mhieu.camera_service.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

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

    @Column(nullable = false)
    String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;

    @Column(name = "stream_url", nullable = false)
    String streamUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Type type;

    @Column(name = "resolution", nullable = true)
    String resolution;

    @Column(name = "fps", nullable = true)
    String fps;

    @Column(name = "is_public", nullable = false)
    boolean isPublic;

    public enum Status {
        ONLINE, OFFLINE, MAINTENANCE, ERROR
    }

    public enum Type {
        SECURITY, MONITORING, TRAFFIC, INDOOR, OUTDOOR
    }

}