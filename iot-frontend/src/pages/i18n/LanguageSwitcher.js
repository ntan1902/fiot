import * as React from 'react';
import {Link} from 'react-router-dom';

import Layouts from '../../components/layout/Layouts';

import {
  Button,
  Calendar,
  Card,
  DatePicker,
  LocaleProvider,
  Modal,
  Pagination,
  Popconfirm,
  Radio,
  Select,
  Table,
  TimePicker,
  Transfer,
} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('en');

const {Option} = Select;
const {RangePicker} = DatePicker;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        filters: [
            {
                text: 'filter1',
                value: 'filter1',
            },
        ],
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
];

class Page extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({visible: true});
    };

    hideModal = () => {
        this.setState({visible: false});
    };

    render() {
        const info = () => {
            Modal.info({
                title: 'some info',
                content: 'some info',
            });
        };
        const confirm = () => {
            Modal.confirm({
                title: 'some info',
                content: 'some info',
            });
        };
        return (
            <div className="locale-components">
                <div className="m-b-15">
                    <Pagination defaultCurrent={1} total={50} showSizeChanger/>
                </div>
                <div className="m-b-15">
                    <Select
                        showSearch
                        style={{width: 200}}
                        className="m-r-15 m-t-5 m-b-5"
                    >
                        <Option value="jack">jack</Option>
                        <Option value="lucy">lucy</Option>
                    </Select>
                    <DatePicker className="m-r-15 m-t-5 m-b-5"/>
                    <TimePicker className="m-r-15 m-t-5 m-b-5"/>
                    <RangePicker style={{width: 200}}/>
                </div>
                <div className="m-b-15">
                    <Button
                        type="primary"
                        onClick={this.showModal}
                        className="m-r-15 m-t-5 m-b-5"
                    >
                        Show Modal
                    </Button>
                    <Button onClick={info} className="m-r-15 m-t-5 m-b-5">
                        Show info
                    </Button>
                    <Button onClick={confirm} className="m-r-15 m-t-5 m-b-5">
                        Show confirm
                    </Button>
                    <Popconfirm title="Question?">
                        <Link to="#">Click to confirm</Link>
                    </Popconfirm>
                </div>
                <div className="m-b-15">
                    <Transfer
                        dataSource={[]}
                        showSearch
                        targetKeys={[]}
                        render={item => item.title}
                    />
                </div>
                <div style={{overflow: 'scroll'}}>
                    <div
                        style={{
                            width: 319,
                            border: '1px solid #d9d9d9',
                            borderRadius: 4
                        }}
                    >
                        <Calendar fullscreen={false} value={moment()}/>
                    </div>
                </div>
                <div className="m-b-15">
                    <Table dataSource={[]} columns={columns}/>
                </div>
                <Modal
                    title="Locale Modal"
                    visible={this.state.visible}
                    onCancel={this.hideModal}
                >
                    <p>Locale Modal</p>
                </Modal>
            </div>
        );
    }
}

class LanguageSwitcher extends React.Component {
    constructor() {
        super();
        this.state = {
            locale: null,
        };
    }

    changeLocale = e => {
        const localeValue = e.target.value;
        this.setState({locale: localeValue});
        if (!localeValue) {
            moment.locale('en');
        } else {
            moment.locale('zh-cn');
        }
    };

    render() {
        const {locale} = this.state;
        return (
            <Layouts title="assets" classname="calendar">

                <Card bordered={false} bodyStyle={{padding: '10px 20px'}}>

                    <div>
                        <div className="m-b-30">
                            <span style={{marginRight: 16}}>
                                Change locale of components:{' '}
                            </span>
                            <Radio.Group
                                defaultValue={undefined}
                                onChange={this.changeLocale}
                            >
                                <Radio.Button key="en" value={undefined}>
                                    English
                                </Radio.Button>
                                <Radio.Button key="cn" value={zhCN}>
                                    中文
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                        <LocaleProvider locale={locale}>
                            <Page
                                key={
                                    locale
                                        ? locale.locale
                                        : 'en' /* Have to refresh for production environment */
                                }
                            />
                        </LocaleProvider>
                    </div>
                </Card>
            </Layouts>
        );
    }
}

export default LanguageSwitcher;
