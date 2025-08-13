package com.dev.analysis_service.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "shelf_metrics")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Metric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer metricId;

    @ManyToOne
    @JoinColumn(name = "shelf_id", nullable = false)
    Shelve shelve;

    LocalDate date;
    LocalTime time;

    Double osaRate;

    @Column(name = "is_alerted")
    Boolean isAlerted;
}