package com.mhieu.camera_service.dto.response;

import java.time.Instant;

import com.mhieu.camera_service.model.Camera;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class HealthyResponse {
    String name;
    Camera.Status status;
    long ping;
    Instant lastChecked;
}
