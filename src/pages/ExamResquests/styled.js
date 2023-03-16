import styled from "styled-components";
const MedicineWrapper = styled.div`
  height: 100%;
  .info {
    padding: 12px;
    .title {
      text-align: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
  }
  .ant-col {
    height: 100%;
  }
  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table,
  .ant-table-container {
    height: calc(100% - 44px);
  }
  .ant-table-wrapper {
    overflow: auto;
  }
`;
export const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
export default MedicineWrapper;
