const { v4: uuidv4 } = require("uuid");
const constant = require("../helpers/constant");

const defaultWidgetBundles = [
  {
    title: "Charts",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.CHARTS,
    description:
      "Display timeseries data using customizable line and bar charts. Use various pie charts to display latest values.",
  },
  {
    title: "Analogue gauges",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES,
    description:
      "Display temperature, humidity, speed, and other latest values on various analog gauge widgets.",
  },
  {
    title: "Maps",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.MAPS,
    description:
        "Visualize latest location or trip animation of the devices or other entities on the indoor or outdoor maps.",
  },
  {
    title: "Cards",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.CARDS,
    description:
        "Tables and cards to display latest and historical values for multiple entities simultaneously.",
  },
  {
    title: "Alarm Widgets",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.ALARM_WIDGETS,
    description: "Visualization of alarms for devices, assets and other entities.",
  },
  {
    title: "Control widgets",
    alias: constant.DEFAULT_WIDGETS_BUNDLE.CONTROL_WIDGETS,
    description: "Send commands to devices"
  }
];

module.exports = (sequelize, Sequelize) => {
  const WidgetsBundle = sequelize.define(
    "widgets_bundle",
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
      title: {
        type: Sequelize.STRING,
      },
      alias: {
        type: Sequelize.STRING,
        unique: true,
      },
      image: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
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

  WidgetsBundle.beforeCreate((bundle) => (bundle.id = uuidv4()));

  WidgetsBundle.initial = () => {
    defaultWidgetBundles.forEach(async (bundle) => {
      await WidgetsBundle.findOrCreate({
        where: {
          ...bundle
        },
        logging: false
      });
    });
  };

  return WidgetsBundle;
};
