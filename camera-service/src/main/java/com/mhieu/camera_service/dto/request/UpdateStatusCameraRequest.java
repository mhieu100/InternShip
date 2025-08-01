package com.mhieu.camera_service.dto.request;


import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateStatusCameraRequest {
   boolean isLive;
}
