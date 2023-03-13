import React from "react";
import { Row, Col, Table } from "antd";
import { useParams } from "react-router-dom";
const Infor = () => {
  let { type } = useParams();
  let typeName;
  switch (type) {
    case "patient":
      typeName = "Bệnh nhân";
      break;
    case "medico":
      typeName = "Y sĩ";
      break;
    default:
      typeName = "";
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số CCCD/CMND",
      dataIndex: "cccd",
      key: "cccd",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
  ];
  return (
    <Row gutter={16}>
      <Col flex="500px">Thông tin {typeName}</Col>
      <Col flex="auto">
        <Table columns={columns}></Table>
      </Col>
    </Row>
  );
};

export default Infor;
