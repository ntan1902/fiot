import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "16:05",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "16:06",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "16:07",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "16:08",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "16:09",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "16:10",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "16:11",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const ExBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#8884d8" />
        <Bar dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExBarChart;
