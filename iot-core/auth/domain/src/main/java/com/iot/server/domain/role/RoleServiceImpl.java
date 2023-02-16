package com.iot.server.domain.role;

import com.iot.server.dao.dto.RoleDto;
import com.iot.server.dao.entity.RoleEntity;
import com.iot.server.dao.role.RoleDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleDao roleDao;

    @Override
    public void save(RoleDto roleDto) {
        roleDao.save(new RoleEntity(roleDto));
    }
}
