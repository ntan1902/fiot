package com.iot.server.application.service;

import com.iot.server.dao.dto.UserCredentialsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityServiceImpl implements SecurityService {
    private final PasswordEncoder passwordEncoder;

    @Override
    public void validateUserCredentials(UserCredentialsDto userCredentials, String email, String password) {
        log.info("Executing {} {}", userCredentials, email);
        if (!passwordEncoder.matches(password, userCredentials.getPassword())) {
            throw new BadCredentialsException("Authentication failed. Email or password is not valid");
        }

        if (!userCredentials.isEnabled()) {
            throw new DisabledException("User is not active");
        }
    }
}
