import React from "react";
import {Table} from "antd";

const ExTableCard = (props) => {
  const dataArray = [
    {
      key: 0,
      entityName: "Thermometer-A",
      entityLabel: "Thermometer",
      temperature: 25
    },
    {
      key: 1,
      entityName: "Thermometer-B",
      entityLabel: "Thermometer",
      temperature: 25
    },
    {
      key: 2,
      entityName: "Thermometer-C",
      entityLabel: "Thermometer",
      temperature: 25
    },
    {
      key: 3,
      entityName: "Thermometer-D",
      entityLabel: "Thermometer",
      temperature: 25
    },
    {
      key: 4,
      entityName: "Thermometer-E",
      entityLabel: "Thermometer",
      temperature: 25
    },
  ]

  const columns = [
    {
      title: "Entity name",
      dataIndex: "entityName",
    },
    {
      title: "Entity label",
      dataIndex: "entityLabel",
    },
    {
      title: "Temperature",
      dataIndex: "temperature",
    },
  ];

  return (
      <Table
          columns={columns}
          dataSource={dataArray || null}
      />

  );
};

export default ExTableCard;
