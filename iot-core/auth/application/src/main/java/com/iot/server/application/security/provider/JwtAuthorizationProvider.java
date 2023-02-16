package com.iot.server.application.security.provider;

import com.iot.server.application.security.jwt.JwtFactory;
import com.iot.server.domain.model.SecurityUser;
import com.iot.server.domain.model.TokenAuthentication;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationProvider implements AuthenticationProvider {

    private final JwtFactory jwtFactory;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String accessToken = authentication.getName();
        SecurityUser securityUser = jwtFactory.parseAccessJwtToken(accessToken);
        return new TokenAuthentication(securityUser, null, securityUser.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return TokenAuthentication.class.isAssignableFrom(authentication);
    }
}
