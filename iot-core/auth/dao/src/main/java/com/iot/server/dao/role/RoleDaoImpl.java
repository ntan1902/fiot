package com.iot.server.dao.role;

import com.iot.server.common.dao.JpaAbstractDao;
import com.iot.server.dao.entity.RoleEntity;
import com.iot.server.dao.repository.RoleRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleDaoImpl extends JpaAbstractDao<RoleEntity, UUID> implements RoleDao {

    private final RoleRepository roleRepository;

    @Override
    protected JpaRepository<RoleEntity, UUID> getJpaRepository() {
        return roleRepository;
    }

    @Override
    public RoleEntity findByName(String name) {
        return roleRepository.findByName(name).orElse(null);
    }
}
