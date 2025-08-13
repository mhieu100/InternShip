package com.dev.stream_service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CameraResponse {
    Long id;
    String name;
    String location;
    Status status;
    String streamUrl;
    String resolution;
    String fps;
    Type type;
    boolean isPublic;
    Integer viewerCount = 0;

    public enum Status {
        ONLINE, OFFLINE, MAINTENANCE, ERROR
    }

    public enum Type {
        SECURITY, MONITORING, TRAFFIC, INDOOR, OUTDOOR
    }

}