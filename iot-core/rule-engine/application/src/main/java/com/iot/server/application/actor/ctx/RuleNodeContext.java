package com.iot.server.application.actor.ctx;

import akka.actor.typed.ActorRef;
import com.iot.server.application.message.ActorMsg;
import com.iot.server.dao.dto.RuleNodeDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RuleNodeContext {
    private ActorRef<ActorMsg> selfActor;
    private ActorRef<ActorMsg> ruleChainActor;
    private RuleNodeDto self;
}
