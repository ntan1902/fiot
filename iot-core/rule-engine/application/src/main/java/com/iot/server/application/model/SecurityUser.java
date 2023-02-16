package com.iot.server.application.model;

import com.iot.server.common.enums.AuthorityEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecurityUser {
    protected UUID id;
    private boolean enabled;
    private Collection<GrantedAuthority> authorities;
    private String accessToken;
    private String email;
    private String firstName;
    private String lastName;
    private UUID tenantId;
    private UUID customerId;

    public void setAuthorities(List<AuthorityEnum> authorities) {
        this.authorities = authorities.stream()
                .map(authority -> new SimpleGrantedAuthority(authority.name()))
                .collect(Collectors.toSet());
    }
}
