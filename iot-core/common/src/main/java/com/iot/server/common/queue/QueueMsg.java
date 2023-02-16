package com.iot.server.common.queue;

import com.iot.server.common.model.MetaData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueueMsg {
  private String key;
  private UUID entityId;
  private UUID ruleChainId;
  private String data;
  private MetaData metaData;
  private String type;
  private Set<UUID> userIds;
}
