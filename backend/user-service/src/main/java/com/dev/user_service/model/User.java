package com.dev.user_service.model;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // cho ai chưa biết thì users nhớ thêm s nhé, chứ ko thêm s la thanh user keyword trong Sql và khi chay code se bi loi
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private Role role;

    public enum Role {
        USER,
        ADMIN
    }
}
