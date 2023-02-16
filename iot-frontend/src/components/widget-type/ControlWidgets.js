import {Col, Row} from "antd";
import React, {useState} from "react";
import ExSwitchSelector from "../example-widgets/control_widgets/ExSwitchSelector";
import ExDeviceLedIndicator from "../example-widgets/control_widgets/ExDeviceLedIndicator";

const ControlWidgets = (props) => {
  const [isOn, setIsOn] = useState(true)
  return (
      <>
        <Row gutter={16}>
          <Col span={12}>
            <ExSwitchSelector setIsOn={setIsOn}/>
          </Col>
          <Col span={12}>
            <ExDeviceLedIndicator isOn={isOn}/>
          </Col>
        </Row>
      </>
  );
};

export default ControlWidgets;