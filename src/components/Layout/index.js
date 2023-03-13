import { Button, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import LayoutWrapper from "./styled";
import { InfoCircleOutlined } from "@ant-design/icons";
import logo from "../../assets/imgs/logo.svg";
const { Header, Sider, Content } = Layout;
const MainLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <LayoutWrapper>
      <Layout className="main-layout">
        <Header className="header">
          <div className="logo">
            <img src={logo} alt="" />
            <h1>VINPEC</h1>
          </div>
        </Header>
        <Layout className="site-layout">
          <Sider
            width={250}
            style={{ background: colorBgContainer, overflow: "auto" }}
          >
            <Menu
              mode="inline"
              defaultOpenKeys={[
                "exam-management",
                "healing-management",
                "reports",
                "info",
              ]}
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
                      key: "info-medico",
                      label: <Link to={"/info/medico"}>Y sĩ</Link>,
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
                      label: <Link to={"/examrequests"}>Phiếu yêu cầu</Link>,
                    },
                    {
                      key: "services",
                      label: <Link to={"/services"}>Gói khám</Link>,
                    },
                  ],
                },
                {
                  key: "healing-management",
                  label: "Chữa bệnh",
                  children: [
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
                      label: (
                        <Link to={"/reports/exam"}>Báo cáo khám bệnh</Link>
                      ),
                    },
                    {
                      key: "reports-healing",
                      label: (
                        <Link to={"/reports/healing"}>Báo cáo chữa bệnh</Link>
                      ),
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
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </LayoutWrapper>
  );
};
export default MainLayout;
