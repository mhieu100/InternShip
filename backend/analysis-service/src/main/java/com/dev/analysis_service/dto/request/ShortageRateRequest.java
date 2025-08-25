package com.dev.analysis_service.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ShortageRateRequest {
    String startDate;
    String endDate;
    String includeShelf;
}
