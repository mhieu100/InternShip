package com.mhieu.camera_service.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CameraSnapshot {
    private Camera.Status status;
    private String fps;
    private String resolution;

    public static CameraSnapshot fromCamera(Camera camera) {
        return new CameraSnapshot(camera.getStatus(), camera.getFps(), camera.getResolution());
    }

   public boolean isDifferent(Camera other) {
    if (other == null) return true;
    
    if (this.status != other.getStatus()) {
        return true;
    }
    
    if (this.fps == null ? other.getFps() != null : !this.fps.equals(other.getFps())) {
        return true;
    }
    
    if (this.resolution == null ? other.getResolution() != null : !this.resolution.equals(other.getResolution())) {
        return true;
    }
    
    return false;
}
}
