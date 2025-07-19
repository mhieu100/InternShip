package com.mhieu.boiler_template_service.model;

import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Street is required")
    @Column(nullable = false)
    private String street;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    @NotBlank(message = "Country is required")
    @Column(nullable = false)
    private String country;

    @NotBlank(message = "Postal code is required")
    @Column(nullable = false)
    private String postalCode;

    @OneToOne(mappedBy = "address", fetch = FetchType.LAZY)
    private User user;
}