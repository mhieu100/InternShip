package com.mhieu.order_service.config;

public class FeignClientException extends RuntimeException {
    private final int statusCode;
    private final String error;

    public FeignClientException(int statusCode, String message, String error) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getError() {
        return error;
    }
}
