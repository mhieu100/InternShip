package com.mhieu.camera_service.dto.request;

import com.mhieu.camera_service.model.Camera;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateStatusCameraRequest {
   Camera.Status status;
   String fps;
   String resolution;
}
