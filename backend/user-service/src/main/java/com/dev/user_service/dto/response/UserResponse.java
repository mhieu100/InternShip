package com.dev.user_service.dto.response;

import java.time.Instant;

import com.dev.user_service.utils.RoleEnum;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private long id;
    private String name;
    private String email;

    private String address;
    private RoleEnum role;
    private Instant createdAt;
    private Instant updatedAt;

}
