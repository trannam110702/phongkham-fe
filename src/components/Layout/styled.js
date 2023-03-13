import styled from "styled-components";
const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  .main-layout {
    width: 100%;
    height: 100%;
  }
  .header {
    display: flex;
    justify-content: center;
    .logo {
      display: flex;
      gap: 10px;
      img {
      }
      h1 {
        font-size: 24px;
        font-weight: 700;
        color: white;
      }
    }
  }
`;
export default LayoutWrapper;
