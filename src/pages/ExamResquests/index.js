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
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import {
  ExclamationCircleFilled,
  SearchOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import MedicineWrapper, { Buttons } from "./styled";
import { getAllMedicine } from "../../api/medicine";
import { getAllMedico } from "../../api/medico";
import { getAllPatient } from "../../api/patient";
import { getAllService } from "../../api/service";
import { addExam, deleteExam, getAllExam, updateExam } from "../../api/exam";

import { Store } from "../../store/store";

const { confirm } = Modal;
const Infor = () => {
  const { Option } = Select;
  const { showNotification } = useContext(Store);
  const [form] = Form.useForm();
  const [dataSourceRoot, setDataSourceRoot] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [medico, setMedico] = useState([]);
  const [patient, setPatient] = useState([]);
  const [service, setService] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [recordState, setRecordState] = useState(null);
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
  const reloadTable = async () => {
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
  const showDeleteConfirm = (rec) => {
    const onOk = async () => {
      const res = await deleteExam(rec);
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
              let rec = {
                ...record,
                medico: dataSourceRoot.find((item) => item._id === record._id)
                  .medico,
                patient: dataSourceRoot.find((item) => item._id === record._id)
                  .patient,
                service: dataSourceRoot.find((item) => item._id === record._id)
                  .service,
              };
              console.log(rec);
              setRecordState({
                ...record,
                medico: dataSourceRoot.find((item) => item._id === record._id)
                  .medico,
                patient: dataSourceRoot.find((item) => item._id === record._id)
                  .patient,
                service: dataSourceRoot.find((item) => item._id === record._id)
                  .service,
              });
              form.setFieldsValue({ ...rec, examDate: dayjs() });
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
          width={800}
          title={`Phiếu khám`}
          onCancel={() => {
            setModal(false);
            form.resetFields();
            setRecordState(null);
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
                label="Nha sĩ"
                name="medico"
                rules={[{ required: true, message: "Cần chọn trường này" }]}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Select
                  placeholder="Chọn Nha sĩ"
                  showSearch
                  filterOption={(input, option) => {
                    return (option?.children.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    );
                  }}
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                >
                  {medico.map((me) => {
                    return (
                      <Option key={me._id} value={me._id}>
                        {`${me?.name} - ${me.cccd}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Bệnh nhân"
                name="patient"
                rules={[{ required: true, message: "Cần chọn trường này" }]}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Select
                  placeholder="Chọn Bệnh nhân"
                  showSearch
                  filterOption={(input, option) => {
                    return (option?.children.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    );
                  }}
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                >
                  {patient.map((pati) => {
                    return (
                      <Option key={pati._id} value={pati._id}>
                        {`${pati?.name} - ${pati.cccd}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Dịch vụ khám"
                name="service"
                rules={[{ required: true, message: "Cần chọn trường này" }]}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Select
                  placeholder="Chọn Dịch vụ khám"
                  showSearch
                  filterOption={(input, option) => {
                    return (option?.children.toLowerCase() ?? "").includes(
                      input.toLowerCase()
                    );
                  }}
                  filterSort={(optionA, optionB) =>
                    (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase())
                  }
                >
                  {service.map((ser) => {
                    return (
                      <Option key={ser._id} value={ser._id}>
                        {`${ser?.name} - ${ser.code}`}
                      </Option>
                    );
                  })}
                </Select>
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
              <Form.Item
                name="description"
                label="Chuẩn đoán"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Cần nhập trường này",
                  },
                ]}
              >
                <Input.TextArea
                  allowClear
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
              </Form.Item>
              <Form.List
                label="Đơn thuốc"
                name="medicine"
                rules={[{ required: true, message: "Cần chọn trường này" }]}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div
                        className="medi-list"
                        key={key}
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginBottom: 6,
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "medi"]}
                          label="Thuốc"
                          style={{ width: "400px", margin: "10px" }}
                          rules={[
                            { required: true, message: "Điền tên thuốc" },
                          ]}
                        >
                          <Select
                            placeholder="Chọn Đơn thuốc"
                            allowClear
                            showSearch
                            filterOption={(input, option) => {
                              return (
                                option?.children.toLowerCase() ?? ""
                              ).includes(input.toLowerCase());
                            }}
                            filterSort={(optionA, optionB) =>
                              (optionA?.children ?? "")
                                .toLowerCase()
                                .localeCompare(
                                  (optionB?.children ?? "").toLowerCase()
                                )
                            }
                          >
                            {medicine.map((me) => {
                              return (
                                <Option key={me._id} value={me._id}>
                                  {`${me?.name} - ${me.code}`}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "num"]}
                          style={{ width: "400px", margin: "10px" }}
                          label="Số lượng"
                          rules={[{ required: true, message: "Điền số lượng" }]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Điền số lượng"
                            min={1}
                          />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </div>
                    ))}
                    <Form.Item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        style={{ width: 500, marginTop: 24 }}
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm thuốc
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>
            <Buttons>
              {recordState ? (
                <Button
                  type="primary"
                  loading={addLoading}
                  onClick={() => {
                    setAddLoading(true);
                    form
                      .validateFields()
                      .then((values) => {
                        console.log(values);
                        return updateExam({
                          str: JSON.stringify({
                            ...values,
                            _id: recordState._id,
                            examDate: values.examDate.format("DD/MM/YYYY"),
                          }),
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
                        return addExam({
                          str: JSON.stringify({
                            ...values,
                            examDate: values.examDate.format("DD/MM/YYYY"),
                          }),
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
