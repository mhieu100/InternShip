package com.mhieu.boiler_template_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public enum ErrorCode {
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),

    BAD_REQUEST(1001, "Bad request", HttpStatus.BAD_REQUEST),
    METHOD_NOT_ALLOWED(1002, "Method not allowed", HttpStatus.METHOD_NOT_ALLOWED),
    UNSUPPORTED_MEDIA_TYPE(1003, "Unsupported media type", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
    INVALID_ARGUMENT(1004, "Invalid argument", HttpStatus.BAD_REQUEST),
    MISSING_PARAMETER(1005, "Missing required parameter", HttpStatus.BAD_REQUEST),

    NOT_FOUND(1008, "Resource not found", HttpStatus.NOT_FOUND),
    DATA_NOT_FOUND(1009, "Data not found", HttpStatus.NOT_FOUND),
    

    CONFLICT(1010, "Conflict", HttpStatus.CONFLICT),
    DUPLICATE_RESOURCE(1011, "Resource already exists", HttpStatus.CONFLICT),

    INTERNAL_ERROR(1500, "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    SERVICE_UNAVAILABLE(1501, "Service unavailable", HttpStatus.SERVICE_UNAVAILABLE),
    TIMEOUT(1502, "Request timeout", HttpStatus.REQUEST_TIMEOUT),

    OPERATION_FAILED(1600, "Operation failed", HttpStatus.BAD_REQUEST),
    INVALID_STATE(1601, "Invalid state for operation", HttpStatus.BAD_REQUEST),

    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }
}
