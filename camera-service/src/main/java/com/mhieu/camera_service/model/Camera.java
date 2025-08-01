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

    @Column(nullable = false)
    String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Status status;

    @Column(name = "stream_url")
    String streamUrl;

    @Column(name = "is_live", nullable = false)
    boolean isLive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Quality quality;

    @Column(name = "resolution", nullable = false)
    private String resolution;

    @Column(name = "fps", nullable = false)
    private Integer fps;

    @Column(name = "last_updated")
    Instant lastUpdated;

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = Instant.now();
    }

    public enum Status {
        ONLINE, OFFLINE, MAINTENANCE, ERROR
    }

    public enum Type {
        SECURITY, MONITORING, TRAFFIC, INDOOR, OUTDOOR
    }

    public enum Quality {
        HD, SD, FHD, UHD
    }

}