package com.iot.server.dao.repository;

import com.iot.server.dao.entity.UserCredentialsEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCredentialsRepository extends JpaRepository<UserCredentialsEntity, UUID> {
    Optional<UserCredentialsEntity> findByUserId(UUID userId);

    Optional<UserCredentialsEntity> findByActivateToken(String activateToken);
}
