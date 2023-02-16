package com.iot.server.domain.rule_chain;

import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.enums.RuleType;
import com.iot.server.common.exception.IoTException;
import com.iot.server.common.model.BaseReadQuery;
import com.iot.server.dao.dto.RuleChainDto;
import com.iot.server.dao.dto.RuleNodeDto;
import com.iot.server.dao.entity.relation.RelationEntity;
import com.iot.server.dao.entity.rule_chain.RuleChainEntity;
import com.iot.server.dao.entity.rule_node.RuleNodeEntity;
import com.iot.server.dao.entity.rule_node_descriptor.RuleNodeDescriptorEntity;
import com.iot.server.dao.relation.RelationDao;
import com.iot.server.dao.rule_chain.RuleChainDao;
import com.iot.server.dao.rule_node.RuleNodeDao;
import com.iot.server.dao.rule_node_descriptor.RuleNodeDescriptorDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RuleChainServiceImpl implements RuleChainService {

  private final RuleChainDao ruleChainDao;
  private final RelationDao relationDao;
  private final RuleNodeDao ruleNodeDao;
  private final RuleNodeDescriptorDao ruleNodeDescriptorDao;

  @Override
  @Cacheable(cacheNames = "ruleChain", key = "{#ruleChainId.toString()}")
  public RuleChainDto findRuleChainById(UUID ruleChainId) {
    log.trace("{}", ruleChainId);
    if (ruleChainId == null) {
      return null;
    }

    RuleChainEntity ruleChainEntity = ruleChainDao.findById(ruleChainId);
    if (ruleChainEntity == null) {
      return null;
    }
    return new RuleChainDto(ruleChainEntity);
  }

  @Override
  @Cacheable(cacheNames = "ruleChain", key = "{'ruleNodes:' + #ruleChainId.toString()}")
  public List<RuleNodeDto> findRuleNodesById(UUID ruleChainId) {
    log.trace("{}", ruleChainId);
    if (ruleChainId == null) {
      return Collections.emptyList();
    }

    return ruleNodeDao
            .findAllByRuleChainId(ruleChainId)
            .stream()
            .map(RuleNodeDto::new)
            .collect(Collectors.toList());
  }

  @Override
  public List<RuleChainDto> findAllByTenantId(UUID tenantId, BaseReadQuery query) {
    log.trace("{}, {}", tenantId, query);

    List<RuleChainEntity> ruleChainEntities = ruleChainDao.findAllByTenantId(tenantId, query);

    return ruleChainEntities.stream()
            .map(RuleChainDto::new)
            .collect(Collectors.toList());
  }

  @Override
  public RuleChainDto createRuleChain(RuleChainDto ruleChainDto) {
    log.trace("{}", ruleChainDto);

    RuleChainDto savedRuleChain = new RuleChainDto(
            ruleChainDao.save(new RuleChainEntity(ruleChainDto))
    );

    CompletableFuture.runAsync(() -> {
      generateDefaultRuleNodesAndRelations(savedRuleChain);
    });

    return savedRuleChain;
  }

  private void generateDefaultRuleNodesAndRelations(RuleChainDto savedRuleChain) {
    // Get rule node descriptors
    List<RuleNodeDescriptorEntity> ruleNodeDescriptors = ruleNodeDescriptorDao.findAll();

    List<RuleNodeEntity> ruleNodeEntities = new ArrayList<>();
    List<RelationEntity> relationEntities = new ArrayList<>();

    // Message Type Switch
    Optional<RuleNodeDescriptorEntity> messageTypeSwitchDescriptor = ruleNodeDescriptors.stream()
            .filter(ruleNodeDescriptorEntity -> ruleNodeDescriptorEntity.getName().equals("message type switch"))
            .findAny();

    messageTypeSwitchDescriptor.ifPresent(ruleNodeDescriptorEntity -> ruleNodeEntities.add(RuleNodeEntity.builder()
            .name("Message Type Switch")
            .ruleChainId(savedRuleChain.getId())
            .additionalInfo("{\"x\":255,\"y\":120}")
            .clazz(ruleNodeDescriptorEntity.getClazz())
            .config(ruleNodeDescriptorEntity.getDefaultConfig())
            .configClazz(ruleNodeDescriptorEntity.getConfigClazz())
            .build()));

    // Save Timeseries
    Optional<RuleNodeDescriptorEntity> saveTsDescriptor = ruleNodeDescriptors.stream()
            .filter(ruleNodeDescriptorEntity -> ruleNodeDescriptorEntity.getName().equals("save timeseries"))
            .findAny();

    saveTsDescriptor.ifPresent(ruleNodeDescriptorEntity -> ruleNodeEntities.add(RuleNodeEntity.builder()
            .name("Save Timeseries")
            .ruleChainId(savedRuleChain.getId())
            .additionalInfo("{\"x\":540,\"y\":15}")
            .clazz(ruleNodeDescriptorEntity.getClazz())
            .config(ruleNodeDescriptorEntity.getDefaultConfig())
            .configClazz(ruleNodeDescriptorEntity.getConfigClazz())
            .build()));

    // Send RPC Request
    Optional<RuleNodeDescriptorEntity> sendRpcRequestDescriptor = ruleNodeDescriptors.stream()
            .filter(ruleNodeDescriptorEntity -> ruleNodeDescriptorEntity.getName().equals("send rpc request"))
            .findAny();

    sendRpcRequestDescriptor.ifPresent(ruleNodeDescriptorEntity -> ruleNodeEntities.add(RuleNodeEntity.builder()
            .name("RPC To Device")
            .ruleChainId(savedRuleChain.getId())
            .additionalInfo("{\"x\":600,\"y\":120}")
            .clazz(ruleNodeDescriptorEntity.getClazz())
            .config(ruleNodeDescriptorEntity.getDefaultConfig())
            .configClazz(ruleNodeDescriptorEntity.getConfigClazz())
            .build()));

    // Send RPC Response
    Optional<RuleNodeDescriptorEntity> sendRpcResponseDescriptor = ruleNodeDescriptors.stream()
            .filter(ruleNodeDescriptorEntity -> ruleNodeDescriptorEntity.getName().equals("send rpc response"))
            .findAny();

    sendRpcResponseDescriptor.ifPresent(ruleNodeDescriptorEntity -> ruleNodeEntities.add(RuleNodeEntity.builder()
            .name("RPC From Device")
            .ruleChainId(savedRuleChain.getId())
            .additionalInfo("{\"x\":540,\"y\":225}")
            .clazz(ruleNodeDescriptorEntity.getClazz())
            .config(ruleNodeDescriptorEntity.getDefaultConfig())
            .configClazz(ruleNodeDescriptorEntity.getConfigClazz())
            .build()));

    List<RuleNodeEntity> savedRuleNodeEntities = ruleNodeDao.saveAllAndFlush(ruleNodeEntities);
    Map<String, RuleNodeEntity> ruleNodeEntityMap = new HashMap<>();
    for (RuleNodeEntity ruleNodeEntity : savedRuleNodeEntities) {
      ruleNodeEntityMap.put(ruleNodeEntity.getName(), ruleNodeEntity);
    }

    savedRuleChain.setFirstRuleNodeId(ruleNodeEntityMap.get("Message Type Switch").getId());
    ruleChainDao.save(new RuleChainEntity(savedRuleChain));

    relationEntities.add(RelationEntity.builder()
            .name("Post telemetry")
            .fromId(ruleNodeEntityMap.get("Message Type Switch").getId())
            .fromType(RuleType.RULE_NODE.name())
            .toId(ruleNodeEntityMap.get("Save Timeseries").getId())
            .toType(RuleType.RULE_NODE.name())
            .build());
    relationEntities.add(RelationEntity.builder()
            .name("RPC Request To Device")
            .fromId(ruleNodeEntityMap.get("Message Type Switch").getId())
            .fromType(RuleType.RULE_NODE.name())
            .toId(ruleNodeEntityMap.get("RPC To Device").getId())
            .toType(RuleType.RULE_NODE.name())
            .build());
    relationEntities.add(RelationEntity.builder()
            .name("RPC Request From Device")
            .fromId(ruleNodeEntityMap.get("Message Type Switch").getId())
            .fromType(RuleType.RULE_NODE.name())
            .toId(ruleNodeEntityMap.get("RPC From Device").getId())
            .toType(RuleType.RULE_NODE.name())
            .build());

    relationDao.saveAll(relationEntities);
  }

  @Override
  @CacheEvict(cacheNames = "ruleChain", key = "{'ruleNodes:' + #ruleChainId.toString()}")
  public List<RuleNodeDto> updateRuleNodes(UUID ruleChainId, Integer firstRuleNodeIndex, List<RuleNodeEntity> ruleNodeEntities) {
    log.info("{}, {}", ruleChainId, ruleNodeEntities);

    RuleChainEntity ruleChainEntity = ruleChainDao.findById(ruleChainId);
    if (ruleChainEntity == null) {
      log.error("Rule chain is not found {}", ruleChainId);
      throw new IoTException(ReasonEnum.INVALID_PARAMS, "Rule chain is not found");
    }

    List<RuleNodeEntity> foundRuleNodes = ruleNodeDao.findAllByRuleChainId(ruleChainId);
    List<RuleNodeEntity> toDelete = new ArrayList<>();

    deleteOrUpdateFoundNodes(ruleNodeEntities, foundRuleNodes, toDelete);
    deleteNodes(toDelete);

    if (!foundRuleNodes.isEmpty()) {
      List<RuleNodeEntity> savedRuleNodes = ruleNodeDao.saveAllAndFlush(ruleNodeEntities);

      UUID firstRuleNodeId = null;
      if (firstRuleNodeIndex != null && firstRuleNodeIndex >= 0) {
        firstRuleNodeId = ruleNodeEntities.get(firstRuleNodeIndex).getId();
      }

      if (firstRuleNodeId != null && ruleChainEntity.getFirstRuleNodeId() != firstRuleNodeId) {
        ruleChainEntity.setFirstRuleNodeId(firstRuleNodeId);
      }

      return savedRuleNodes.stream()
              .map(RuleNodeDto::new)
              .collect(Collectors.toList());
    }
    return Collections.emptyList();
  }

  @Override
  @Caching(
          evict = {
                  @CacheEvict(cacheNames = "ruleChain", key = "{#ruleChainId.toString()}"),
                  @CacheEvict(cacheNames = "ruleChain", key = "'ruleNodes:' + #ruleChainId.toString()")
          }
  )
  public void deleteRuleChainById(UUID ruleChainId) {
    try {
      List<RuleNodeEntity> ruleNodes = ruleNodeDao.findAllByRuleChainId(ruleChainId);

      for (RuleNodeEntity ruleNode : ruleNodes) {
        relationDao.deleteRelations(ruleNode.getId());
        ruleNodeDao.removeById(ruleNode.getId());
      }
      ruleChainDao.removeById(ruleChainId);

    } catch (RuntimeException ex) {
      log.error(ex.getMessage(), ex);
    }
  }

  private void deleteOrUpdateFoundNodes(List<RuleNodeEntity> ruleNodeEntities,
                                        List<RuleNodeEntity> foundRuleNodes,
                                        List<RuleNodeEntity> toDelete) {
    Map<UUID, Integer> ruleNodeIndexMap = getRuleNodeIndexMap(ruleNodeEntities);
    for (RuleNodeEntity foundRuleNode : foundRuleNodes) {
      Integer index = ruleNodeIndexMap.getOrDefault(foundRuleNode.getId(), null);

      if (index == null) {
        toDelete.add(foundRuleNode);
      } else {
        int i = foundRuleNodes.indexOf(foundRuleNode);
        foundRuleNodes.set(i, ruleNodeEntities.get(index));
      }
    }
  }

  private void deleteNodes(List<RuleNodeEntity> toDelete) {
    for (RuleNodeEntity ruleNode : toDelete) {
      relationDao.deleteRelations(ruleNode.getId());
      ruleNodeDao.removeById(ruleNode.getId());
    }
  }

  private Map<UUID, Integer> getRuleNodeIndexMap(List<RuleNodeEntity> ruleNodeEntities) {
    Map<UUID, Integer> res = new HashMap<>();

    ruleNodeEntities.forEach(ruleNodeEntity -> {
      if (ruleNodeEntity.getId() != null) {
        res.put(ruleNodeEntity.getId(), ruleNodeEntities.indexOf(ruleNodeEntity));
      }
    });

    return res;
  }
}
