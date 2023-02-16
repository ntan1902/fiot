import React, {useState} from "react";
import {
  Button,
  Divider,
  Form,
  message,
  Popconfirm,
  Radio,
  Switch,
  Table,
  Tooltip,
} from "antd";
import TenantService from "../../services/tenant";
import InfoTenantModal from "./InfoTenantModal";
import {removeTenant} from "../../actions/tenants";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";

const FormItem = Form.Item;

const _title = () => "Here is title";
const _showHeader = true;
const _footer = () => "Here is footer";
const _scroll = { y: 240 };
const _pagination = { position: "bottom" };

const TenantListTable = (props) => {
  const { tenants } = useSelector((state) => state.tenants);

  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(_pagination);
  const [size, setSize] = useState("small");
  const [title, setTitle] = useState(undefined);
  const [showHeader, setShowHeader] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [footer, setFooter] = useState(_footer);
  const [scroll, setScroll] = useState(undefined);
  const [hasData, setHasData] = useState(true);

  const [openInfoModal, setOpenInfoModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(null);

  const dispatch = useDispatch();

  const state = {
    bordered,
    loading,
    pagination,
    size,
    showHeader,
    rowSelection,
    scroll,
    hasData,
  };

  const dataArray = tenants.map((tenant, index) => {
    return {
      key: index,
      id: tenant.id,
      createdAt: tenant.createdAt,
      title: tenant.title,
      email: tenant.email,
      country: tenant.country,
      phone: tenant.phone,
    };
  });

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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setSelectedTenantId(record.id);
                setOpenInfoModal(true);
              }}
              type="primary"
              shape="circle"
              icon="edit"
            />
          </Tooltip>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure to delete tenant?"
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
  ];

  const handleToggle = (prop) => (enable) => {
    if (prop === "bordered") {
      setBordered(enable);
    }
    if (prop === "loading") {
      setLoading(enable);
    }
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleTitleChange = (enable) => {
    setTitle(enable ? _title : undefined);
  };

  const handleHeaderChange = (enable) => {
    setShowHeader(enable ? _showHeader : false);
  };

  const handleFooterChange = (enable) => {
    setFooter(enable ? _footer : undefined);
  };

  const handleRowSelectionChange = (enable) => {
    setRowSelection(enable ? {} : undefined);
  };

  const handleScollChange = (enable) => {
    setScroll(enable ? _scroll : undefined);
  };

  const handleDataChange = (hasData) => {
    setHasData(hasData);
  };

  const handlePaginationChange = (e) => {
    const { value } = e.target;
    setPagination(value === "none" ? false : { position: value });
  };

  const confirmDelete = async (id) => {
    try {
      await TenantService.remove(id);
      dispatch(removeTenant(id))
    } catch (e) {
      message.error(e.response.data.message);
      return;
    }
    message.success("Delete tenant successfully!");
  };

  return (
    <div>
      {openInfoModal && (
        <InfoTenantModal
          tenantId={selectedTenantId}
          openTenantModal={openInfoModal}
          setOpenInfoModal={setOpenInfoModal}
        />
      )}
      <div className="m-b-15">
        <Form layout="inline">
          <FormItem label="Bordered">
            <Switch
              checked={bordered}
              onChange={handleToggle("bordered")}
              size="small"
            />
          </FormItem>
          <FormItem label="loading">
            <Switch
              checked={loading}
              onChange={handleToggle("loading")}
              size="small"
            />
          </FormItem>
          <FormItem label="Title">
            <Switch
              checked={!!title}
              onChange={handleTitleChange}
              size="small"
            />
          </FormItem>
          <FormItem label="Column Header">
            <Switch
              checked={!!showHeader}
              onChange={handleHeaderChange}
              size="small"
            />
          </FormItem>
          <FormItem label="Footer">
            <Switch
              checked={!!footer}
              onChange={handleFooterChange}
              size="small"
            />
          </FormItem>
          <FormItem label="Checkbox">
            <Switch
              checked={!!rowSelection}
              onChange={handleRowSelectionChange}
              size="small"
            />
          </FormItem>
          <FormItem label="Fixed Header">
            <Switch
              checked={!!scroll}
              onChange={handleScollChange}
              size="small"
            />
          </FormItem>
          <FormItem label="Has Data">
            <Switch
              checked={!!hasData}
              onChange={handleDataChange}
              size="small"
            />
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
        <Table
          {...state}
          columns={columns}
          dataSource={hasData ? dataArray : null}
          scroll={{ x: 768 }}
        />
      </div>
    </div>
  );
};

export default TenantListTable;
