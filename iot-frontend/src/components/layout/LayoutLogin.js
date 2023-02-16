import React from 'react';
import {Layout} from 'antd';

class LayoutLogin extends React.Component {
    render() {
        return (
            <Layout>
                <div className={`${this.props.classname}`}>{this.props.children}</div>
            </Layout>

        );
    }
}

export default LayoutLogin;