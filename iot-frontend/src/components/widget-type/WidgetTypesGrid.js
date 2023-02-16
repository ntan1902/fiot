import React from "react"
import {Modal} from "antd"
import Charts from "./Charts"
import AnalogueGauges from "./AnalogueGauges"
import Maps from "./Maps"
import Cards from "./Cards"
import Alarms from "./Alarms"
import constant from "../../helpers/constants"
import ControlWidgets from "./ControlWidgets";

const WidgetTypesGrid = (props) => {
  const {widgetType, openWidgetTypesGrid, setOpenWidgetTypesGrid} = props
  let modalWidth = 1300
  if (widgetType === constant.DEFAULT_WIDGETS_BUNDLE.CONTROL_WIDGETS) {
    modalWidth = 300
  }

  const renderTab = () => {
    switch (widgetType) {
      case constant.DEFAULT_WIDGETS_BUNDLE.CHARTS:
        return <Charts/>
      case constant.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES:
        return <AnalogueGauges/>
      case constant.DEFAULT_WIDGETS_BUNDLE.MAPS:
        return (
            <div style={{width: "1255", height: 500}}>
              <Maps/>
            </div>
        )
      case constant.DEFAULT_WIDGETS_BUNDLE.CARDS:
        return <Cards/>
      case constant.DEFAULT_WIDGETS_BUNDLE.ALARM_WIDGETS:
        return <Alarms/>
      case constant.DEFAULT_WIDGETS_BUNDLE.CONTROL_WIDGETS:
        return <ControlWidgets/>
      default:
        return <Charts/>
    }
  }

  return (
      <Modal
          visible={openWidgetTypesGrid}
          onCancel={() => setOpenWidgetTypesGrid(false)}
          centered={true}
          width={modalWidth}
          footer={null}
          closable={false}
          // bodyStyle={{backgroundColor: "lightgray"}}
          destroyOnClose={true}
      >
        {renderTab()}
      </Modal>
  )
}

export default WidgetTypesGrid
