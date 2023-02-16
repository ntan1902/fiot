package com.iot.server.common.utils;

public class ScriptUtils {
    public static final String MSG = "msg";
    public static final String META_DATA = "metaData";
    public static final String MSG_TYPE = "msgType";
    public static final String RULE_NODE_FUNCTION_NAME = "ruleNodeFunctionName";

    private static final String JS_WRAPPER_PREFIX_TEMPLATE =
            "function %s(msgStr, metaDataStr, msgType) { " +
                    "    var msg = JSON.parse(msgStr); " +
                    "    var metaData = JSON.parse(metaDataStr); " +
                    "    return JSON.stringify(%s(msg, metaData, msgType));" +
                    "    function %s(%s, %s, %s) {";
    private static final String JS_WRAPPER_SUFFIX = "\n}" +
            "\n}";

    // function abc(msgStr, metaDataStr, msgType) {
    //    var msg = JSON.parse(msgStr);
    //    var metaData = JSON.parse(metaDataStr);
    //    return JSON.stringify(ruleNodeFunc(msg, metaData, msgType));
    //    function ruleNodeFunc(msg, metaData, msgType) {
    //        return 'Incoming message:\\n' + JSON.stringify(msg) + '\\nIncoming metaData:\\n' + JSON.stringify(metaData);
    //    }
    // }

    public static String getScript(String functionName, String script, String... args) {
        String msgArg;
        String metaDataArg;
        String msgTypeArg;
        if (args != null && args.length == 3) {
            msgArg = args[0];
            metaDataArg = args[1];
            msgTypeArg = args[2];
        } else {
            msgArg = MSG;
            metaDataArg = META_DATA;
            msgTypeArg = MSG_TYPE;
        }
        String jsWrapperPrefix = String.format(JS_WRAPPER_PREFIX_TEMPLATE, functionName,
                RULE_NODE_FUNCTION_NAME, RULE_NODE_FUNCTION_NAME, msgArg, metaDataArg, msgTypeArg);
        return jsWrapperPrefix + script + JS_WRAPPER_SUFFIX;
    }
}
