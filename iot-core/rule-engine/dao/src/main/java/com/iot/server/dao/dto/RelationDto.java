package com.iot.server.dao.dto;

import com.iot.server.dao.entity.relation.RelationEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RelationDto {
    private UUID fromId;
    private String fromType;
    private UUID toId;
    private String toType;
    private String name;

    public RelationDto(RelationEntity relationEntity) {
        this.fromId = relationEntity.getFromId();
        this.fromType = relationEntity.getFromType();
        this.toId = relationEntity.getToId();
        this.toType = relationEntity.getToType();
        this.name = relationEntity.getName();
    }
}
