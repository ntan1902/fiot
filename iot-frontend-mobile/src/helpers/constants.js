export default {
  // Token header
  TOKEN_HEADER: 'Authorization',
  TOKEN_START: 'Bearer ',

  AUTHORITIES: ['ADMIN', 'TENANT', 'CUSTOMER'],

  ROLE_ADMIN: 'ADMIN',
  ROLE_TENANT: 'TENANT',
  ROLE_CUSTOMER: 'CUSTOMER',

  // DEVICE_CREDENTIALS
  DEVICE_CREDENTIALS_TYPE_ACCESS_TOKEN: 'ACCESS_TOKEN',
  DEVICE_CREDENTIALS_TYPE_X_509: 'X509_CERTIFICATE',
  DEVICE_CREDENTIALS_TYPE_MQTT_BASIC: 'MQTT_BASIC',

  // WIDGETS BUNDLE
  DEFAULT_WIDGETS_BUNDLE: {
    CHARTS: 'charts',
    ANALOGUE_GAUGES: 'analogue_gauges',
    MAPS: 'maps',
    CARDS: 'cards',
    ALARM_WIDGETS: 'alarm_widgets',
    CONTROL_WIDGETS: 'control_widgets',
  },

  // WIDGET TYPE
  DEFAULT_WIDGET_TYPE: {
    // CHARTS
    BAR_CHART: 'bar_chart',
    LINE_CHART: 'line_chart',
    PIE_CHART: 'pie_chart',

    // ANALOGUE_GAUGES
    RADIAL_GAUGE: 'radial_gauge',
    LINEAR_GAUGE: 'linear_gauge',

    // MAPS
    OPEN_STREET_MAP: 'openstreetmap',

    // ALARM_WIDGETS
    ALARMS: 'alarms',

    // CARDS
    TABLE_CARD: 'table_card',

    // SWITCH_SELECTOR
    SWITCH_SELECTOR: 'switch_selector',
    LED_INDICATOR: 'led_indicator',
  },

  // DEFAULT_NODE_DESCRIPTORS_CLAZZ
  DEFAULT_CLAZZ: {
    MESSAGE_TYPE_SWITCH: 'msg_type_switch',
    SAVE_TIMESERIES: 'save_ts',
  },
}
