package com.mhieu.camera_service.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StreamStatus {
    @JsonProperty("active")
    private final boolean active;

    @JsonProperty("quality")
    private final String quality;

    @JsonProperty("uptimeMs")
    private final long uptimeMs;
}
