package com.iot.server.common.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BaseReadQuery {
    private int page;
    private int size;
    private String order;
    private String property;
}
