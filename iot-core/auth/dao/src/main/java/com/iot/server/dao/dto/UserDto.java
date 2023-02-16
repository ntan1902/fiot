package com.iot.server.dao.dto;


import com.iot.server.common.dto.BaseDto;
import com.iot.server.dao.entity.UserEntity;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserDto extends BaseDto<UUID> {

   private String email;
   private String firstName;
   private String lastName;
   private UUID tenantId;
   private UUID customerId;

   public UserDto(UserEntity userEntity) {
      super(userEntity);
      this.email = userEntity.getEmail();
      this.firstName = userEntity.getFirstName();
      this.lastName = userEntity.getLastName();
      this.tenantId = userEntity.getTenantId();
      this.customerId = userEntity.getCustomerId();
   }
}

