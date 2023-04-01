import React, { useEffect, useState } from "react";
import { Progress, Space } from "antd";
import ReportWrapper from "./styled";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  LineChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { getAllExam } from "../../api/exam";
import { getMedicineById } from "../../api/medicine";
import { getServiceById } from "../../api/service";
const Reports = () => {
  const examsData = [
    { name: "1/4", medicine: 12000000, service: 5000000 },
    { name: "2/4", medicine: 8000000, service: 3000000 },
    { name: "3/4", medicine: 18000000, service: 20000000 },
    { name: "4/4", medicine: 16000000, service: 14000000 },
    { name: "5/4", medicine: 9000000, service: 2000000 },
    { name: "6/4", medicine: 17000000, service: 19000000 },
  ];
  const data = [
    { name: "1/4", patient: 12 },
    { name: "2/4", patient: 8 },
    { name: "3/4", patient: 18 },
    { name: "4/4", patient: 16 },
    { name: "5/4", patient: 9 },
    { name: "6/4", patient: 17 },
  ];
  const data2 = [
    {
      subject: "Lấy cao răng",
      A: 12,
      B: 11,
      fullMark: 15,
    },
    {
      subject: "Bọc sứ",
      A: 9,
      B: 13,
      fullMark: 15,
    },
    {
      subject: "Trồng răng",
      A: 8,
      B: 13,
      fullMark: 15,
    },
    {
      subject: "Niềng răng",
      A: 9,
      B: 10,
      fullMark: 15,
    },
    {
      subject: "Nhổ răng khôn",
      A: 8,
      B: 9,
      fullMark: 15,
    },
    {
      subject: "Làm trắng răng",
      A: 6,
      B: 8,
      fullMark: 15,
    },
  ];
  return (
    <ReportWrapper>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Doanh thu tháng 4</h3>
        <BarChart width={780} height={250} data={examsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={90} />
          <Tooltip />
          <Legend />
          <Bar dataKey="medicine" name="Doanh thu Thuốc" fill="#8884d8" />
          <Bar dataKey="service" name="Doanh thu Khám" fill="#82ca9d" />
        </BarChart>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Bệnh nhân tháng 4</h3>
        <LineChart width={780} height={250} data={data} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={90} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="patient"
            name="Bệnh nhân"
            stroke="#cf1322"
          />
        </LineChart>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Lịch sử dịch vụ</h3>
        <RadarChart outerRadius={90} width={730} height={250} data={data2}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 15]} />
          <Radar
            name="Lịch sử Khám Tháng 4"
            dataKey="B"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Radar
            name="Lịch sử Khám Tháng 3"
            dataKey="A"
            stroke="#ffc53d"
            fill="#ffc53d"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </div>
    </ReportWrapper>
  );
};

export default Reports;
