const {v4: uuidv4} = require("uuid");
const constant = require("../helpers/constant");

const defaultWidgetTypes = [
  // CHARTS
  {
    name: "Bar Chart",
    alias: constant.DEFAULT_WIDGET_TYPE.BAR_CHART,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
        "Displays changes to timeseries data over time. For example, daily water consumption for last month.",
    descriptor: '{"sizeX":10,"sizeY":6}',
  },
  {
    name: "Line Chart",
    alias: constant.DEFAULT_WIDGET_TYPE.LINE_CHART,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
        "Displays changes to timeseries data over time. For example, temperature or humidity readings.",
    descriptor: '{"sizeX":10,"sizeY":6}',
  },
  {
    name: "Pie Chart",
    alias: constant.DEFAULT_WIDGET_TYPE.PIE_CHART,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
        "Displays latest values of the attributes or timeseries data for multiple entities in a pie chart. Supports numeric values only.",
    descriptor: '{"sizeX":4,"sizeY":4}',
  },

  // ANALOGUE GAUGES
  {
    name: "Linear Gauge",
    alias: constant.DEFAULT_WIDGET_TYPE.LINEAR_GAUGE,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES,
    description:
        "Preconfigured widget to display temperature. Allows to configure temperature range, gradient colors and other settings.",
    descriptor: '{"sizeX":10,"sizeY":4}',
  },
  {
    name: "Radial Gauge",
    alias: constant.DEFAULT_WIDGET_TYPE.RADIAL_GAUGE,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES,
    description:
      "Preconfigured gauge to display any value reading. Allows to configure value range, gradient colors and other settings.",
    descriptor: '{"sizeX":6,"sizeY":5}',
  },

  // MAPS
  {
    name: "OpenStreetMap",
    alias: constant.DEFAULT_WIDGET_TYPE.OPEN_STREET_MAP,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.MAPS,
    description: "Show latest values and location of the entities on OpenStreetMap.",
    descriptor: '{"sizeX":6,"sizeY":6}',
  },

  // CARDS
  {
    name: "Entities Table",
    alias: constant.DEFAULT_WIDGET_TYPE.TABLE_CARD,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CARDS,
    description: "Displays list of entities that match selected alias and filter with ability of additional full text search and pagination. Highly customizable using widget styles, data source keys and widget actions.",
    descriptor: '{"sizeX":8,"sizeY":6}'
  },
  // ALARM WIDGETS
  {
    name: "Alarms",
    alias: constant.DEFAULT_WIDGET_TYPE.ALARMS,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.ALARM_WIDGETS,
    description: "Visualization of alarms for devices, assets and other entities.",
    descriptor: '{"sizeX":6,"sizeY":6}',
  },

  // SWITCH SELECTOR
  {
    name: "Switch Selector",
    alias: constant.DEFAULT_WIDGET_TYPE.SWITCH_SELECTOR,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CONTROL_WIDGETS,
    description: "Allows to send RPC call to device when user toggle the switch selector",
    descriptor: '{"sizeX":2,"sizeY":1}',
  },

  // LED INDICATOR
  {
    name: "Led Indicator",
    alias: constant.DEFAULT_WIDGET_TYPE.LED_INDICATOR,
    bundleAlias: constant.DEFAULT_WIDGETS_BUNDLE.CONTROL_WIDGETS,
    description: "Visualize the state of the device. Fetches the value from device using RPC or using attribute subscription. ",
    descriptor: '{"sizeX":3,"sizeY":2}',
  }
];

module.exports = (sequelize, Sequelize) => {
  const WidgetType = sequelize.define(
      "widget_type",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        tenantId: {
          type: Sequelize.UUID,
          references: {
            model: "tenant",
            key: "id",
          },
        },
        name: {
          type: Sequelize.STRING,
        },
        alias: {
          type: Sequelize.STRING,
          unique: true,
        },
        bundleAlias: {
          type: Sequelize.STRING,
        },
        image: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        descriptor: {
          type: Sequelize.STRING(1000000),
        },
        deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        createUid: {
          type: Sequelize.UUID,
        },
        updateUid: {
          type: Sequelize.UUID,
        },
      },
      {
        underscored: true,
        freezeTableName: true,
        defaultScope: {
          attributes: {
            exclude: [
              "deleted",
              "createUid",
              "updateUid",
              "updatedAt",
            ],
          },
        },
      }
  );

  WidgetType.beforeCreate((widget) => (widget.id = uuidv4()));

  WidgetType.initial = () => {
    defaultWidgetTypes.forEach(async (widget) => {
      await WidgetType.findOrCreate({
        where: {
          ...widget,
        },
        logging: false,
      });
    });
  };

  return WidgetType;
};
