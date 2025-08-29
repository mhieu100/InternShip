package com.dev.analysis_service.dto.response;

public interface TotalShortageStatusResponse {
    String getShelfName();
    Double getTotalOperationHours();
    Double getTotalShortageHours();
    Double getTotalShortageRate();
}
