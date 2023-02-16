package com.iot.server.common.request;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TenantRequest {
    private UUID id;
    private UUID userId;
    private String email;
    private String title;
    private String address;
    private String phone;
    private String country;
    private String city;
    private String state;
    private boolean deleted;
    private UUID updateUid;
    private UUID createUid;
    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;
}
