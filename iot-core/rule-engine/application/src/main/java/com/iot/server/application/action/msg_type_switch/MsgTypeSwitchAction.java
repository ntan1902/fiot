package com.iot.server.application.action.msg_type_switch;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.EmptyConfiguration;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.enums.MsgType;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "message type switch",
        relationNames = {"Post attributes", "Post telemetry", "RPC Request From Device", "RPC Request To Device", "RPC Queued", "RPC Sent", "RPC Delivered", "RPC Successful", "RPC Timeout", "RPC Expired", "RPC Failed", "RPC Deleted",
                "Activity Event", "Inactivity Event", "Connect Event", "Disconnect Event", "Entity Created", "Entity Updated", "Entity Deleted", "Entity Assigned",
                "Entity Unassigned", "Attributes Updated", "Attributes Deleted", "Alarm Acknowledged", "Alarm Cleared", "Other", "Entity Assigned From Tenant", "Entity Assigned To Tenant",
                "Timeseries Updated", "Timeseries Deleted", "Success", "Failure"},
        configClazz = EmptyConfiguration.class
)
public class MsgTypeSwitchAction extends AbstractRuleNodeAction {

    private EmptyConfiguration config;

    @Override
    protected void initConfig(String config) {
        this.config = GsonUtils.fromJson(config, EmptyConfiguration.class);
    }

    @Override
    public void onMsg(RuleNodeMsg msg) {
        String relationName = "";
        if (msg.getType().equals(MsgType.POST_TELEMETRY_REQUEST.name())) {
            relationName = "Post telemetry";
        } else if (msg.getType().equals(MsgType.RPC_REQUEST_TO_DEVICE.name())) {
            relationName = "RPC Request To Device";
        } else if (msg.getType().equals(MsgType.RPC_REQUEST_FROM_DEVICE.name())) {
            relationName = "RPC Request From Device";
        } else {
            relationName = "Other";
        }
        this.ctx.tellNext(msg, relationName);
    }

    @Override
    public void stop() {

    }
}
