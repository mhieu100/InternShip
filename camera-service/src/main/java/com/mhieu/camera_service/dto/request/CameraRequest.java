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

    @NotBlank(message = "IP address không được để trống")
    String ipAddress;

    @NotBlank(message = "Vị trí không được để trống")
    String location;

    @NotBlank(message = "Độ phân giải không được để trống")
    String resolution;

    @NotNull(message = "FPS không được để trống")
    @Min(value = 1, message = "FPS phải lớn hơn 0")
    Integer fps;

    @NotNull(message = "Trạng thái không được để trống")
    Camera.Status status;

}