import React, { useEffect, useState, useContext } from "react";
import { DatePicker, Space, Flex, Select, Button } from "antd";
import ReportWrapper from "./styled";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Rectangle,
  LineChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { getAllMedicine } from "../../api/medicine";
import { getAllService } from "../../api/service";
import { getReport } from "../../api/report";
import { Store } from "../../store/store";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const Reports = () => {
  const { showNotification } = useContext(Store);
  const [data, setData] = useState([]);
  const [medicines, setMedicines] = useState(null);
  const [services, setServices] = useState(null);
  const [loading, setLoaing] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  useEffect(() => {
    const run = async () => {
      getReport(searchParams).then((res) => {
        setData(res.data);
      });
      getAllMedicine().then((res) => {
        setMedicines(res.data);
      });
      getAllService().then((res) => {
        setServices(res.data);
      });
      setLoaing(false);
    };
    run();
  }, []);
  useEffect(() => {
    setData([]);
  }, [searchParams]);
  return (
    <ReportWrapper>
      <Flex gap="middle" align="center">
        <Flex gap="middle" align="center" style={{ flex: "1 1 auto" }}>
          <Flex vertical>
            <p>Chọn khoảng thời gian</p>
            <Space direction="vertical" size={12}>
              <RangePicker
                onCalendarChange={(val) => {
                  if (!val[0])
                    return setSearchParams((prev) => ({
                      ...prev,
                      fromDate: dayjs().format("YYYY-MM-DD"),
                      toDate: dayjs().format("YYYY-MM-DD"),
                    }));
                  setSearchParams((prev) => ({
                    ...prev,
                    fromDate: dayjs(val[0]).format("YYYY-MM-DD"),
                    toDate: dayjs(val[1]).format("YYYY-MM-DD"),
                  }));
                }}
              />
            </Space>
          </Flex>
          {/* <Flex vertical>
            <p>Chọn dịch vụ khám</p>
            <Select
              allowClear
              loading={!services}
              options={services?.map((item) => ({ value: item.code, label: item.name }))}
              onSelect={(val) => setSearchParams((prev) => ({ ...prev, serviceCode: val }))}
              onClear={() => setSearchParams((prev) => ({ ...prev, serviceCode: null }))}
            ></Select>
          </Flex> */}
          <Flex vertical>
            <p>Chọn loại thuốc</p>
            <Select
              allowClear
              loading={!medicines}
              options={medicines?.map((item) => ({ value: item.code, label: item.name }))}
              onSelect={(val) => setSearchParams((prev) => ({ ...prev, medicineCode: val }))}
              onClear={() => setSearchParams((prev) => ({ ...prev, medicineCode: null }))}
            ></Select>
          </Flex>
        </Flex>
        <Flex vertical>
          <Button
            type="primary"
            loading={loading}
            onClick={async () => {
              try {
                setLoaing(true);
                const res = await getReport(searchParams);
                setData(res.data);
                showNotification({
                  message: "Thành công",
                  type: "success",
                });
              } catch (error) {
                showNotification({
                  message: "Đã xảy ra lỗi",
                  type: "error",
                });
              } finally {
                setLoaing(false);
              }
            }}
          >
            <div style={{ minWidth: "100px" }}>Lọc</div>
          </Button>
        </Flex>
      </Flex>
      <br />
      <ResponsiveContainer width="100%" height="90%">
        {searchParams ? (
          <BarChart
            width={500}
            height={300}
            data={data.map((item) => ({
              ...item,
              name: item.month || dayjs(item.date).format("DD/MM"),
            }))}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              name={`Doanh thu dịch vụ khám`}
              dataKey="service_revenue"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              name={`Doanh thu bán thuốc ${
                medicines?.find((item) => item.code === searchParams.medicineCode)?.name || ""
              }`}
              dataKey="medicine_revenue"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "3rem",
              fontSize: "30px",
            }}
          >
            Vui lòng chọn lọc
          </div>
        )}
      </ResponsiveContainer>
    </ReportWrapper>
  );
};

export default Reports;
