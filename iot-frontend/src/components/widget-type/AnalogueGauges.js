import React from "react";
import ExRadialGauge from "../example-widgets/analogue-gauges/ExRadialGauge";
import ExLinearGauge from "../example-widgets/analogue-gauges/ExLinearGauge";
import {Col, Row} from "antd";

const AnalogueGauges = (props) => {
  return (
    <>
      <Row gutter={8}>
        <Col span={16}>
          <ExLinearGauge />
        </Col>
        <Col span={8}>
          <ExRadialGauge />
        </Col>
      </Row>
    </>
  );
};

export default AnalogueGauges;
