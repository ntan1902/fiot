import React, {useEffect, useState} from "react"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import GridLayout from "react-grid-layout"
import renderComponent from "./ComponentRenderer"
import {useDispatch, useSelector} from "react-redux"
import {saveChangesDashboard} from "../../actions/dashboards"
import DashboardService from "../../services/dashboard"
import styled from "styled-components"
import {Icon, message, Modal} from "antd"
import {Action, Fab} from "react-tiny-fab"
import "react-tiny-fab/dist/styles.css"
import AddWidgetModal from "./AddWidgetModal"
import {loadAlarmsByDeviceId} from "../../actions/alarms"
import {loadTelemetryByDeviceId} from "../../actions/telemetry"
import {loadLatestTelemetryByDeviceId} from "../../actions/telemetry"
import {get, isEmpty} from "lodash"

const StyledAction = (props) => (
  <Action style={{backgroundColor: "orange"}} {...props}>
    {props.children}
  </Action>
)

const transparentWidgetAlias = ["linear_gauge", "radial_gauge", "switch_selector"]

const StyledDiv = styled.div`
  background-color: ${({alias}) => (transparentWidgetAlias.includes(alias) ? "transparent" : "white")};
  :hover {
    background-color: white;
  }
  align-text: center;
  align-items: center;
  align-content: center;
`

const {confirm} = Modal

const styleButton = {
  style: {borderRadius: "5px"},
  size: "large",
}

const removeStyle = {
  position: "absolute",
  right: 0,
  top: 0,
  marginTop: -8,
  cursor: "pointer",
  zIndex: 0,
}

