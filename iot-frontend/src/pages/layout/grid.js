import * as React from 'react';
import Layouts from '../../components/layout/Layouts';
import {Card, Col, Row} from 'antd';
import BasicGrid from '../../components/grid/BasicGrid';
import ColumnOffset from '../../components/grid/ColumnOffset';
import GridGutter from '../../components/grid/GridGutter';
import FlexLayout from '../../components/grid/FlexLayout';
import FlexAlignment from '../../components/grid/FlexAlignment';

class Grid extends React.Component {
    render() {
        return (
            <Layouts title="assets" classname="grid">
                <Row gutter={16}>
                    <Col xs={24} lg={10}>

                        <Card
                            bordered={false}
                            title={<p>Basic Grid</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                        >
                            <BasicGrid/>
                        </Card>
                        <Card
                            bordered={false}
                            title={<p>Grid Gutter</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                            className="m-t-15"
                        >
                            <GridGutter/>
                        </Card>

                    </Col>

                    <Col xs={24} lg={14}>
                        <Card
                            bordered={false}
                            title={<p>Column Offset</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                        >
                            <ColumnOffset/>
                        </Card>

                        <Card
                            bordered={false}
                            title={<p>Flex Layout</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                            className="m-t-15"
                        >
                            <FlexLayout/>
                        </Card>

                    </Col>
                    <Col xs={24} sm={24} className="m-t-15">
                        <Card
                            bordered={false}
                            title={<p>Flex Alignment</p>}
                            bodyStyle={{padding: '0 20px 20px'}}
                        >
                            <FlexAlignment/>
                        </Card>
                    </Col>

                </Row>

            </Layouts>
        );
    }
}

export default Grid;
