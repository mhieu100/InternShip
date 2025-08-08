package com.mhieu.camera_service.dto.response;

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
    String resolution;
    String fps;
    Camera.Type type;
    boolean isPublic;
    Integer viewerCount = 0; 
}