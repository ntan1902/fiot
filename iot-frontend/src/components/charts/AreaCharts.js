import * as React from 'react';
import {Area, AreaChart, CartesianGrid, Tooltip} from 'recharts';

const data = [
    {
        name: 'Page A',
        uv: 400,
        pv: 2400,
        amt: 500,
    },
    {
        name: 'Page B',
        uv: 800,
        pv: 1398,
        amt: 800,
    },
    {
        name: 'Page C',
        uv: 2200,
        pv: 1500,
        amt: 1200,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
    {
        name: 'Page F',
        uv: 800,
        pv: 1398,
        amt: 800,
    },
    {
        name: 'Page G',
        uv: 400,
        pv: 2400,
        amt: 500,
    },
    {
        name: 'Page H',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
];

class AreaCharts extends React.Component {
    render() {
        return (
            <AreaChart
                width={200}
                height={300}
                data={data}
                syncId="anyId"
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>

                <Tooltip/>
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d"/>
            </AreaChart>
        );
    }
}

export default AreaCharts;
