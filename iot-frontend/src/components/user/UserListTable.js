import React, {useState} from "react"
import {Button, Divider, Form, message, Radio, Switch, Table, Tooltip, Tag} from "antd"
import {useSelector} from "react-redux"
import moment from "moment"
import {get} from "lodash"

const FormItem = Form.Item

const _title = () => "Here is title"
const _showHeader = true
const _footer = () => "Here is footer"
const _scroll = {y: 240}
const _pagination = {position: "bottom"}

const colorUsers = {
  TENANT: "green",
  CUSTOMER: "blue",
}

const UserListTable = (props) => {
  const {users} = useSelector((state) => state.users)

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

  const dataArray = users.map((user, index) => {
    return {
      key: index,
      id: user.id,
      createdAt: user.createdAt,
      email: user.email,
      roles: get(user, "extraInfo.roles", []),
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role(s)",
      dataIndex: "roles",
      render: (roles) => (
        <>
          {roles.map((role) => {
            return (
              <Tag color={colorUsers[role]} key={role}>
                {role}
              </Tag>
            )
          })}
        </>
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

  return (
    <div>
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

export default UserListTable
