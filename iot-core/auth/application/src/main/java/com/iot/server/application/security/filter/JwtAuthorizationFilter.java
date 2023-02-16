package com.iot.server.application.security.filter;

import com.iot.server.application.exception.IoTExceptionHandler;
import com.iot.server.domain.model.TokenAuthentication;
import java.io.IOException;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    public static final String HEADER_PREFIX = "Bearer ";

    private final List<String> pathsToSkip;
    private final AuthenticationManager authenticationManager;
    private final IoTExceptionHandler ioTExceptionHandler;

    public JwtAuthorizationFilter(List<String> pathsToSkip, AuthenticationManager authenticationManager, IoTExceptionHandler ioTExceptionHandler) {
        this.pathsToSkip = pathsToSkip;
        this.authenticationManager = authenticationManager;
        this.ioTExceptionHandler = ioTExceptionHandler;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.info("{}", request.getServletPath());
        String token = getTokenFromRequest(request);

        Authentication authentication = new TokenAuthentication(token, null);
        Authentication authResult;
        try {
            authResult = authenticationManager.authenticate(authentication);
            SecurityContextHolder.getContext().setAuthentication(authResult);
        } catch (AuthenticationException ex) {
            ioTExceptionHandler.handle(response, ex);
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return pathsToSkip
                .stream()
                .anyMatch(path -> new AntPathMatcher().match(path, request.getServletPath()));
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(HEADER_PREFIX)) {
            return bearerToken.substring(HEADER_PREFIX.length());
        }
        return null;
    }

}
