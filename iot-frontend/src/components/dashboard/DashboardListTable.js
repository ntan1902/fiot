import React, {useState} from "react"
import {Button, Divider, Form, message, Popconfirm, Radio, Switch, Table, Tooltip} from "antd"
import DashboardService from "../../services/dashboard"
import InfoDashboardModal from "./InfoDashboardModal"
import {openDashboard, removeDashboard} from "../../actions/dashboards"
import {useDispatch, useSelector} from "react-redux"
import moment from "moment"
import {get} from "lodash"

const FormItem = Form.Item

const _title = () => "Here is title"
const _showHeader = true
const _footer = () => "Here is footer"
const _scroll = {y: 240}
const _pagination = {position: "bottom"}

const DashboardListTable = (props) => {
  const {dashboards} = useSelector((state) => state.dashboards)
  const {customers} = useSelector((state) => state.customers)
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles.includes("TENANT")

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
  const [selectedDashboard, setSelectedDashboard] = useState(null)

  const dispatch = useDispatch()

  const state = {
    bordered,
    loading,
    pagination,
    size,
    showHeader,
    rowSelection,
    scroll,
    hasData,
  }

  const dataArray = dashboards.map((dashboard, index) => {
    return {
      id: dashboard.id,
      key: index,
      createdAt: dashboard.createdAt,
      title: dashboard.title,
      description: dashboard.description,
      configuration: dashboard.configuration,
      dashboardCustomers: get(dashboard, "dashboardCustomers", []).map((c) => c.customerId),
    }
  })

  let customersData = {}
  customers.forEach((c) => {
    customersData[c.id] = c.email
  })

  let columns = [
    {
      title: "Created time",
      dataIndex: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a
          onClick={() => {
            setSelectedDashboard(record)
            setOpenInfoModal(true)
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Assigned Customers",
      dataIndex: "dashboardCustomers",
      key: "dashboardCustomers",
      render: (value) => {
        let customersList = ""
        value.forEach((id) => {
          return (customersList += ", " + customersData[id])
        })
        return customersList.slice(1, customersList.length)
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <Tooltip title="Open dashboard">
            <Button
              type="primary"
              shape="circle"
              icon="build"
              onClick={() => {
                setSelectedDashboard(record)
                dispatch(openDashboard({isOpen: true, dashboard: record}))
              }}
            />
          </Tooltip>

          <Divider type="vertical" />
          {isTenant && (
            <Popconfirm
              title="Are you sure to delete dashboard?"
              onConfirm={() => confirmDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button type="danger" shape="circle" icon="delete" />
              </Tooltip>
            </Popconfirm>
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

  const handleScollChange = (enable) => {
    setScroll(enable ? _scroll : undefined)
  }

  const handleDataChange = (hasData) => {
    setHasData(hasData)
  }

  const handlePaginationChange = (e) => {
    const {value} = e.target
    setPagination(value === "none" ? false : {position: value})
  }

  const confirmDelete = async (id) => {
    try {
      await DashboardService.remove(id)
      dispatch(removeDashboard(id))
    } catch (e) {
      if (e.response.data.message) {
        message.error(e.response.data.message)
        return
      }
    }
    message.success("Delete dashboard successfully!")
  }

  if (!isTenant) {
    columns = columns.filter((c) => c.key !== "dashboardCustomers")
  }

  return (
    <div>
      {openInfoModal && selectedDashboard && (
        <InfoDashboardModal
          dashboardId={selectedDashboard.id}
          openDashboardModal={openInfoModal}
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
            <Switch checked={!!scroll} onChange={handleScollChange} size="small" />
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
        <Table {...state} columns={columns} dataSource={hasData ? dataArray : null} scroll={{x: 768}} />
      </div>
    </div>
  )
}

export default DashboardListTable
