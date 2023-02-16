import {useSelector} from "react-redux";
import moment from "moment";
import {Table, Tag} from "antd";
import React from "react";

const colorSeverity = {
    "CRITICAL": "red",
    "MAJOR": "volcano",
    "MINOR": "orange",
    "WARNING": "gold",
    "INDETERMINATE": "#f50",
}

const valueSeverity = {
    "WARNING": 1,
    "MINOR": 2,
    "MAJOR": 3,
    "CRITICAL": 4,
    "INDETERMINATE": 5,
}

const DeviceAlarm = (props) => {
    const {dataSources} = props;
    const deviceId = dataSources && Object.keys(dataSources)
    const {alarms} = useSelector((state) => state.alarms);
    let dataArray = alarms[deviceId]?.map((alarm, index) => {
        return {
            key: index,
            createdAt: alarm.createdAt,
            name: alarm.name,
            severity: alarm.severity,
            detail: alarm.detail
        };
    });

    const columns = [
        {
            title: "Created time",
            dataIndex: "createdAt",
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.createdAt - b.createdAt,
            render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name - b.name
        },
        {
            title: "Severity",
            dataIndex: "severity",
            sorter: (a, b) => valueSeverity[a.severity] - valueSeverity[b.severity],
            render: severity => (
                <Tag color={colorSeverity[severity]} key={severity}>
                    {severity}
                </Tag>
            )
        },
        {
            title: "Detail",
            dataIndex: "detail",
        },

    ];

    return (
        <div style={{overflow: "scroll", height: "inherit"}} className="custom-table">
            <Table columns={columns} dataSource={dataArray}/>
        </div>
    );
};

export default DeviceAlarm;
