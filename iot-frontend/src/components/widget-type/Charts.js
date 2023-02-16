import React from "react";
import ExBarChart from "../example-widgets/charts/ExBarChart";
import ExLineChart from "../example-widgets/charts/ExLineChart";
import ExPieChart from "../example-widgets/charts/ExPieChart";
import {Card, Col, Row} from "antd";

const Charts = () => {
  const StyledCard = (props) => (
    <Card {...props} bodyStyle={{ height: "300px" }}>
      {props.children}
    </Card>
  );
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <StyledCard title="Timeseries Bar Chart">
            <ExBarChart />
          </StyledCard>
        </Col>
        <Col span={8}>
          <StyledCard title="Timeserires Line Chart">
            <ExLineChart />
          </StyledCard>
        </Col>
        <Col span={8}>
          <StyledCard title="Pie Chart">
            <ExPieChart />
          </StyledCard>
        </Col>
      </Row>
    </>
  );
};

export default Charts;
