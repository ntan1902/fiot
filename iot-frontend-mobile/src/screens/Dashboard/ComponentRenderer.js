import React from 'react'
import DeviceBarChart from './Widgets/DeviceBarChart'
import DeviceLineChart from './Widgets/DeviceLineChart'
import DeviceMaps from './Widgets/DeviceMaps'
import constant from '../../helpers/constants'
import DeviceRadialGauge from './Widgets/DeviceRadialGauge'
import DeviceSwitchSelector from './Widgets/DeviceSwitchSelector'

const renderComponent = (typeAlias, dataSources, settings) => {
  switch (typeAlias) {
    // CHARTS

    case constant.DEFAULT_WIDGET_TYPE.BAR_CHART:
      return <DeviceBarChart dataSources={dataSources} />
    case constant.DEFAULT_WIDGET_TYPE.LINE_CHART:
      return <DeviceLineChart dataSources={dataSources} />
    // case constant.DEFAULT_WIDGET_TYPE.PIE_CHART:
    //  return <DevicePieChart />;

    // ANALOGUE_GAUGES
    // case constant.DEFAULT_WIDGET_TYPE.LINEAR_GAUGE:
    //  return (
    //    <DeviceLinearGauge
    //      dataSources={dataSources}
    //      width={width}
    //      height={height}
    //    />
    //  )
    case constant.DEFAULT_WIDGET_TYPE.RADIAL_GAUGE:
      return <DeviceRadialGauge dataSources={dataSources} />

    // MAPS
    case constant.DEFAULT_WIDGET_TYPE.OPEN_STREET_MAP:
      return <DeviceMaps dataSources={dataSources} />
    // case constant.DEFAULT_WIDGET_TYPE.ALARMS:
    //  return <DeviceAlarm dataSources={dataSources} />

    /// / CARDS
    // case constant.DEFAULT_WIDGET_TYPE.TABLE_CARD:
    //  return <DeviceTableCard dataSources={dataSources} />

    /// / CONTROL_WIDGETS
    case constant.DEFAULT_WIDGET_TYPE.SWITCH_SELECTOR:
      return <DeviceSwitchSelector settings={settings} />
    // case constant.DEFAULT_WIDGET_TYPE.LED_INDICATOR:
    //  return (
    //    <DeviceLedIndicator settings={settings} width={width} height={height} />
    //  )

    default:
      return <></>
  }
}

export default renderComponent
