import React, { useState, useContext } from "react";
import ServiceCardWrapper, { DesWrapper } from "./styled";
import { Card, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { updateService, deleteService } from "../../api/service";
import Building from "../../assets/imgs/Buildings.png";
import { Store } from "../../store/store";

const ServiceCard = ({ img, title, price, record, setallService }) => {
  const { showNotification } = useContext(Store);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [editModal, setEditModal] = useState(false);
  const showDeleteConfirm = (rec) => {
    const onOk = async () => {
      const res = await deleteService(rec);
      setallService((prev) => prev.filter((item) => item.code !== rec.code));
      showNotification({ message: res.statusText, type: "info" });
    };
    const onCancel = () => {};
    confirm({
      title: "Chắc chắn muốn xóa bản ghi này?",
      icon: <ExclamationCircleFilled />,
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk,
      onCancel,
    });
  };
  return (
    <ServiceCardWrapper>
      <Modal
        title="Sửa gói khám"
        open={editModal}
        width={900}
        onCancel={() => setEditModal(false)}
        footer={null}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
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
            name="code"
            label="Mã gói khám"
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
              defaultValue={1000000}
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
              <Button key="back" onClick={() => setEditModal(false)}>
                Hủy
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      return updateService({ ...values, _id: record._id });
                    })
                    .then((res) => {
                      showNotification({
                        message: res.statusText,
                        type: "info",
                      });
                    });
                }}
              >
                Sửa
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Card
        style={{ width: "100%" }}
        cover={<img src={img}></img>}
        actions={[
          <Button
            onClick={() => {
              showDeleteConfirm(record);
            }}
            type="primary"
            danger
          >
            Xóa
          </Button>,
          <Button
            onClick={() => {
              form.setFieldsValue(record);
              setEditModal(true);
            }}
            type="primary"
          >
            Sửa
          </Button>,
        ]}
      >
        <Card.Meta
          title={title}
          description={
            <DesWrapper>
              <img src={Building}></img>
              <span>{record.code}</span>
            </DesWrapper>
          }
        ></Card.Meta>
        <span className="price">Chi phí: {price} đồng</span>
      </Card>
    </ServiceCardWrapper>
  );
};

export default ServiceCard;
