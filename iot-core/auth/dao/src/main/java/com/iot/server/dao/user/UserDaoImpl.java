package com.iot.server.dao.user;

import com.iot.server.common.dao.JpaAbstractDao;
import com.iot.server.dao.entity.UserEntity;
import com.iot.server.dao.repository.UserRepository;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDaoImpl extends JpaAbstractDao<UserEntity, UUID> implements UserDao {

    private final UserRepository userRepository;

    @Override
    protected JpaRepository<UserEntity, UUID> getJpaRepository() {
        return userRepository;
    }

    @Override
    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email)
                .isPresent();
    }

    @Override
    public List<UserEntity> findAllByUserIdNotEqual(UUID userId) {
        return userRepository.findAllByIdNotEqual(userId);
    }
}
