package com.iot.server.application.config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import java.security.interfaces.RSAPublicKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JWKSetConfig {
    @Bean
    public JWKSet jwkSet(JwtConfig jwtConfig) {
        RSAKey.Builder builder = new RSAKey.Builder((RSAPublicKey) jwtConfig.getPublicKey())
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(JWSAlgorithm.RS256);
        return new JWKSet(builder.build());
    }
}
