package com.iot.server.application.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.server.application.controller.request.LoginRequest;
import com.iot.server.application.controller.response.LoginResponse;
import com.iot.server.application.exception.IoTExceptionHandler;
import com.iot.server.application.security.jwt.JwtFactory;
import com.iot.server.domain.model.SecurityUser;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;

@Slf4j
public class LoginAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IoTExceptionHandler ioTExceptionHandler;

    @Autowired
    private JwtFactory jwtFactory;

    @SneakyThrows
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        if (!HttpMethod.POST.name().equals(request.getMethod())) {
            log.error("Authentication method not supported. Request method: " + request.getMethod());
            throw new AuthenticationServiceException("Authentication method not supported");
        }
        LoginRequest loginRequest = objectMapper.readValue(request.getInputStream(), LoginRequest.class);

        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        if (!StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            throw new AuthenticationServiceException("Username or Password is invalid");
        }

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                email,
                password
        );
        return this.getAuthenticationManager().authenticate(token);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        SecurityUser securityUser = (SecurityUser) authResult.getPrincipal();
        log.info("Login successfully {}", securityUser);

        String accessToken = jwtFactory.createAccessToken(securityUser);
        String refreshToken = jwtFactory.createRefreshToken(securityUser);

        LoginResponse loginResponse = new LoginResponse(securityUser, accessToken, refreshToken, "Bearer");

        // Response to client
        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), loginResponse);

        clearAuthenticationAttributes(request);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        ioTExceptionHandler.handle(response, failed);
    }

    protected final void clearAuthenticationAttributes(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return;
        }

        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
    }
}
