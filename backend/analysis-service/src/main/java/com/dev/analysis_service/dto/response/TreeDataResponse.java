package com.dev.analysis_service.dto.response;

public interface TreeDataResponse {
    String getShelfName();
    Double getOperatingHours();
    Double getShortageHours();
    Double getShortageRate();
    Double getAlertCount();
    Double getReplenishCount();
    Double getRecoveryRate();
    String getYear();
    String getMonth();
    String getDay();
}
