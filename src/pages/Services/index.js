import React, { useEffect, useState, useContext } from "react";
import ServicesWrapper, { FormWrapper } from "./styled";
import ServiceCard from "../../components/ServiceCard";
import img from "../../assets/imgs/examcard.png";
import { Button, Col, Row, Modal, Form, Input, InputNumber, Spin } from "antd";
import { getAllService, addService } from "../../api/service";
import { Store } from "../../store/store";

const Services = () => {
  const [form] = Form.useForm();
  const { showNotification } = useContext(Store);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [allService, setallService] = useState([]);
  const [listClinic, setListClinic] = useState([]);
  useEffect(() => {
    setLoading(true);
    const run = async () => {
      const res = await getAllService();
      setallService(res.data);
      setLoading(false);
    };
    run();
  }, [addModal]);
  useEffect(() => {
    form.resetFields();
  }, [addModal]);
  const handleSubmit = async (value) => {};
  return (
    <ServicesWrapper>
      <Modal
        title="Thêm gói khám"
        open={addModal}
        width={900}
        onCancel={() => setAddModal(false)}
        footer={null}
      >
        <FormWrapper>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Tên gói khám"
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
              name="price"
              label="Giá gói khám"
              rules={[
                {
                  required: true,
                  message: "Cần nhập trường này",
                },
              ]}
            >
              <InputNumber
                min={0}
                prefix="VND"
                style={{
                  width: "100%",
                }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                {
                  required: true,
                  message: "Cần nhập trường này",
                },
              ]}
            >
              <Input.TextArea allowClear autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>
            <Form.Item noStyle>
              <div className="footer">
                <Button key="back" onClick={() => setAddModal(false)}>
                  Hủy
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading1}
                  onClick={() => {
                    form
                      .validateFields()
                      .then((values) => {
                        addService(values);
                      })
                      .then((value) => {
                        showNotification({
                          message: "Thành công",
                          type: "success",
                        });
                      })
                      .catch((e) => {
                        showNotification({
                          message: "Thất bại",
                          type: "error",
                        });
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  Thêm
                </Button>
              </div>
            </Form.Item>
          </Form>
        </FormWrapper>
      </Modal>
      <Spin spinning={loading}>
        <Row className="taskbar-row">
          <Col span={4}>
            <Button
              className="add-btn"
              type="primary"
              onClick={() => {
                setAddModal(true);
              }}
            >
              Thêm
            </Button>
          </Col>
        </Row>
        <Row className="content" gutter={[12, 12]}>
          {allService.map((pack) => {
            return (
              <ServiceCard
                img={img}
                key={pack._id}
                title={pack.name}
                price={pack.price}
                record={pack}
                setallService={setallService}
              />
            );
          })}
        </Row>
      </Spin>
    </ServicesWrapper>
  );
};

export default Services;
