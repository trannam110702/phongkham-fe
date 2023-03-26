import React, { useState, useEffect, useRef } from "react";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space, Modal } from "antd";
import {
  ExclamationCircleFilled,
  SearchOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getAllMedicine } from "../../api/medicine";
import { getAllMedico } from "../../api/medico";
import { getAllPatient } from "../../api/patient";
import { getAllService } from "../../api/service";
import { addExam, deleteExam, getAllExam, updateExam } from "../../api/exam";
import ReceiptsWrapper from "./styled";
import logo from "../../assets/imgs/logo.svg";
const Receipts = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSourceRoot, setDataSourceRoot] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [medico, setMedico] = useState([]);
  const [patient, setPatient] = useState([]);
  const [service, setService] = useState([]);
  const [record, setRecord] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [sum, setSum] = useState();
  const [mediSum, setMediSum] = useState();
  const searchInput = useRef(null);
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
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
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
  useEffect(() => {
    const run = async () => {
      let res;
      setTableLoading(true);
      res = await getAllMedico();
      setMedico(res.data);
      res = await getAllMedicine();
      setMedicine(res.data);
      res = await getAllPatient();
      setPatient(res.data);
      res = await getAllService();
      setService(res.data);
      res = await getAllExam();
      setDataSourceRoot(res.data);
      setTableLoading(false);
    };
    run();
  }, []);
  useEffect(() => {
    const run = async () => {
      let res, resData;
      setTableLoading(true);
      res = await getAllExam();
      resData = res.data.map((item) => {
        return {
          ...item,
          key: item._id,
          medico: medico.find((me) => me._id === item.medico)?.name,
          patient: patient.find((me) => me._id === item.patient)?.name,
          service: service.find((me) => me._id === item.service)?.name,
        };
      });
      setDataSource(resData);
      setTableLoading(false);
    };
    run();
  }, [modal, medico, medicine, patient, service]);
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Nha sĩ",
      dataIndex: "medico",
      key: "medico",
      ...getColumnSearchProps("medico"),
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient",
      key: "patient",
      ...getColumnSearchProps("patient"),
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
      ...getColumnSearchProps("service"),
    },
    {
      title: "Ngày tạo ",
      dataIndex: "examDate",
      key: "examDate",
      ...getColumnSearchProps("examDate"),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
  ];
  const medicineColumn = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "num",
      key: "num",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (tex, record) => {
        let mul = record.price * record.num;
        return <>{mul}</>;
      },
    },
  ];
  return (
    <ReceiptsWrapper>
      <Modal
        open={modal}
        footer={null}
        width={800}
        onCancel={() => {
          setModal(false);
        }}
      >
        <div className="receipt" style={{ margin: "20px" }}>
          <div>
            <div
              className="logo"
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <img src={logo} alt="" />
              <h1>Phòng khám nha khoa VINPEC</h1>
            </div>
            <div style={{ textAlign: "center" }}>
              Địa chỉ: Stanford Phố vọng, 207 Giải Phóng, Đồng Tâm, Hai Bà
              Trưng, Hà Nội <br /> SĐT: +84327086066
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "24px",
              margin: "50px 0 0 0",
              fontWeight: "500",
            }}
          >
            HÓA ĐƠN THANH TOÁN
          </div>
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Mã hóa đơn: {record._id}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "16px",
            }}
          >
            <div>
              <b>Khách hàng: </b>
              {patient.find((pati) => pati._id === record.patient)?.name}
              <br />
              <b>Địa chỉ: </b>
              {patient.find((pati) => pati._id === record.patient)?.address}
              <br />
              <b>CCCD: </b>
              {patient.find((pati) => pati._id === record.patient)?.cccd}
            </div>
            <div>
              <b>Dịch vụ: </b>
              {service.find((ser) => ser._id === record.service)?.name}
              <br />
              <b>Giá: </b>
              {service.find((ser) => ser._id === record.service)?.price} đồng
            </div>
          </div>
          <b
            style={{
              display: "block",
              margin: "20px 0 0 0",
              fontSize: "16px",
            }}
          >
            Đơn thuốc
          </b>
          <Table
            columns={medicineColumn}
            pagination={false}
            dataSource={record.medicine}
            summary={(pageData) => {
              let sum = 0;
              pageData.forEach((medi) => (sum += medi.price * medi.num));
              setMediSum(sum);
            }}
          ></Table>
          <div style={{ margin: "20px 0", textAlign: "right" }}>
            <b style={{ display: "block" }}>Tổng tiền thuốc: {mediSum} đồng</b>
            <b style={{ display: "block" }}>
              Tổng tiền thanh toán:{" "}
              {mediSum +
                service.find((ser) => ser._id === record.service)?.price}{" "}
              đồng
            </b>
          </div>
          <div style={{ margin: "20px 0", textAlign: "right" }}>
            <b style={{ display: "block" }}>
              Ngày thanh toán: {record.examDate}
            </b>
          </div>
          <div
            style={{
              margin: "20px 0",
              display: "flex",
              paddingBottom: "100px",
            }}
          >
            <b style={{ display: "block", width: "50%", textAlign: "center" }}>
              Người thu tiền <br /> <i>(kí ghi họ tên)</i>
            </b>
            <b style={{ display: "block", width: "50%", textAlign: "center" }}>
              Khách hàng <br /> <i>(kí ghi họ tên)</i>
            </b>
          </div>
        </div>
      </Modal>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={tableLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              let rec = dataSourceRoot.find((item) => {
                return item._id === record._id;
              });
              rec.medicine = rec.medicine.map((medi) => {
                let mediInfo = medicine.find((me) => {
                  return me._id === medi.medi;
                });
                return {
                  ...medi,
                  name: mediInfo.name,
                  price: mediInfo.price,
                  key: mediInfo._id,
                };
              });
              console.log(rec);
              setRecord(rec);
              setModal(true);
            },
          };
        }}
      ></Table>
    </ReceiptsWrapper>
  );
};

export default Receipts;
