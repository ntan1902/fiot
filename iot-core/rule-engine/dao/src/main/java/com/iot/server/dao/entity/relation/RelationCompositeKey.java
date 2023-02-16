package com.iot.server.dao.entity.relation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Transient;
import java.io.Serializable;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RelationCompositeKey implements Serializable {

    @Transient
    private static final long serialVersionUID = -4089175869616037592L;

    private UUID fromId;
    private String fromType;
    private UUID toId;
    private String toType;
    private String name;
}
