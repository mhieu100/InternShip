package com.dev.analysis_service.dto.response;

public interface TotalRecoveryStatusResponse {
    String getShelfName();
    Double getTotalAlertCount();
    Double getTotalReplenishCount();
    Double getTotalRecoveryRate();
}
