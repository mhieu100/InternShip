package com.dev.camera_service.dto.request;

import com.dev.camera_service.model.Camera;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateStatusRequest {
    Camera.Status status;
    String fps;
    String resolution;
}
