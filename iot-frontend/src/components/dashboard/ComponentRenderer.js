import React from "react"
import DeviceBarChart from "../device-charts/DeviceBarChart"
import DeviceLineChart from "../device-charts/DeviceLineChart"
//import DevicePieChart from "../device-charts/DevicePieChart";
import DeviceLinearGauge from "../device-gauge/DeviceLinearGauge"
import DeviceRadialGauge from "../device-gauge/DeviceRadialGauge"
import DeviceAlarm from "../device_alarms/DeviceAlarm"
import constant from "../../helpers/constants"
import DeviceMaps from "../device-maps/DeviceMaps";
import DeviceTableCard from "../device-cards/DeviceTableCard"
import DeviceSwitchSelector from "../device-control-widgets/DeviceSwitchSelector";
import DeviceLedIndicator from "../device-control-widgets/DeviceLedIndicator"

const renderComponent = (typeAlias, dataSources, settings, width = 0, height = 0) => {
  switch (typeAlias) {
    //CHARTS
    case constant.DEFAULT_WIDGET_TYPE.BAR_CHART:
      return <DeviceBarChart dataSources={dataSources} />
    case constant.DEFAULT_WIDGET_TYPE.LINE_CHART:
      return <DeviceLineChart dataSources={dataSources} />
    //case constant.DEFAULT_WIDGET_TYPE.PIE_CHART:
    //  return <DevicePieChart />;

    //ANALOGUE_GAUGES
    case constant.DEFAULT_WIDGET_TYPE.LINEAR_GAUGE:
      return <DeviceLinearGauge settings={settings} dataSources={dataSources} width={width} height={height}/>
    case constant.DEFAULT_WIDGET_TYPE.RADIAL_GAUGE:
      return <DeviceRadialGauge settings={settings} dataSources={dataSources} width={width} height={height} />

    // MAPS
    case constant.DEFAULT_WIDGET_TYPE.OPEN_STREET_MAP:
      return <DeviceMaps dataSources={dataSources} />
    case constant.DEFAULT_WIDGET_TYPE.ALARMS:
      return <DeviceAlarm dataSources={dataSources} />
  
    // CARDS
    case constant.DEFAULT_WIDGET_TYPE.TABLE_CARD:
      return <DeviceTableCard dataSources={dataSources}/>

    // CONTROL_WIDGETS
    case constant.DEFAULT_WIDGET_TYPE.SWITCH_SELECTOR:
      return <DeviceSwitchSelector settings={settings} width={width} height={height}/>
    case constant.DEFAULT_WIDGET_TYPE.LED_INDICATOR:
      return <DeviceLedIndicator settings={settings} width={width} height={height}/>

    default:
      return <></>
  }
}

export default renderComponent
