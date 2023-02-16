import {Col, Row} from "antd";
import React from "react";
import ExTableCard from "../example-widgets/cards/ExTableCard";

const Cards = (props) => {
  return (
      <>
        <Row gutter={8}>
          <Col span={24}>
            <ExTableCard />
          </Col>
        </Row>
      </>
  );
};

export default Cards;