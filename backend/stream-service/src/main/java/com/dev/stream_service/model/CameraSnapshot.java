package com.dev.stream_service.model;

import com.dev.stream_service.dto.response.CameraResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CameraSnapshot {
    private CameraResponse.Status status;
    private String fps;
    private String resolution;
    private Integer viewerCount = 0;

    public static CameraSnapshot fromCamera(CameraResponse camera) {
        return new CameraSnapshot(camera.getStatus(), camera.getFps(), camera.getResolution(), camera.getViewerCount());
    }

   public boolean isDifferent(CameraResponse other) {

    if (other == null) return true;

    if (this.status != other.getStatus()) {
        return true;
    }
    
    if (this.fps == null ? other.getFps() != null : !this.fps.equals(other.getFps())) {
        return true;
    }
       if (this.viewerCount == null ? other.getViewerCount() != null : !this.viewerCount.equals(other.getViewerCount())) {
           return true;
       }
    return this.resolution == null ? other.getResolution() != null : !this.resolution.equals(other.getResolution());
   }
}
