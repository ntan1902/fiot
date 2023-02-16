import React, {useState} from "react"
import {Button, Divider, Form, message, Popconfirm, Radio, Switch, Table, Tooltip, Checkbox} from "antd"
import DeviceService from "../../services/device"
import InfoDeviceModal from "./InfoDeviceModal"
import ManageCredentials from "../device-credentials/ManageCredentials"
import {useDispatch, useSelector} from "react-redux"
import {removeDevice} from "../../actions/devices"
import moment from "moment"

const FormItem = Form.Item

const _title = () => "Here is title"
const _showHeader = true
const _footer = () => "Here is footer"
const _scroll = {y: 240}
const _pagination = {position: "bottom"}

const DeviceListTable = (props) => {
  const {devices} = useSelector((state) => state.devices)
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles && userRoles.includes("TENANT")

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
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const [openManageCredentialsModal, setOpenManageCredentialsModal] = useState(false)
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

  const dataArray = devices.map((device, index) => {
    return {
      key: index,
      id: device.id,
      createdAt: device.createdAt,
      name: device.name,
      label: device.label,
      isGateway: device.isGateway,
    }
  })

  const columns = [
    {
      title: "Created time",
      dataIndex: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text,
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      render: (text) => text,
    },
    {
      title: "Is Gateway",
      dataIndex: "isGateway",
      key: "isGateway",
      render: (value) => <Checkbox checked={value} disabled={true}></Checkbox>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          {isTenant && (
            <>
              <Tooltip title="Manage Credentials">
                <Button
                  onClick={() => {
                    setSelectedDeviceId(record.id)
                    setOpenManageCredentialsModal(true)
                  }}
                  type="primary"
                  shape="circle"
                  icon="safety-certificate"
                />
              </Tooltip>
              <Divider type="vertical" />
            </>
          )}
          <Tooltip title={isTenant ? "Edit" : "Information"}>
            <Button
              onClick={() => {
                setSelectedDeviceId(record.id)
                setOpenInfoModal(true)
              }}
              type="primary"
              shape="circle"
              icon={isTenant ? "edit" : "info"}
            />
          </Tooltip>
          {isTenant && (
            <>
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
            </>
          )}
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
      await DeviceService.remove(id)
      dispatch(removeDevice(id))
    } catch (e) {
      message.error(e.response.data.message)
      return
    }
    message.success("Delete device successfully!")
  }

  return (
    <div>
      {openInfoModal && (
        <InfoDeviceModal
          deviceId={selectedDeviceId}
          openInfoModal={openInfoModal}
          setOpenInfoModal={setOpenInfoModal}
        />
      )}
      {
        <ManageCredentials
          deviceId={selectedDeviceId}
          openManageCredentialsModal={openManageCredentialsModal}
          setOpenManageCredentialsModal={setOpenManageCredentialsModal}
        />
      }
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
