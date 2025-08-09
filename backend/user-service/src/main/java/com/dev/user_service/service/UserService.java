package com.dev.user_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.user_service.model.User;
import com.dev.user_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
