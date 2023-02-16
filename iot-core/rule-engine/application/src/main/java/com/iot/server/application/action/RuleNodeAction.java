package com.iot.server.application.action;

import com.iot.server.application.actor.ctx.ActionContext;
import com.iot.server.application.message.RuleNodeMsg;

import java.util.UUID;

public interface RuleNodeAction {

    void init(ActionContext ctx, String config);

    void onMsg(RuleNodeMsg msg);

    void stop();

}
