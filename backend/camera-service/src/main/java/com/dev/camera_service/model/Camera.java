package com.dev.camera_service.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "cameras")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String name;
    String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;
    String streamUrl;

    @Enumerated(EnumType.STRING)
    Type type;
    String resolution;
    String fps;
    boolean isPublic;
    Integer viewerCount = 0;

    public enum Status {
        ONLINE, OFFLINE
    }

    public enum Type {
        SECURITY, MONITORING, TRAFFIC, INDOOR, OUTDOOR
    }

}