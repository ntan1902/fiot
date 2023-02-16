package com.iot.server.common.enums;

import java.util.ArrayList;
import java.util.List;

public enum AuthorityEnum {
    ADMIN("ADMIN"),
    TENANT("TENANT"),
    CUSTOMER("CUSTOMER");

    private final String authority;

    AuthorityEnum(String authority) {
        this.authority = authority;
    }

    public static AuthorityEnum getAuthority(String value) {
        AuthorityEnum authorityEnum = null;
        if (value != null && value.length() != 0) {
            for (AuthorityEnum current : AuthorityEnum.values()) {
                if (current.name().equalsIgnoreCase(value)) {
                    authorityEnum = current;
                    break;
                }
            }
        }
        return authorityEnum;
    }

    public static List<AuthorityEnum> getAuthorities(List<String> values) {
        List<AuthorityEnum> authorityEnums = null;
        if (values != null && !values.isEmpty()) {
            authorityEnums = new ArrayList<>();
            for (String value : values) {
                for (AuthorityEnum current : AuthorityEnum.values()) {
                    if (current.name().equalsIgnoreCase(value)) {
                        authorityEnums.add(current);
                    }
                }
            }
        }
        return authorityEnums;
    }

    public String getAuthority() {
        return authority;
    }
}
