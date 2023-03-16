import styled from "styled-components";
const ServicesWrapper = styled.div`
  height: 100%;
  .content {
    height: calc(100% - 60px);
    overflow-y: scroll;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, auto));
    gap: 12px;
  }
  .taskbar-row {
    margin-bottom: 24px;
    justify-content: end;
    .add-btn {
      float: right;
    }
  }
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
`;
export const FormWrapper = styled.div`
  padding: 20px;
  .footer {
    display: flex;
    gap: 10px;
    justify-content: end;
  }
`;
export default ServicesWrapper;
