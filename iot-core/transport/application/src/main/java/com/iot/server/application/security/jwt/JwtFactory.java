package com.iot.server.application.security.jwt;

import com.iot.server.application.model.SecurityUser;
import com.iot.server.application.security.config.JwtConfig;
import com.iot.server.common.enums.AuthorityEnum;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFactory {
    public static final String AUTHORITIES = "authorities";
    public static final String TENANT_ID = "tenantId";
    public static final String CUSTOMER_ID = "customerId";
    public static final String FIRST_NAME = "firstName";
    public static final String LAST_NAME = "lastName";
    public static final String EMAIL = "email";
    public static final String ENABLED = "enabled";
    private final JwtConfig jwtConfig;

    public SecurityUser parseAccessJwtToken(String accessToken) {
        Jws<Claims> jwsClaims = parseTokenClaims(accessToken);
        Claims claims = jwsClaims.getBody();
        String subject = claims.getSubject();

        @SuppressWarnings("unchecked")
        List<String> scopes = claims.get(AUTHORITIES, List.class);
        if (scopes == null || scopes.isEmpty()) {
            throw new IllegalArgumentException("JWT Token doesn't have any scopes");
        }

        SecurityUser securityUser = new SecurityUser();
        securityUser.setId(UUID.fromString(subject));
        securityUser.setAuthorities(AuthorityEnum.getAuthorities(scopes));
        securityUser.setTenantId(UUID.fromString(claims.get(TENANT_ID, String.class)));
//        securityUser.setCustomerId(UUID.fromString(claims.get(CUSTOMER_ID, String.class)));
        securityUser.setFirstName(claims.get(FIRST_NAME, String.class));
        securityUser.setLastName(claims.get(LAST_NAME, String.class));
        securityUser.setEmail(claims.get(EMAIL, String.class));
        securityUser.setEnabled(claims.get(ENABLED, Boolean.class));
        securityUser.setAccessToken(accessToken);

        return securityUser;
    }

    public Jws<Claims> parseTokenClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(jwtConfig.getPublicKey())
                    .parseClaimsJws(token);
        } catch (UnsupportedJwtException | MalformedJwtException | IllegalArgumentException | SignatureException ex) {
            log.debug("Invalid JWT Token", ex);
            throw new BadCredentialsException("Invalid JWT token: ", ex);
        } catch (ExpiredJwtException expiredEx) {
            log.debug("JWT Token is expired", expiredEx);
            throw new IoTException(ReasonEnum.EXPIRED_TOKEN, "JWT Token expired");
        }
    }
}
