package com.dev.camera_service.dto.response;

import com.dev.camera_service.model.Camera;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CameraResponse {
    Long id;
    String name;
    String location;
    Camera.Status status;
    String streamUrl;
    String resolution;
    String fps;
    Camera.Type type;
    Boolean isPublic;
    Integer viewerCount = 0;

    String username;
    String password;
}