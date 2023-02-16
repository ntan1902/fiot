package com.iot.server.dao.repository;

import com.iot.server.dao.entity.rule_node_descriptor.RuleNodeDescriptorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RuleNodeDescriptorRepository extends JpaRepository<RuleNodeDescriptorEntity, UUID> {
}
