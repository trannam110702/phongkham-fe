import React, { useState, useEffect, useRef, useContext } from "react";
import Highlighter from "react-highlight-words";
import printJS from "print-js";
import { Table, Input, Button, Space, Tag, Modal } from "antd";
import {
  ExclamationCircleFilled,
  SearchOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getAllSchedule, deleteSchedule, toggleSchedule } from "../../api/schedule";
import { Store } from "../../store/store";
import ReceiptsWrapper from "./styled";
import logo from "../../assets/imgs/logo.svg";
import dayjs from "dayjs";
const { confirm } = Modal;
const Receipts = () => {
  const { showNotification } = useContext(Store);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataSourceRoot, setDataSourceRoot] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

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
      let res;
      setTableLoading(true);
      res = await getAllSchedule();
      setDataSourceRoot(res.data);
      setTableLoading(false);
    };
    run();
  }, []);
  const showDeleteConfirm = (rec) => {
    const onOk = async () => {
      const res = await deleteSchedule(rec);
      showNotification({ message: res.statusText, type: "info" });
      setDataSourceRoot(dataSourceRoot.filter((item) => item.code !== rec.code));
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
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Người đặt lịch",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
      ...getColumnSearchProps("phonenumber"),
    },
    {
      title: "Ngày đặt lịch",
      dataIndex: "date",
      key: "date",
      render: (text) => <>{dayjs(text).format("DD/MM/YYYY")}</>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <>
          {text == "new" ? (
            <Tag color="success">Mới</Tag>
          ) : (
            <Tag color="processing">Đã lên lịch</Tag>
          )}
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            onClick={() => {
              showDeleteConfirm({ code: record.code });
            }}
            type="primary"
            danger
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              toggleSchedule({ code: record.code })
                .then(() => {
                  setDataSourceRoot(
                    dataSourceRoot.map((item) => {
                      if (item.code === record.code) {
                        return { ...item, status: "scheduled" };
                      }
                      return item;
                    })
                  );
                  showNotification({ message: "Chấp nhận lịch khám", type: "info" });
                })
                .catch(() => {
                  showNotification({ message: "Chấp nhận lịch khám thất bại", type: "error" });
                });
            }}
            type="primary"
          >
            Chấp nhận
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ReceiptsWrapper>
      <Table
        columns={columns}
        dataSource={dataSourceRoot}
        pagination={false}
        loading={tableLoading}
      ></Table>
    </ReceiptsWrapper>
  );
};

export default Receipts;
