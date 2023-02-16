package com.iot.server.application.utils;

import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.model.MetaData;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class RuleNodeUtils {

    private static final Pattern DATA_PATTERN = Pattern.compile("(\\$\\[)(.*?)(])");

    public static List<String> processPatterns(List<String> patterns, RuleNodeMsg ruleNodeMsg) {
        if (!CollectionUtils.isEmpty(patterns)) {
            return patterns.stream().map(p -> processPattern(p, ruleNodeMsg)).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public static String processPattern(String pattern, RuleNodeMsg ruleNodeMsg) {
        return processPattern(pattern, ruleNodeMsg.getMetaData());
    }

    public static List<String> processPatterns(List<String> patterns, MetaData metaData) {
        if (!CollectionUtils.isEmpty(patterns)) {
            return patterns.stream().map(p -> processPattern(p, metaData)).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public static String processPattern(String pattern, MetaData metaData) {
        String result = pattern;
        for (Map.Entry<String, String> keyVal : metaData.values().entrySet()) {
            result = processVar(result, keyVal.getKey(), keyVal.getValue());
        }
        return result;
    }

    private static String processVar(String pattern, String key, String val) {
        return pattern.replace(formatMetadataVarTemplate(key), val);
    }

    static String formatDataVarTemplate(String key) {
        return "$[" + key + ']';
    }

    static String formatMetadataVarTemplate(String key) {
        return "${" + key + '}';
    }
}