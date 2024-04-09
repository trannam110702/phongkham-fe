import React, { useEffect, useState, useContext, useRef } from "react";
import Highlighter from "react-highlight-words";
import { Row, Col, Table, Form, Input, Button, Modal, Space, Tag } from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import InforWrapper, { Buttons } from "./styled";
import { getAllPeople, addPeople, deletePeople, updatePeople } from "../../api/people";
import { Store } from "../../store/store";
const { confirm } = Modal;
const Infor = () => {
  const { showNotification } = useContext(Store);
  let { type } = useParams();
  let typeName;
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
  useEffect(() => {
    const run = async () => {
      let res, resData;
      setTableLoading(true);
      res = await getAllPeople(type);
      resData = res.data.map((item) => {
        return { ...item, key: item._id };
      });
      setDataSource(resData);
      setTableLoading(false);
    };
    run();
  }, [type, modal]);
  const reloadTable = async () => {
    const res = await getAllPeople(type);
    let resData = res.data.map((item) => {
      return { ...item, key: item._id };
    });
    setDataSource(resData);
    setTableLoading(false);
  };
  const showDeleteConfirm = (rec) => {
    const onOk = async () => {
      const res = await deletePeople(rec);
      showNotification({ message: "Xóa thành công", type: "info" });
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
  switch (type) {
    case "patient":
      typeName = "Bệnh nhân";
      break;
    case "medico":
      typeName = "Nha sĩ";
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
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số CCCD/CMND",
      dataIndex: "cccd",
      key: "cccd",
      ...getColumnSearchProps("cccd"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
      ...getColumnSearchProps("phonenumber"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
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
              form.setFieldsValue(record);
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
    <InforWrapper>
      <Row gutter={16} style={{ height: "100%" }}>
        <Modal
          footer={null}
          open={modal}
          width={600}
          title={`Thông tin ${typeName}`}
          onCancel={() => {
            setModal(false);
            form.resetFields();
            setRecord(null);
          }}
          onOk={() => {}}
        >
          <Col className="info" span={24}>
            <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} labelAlign={"left"}>
              <Form.Item
                name="name"
                label={`Tên ${typeName}`}
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
                name="cccd"
                label={`Căn cước công dân`}
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
                name="email"
                label={`Email`}
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
                name="address"
                label={`Địa chỉ`}
                rules={[
                  {
                    required: true,
                    message: "Cần nhập trường này",
                  },
                ]}
              >
                <Input />
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
                          return updatePeople({
                            ...record,
                            ...values,
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
                          return addPeople({ ...values, type });
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
    </InforWrapper>
  );
};

export default Infor;