const DesignLayout = () => {
  const dispatch = useDispatch()
  const {openedDashboard} = useSelector((state) => state.dashboards)
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles.includes("TENANT")

  const [currentLayout, setCurrentLayout] = useState([])
  const [openAddWidgetModal, setOpenAddWidgetModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [shouldReload, setShouldReload] = useState(false)
  const widgets = get(openedDashboard, "dashboard.configuration.widgets", [])

  useEffect(async () => {
    const deviceList = []
    widgets.forEach((w) => {
      const dataSources = get(w, "dataSources", {})
      for (const [key, value] of Object.entries(dataSources)) {
        deviceList.push(key)
      }
    })

    const uniqueDeviceIds = [...new Set(deviceList)]
    await Promise.all(
      uniqueDeviceIds.map(async (deviceId) => {
        if (deviceId) {
          dispatch(loadTelemetryByDeviceId(deviceId))
          dispatch(loadLatestTelemetryByDeviceId(deviceId))
          dispatch(loadAlarmsByDeviceId(deviceId))
        }
      })
    )
  }, [openedDashboard])

  const layout = widgets.map((widget, idx) => {
    const _id = widget.id ? widget.id : idx
    return {
      id: _id,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
      typeAlias: widget.typeAlias,
      dataSources: get(widget, "dataSources", {}),
      settings: get(widget, "settings", {}),
    }
  })

  useEffect(() => {
    const formattedWidgets = formatCurrentLayoutToWidgets()
    const data = {
      dashboardId: get(openedDashboard, "dashboard.id"),
      widgets: formattedWidgets,
    }
    if (!isEmpty(formattedWidgets)) {
      dispatch(saveChangesDashboard(data))
      triggerShouldReload()
    }
  }, [currentLayout])

  const children = React.useMemo(() => {
    return layout.map((item) => {
      return (
        <StyledDiv
          alias={item.typeAlias}
          key={item.typeAlias + item.id}
          data-grid={{x: item.x, y: item.y, w: item.w, h: item.h}}
        >
          {renderComponent(item.typeAlias, item.dataSources, item.settings, item.w, item.h)}
          {isEdit && (
            <span onClick={() => handleRemoveWidget(item)} style={removeStyle}>
              <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" style={{fontSize: "20px"}} />
            </span>
          )}
        </StyledDiv>
      )
    })
  }, [shouldReload])

  const handleLayoutChange = (layout) => {
    setCurrentLayout(layout)
  }

  const formatCurrentLayoutToWidgets = () => {
    return currentLayout.map((l, idx) => {
      const formattedTypeAlias = l.i.replace(/[0-9]/g, "") // remove all number, remain char
      let _id = l.i.replace(/^\D+/g, "") // remove all char, remain number
      if (isEmpty(_id)) {
        _id = idx
      }
      return {
        id: _id,
        typeAlias: formattedTypeAlias,
        x: l.x,
        y: l.y,
        w: l.w,
        h: l.h,
        dataSources: layout[idx]?.dataSources,
        settings: layout[idx]?.settings,
      }
    })
  }

  const handleSaveChanges = async () => {
    const formattedWidgets = formatCurrentLayoutToWidgets()

    const data = {
      dashboardId: get(openedDashboard, "dashboard.id"),
      widgets: formattedWidgets,
    }

    const configurationStr = JSON.stringify({widgets: data.widgets})

    try {
      await DashboardService.updateConfiguration(data.dashboardId, configurationStr)
      dispatch(saveChangesDashboard(data))
    } catch (e) {
      message.error(e.response.data.message)
      return
    }
    message.success("Update dashboard successfully")
    setIsEdit(false)
    triggerShouldReload()
  }

  const handleOpenAddWidgetModal = (value) => {
    setIsEdit(true)
    setOpenAddWidgetModal(value)
  }

  const handleRemoveWidget = (removedWidget) => {
    confirm({
      title: "Are you sure to remove widget?",
      centered: true,

      okText: "Yes",
      okButtonProps: {
        ...styleButton,
        icon: "check",
      },
      onOk() {
        const curWidgets = get(openedDashboard, "dashboard.configuration.widgets", [])

        const newWidgets = curWidgets.filter((widget) => widget.id !== removedWidget.id)

        const data = {
          dashboardId: get(openedDashboard, "dashboard.id"),
          widgets: newWidgets,
        }

        dispatch(saveChangesDashboard(data))
        triggerShouldReload()
      },

      cancelButtonProps: styleButton,
      onCancel() {},
    })
  }

  const triggerShouldReload = () => {
    setShouldReload(!shouldReload)
  }

  return (
    <div>
      <AddWidgetModal
        openAddWidgetModal={openAddWidgetModal}
        handleOpenAddWidgetModal={handleOpenAddWidgetModal}
        triggerShouldReload={triggerShouldReload}
      />
      <GridLayout
        isDraggable={isEdit}
        isResizable={isEdit}
        className="layout"
        cols={32}
        rowHeight={50}
        autoSize={true}
        width={1600}
        onLayoutChange={handleLayoutChange}
      >
        {children}
      </GridLayout>
      {isTenant && (
        <Fab
          style={{right: 0, bottom: 0}}
          mainButtonStyles={{backgroundColor: "orange"}}
          icon={isEdit ? <Icon type="check" /> : <Icon type="experiment" />}
          onClick={() => isEdit && handleSaveChanges()}
        >
          {!isEdit && (
            <StyledAction
              text="Add new widget"
              onClick={() => {
                setOpenAddWidgetModal(true)
              }}
            >
              <Icon type="plus" />
            </StyledAction>
          )}
          {!isEdit && (
            <StyledAction
              text="Enter edit mode"
              onClick={() => {
                setIsEdit(true)
                triggerShouldReload()
                message.info("Drag and resize is available now.")
              }}
            >
              <Icon type="edit" />
            </StyledAction>
          )}
        </Fab>
      )}

      {isEdit && isTenant && (
        <Fab
          style={{right: 80, bottom: 0}}
          mainButtonStyles={{backgroundColor: "red"}}
          icon={<Icon type="close" />}
          onClick={() => {
            setIsEdit(false)
            triggerShouldReload()
            message.warn("Drag and resize is not available now.")
          }}
        />
      )}
    </div>
  )
}

export default DesignLayout
