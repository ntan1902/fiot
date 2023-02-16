package com.iot.server.application.action;

import com.iot.server.common.utils.GsonUtils;
import com.iot.server.dao.dto.RuleNodeDescriptorDto;
import com.iot.server.domain.rule_node_descriptor.RuleNodeDescriptorService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RuleNodeFactory implements ApplicationContextAware {

    private final RuleNodeDescriptorService ruleNodeDescriptorService;

    @SneakyThrows
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        Map<String, Object> beanMap = applicationContext.getBeansWithAnnotation(RuleNode.class);
        log.info("RuleNode beans {}", beanMap);

        ruleNodeDescriptorService.deleteAll();

        List<RuleNodeDescriptorDto> ruleNodeDescriptors = new ArrayList<>();
        for (Object object : beanMap.values()) {
            RuleNodeDescriptorDto ruleNodeDescriptor = getRuleNodeDescriptorDto(object);

            ruleNodeDescriptors.add(ruleNodeDescriptor);
        }

        ruleNodeDescriptorService.saveAll(ruleNodeDescriptors);
    }

    private RuleNodeDescriptorDto getRuleNodeDescriptorDto(Object object) throws InstantiationException, IllegalAccessException, InvocationTargetException, NoSuchMethodException {
        RuleNodeDescriptorDto ruleNodeDescriptor = new RuleNodeDescriptorDto();

        String clazzName = object.getClass().getName();
        RuleNode ruleNodeAnnotation = object.getClass().getAnnotation(RuleNode.class);

        ruleNodeDescriptor.setClazz(clazzName);
        ruleNodeDescriptor.setName(ruleNodeAnnotation.name());
        ruleNodeDescriptor.setType(ruleNodeAnnotation.type());
        ruleNodeDescriptor.setRelationNames(Arrays.toString(ruleNodeAnnotation.relationNames()));

        Class<? extends ActionConfiguration> configClazz = ruleNodeAnnotation.configClazz();

        ActionConfiguration config = configClazz.getDeclaredConstructor().newInstance();
        ActionConfiguration defaultConfig = config.getDefaultConfiguration();

        ruleNodeDescriptor.setConfigClazz(configClazz.getName());
        ruleNodeDescriptor.setDefaultConfig(GsonUtils.toJson(defaultConfig));
        return ruleNodeDescriptor;
    }
}
