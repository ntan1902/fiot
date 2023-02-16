package com.iot.server.application.action;

import org.springframework.stereotype.Component;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Component
public @interface RuleNode {
    String type();

    String name();

    String[] relationNames() default {"Success", "Failure"};

    Class<? extends ActionConfiguration> configClazz();
}
