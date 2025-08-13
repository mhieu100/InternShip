package com.dev.analysis_service.model;

import java.util.Set;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "shelves")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Shelve {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long shelfId;
    String name;

    @OneToMany(mappedBy="shelve")
    private Set<SummaryDaily> summary;

    @OneToMany(mappedBy="shelve")
    private Set<Metric> metrics;
}
