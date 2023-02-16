package com.iot.server.application.security.config;

import com.iot.server.common.utils.RSAUtils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;

@Data
@Component
@ConfigurationProperties(prefix = "security.jwt")
@Slf4j
public class JwtConfig {
    private long accessTokenExp;
    private String issuer;
    private String publicKeyFile;
    private PublicKey publicKey;

    @PostConstruct
    void loadRSAKeyPair() throws NoSuchAlgorithmException, IOException, InvalidKeySpecException {
        publicKey = RSAUtils.getPublicKey(publicKeyFile);
        log.info("JwtConfig {}", this);
    }
}
