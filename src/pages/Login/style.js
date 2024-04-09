import styled from "styled-components";
const LoginWrrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;

  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    margin: auto;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .main {
    display: flex;
    justify-content: center;
    .sideimg {
      border-radius: 20px 0 0 20px;
      max-width: 500px;
    }
  }
  form {
    min-width: 360px;
    background-color: white;
    border-radius: 0 20px 20px 0;
    padding: 36px;
    .title {
      font-size: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-bottom: 24px;
    }
    img {
      width: 150px;
    }
    button {
      width: 100%;
      margin-top: 1rem;
    }
  }
  @media only screen and (max-width: 900px) {
    .sideimg {
      display: none;
    }
    form {
      border-radius: 20px;
      min-width: 0px;
    }
  }
`;
export default LoginWrrapper;
