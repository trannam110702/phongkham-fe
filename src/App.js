import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/Layout";
import { ConfigProvider, theme } from "antd";

import ExamResquests from "./pages/ExamResquests";
import Services from "./pages/Services";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import Result500 from "./pages/Result500";
import Infor from "./pages/Infor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "examrequests",
        element: <ExamResquests />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "receipts",
        element: <Receipts />,
      },
      {
        path: "reports/:type",
        element: <Reports />,
      },
      {
        path: "info/:type",
        element: <Infor />,
      },
    ],
    errorElement: <Result500 />,
  },
]);
const customTheme = {
  token: {},
};
function App() {
  return (
    <ConfigProvider theme={customTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
