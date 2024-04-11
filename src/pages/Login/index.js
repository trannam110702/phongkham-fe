import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Store } from "../../store/store";

import background from "../../assets/imgs/background.jpg";
import NgocMinhBuilding from "../../assets/imgs/homedental.jpg";
import logo from "../../assets/imgs/logo.png";
import LoginWrrapper from "./style";
import { login } from "../../api/login";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
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
      showNotification({ type: "error", message: "Login fail" });
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
    </LoginWrrapper>
  );
};

export default LoginPage;
