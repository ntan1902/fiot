package com.iot.server.common.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;

public class RSAUtils {

    public static final String ENCRYPT_ALGORITHM = "RSA";

    public static final String BEGIN_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----";
    public static final String END_PUBLIC_KEY = "-----END PUBLIC KEY-----";
    public static final String BEGIN_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----";
    public static final String END_PRIVATE_KEY = "-----END PRIVATE KEY-----";
    public static final String EMPTY_STRING = "";

    public static PublicKey getPublicKey(String filename) throws NoSuchAlgorithmException, IOException, InvalidKeySpecException {
        return getPublicKeyString(readFile(filename));
    }

    public static PrivateKey getPrivateKey(String filename) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        return getPrivateKeyString(readFile(filename));
    }

    private static PublicKey getPublicKeyString(String publicKeyContent) throws NoSuchAlgorithmException, InvalidKeySpecException {
        publicKeyContent = publicKeyContent
                .replace(BEGIN_PUBLIC_KEY, EMPTY_STRING)
                .replace(END_PUBLIC_KEY, EMPTY_STRING);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(Base64.getDecoder().decode(publicKeyContent));

        KeyFactory factory = KeyFactory.getInstance(ENCRYPT_ALGORITHM);
        return factory.generatePublic(spec);
    }

    private static PrivateKey getPrivateKeyString(String privateKeyContent) throws NoSuchAlgorithmException, InvalidKeySpecException {
        privateKeyContent = privateKeyContent
                .replace(BEGIN_PRIVATE_KEY, EMPTY_STRING)
                .replace(END_PRIVATE_KEY, EMPTY_STRING);

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKeyContent));

        KeyFactory factory = KeyFactory.getInstance(ENCRYPT_ALGORITHM);
        return factory.generatePrivate(spec);
    }

    private static String readFile(String filename) throws IOException {

        InputStream inputStream = new ClassPathResource(filename).getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        return reader.lines()
                .collect(Collectors.joining());
    }

//    public static void main(String[] args) throws Exception {
//        PrivateKey privateKey = getPrivateKey("private_key_pkcs8.pem");
//        PublicKey publicKey = getPublicKey("public_key.pem");
//
//        JWKSet jwk = new JWKSet(
//                new RSAKey.Builder((RSAPublicKey) publicKey).privateKey(privateKey).build());
//
//        Claims claims = Jwts.claims()
//                .setSubject("UUID");
//        claims.put("firstName", "An");
//
//        ZonedDateTime currentTime = ZonedDateTime.now();
//
//        String accessToken = Jwts.builder()
//                .setClaims(claims)
//                .setIssuer("com.iot")
//                .setIssuedAt(Date.from(currentTime.toInstant()))
//                .setExpiration(Date.from(currentTime.plusSeconds(60000).toInstant()))
//                .signWith(SignatureAlgorithm.RS256, privateKey)
//                .compact();
//
//        System.out.println(jwk.toJSONObject());
//        System.out.println(accessToken);
//
//        Jws<Claims> claimsJws = Jwts.parser()
//                .setSigningKey(publicKey)
//                .parseClaimsJws(accessToken);
//
//        System.out.println(claimsJws.getBody());
//    }
}