package com.iot.server.dao.dto;

import com.iot.server.common.dto.BaseDto;
import com.iot.server.dao.entity.UserCredentialsEntity;
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
public class UserCredentialsDto extends BaseDto<UUID> {

   private UUID userId;
   private boolean enabled;
   private String password;
   private String activateToken;
   private String resetToken;

   public UserCredentialsDto(UserCredentialsEntity userCredentialsEntity) {
      super(userCredentialsEntity);
      this.userId = userCredentialsEntity.getUser().getId();
      this.password = userCredentialsEntity.getPassword();
      this.enabled = userCredentialsEntity.isEnabled();
      this.activateToken = userCredentialsEntity.getActivateToken();
      this.resetToken = userCredentialsEntity.getResetToken();
   }

   public void setUserId(UUID userId) {
      this.userId = userId;
   }
}
