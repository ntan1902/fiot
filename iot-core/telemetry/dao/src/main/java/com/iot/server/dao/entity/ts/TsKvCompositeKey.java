package com.iot.server.dao.entity.ts;

import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Transient;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TsKvCompositeKey implements Serializable {

   @Transient
   private static final long serialVersionUID = -4089175869616037523L;

   private UUID entityId;
   private String key;
   private long ts;
}
