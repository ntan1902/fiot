package com.iot.server.domain.model;

import com.iot.server.common.enums.AuthorityEnum;
import com.iot.server.dao.dto.UserDto;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecurityUser extends UserDto {
    private boolean enabled;
    private Collection<GrantedAuthority> authorities;
    private String accessToken;

    public SecurityUser(UserDto user, boolean enabled, Collection<String> roles) {
        this.setId(user.getId());
        this.setEmail(user.getEmail());
        this.setFirstName(user.getFirstName());
        this.setLastName(user.getLastName());
        this.setTenantId(user.getTenantId());
        this.setCustomerId(user.getCustomerId());
        this.setCreatedAt(user.getCreatedAt());
        this.setUpdatedAt(user.getUpdatedAt());
        this.enabled = enabled;

        this.authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    public void setAuthorities(List<AuthorityEnum> authorities) {
        this.authorities = authorities.stream()
                .map(authority -> new SimpleGrantedAuthority(authority.name()))
                .collect(Collectors.toSet());
    }
}
