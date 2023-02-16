import React, {useState} from "react"
import {Button, Divider, Form, message, Popconfirm, Radio, Switch, Table, Tooltip, Checkbox} from "antd"
import SimulatorDeviceService from "../../services/simulatorDevice"
import InfoSimulatorDeviceModal from "./InfoSimulatorDeviceModal"
import {useDispatch, useSelector} from "react-redux"
import {removeSimulatorDevice} from "../../actions/simulatorDevices"
import moment from "moment"

const FormItem = Form.Item

const _title = () => "Here is title"
const _showHeader = true
const _footer = () => "Here is footer"
const _scroll = {y: 240}
const _pagination = {position: "bottom"}

const DeviceListTable = (props) => {
  const {simulatorDevices} = useSelector((state) => state.simulatorDevices)

  const [bordered, setBordered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(_pagination)
  const [size, setSize] = useState("small")
  const [title, setTitle] = useState(undefined)
  const [showHeader, setShowHeader] = useState(true)
  const [rowSelection, setRowSelection] = useState({})
  const [footer, setFooter] = useState(_footer)
  const [scroll, setScroll] = useState(undefined)
  const [hasData, setHasData] = useState(true)

  const [openInfoModal, setOpenInfoModal] = useState(false)
  const [curSimulatorDevice, setCurSimulatorDevice] = useState({})
  const dispatch = useDispatch()

  const stateData = {
    bordered,
    loading,
    pagination,
    size,
    showHeader,
    rowSelection,
    scroll,
    hasData,
  }

  const dataArray = simulatorDevices.map((device, index) => {
    return {
      key: index,
      id: device.id,
      createdAt: device.createdAt,
      deviceToken: device.deviceToken,
      dataSources: device.dataSources,
      requestInterval: device.requestInterval,
      isAlive: device.isAlive
    }
  })

  const columns = [
    {
      title: "Created time",
      dataIndex: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss")
      ,
    },
    {
      title: "Device Token",
      dataIndex: "deviceToken",
      key: "deviceToken",
      render: (text) => text,
    },
    {
      title: "Data Sources",
      dataIndex: "dataSources",
      key: "dataSources",
      render: (text) => {
        const dataSourceKeys = JSON.parse(text).map((e) => e.key)
        let dataSourceKeyList = ""
        dataSourceKeys.forEach((key) => {
          return dataSourceKeyList += ", " + key
        })
        return (
          dataSourceKeyList.slice(1, dataSourceKeyList.length)
        )
      },
    },
    {
      title: "Request Interval",
      dataIndex: "requestInterval",
      key: "requestInterval",
      render: (text) => text,
    },
    {
      title: "Is Alive",
      dataIndex: "isAlive",
      key: "isAlive",
      render: (value) => (
        <Checkbox disabled={true} checked={value}></Checkbox>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setCurSimulatorDevice(record)
                setOpenInfoModal(true)
              }}
              type="primary"
              shape="circle"
              icon="edit"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure to delete device?"
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="danger" shape="circle" icon="delete" />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    },
  ]

  const handleToggle = (prop) => (enable) => {
    if (prop === "bordered") {
      setBordered(enable)
    }
    if (prop === "loading") {
      setLoading(enable)
    }
  }

  const handleSizeChange = (e) => {
    setSize(e.target.value)
  }

  const handleTitleChange = (enable) => {
    setTitle(enable ? _title : undefined)
  }

  const handleHeaderChange = (enable) => {
    setShowHeader(enable ? _showHeader : false)
  }

  const handleFooterChange = (enable) => {
    setFooter(enable ? _footer : undefined)
  }

  const handleRowSelectionChange = (enable) => {
    setRowSelection(enable ? {} : undefined)
  }

  const handleScrollChange = (enable) => {
    setScroll(enable ? _scroll : undefined)
  }

  const handleDataChange = (enable) => {
    setHasData(enable)
  }

  const handlePaginationChange = (e) => {
    const {value} = e.target
    setPagination(value === "none" ? false : {position: value})
  }

  const confirmDelete = async (id) => {
    try {
      await SimulatorDeviceService.remove(id)
      dispatch(removeSimulatorDevice(id))
    } catch (e) {
      message.error(e.response.data.message)
      return
    }
    message.success("Delete device successfully!")
  }

  return (
    <div>
      {openInfoModal && (
        <InfoSimulatorDeviceModal
          curSimulatorDevice={curSimulatorDevice}
          openInfoModal={openInfoModal}
          setOpenInfoModal={setOpenInfoModal}
        />
      )}

      <div className="m-b-15">
        <Form layout="inline">
          <FormItem label="Bordered">
            <Switch checked={bordered} onChange={handleToggle("bordered")} size="small" />
          </FormItem>
          <FormItem label="loading">
            <Switch checked={loading} onChange={handleToggle("loading")} size="small" />
          </FormItem>
          <FormItem label="Title">
            <Switch checked={!!title} onChange={handleTitleChange} size="small" />
          </FormItem>
          <FormItem label="Column Header">
            <Switch checked={!!showHeader} onChange={handleHeaderChange} size="small" />
          </FormItem>
          <FormItem label="Footer">
            <Switch checked={!!footer} onChange={handleFooterChange} size="small" />
          </FormItem>
          <FormItem label="Checkbox">
            <Switch checked={!!rowSelection} onChange={handleRowSelectionChange} size="small" />
          </FormItem>
          <FormItem label="Fixed Header">
            <Switch checked={!!scroll} onChange={handleScrollChange} size="small" />
          </FormItem>
          <FormItem label="Has Data">
            <Switch checked={!!hasData} onChange={handleDataChange} size="small" />
          </FormItem>
          <FormItem label="Size">
            <Radio.Group value={size} onChange={handleSizeChange} size="small">
              <Radio.Button value="default" size="small">
                Default
              </Radio.Button>
              <Radio.Button value="middle" size="small">
                Middle
              </Radio.Button>
              <Radio.Button value="small" size="small">
                Small
              </Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem label="Pagination" className="custom-float">
            <Radio.Group
              value={pagination ? pagination.position : "none"}
              onChange={handlePaginationChange}
              size="small"
            >
              <Radio.Button value="top" size="small">
                Top
              </Radio.Button>
              <Radio.Button value="bottom" size="small">
                Bottom
              </Radio.Button>
              <Radio.Button value="both" size="small">
                Both
              </Radio.Button>
              <Radio.Button value="none" size="small">
                None
              </Radio.Button>
            </Radio.Group>
          </FormItem>
        </Form>
      </div>
      <div className="custom-table">
        <Table {...stateData} columns={columns} dataSource={hasData ? dataArray : null} scroll={{x: 768}} />
      </div>
    </div>
  )
}

export default DeviceListTable
