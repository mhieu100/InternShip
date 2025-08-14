package com.dev.analysis_service.dto.response;


import lombok.*;

@Data
@Builder
public class SummaryDailyResponse {
    Long shelveId;
    String shelveName;
    String date;
    Double operatingHours;
    Double shortageHours;
    Double shortageRate;
    Double alertCount;
    Double replenishCount;
    Double recoveryRate;
}