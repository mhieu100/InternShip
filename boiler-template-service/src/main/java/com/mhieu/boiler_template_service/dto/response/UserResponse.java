package com.mhieu.boiler_template_service.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String password;

    // private AddressResponse address;
}
