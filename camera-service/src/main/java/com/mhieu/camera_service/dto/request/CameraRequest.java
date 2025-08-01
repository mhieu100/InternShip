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

    @NotNull(message = "Chất lượng không được để trống")
    Camera.Quality quality;

    @NotBlank(message = "Độ phân giải không được để trống")
    String resolution;

    @Min(value = 1, message = "FPS phải lớn hơn 0")
    @Max(value = 120, message = "FPS không được vượt quá 120")
    Integer fps;
}