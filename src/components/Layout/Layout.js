import React, { useState } from "react";
import { Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { InfoCircleOutlined, DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import LayoutWrapper from "./styled";
import logo from "../../assets/imgs/logo.png";

const { Header, Sider, Content } = Layout;
const items = [
  {
    key: "1",
    label: "Thông tin tài khoản",
    onClick: () => {},
  },
  {
    key: "2",
    label: "Đăng xuất",
    onClick: () => {
      localStorage.removeItem("username");
      window.location.reload();
    },
  },
];
const MainLayout = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // if (!window.localStorage.getItem("username")) return <Login />;
  return (
    <LayoutWrapper>
      <Layout className="main-layout">
        <Header className="header">
          <div className="logo">
            <img src={logo} alt="" />
            <h1>Home Dental</h1>
          </div>
          <Dropdown
            menu={{
              items,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Tài khoản
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Layout className="site-layout">
          <Sider width={250} style={{ background: colorBgContainer, overflow: "auto" }}>
            <Menu
              mode="inline"
              defaultOpenKeys={["exam-management", "healing-management", "reports", "info"]}
              items={[
                {
                  key: "info",
                  label: "Cập nhật thông tin",
                  icon: <InfoCircleOutlined />,
                  children: [
                    {
                      key: "info-patient",
                      label: <Link to={"/info/patient"}>Bệnh nhân</Link>,
                    },
                    {
                      key: "info-doctor",
                      label: <Link to={"/info/doctor"}>Nha sĩ</Link>,
                    },
                    {
                      key: "info-staff",
                      label: <Link to={"/info/staff"}>Nhân viên</Link>,
                    },
                    {
                      key: "medicine",
                      label: <Link to={"/medicine"}>Thuốc</Link>,
                    },
                  ],
                },
                {
                  key: "exam-management",
                  label: "Khám bệnh",
                  icon: <InfoCircleOutlined />,
                  children: [
                    {
                      key: "examrequests",
                      label: <Link to={"/examrequests"}>Phiếu khám</Link>,
                    },
                    {
                      key: "services",
                      label: <Link to={"/services"}>Gói khám</Link>,
                    },
                    {
                      key: "receipts",
                      label: <Link to={"/receipts"}>Hóa đơn</Link>,
                    },
                  ],
                },
                {
                  key: "reports",
                  label: "Báo cáo",
                  children: [
                    {
                      key: "reports-exam",
                      label: <Link to={"/reports/exam"}>Báo cáo khám bệnh</Link>,
                    },
                    {
                      key: "reports-revenue",
                      label: <Link to={"/reports/revenue"}>Báo cáo doanh thu</Link>,
                    },
                  ],
                },
              ]}
            />
          </Sider>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "white",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </LayoutWrapper>
  );
};
export default MainLayout;
