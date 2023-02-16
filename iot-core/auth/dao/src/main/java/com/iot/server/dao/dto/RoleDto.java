package com.iot.server.dao.dto;

import com.iot.server.common.dto.BaseDto;
import com.iot.server.dao.entity.RoleEntity;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class RoleDto extends BaseDto<UUID> {

   private String name;

   public RoleDto(RoleEntity roleEntity) {
      super(roleEntity);
      this.name = roleEntity.getName();
   }

}
