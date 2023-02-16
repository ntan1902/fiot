require("dotenv").config()

module.exports = {
  IOT_ENTITY_PORT: process.env.IOT_ENTITY_PORT || "8081",
  // Database
  DATABASE_USERNAME: process.env.DB_USERNAME || "postgres",
  DATABASE_PASSWORD: process.env.DB_PASSWORD || "123456",
  DATABASE_NAME: process.env.DB_NAME || "iot_entity",
  DATABASE_HOST: process.env.DB_HOST || "localhost",
  DATABASE_PORT: process.env.DB_PORT || "5432",
  DATABASE_DIALECT: process.env.DB_DIALECT || "postgres",

  // Token header
  TOKEN_HEADER: "Authorization",
  TOKEN_START: "Bearer ",

  // API URL
  IOT_AUTH_URL: process.env.IOT_AUTH_URL || "http://localhost:5050/auth",

  // ROLES
  AUTHORITIES: ["ADMIN", "TENANT", "CUSTOMER"],

  ROLE_ADMIN: "ADMIN",
  ROLE_TENANT: "TENANT",
  ROLE_CUSTOMER: "CUSTOMER",

  // DEVICE_CREDENTIALS
  DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN: "ACCESS_TOKEN",
  DEVICE_CREDENTIALS_TYPE_X_509: "X509_CERTIFICATE",
  DEVICE_CREDENTIALS_TYPE_MQTT_BASIC: "MQTT_BASIC",

  // WIDGETS BUNDLE
  DEFAULT_WIDGETS_BUNDLE: {
    CHARTS: "charts",
    ANALOGUE_GAUGES: "analogue_gauges",
    MAPS: "maps",
    CARDS: "cards",
    ALARM_WIDGETS: "alarm_widgets",
    CONTROL_WIDGETS: "control_widgets",
  },

  // WIDGET TYPE
  DEFAULT_WIDGET_TYPE: {
    // CHARTS
    BAR_CHART: "bar_chart",
    LINE_CHART: "line_chart",
    PIE_CHART: "pie_chart",

    // ANALOGUE_GAUGES
    RADIAL_GAUGE: "radial_gauge",
    LINEAR_GAUGE: "linear_gauge",

    // MAPS
    OPEN_STREET_MAP: "openstreetmap",

    // CARDS
    TABLE_CARD: "table_card",

    // ALARMS
    ALARMS: "alarms",

    // SWITCH_SELECTOR
    SWITCH_SELECTOR: "switch_selector",

    // LED INDICATOR
    LED_INDICATOR: "led_indicator",
  },

  // RabbitMQ
  MESSAGE_QUEUE: {
    HOST: process.env.RABBIT_MQ_HOST || "localhost",
    PORT: process.env.RABBIT_MQ_PORT || "5672",
    CREDENTIAL: process.env.RABBIT_MQ_CREDENTIAL || "",

    ALARM_QUEUE: process.env.RABBIT_MQ_ALARM_QUEUE || "createAlarmQueue",
    ALARM_EXCHANGE: process.env.RABBIT_MQ_ALARM_EXCHANGE || "alarmExchange",
    ALARM_TYPE: process.env.RABBIT_MQ_ALARM_TYPE || "fanout",

    DEVICE_TELEMETRY_QUEUE: process.env.RABBIT_MQ_TELEMETRY_QUEUE || "updateLastActiveTimeDeviceQueue",
    DEVICE_TELEMETRY_EXCHANGE: process.env.RABBIT_MQ_TELEMETRY_EXCHANGE || "deviceTelemetryExchange",
    DEVICE_TELEMETRY_TYPE: process.env.RABBIT_MQ_TELEMETRY_TYPE || "fanout",

    DEVICE_RPC_EXCHANGE: process.env.RABBIT_MQ_RPC_EXCHANGE || "deviceRpcExchange",
    DEVICE_RPC_TYPE: process.env.RABBIT_MQ_RPC_TYPE || "fanout",

    DEVICE_RPC_RESPONSE_QUEUE: process.env.RABBIT_MQ_RPC_RESPONSE_QUEUE || "updateServerRpcResponseQueue",
    DEVICE_RPC_RESPONSE_EXCHANGE: process.env.RABBIT_MQ_RPC_RESPONSE_EXCHANGE || "serverRpcResponseExchange",
  },

  // Eureka
  EUREKA_CREDENTIAL: process.env.EUREKA_CREDENTIAL || "admin:admin",
  EUREKA_HOST: process.env.EUREKA_HOST || "localhost",
  EUREKA_PORT: process.env.EUREKA_PORT || "8761",
}
