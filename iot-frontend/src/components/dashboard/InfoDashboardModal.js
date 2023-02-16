import React, {useEffect, useState} from "react"
import {Button, Form, Input, message, Modal, TreeSelect} from "antd"
import DashboardService from "../../services/dashboard"
import {find, get} from "lodash"
import {useDispatch, useSelector} from "react-redux"
import {openDashboard, updateDashboard} from "../../actions/dashboards"

const InfoDashboardModal = (props) => {
  const {openDashboardModal, dashboardId, setOpenInfoModal} = props
  const [dashboardInfo, setDashboardInfo] = useState({})
  const [isInfoChanged, setIsInfoChanged] = useState(false)
  const [assignedCustomers, setAssignedCustomers] = useState([])

  const dispatch = useDispatch()
  const {dashboards} = useSelector((state) => state.dashboards)
  const {customers} = useSelector((state) => state.customers)
  const {user} = useSelector((state) => state.auth)

  const userRoles = user && user.authorities.map((auth) => auth.authority)
  const isTenant = userRoles.includes("TENANT")

  useEffect(() => {
    const loadDashboard = async () => {
      if (dashboardId) {
        const dashboard = find(dashboards, {id: dashboardId})

        const assignedCustomerIds = get(dashboard, "dashboardCustomers", []).map((c) => c.customerId)
        setAssignedCustomers(assignedCustomerIds)
        setDashboardInfo(dashboard)
      }
    }
    loadDashboard()
  }, [])

  const {getFieldDecorator} = props.form
  const {confirm} = Modal
  const styleButton = {
    style: {borderRadius: "5px"},
    size: "large",
  }

  const customersData = customers.map((c, idx) => {
    return {
      title: c.email,
      value: c.id,
      key: idx,
    }
  })

  const handleUpdateDashboardSubmit = async (e) => {
    e.preventDefault()
    confirm({
      title: "Are you sure to save Dashboard information?",
      centered: true,

      okText: "Yes",
      okButtonProps: {
        ...styleButton,
        icon: "check",
      },
      onOk() {
        props.form.validateFields(["title", "description"], async (err, values) => {
          if (!err) {
            console.log("Received values of form: ", values)
            try {
              const {title, description} = values
              const requestBody = {
                title,
                description,
                assignedCustomers,
              }
              const updatedDashboard = await DashboardService.update(dashboardId, requestBody)

              updatedDashboard.dashboardCustomers = assignedCustomers.map((c) => {
                return {
                  customerId: c,
                }
              })
              dispatch(updateDashboard(updatedDashboard))
            } catch (e) {
              message.error(e.response.data.message)
              return
            }
            message.success("Update dashboard successfully!")
            setOpenInfoModal(false)
          }
        })
      },

      cancelButtonProps: styleButton,
      onCancel() {},
    })
  }

  const handleInfoChange = (e) => {
    const values = props.form.getFieldsValue()
    if (values.title !== dashboardInfo.title || values.description !== dashboardInfo.description) {
      setIsInfoChanged(true)
    } else {
      setIsInfoChanged(false)
    }
  }

  const onAssignCustomer = (value) => {
    setIsInfoChanged(true)
    setAssignedCustomers(value)
  }

  const customerTreeProps = {
    treeData: customersData,
    value: assignedCustomers,
    onChange: onAssignCustomer,
    searchPlaceholder: "Assign customer to this device",
    style: {
      width: "100%",
    },
    dropdownStyle: {maxHeight: 220, overflow: "auto"},
    allowClear: true,
    multiple: true,
    size: "large",
  }

  return (
    <Modal
      title={<h2>Dashboard Information</h2>}
      visible={openDashboardModal}
      onOk={handleUpdateDashboardSubmit}
      okText="Save"
      onCancel={() => setOpenInfoModal(false)}
      cancelButtonProps={styleButton}
      centered={true}
      okButtonProps={{disabled: !isInfoChanged, ...styleButton}}
      destroyOnClose={true}
      footer={isTenant ? undefined : null}
    >
      <div>
        <Button type="primary" onClick={() => dispatch(openDashboard({isOpen: true, dashboard: dashboardInfo}))}>
          Open dashboard
        </Button>
      </div>
      <br />
      <Form className="info_dashboard_form" layout="vertical" onChange={handleInfoChange}>
        <Form.Item label="Title">
          {getFieldDecorator("title", {
            rules: [
              {
                required: true,
                message: "Please input your title!",
                whitespace: true,
              },
            ],
            initialValue: dashboardInfo.title,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator("description", {
            rules: [
              {
                whitespace: true,
              },
            ],
            initialValue: dashboardInfo.description,
          })(<Input />)}
        </Form.Item>
        {isTenant && (
          <Form.Item label="Assigned Customers">
            <TreeSelect {...customerTreeProps} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default Form.create({name: "info_dashboard_form"})(InfoDashboardModal)
