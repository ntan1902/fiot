package com.iot.server.common.model;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.Data;

@Data
public class MetaData {

    private final Map<String, String> data;

    public MetaData() {
        this.data = new ConcurrentHashMap<>();
    }

    public MetaData(Map<String, String> data) {
        this.data = new ConcurrentHashMap<>(data);
    }

    public String getValue(String key) {
        return data.get(key);
    }

    public void putValue(String key, String value) {
        if (key != null && value != null) {
            data.put(key, value);
        }
    }

    public Map<String, String> values() {
        return new HashMap<>(data);
    }
}
