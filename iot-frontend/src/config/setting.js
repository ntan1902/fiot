export const IS_DEV = process.env.REACT_APP_NODE_ENV === "dev";

export const AUTH_API_URL = IS_DEV
    ? process.env.REACT_APP_DEV_AUTH_API_URL
    : process.env.REACT_APP_PROD_API_URL;

export const ENTITY_API_URL = IS_DEV
    ? process.env.REACT_APP_DEV_ENTITY_API_URL
    : process.env.REACT_APP_PROD_API_URL;

export const TRANSPORT_API_URL = IS_DEV
    ? process.env.REACT_APP_DEV_TRANSPORT_API_URL
    : process.env.REACT_APP_PROD_API_URL;

export const TELEMETRY_API_URL = IS_DEV
    ? process.env.REACT_APP_DEV_TELEMETRY_API_URL
    : process.env.REACT_APP_PROD_API_URL;

export const RULE_ENGINE_API_URL = IS_DEV
    ? process.env.REACT_APP_DEV_RULE_ENGINE_API_URL
    : process.env.REACT_APP_PROD_API_URL;

export const BASE_URL = IS_DEV
    ? process.env.REACT_APP_DEV_BASE_URL
    : process.env.REACT_APP_PROD_API_URL;

export const API_AUTH_SERVICE = `/auth/api`;
export const API_ENTITY_SERVICE = `/entity/api`;
export const API_TELEMETRY_SERVICE = "/telemetry/api";
export const API_RULE_ENGINE_SERVICE = `/rule-engine/api`;
export const API_TRANSPORT_SERVICE = `/transport`

export const API_AUTH = `auth`;
export const API_TELEMETRY = "telemetry";
export const API_TENANT = "tenant";
export const API_CUSTOMER = "customer";
export const API_DEVICE = "device";
export const API_WIDGETS_BUNDLE = "widgets-bundle";
export const API_WIDGET_TYPE = "widget-type";
export const API_RULE_CHAIN = "rule-chain";
export const API_RULE_CHAINS = "rule-chains";
export const API_RULE_NODES = "rule-nodes";
export const API_RULE_NODE_DESCRIPTORS = "rule-node-descriptors";
export const API_DASHBOARD = "dashboard";
export const API_ALARM = "alarm";
export const API_SIMULATOR_DEVICE = "simulator-device";
