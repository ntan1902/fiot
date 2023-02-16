import * as React from 'react';
import Layouts from '../../components/layout/Layouts';
import {Card, Col, Row} from 'antd';
import BasicTable from '../../components/table/BasicTable';
import Selection from '../../components/table/Selection';
import Operation from '../../components/table/Operation';
import Filter from '../../components/table/Filter';

class Table extends React.Component {
    render() {
        return (
            <Layouts title="assets" classname="grid">
                <Row gutter={16}>
                    <Col xs={24} sm={24}>
                        <Card
                            bordered={false}
                            title={<p>Basic Table </p>}
                            bodyStyle={{padding: '0 20px 5px'}}
                        >
                            <BasicTable/>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12} className="m-t-15">
                        <Card
                            bordered={false}
                            title={<p>Table with Selection</p>}
                            bodyStyle={{padding: '0 20px 5px'}}
                        >
                            <Selection/>
                        </Card>
                        <Card
                            bordered={false}
                            title={<p>Filter and Sorter</p>}
                            bodyStyle={{padding: '0 20px 5px'}}
                            className="m-t-15"
                        >
                            <Filter/>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12} className="m-t-15">
                        <Card
                            bordered={false}
                            title={<p>Operational Table</p>}
                            bodyStyle={{padding: '0 20px 5px'}}
                        >
                            <Operation/>
                        </Card>
                    </Col>
                </Row>
            </Layouts>
        );
    }
}

export default Table;
