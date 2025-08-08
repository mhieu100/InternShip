package com.mhieu.camera_service.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PictureResponse {
    Long cameraId;
    String pictureUrl;
}