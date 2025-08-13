package com.dev.analysis_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShelveResponse {
    Long shelfId;
    String name;
}
