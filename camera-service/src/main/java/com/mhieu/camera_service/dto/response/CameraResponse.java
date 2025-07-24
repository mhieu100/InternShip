package com.mhieu.camera_service.dto.response;

import java.io.Serializable;
import java.time.Instant;

import com.mhieu.camera_service.model.Camera;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CameraResponse{
    Long id;
    String name;
    String ipAddress;
    String location;
    String resolution;
    Integer fps;
    Camera.Status status;
    Instant lastUpdated;
}