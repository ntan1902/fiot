package com.iot.server.dao.user;

import com.iot.server.common.dao.Dao;
import com.iot.server.dao.entity.UserCredentialsEntity;
import java.util.UUID;

public interface UserCredentialsDao extends Dao<UserCredentialsEntity, UUID> {

   UserCredentialsEntity findByUserId(UUID userId);

   UserCredentialsEntity findByActivateToken(String activateToken);
}
