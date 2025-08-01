package com.mhieu.camera_service.dto.response;

import java.time.Instant;

import com.mhieu.camera_service.model.Camera;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CameraResponse {
    Long id;
    String name;
    String location;
    Camera.Status status;
    String streamUrl;
    boolean isLive;
    Camera.Quality quality;
    String resolution;
    Integer fps;
    Camera.Type type;
    Instant lastUpdated;
}