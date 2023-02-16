package com.iot.server.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RuleNodeRelation {
    private Integer fromIndex;
    private Integer toIndex;
    private String name;
}
