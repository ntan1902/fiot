package com.iot.server.common.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.iot.server.common.enums.KvType;
import com.iot.server.common.model.Kv;
import java.io.IOException;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

public final class GsonUtils {
    private static final String CAN_NOT_PARSE_VALUE = "Can't parse value: ";
    private static final Gson GSON =
            new GsonBuilder()
                    .registerTypeAdapter(
                            byte[].class,
                            new TypeAdapter<byte[]>() {
                                @Override
                                public void write(JsonWriter out, byte[] value) throws IOException {
                                    out.value(Base64.getEncoder().encodeToString(value));
                                }

                                @Override
                                public byte[] read(JsonReader in) throws IOException {
                                    return Base64.getDecoder().decode(in.nextString());
                                }
                            })
                    .setLenient()
                    .create();

    private GsonUtils() {
    }

    public static <T> T fromJson(String json, Class<T> clazz) {
        return GSON.fromJson(json, clazz);
    }

    public static <T> T fromJson(String json, Type type) {
        return GSON.fromJson(json, type);
    }

    public static String toJson(Object obj) {
        return GSON.toJson(obj);
    }

    public static List<Kv> parseJsonElement(JsonElement jsonElement) {
        if (jsonElement.isJsonObject()) {
            return parseKvs(jsonElement.getAsJsonObject(), System.currentTimeMillis());
        } else if (jsonElement.isJsonArray()) {
            List<Kv> res = new ArrayList<>();

            jsonElement.getAsJsonArray().forEach(je -> {
                if (je.isJsonObject()) {
                    res.addAll(parseKvs(je.getAsJsonObject(), System.currentTimeMillis()));
                } else {
                    throw new JsonSyntaxException(CAN_NOT_PARSE_VALUE + je);
                }
            });

            return res;
        } else {
            throw new JsonSyntaxException(CAN_NOT_PARSE_VALUE + jsonElement);
        }
    }

    private static List<Kv> parseKvs(JsonObject jsonObject, Long ts) {
        List<Kv> result = new ArrayList<>();

        for (Map.Entry<String, JsonElement> valueEntry : jsonObject.entrySet()) {
            JsonElement element = valueEntry.getValue();
            if (element.isJsonPrimitive()) {
                JsonPrimitive value = element.getAsJsonPrimitive();
                if (value.isString()) {
                    try {
                        result.add(buildNumericKeyValueProto(value, valueEntry.getKey(), ts));
                    } catch (RuntimeException ex) {
                        result.add(Kv.builder()
                                .key(valueEntry.getKey())
                                .type(KvType.STRING)
                                .value(value.getAsString())
                                .ts(ts)
                                .build());
                    }

                } else if (value.isBoolean()) {

                    result.add(Kv.builder()
                            .key(valueEntry.getKey())
                            .type(KvType.BOOLEAN)
                            .value(value.getAsBoolean())
                            .ts(ts)
                            .build());

                } else if (value.isNumber()) {

                    result.add(buildNumericKeyValueProto(value, valueEntry.getKey(), ts));

                } else if (!value.isJsonNull()) {
                    throw new JsonSyntaxException(CAN_NOT_PARSE_VALUE + value);
                }
            } else if (element.isJsonObject() || element.isJsonArray()) {

                result.add(Kv.builder()
                        .key(valueEntry.getKey())
                        .type(KvType.JSON)
                        .value(element.toString())
                        .ts(ts)
                        .build());

            }
        }
        return result;
    }

    private static Kv buildNumericKeyValueProto(JsonPrimitive value, String key, Long ts) {
        String valueAsString = value.getAsString();
        Kv.KvBuilder builder = Kv.builder().key(key);

        BigDecimal bigDecimal = new BigDecimal(valueAsString);
        if (bigDecimal.stripTrailingZeros().scale() <= 0
                && !isSimpleDouble(valueAsString)) {
            return builder
                    .type(KvType.LONG)
                    .value(bigDecimal.longValueExact())
                    .ts(ts)
                    .build();
        } else {
            return builder
                    .type(KvType.DOUBLE)
                    .value(bigDecimal.doubleValue())
                    .ts(ts)
                    .build();
        }
    }

    private static boolean isSimpleDouble(String valueAsString) {
        return valueAsString.contains(".") && !valueAsString.contains("E") && !valueAsString.contains("e");
    }

    public static JsonObject getJsonObject(List<Kv> kvs) {
        JsonObject json = new JsonObject();
        for (Kv kv : kvs) {
            switch (kv.getType()) {
                case BOOLEAN:
                    json.addProperty(kv.getKey(), (Boolean) kv.getValue());
                    break;
                case LONG:
                    json.addProperty(kv.getKey(), (Long) kv.getValue());
                    break;
                case DOUBLE:
                    json.addProperty(kv.getKey(), (Double) kv.getValue());
                    break;
                case STRING:
                    json.addProperty(kv.getKey(), (String) kv.getValue());
                    break;
                case JSON:
                    json.add(kv.getKey(), JsonParser.parseString((String) kv.getValue()));
                    break;
            }
        }
        return json;
    }
}
