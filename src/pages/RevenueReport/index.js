import React, { useEffect, useState, useContext, useRef } from "react";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import {
  Row,
  Col,
  Table,
  Form,
  Input,
  Button,
  Flex,
  Space,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import {
  ExclamationCircleFilled,
  SearchOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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

const { RangePicker } = DatePicker;
const Reports = () => {
  const searchInput = useRef(null);
  const { showNotification } = useContext(Store);
  const [data, setData] = useState([]);
  const [medicines, setMedicines] = useState(null);
  const [services, setServices] = useState(null);
  const [loading, setLoaing] = useState(true);
  const [searchParams, setSearchParams] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm  ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Ngày khám ",
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date"),
      render: (text, record) => {
        if (text) {
          return <>{dayjs(text).format("DD/MM/YYYY")}</>;
        } else {
          return <>{dayjs(record.month).format("MM/YYYY")}</>;
        }
      },
    },
    {
      title: "Doanh thu khám ",
      dataIndex: "service_revenue",
      key: "service_revenue",
      ...getColumnSearchProps("service_revenue"),
      render: (text) =>
        new Intl.NumberFormat("vi-US", { style: "currency", currency: "VND" }).format(text),
    },
    {
      title: "Doanh thu thuốc khám ",
      dataIndex: "medicine_revenue",
      key: "medicine_revenue",
      ...getColumnSearchProps("medicine_revenue"),
      render: (text) =>
        new Intl.NumberFormat("vi-US", { style: "currency", currency: "VND" }).format(text),
    },
  ];
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
          {/* <Flex vertical>
            <p>Chọn loại thuốc</p>
            <Select
              allowClear
              loading={!medicines}
              options={medicines?.map((item) => ({ value: item.code, label: item.name }))}
              onSelect={(val) => setSearchParams((prev) => ({ ...prev, medicineCode: val }))}
              onClear={() => setSearchParams((prev) => ({ ...prev, medicineCode: null }))}
            ></Select>
          </Flex> */}
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
      <Table columns={columns} dataSource={data} pagination={false} loading={loading}></Table>
    </ReportWrapper>
  );
};

export default Reports;
