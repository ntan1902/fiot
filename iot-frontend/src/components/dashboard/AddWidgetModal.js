import React, {useState} from "react"
import {Avatar, Button, Card, Form, Icon, List, message, Modal} from "antd"
import {get, maxBy} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import {saveChangesDashboard} from "../../actions/dashboards"
import constants from "../../helpers/constants"
import CreateDatasource from "./CreateDatasource"
import CreateSettings from "./CreateSettings";

const AddWidgetModal = (props) => {
  const {openAddWidgetModal, handleOpenAddWidgetModal, triggerShouldReload} = props
  const {confirm} = Modal

  const dispatch = useDispatch()
  const {widgetsBundles} = useSelector((state) => state.widgetsBundles)
  const {widgetTypes} = useSelector((state) => state.widgetTypes)
  const {openedDashboard} = useSelector((state) => state.dashboards)

  const [isShowWidgetTypes, setIsShowWidgetTypes] = useState(false)
  const [curWidgetsBundle, setCurWidgetsBundle] = useState({})

  const [isCreateDatasource, setIsCreateDatasource] = useState(false)
  const [curWidgetType, setCurWidgetType] = useState({})

  const [dataSources, setDataSources] = useState([{}])
  const [telemetryKeys, setTelemetryKeys] = useState({})
  const [settings, setSettings] = useState({})

  const styleButton = {
    style: {borderRadius: "5px"},
    size: "large",
  }
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  }

  const dataBundles = widgetsBundles.map((bundle) => {
    return {
      ...bundle,
    }
  })

  const dataWidgets = []
  widgetTypes.map((widget) => {
    if (widget.bundleAlias === curWidgetsBundle.alias) {
      dataWidgets.push({
        ...widget,
      })
    }
  })

  const handleChooseBundle = (item) => {
    setCurWidgetsBundle(item)
    setIsShowWidgetTypes(true)
  }

  const handleChooseWidgetType = (item) => {
    setCurWidgetType(item)
    setIsCreateDatasource(true)
  }

  const renderCreateDatasource = () => {
    let allowSingleTelemetry = false
    let allowOnlyDeviceName = false
    let allowSettings = false

    if (curWidgetType.bundleAlias === constants.DEFAULT_WIDGETS_BUNDLE.ANALOGUE_GAUGES) {
      allowSingleTelemetry = true
      allowSettings = true
    }

    if (curWidgetType.bundleAlias === constants.DEFAULT_WIDGETS_BUNDLE.ALARM_WIDGETS) {
      allowOnlyDeviceName = true
    }

    return (
        <>
          {dataSources.map((ds, index) => (
              <CreateDatasource
                  allowSingleTelemetry={allowSingleTelemetry}
                  allowOnlyDeviceName={allowOnlyDeviceName}
                  allowSettings={allowSettings}
                  index={index}
                  form={props.form}
                  setTelemetryKeys={setTelemetryKeys}
              />
          ))}
          <div style={{marginTop: 8, display: "flex", justifyContent: "space-between"}}>
            {!(allowSingleTelemetry || allowOnlyDeviceName) && (
                <Button
                    icon="plus"
                    onClick={() => {
                      const newDataSources = [...dataSources, {}]
                      setDataSources(newDataSources)
                    }}
                >
                  Add
                </Button>
            )}
            {/*<Button icon="check" onClick={() => handleSubmitWidget(curWidgetType)}>*/}
            {/*  Save*/}
            {/*</Button>*/}
          </div>
        </>
    )
  }

  const handleSubmitWidget = (item) => {
    confirm({
      title: "Are you sure to add new widget?",
      centered: true,

      okText: "Yes",
      okButtonProps: {
        ...styleButton,
        icon: "check",
      },
      async onOk() {
        const curWidgets = get(openedDashboard, "dashboard.configuration.widgets", [])

        const positions = []
        curWidgets.forEach((w) => {
          positions.push({
            y: w.y,
            h: w.h,
          })
        })

        const maxPosY = maxBy(positions, "y")
        const newPosition = {
          x: 0,
          y: maxPosY ? maxPosY.y + maxPosY.h : 0,
        }

        const itemDescriptor = JSON.parse(item.descriptor)
        delete telemetryKeys["null"]

        const dataSourceSettings = {
          minRange: props.form.getFieldValue("minRange"),
          maxRange: props.form.getFieldValue("maxRange"),
          unit: props.form.getFieldValue("unit")
        }

        const newWidget = {
          typeAlias: item.alias,
          x: newPosition.x,
          y: newPosition.y,
          w: itemDescriptor.sizeX,
          h: itemDescriptor.sizeY,
          dataSources: telemetryKeys,
          settings: {
            ...settings,
            ...dataSourceSettings,
            getMethod: props.form.getFieldValue("getMethod"),
            setMethod: props.form.getFieldValue("setMethod"),
            rpcRequestInterval: props.form.getFieldValue("rpcRequestInterval")
          }
        }

        const newWidgets = [...curWidgets, newWidget]
        const data = {
          dashboardId: get(openedDashboard, "dashboard.id"),
          widgets: newWidgets,
        }
        try {
          dispatch(saveChangesDashboard(data))
          setDataSources([{}])
          setSettings({})
          setTelemetryKeys({})
        } catch (e) {
          message.error(e.response.data.message)
          return
        }
        message.success("Add widget successfully")
        setIsCreateDatasource(false)
        handleOpenAddWidgetModal(false)
        setIsShowWidgetTypes(false)
        triggerShouldReload()
      },

      cancelButtonProps: styleButton,
      onCancel() {
      },
    })
  }

  return (
      <Modal
          title={
            isShowWidgetTypes ? (
                <div>
                  <a onClick={() => setIsShowWidgetTypes(false)}>
                    <Icon type="left"/>
                  </a>
                  <span className="m-l-10">{curWidgetsBundle.title}: Select widget type</span>
                </div>
            ) : (
                "Select widgets bundle"
            )
          }
          visible={openAddWidgetModal}
          onCancel={() => handleOpenAddWidgetModal(false)}
          bodyStyle={{
            backgroundColor: "whitesmoke",
            height: 800,
            overflow: "scroll",
          }}
          centered={true}
          width={1000}
          footer={null}
          closable={false}
          destroyOnClose={true}
      >
        {isCreateDatasource ? (
            <Modal
                title={
                  <div>
                    <a
                        onClick={() => {
                          setIsCreateDatasource(false)
                          setIsShowWidgetTypes(true)
                          setDataSources([{}])
                        }}
                    >
                      <Icon type="left"/>
                    </a>
                    <span className="m-l-10">Add widget: {curWidgetType.name}</span>
                  </div>
                }
                visible={isCreateDatasource}
                onCancel={() => {
                  setIsCreateDatasource(false)
                  setDataSources([{}])
                }}
                bodyStyle={{
                  backgroundColor: "whitesmoke",
                  height: 800,
                  overflow: "scroll",
                }}
                centered={true}
                width={1000}
                // footer={null}
                destroyOnClose={true}
                onOk={() => handleSubmitWidget(curWidgetType)}
            >
              <Form {...formItemLayout} layout='horizontal'>
                {
                  curWidgetType.bundleAlias === constants.DEFAULT_WIDGETS_BUNDLE.CONTROL_WIDGETS
                      ? <CreateSettings form={props.form} setSettings={setSettings}/>
                      : renderCreateDatasource()
                }
              </Form>
            </Modal>
        ) : isShowWidgetTypes ? (
            <List
                key={"widget_types"}
                grid={{
                  column: 2,
                  gutter: 16,
                }}
                dataSource={dataWidgets}
                renderItem={(item) => (
                    <List.Item>
                      <Card hoverable onClick={() => handleChooseWidgetType(item)}>
                        <List.Item.Meta
                            avatar={
                              <Avatar shape="square" size={128}
                                      src={require(`../../../public/widgets/${item.alias}.png`)}/>
                            }
                            title={<a>{item.name}</a>}
                            description={item.description}
                        />
                      </Card>
                    </List.Item>
                )}
            />
        ) : (
            <List
                key={"widgets_bundles"}
                grid={{
                  column: 2,
                  gutter: 16,
                }}
                dataSource={dataBundles}
                renderItem={(item) => (
                    <List.Item>
                      <Card hoverable onClick={() => handleChooseBundle(item)}>
                        <List.Item.Meta
                            avatar={
                              <Avatar
                                  shape="square"
                                  size={128}
                                  src={require(`../../../public/widgets-bundles/${item.alias}.png`)}
                              />
                            }
                            title={<a>{item.title}</a>}
                            description={item.description}
                        />
                      </Card>
                    </List.Item>
                )}
            />
        )}
      </Modal>
  )
}

export default Form.create({name: "create_widget_form"})(AddWidgetModal)
