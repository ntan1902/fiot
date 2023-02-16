package com.iot.server.dao.entity.relation;

import com.iot.server.common.entity.EntityConstants;
import com.iot.server.dao.dto.RelationDto;
import lombok.*;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = EntityConstants.RELATION_TABLE_NAME)
@IdClass(RelationCompositeKey.class)
public final class RelationEntity {

    @Id
    @Column(name = EntityConstants.RELATION_FROM_ID_PROPERTY, columnDefinition = "uuid")
    private UUID fromId;

    @Id
    @Column(name = EntityConstants.RELATION_FROM_TYPE_PROPERTY)
    private String fromType;

    @Id
    @Column(name = EntityConstants.RELATION_TO_ID_PROPERTY, columnDefinition = "uuid")
    private UUID toId;

    @Id
    @Column(name = EntityConstants.RELATION_TO_TYPE_PROPERTY)
    private String toType;

    @Id
    @Column(name = EntityConstants.RELATION_NAME_PROPERTY)
    private String name;

    public RelationEntity(RelationDto relationDto) {
        this.fromId = relationDto.getFromId();
        this.fromType = relationDto.getFromType();
        this.toId = relationDto.getToId();
        this.toType = relationDto.getToType();
        this.name = relationDto.getName();
    }
}