package com.iot.server.common.model;

import com.iot.server.common.enums.KvType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Kv {
    private KvType type;
    private String key;
    private Object value;
    private Long ts;
}
