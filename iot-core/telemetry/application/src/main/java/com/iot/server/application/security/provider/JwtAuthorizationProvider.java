package com.iot.server.application.security.provider;

import com.iot.server.application.model.SecurityUser;
import com.iot.server.application.model.TokenAuthentication;
import com.iot.server.application.security.jwt.JwtFactory;
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
