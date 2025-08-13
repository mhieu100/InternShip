package com.dev.analysis_service.dto.response;

import java.time.LocalDate;

import lombok.*;

@Data
@Builder
public class SummaryDailyResponse {

    String shelveName;
    LocalDate date;
    Double operatingHours;
    Double shortageHours;
    Double shortageRate;
    Double alertCount;
    Double replenishCount;
    Double recoveryRate;
}