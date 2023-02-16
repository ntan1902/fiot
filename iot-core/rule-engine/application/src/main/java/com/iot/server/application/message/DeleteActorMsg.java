package com.iot.server.application.message;

import lombok.Data;

@Data
public class DeleteActorMsg implements ActorMsg {
  @Override
  public ActorMsgType getType() {
    return ActorMsgType.DELETE_ACTOR_MSG;
  }
}
