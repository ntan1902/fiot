package com.iot.server.dao.dto;

import com.iot.server.common.enums.KvType;
import com.iot.server.dao.entity.latest.TsKvLatestEntity;
import com.iot.server.dao.entity.ts.TsKvEntity;
import java.util.UUID;
import lombok.Data;

@Data
public class TsKvDto {
    private UUID entityId;
    private String key;
    private Long ts;
    private KvType type;
    private Object value;

    public TsKvDto(TsKvEntity tsKvEntity) {
        this.type = tsKvEntity.getType();
        this.key = tsKvEntity.getKey();
        this.ts = tsKvEntity.getTs();
        this.entityId = tsKvEntity.getEntityId();

        switch (tsKvEntity.getType()) {
            case DOUBLE:
                this.value = tsKvEntity.getDoubleV();
                break;
            case LONG:
                this.value = tsKvEntity.getLongV();
                break;
            case BOOLEAN:
                this.value = tsKvEntity.getBoolV();
                break;
            case STRING:
                this.value = tsKvEntity.getStringV();
                break;
            case JSON:
                this.value = tsKvEntity.getJsonV();
                break;
            default:
                break;
        }
    }

    public TsKvDto(TsKvLatestEntity tsKvEntity) {
        this.type = tsKvEntity.getType();
        this.key = tsKvEntity.getKey();
        this.ts = tsKvEntity.getTs();
        this.entityId = tsKvEntity.getEntityId();

        switch (tsKvEntity.getType()) {
            case DOUBLE:
                this.value = tsKvEntity.getDoubleV();
                break;
            case LONG:
                this.value = tsKvEntity.getLongV();
                break;
            case BOOLEAN:
                this.value = tsKvEntity.getBoolV();
                break;
            case STRING:
                this.value = tsKvEntity.getStringV();
                break;
            case JSON:
                this.value = tsKvEntity.getJsonV();
                break;
            default:
                break;
        }
    }
}
