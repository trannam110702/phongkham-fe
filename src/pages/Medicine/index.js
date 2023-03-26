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
  Modal,
  Space,
  DatePicker,
  InputNumber,
} from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import MedicineWrapper, { Buttons } from "./styled";
import {
  getAllMedicine,
  addMedicine,
  deleteMedicine,
  updateMedicine,
} from "../../api/medicine";

import { Store } from "../../store/store";

const { confirm } = Modal;
const Infor = () => {
  const { showNotification } = useContext(Store);
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
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
      let res, resData;
      setTableLoading(true);
      res = await getAllMedicine();
      resData = res.data.map((item) => {
        return { ...item, key: item._id };
      });
      setDataSource(resData);
      setTableLoading(false);
    };
    run();
  }, [modal]);

  const reloadTable = async () => {
    const res = await getAllMedicine();
    let resData = res.data.map((item) => {
      return { ...item, key: item._id };
    });
    setDataSource(resData);
    setTableLoading(false);
  };
  const showDeleteConfirm = (rec) => {
    const onOk = async () => {
      const res = await deleteMedicine(rec);
      showNotification({ message: res.statusText, type: "info" });
      reloadTable();
    };
    const onCancel = () => {
      reloadTable();
    };
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
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mã thuốc",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Nguồn gốc",
      dataIndex: "origin",
      key: "origin",
      ...getColumnSearchProps("origin"),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "dueDate",
      key: "dueDate",
      ...getColumnSearchProps("dueDate"),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      ...getColumnSearchProps("unit"),
    },
    {
      title: "Đơn giá (VND)",
      dataIndex: "price",
      key: "price",
      ...getColumnSearchProps("price"),
      render: (text) => {
        return `${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            onClick={() => {
              showDeleteConfirm(record);
            }}
            type="primary"
            danger
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              form.setFieldsValue({ ...record, dueDate: dayjs() });
              setRecord(record);
              setModal(true);
            }}
            type="primary"
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <MedicineWrapper>
      <Row gutter={16} style={{ height: "100%" }}>
        <Modal
          footer={null}
          open={modal}
          width={600}
          title={`Thông tin thuốc`}
          onCancel={() => {
            setModal(false);
            form.resetFields();
            setRecord(null);
          }}
          onOk={() => {}}
        >
          <Col className="info" span={24}>
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign={"left"}
            >
              <Form.Item
                name="name"
                label={`Tên thuốc`}
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
                label={`Mã thuốc`}
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
                name="origin"
                label={`Nguồn gốc`}
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
                name="dueDate"
                label={`Hạn sử dụng`}
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
              <Form.Item
                name="unit"
                label={`Đơn vị`}
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
                label={`Đơn giá`}
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
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Buttons>
                {record ? (
                  <Button
                    type="primary"
                    loading={addLoading}
                    onClick={() => {
                      setAddLoading(true);
                      form
                        .validateFields()
                        .then((values) => {
                          return updateMedicine({
                            ...values,
                            _id: record._id,
                            dueDate: values.dueDate.format("DD/MM/YYYY"),
                          });
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
                          setAddLoading(false);
                        });
                    }}
                  >
                    Sửa
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    loading={addLoading}
                    onClick={() => {
                      setAddLoading(true);
                      form
                        .validateFields()
                        .then((values) => {
                          return addMedicine({
                            ...values,
                            dueDate: values.dueDate.format("DD/MM/YYYY"),
                          });
                        })
                        .then((value) => {
                          showNotification({
                            message: "Thêm thành công",
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
                          setAddLoading(false);
                        });
                    }}
                  >
                    Thêm
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setModal(false);
                  }}
                >
                  Hủy
                </Button>
              </Buttons>
            </Form>
          </Col>
        </Modal>

        <Col span={24}>
          <div style={{ marginBottom: 12, height: 32 }}>
            <Button
              onClick={() => {
                form.resetFields();
                setModal(true);
              }}
            >
              Thêm
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            loading={tableLoading}
          ></Table>
        </Col>
      </Row>
    </MedicineWrapper>
  );
};

export default Infor;
