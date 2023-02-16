package com.iot.server.domain.model;

import java.util.Collection;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class TokenAuthentication extends UsernamePasswordAuthenticationToken {
    public TokenAuthentication(Object principal, Object credentials) {
        super(principal, credentials);
    }

    public TokenAuthentication(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }
}
