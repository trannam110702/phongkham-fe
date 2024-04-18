import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Tooltip, Col, FloatButton, Modal, Flex, DatePicker } from "antd";
import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Store } from "../../store/store";

import background from "../../assets/imgs/background.jpg";
import NgocMinhBuilding from "../../assets/imgs/homedental.jpg";
import logo from "../../assets/imgs/logo.png";
import LoginWrrapper from "./style";
import { createSchedule } from "../../api/schedule";
import { login } from "../../api/login";

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const { showNotification } = useContext(Store);
  const navigate = useNavigate();
  const onFinish = async ({ username, password }) => {
    try {
      setLoading(true);
      const res = await login({ username, password });
      for (let key in res.data) {
        const data = res.data[key];
        window.localStorage.setItem(key, JSON.stringify(data));
      }
      navigate("/");
      showNotification({ type: "success", message: "Login successful" });
    } catch (error) {
      showNotification({
        type: "error",
        message: error?.response?.data || JSON.stringify(error) || "Login fail",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrrapper style={{ backgroundImage: `url(${background})` }}>
      <div className="modal">
        <div className="main">
          <img src={NgocMinhBuilding} alt="hongkong" className="sideimg"></img>
          <Form
            layout="vertical"
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className="title">
              <img src={logo} alt="logo" />
              Đăng nhập
            </div>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        footer={null}
        open={modal}
        width={600}
        title={`Đặt lịch khám`}
        onCancel={() => {
          setModal(false);
        }}
        onOk={() => {}}
      >
        <Col className="info" span={24}>
          <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign={"left"}>
            <Form.Item
              name="name"
              label={`Họ và tên`}
              rules={[
                {
                  required: true,
                  message: "Cần nhập trường này",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phonenumber"
              label={`Số điện thoại`}
              rules={[
                {
                  required: true,
                  message: "Cần nhập trường này",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="examDate"
              label={`Ngày khám`}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              rules={[
                {
                  required: true,
                  message: "Cần nhập trường này",
                },
              ]}
            >
              <DatePicker
                style={{
                  width: "100%",
                }}
                placeholder="Chọn ngày"
              />
            </Form.Item>
            <Flex justify="end" gap="middle">
              <Button
                onClick={() => {
                  setModal(false);
                }}
              >
                Hủy
              </Button>
              <Button
                loading={addLoading}
                type="primary"
                onClick={() => {
                  setAddLoading(true);
                  form
                    .validateFields()
                    .then((values) => {
                      return createSchedule({
                        ...values,
                        examDate: values.examDate.format("YYYY-MM-DD"),
                      });
                    })
                    .then(() => {
                      showNotification({
                        message: "Đặt lịch khám thành công",
                        type: "success",
                      });
                    })
                    .catch((e) => {
                      showNotification({
                        message: "Đặt thất bại",
                        type: "error",
                      });
                    })
                    .finally(() => {
                      setAddLoading(false);
                    });
                }}
              >
                Đặt lịch khám
              </Button>
            </Flex>
          </Form>
        </Col>
      </Modal>
      <Tooltip title="Đăng ký lịch khám ngay" trigger="click" defaultOpen>
        <FloatButton
          onClick={() => setModal(true)}
          type="primary"
          shape="circle"
          style={{ right: 70, width: 80, height: 80 }}
          icon={<CustomerServiceOutlined />}
        />
      </Tooltip>
    </LoginWrrapper>
  );
};

export default LoginPage;
