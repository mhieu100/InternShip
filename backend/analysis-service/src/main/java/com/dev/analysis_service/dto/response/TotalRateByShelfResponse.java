package com.dev.analysis_service.dto.response;

import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class TotalRateByShelfResponse {
    String shelf;
    Double totalHours;
    Double shortageHours;
    Integer shortageRate;
}
