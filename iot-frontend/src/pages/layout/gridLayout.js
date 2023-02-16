import * as React from 'react';
import Layouts from '../../components/layout/Layouts';
import {Card, Col, Row} from 'antd';
import BasicLayout from '../../components/grid/layout/BasicLayout';
import Slider from '../../components/grid/layout/Slider';
import CustomTrigger from '../../components/grid/layout/CustomTrigger';
import HeaderSlider from '../../components/grid/layout/HeaderSlider';

class Gridlayout extends React.Component {
    render() {
        return (
            <Layouts title="assets" classname="gridlayout">
                <Row gutter={16}>
                    <Col xs={24} lg={12}>

                        <Card
                            bordered={false}
                            title={<p>Basic Layout</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                        >
                            <BasicLayout/>
                        </Card>
                        <Card
                            bordered={false}
                            title={<p>Header Slider </p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                            className="m-t-15"
                        >
                            <HeaderSlider/>
                        </Card>

                    </Col>

                    <Col xs={24} lg={12}>
                        <Card
                            bordered={false}
                            title={<p>Slider</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                        >
                            <Slider/>
                        </Card>

                        <Card
                            bordered={false}
                            title={<p>Custom Trigger</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                            className="m-t-15"
                        >
                            <CustomTrigger/>
                        </Card>

                    </Col>

                </Row>

            </Layouts>
        );
    }
}

export default Gridlayout;
