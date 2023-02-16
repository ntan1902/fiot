package com.iot.server.application.action;

import com.iot.server.application.actor.ctx.ActionContext;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.utils.RuleNodeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

@Slf4j
public abstract class AbstractRuleNodeAction implements RuleNodeAction {
    protected ActionContext ctx;

    @Override
    public void init(ActionContext ctx, String config) {
        this.ctx = ctx;
        initConfig(config);
    }

    protected String processTemplate(String template, RuleNodeMsg msg) {
        if (StringUtils.hasText(template)) {
            return RuleNodeUtils.processPattern(template, msg);
        }
        return "";
    }


    protected abstract void initConfig(String config);

}
