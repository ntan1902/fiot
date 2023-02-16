package com.iot.server.application.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class RuleEngineActorMsg implements ActorMsg {
    private RuleNodeMsg msg;
}
