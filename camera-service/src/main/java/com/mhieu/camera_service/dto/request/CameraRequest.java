package com.mhieu.camera_service.dto.request;

import com.mhieu.camera_service.model.Camera;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CameraRequest {

    @NotBlank(message = "Tên camera không được để trống")
    String name;

    @NotBlank(message = "Vị trí không được để trống")
    String location;

    @NotNull(message = "Trạng thái không được để trống")
    Camera.Status status;

    @NotBlank(message = "StreamURL không được để trống")
    String streamUrl;

    @NotNull(message = "Trạng thái trực tuyến không được để trống")
    Camera.Type type;
}