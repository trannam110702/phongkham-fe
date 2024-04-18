import "./App.css";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import MainLayout from "./components/Layout/App";
import { ConfigProvider, theme } from "antd";
import { StateProvider } from "./store/store";

import ExamResquests from "./pages/ExamResquests";
import Services from "./pages/Services";
import Receipts from "./pages/Receipts";
import Schedule from "./pages/Schedule";
import Reports from "./pages/ServiceReport";
import RevenueReport from "./pages/RevenueReport";
import Result500 from "./pages/Result500";
import Infor from "./pages/Infor";
import Medicine from "./pages/Medicine";

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
        path: "schedule",
        element: <Schedule />,
      },
      {
        path: "reports/exam",
        element: <Reports />,
      },
      {
        path: "reports/revenue",
        element: <RevenueReport />,
      },
      {
        path: "info/:type",
        element: <Infor />,
      },
      {
        path: "medicine",
        element: <Medicine />,
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
      <StateProvider>
        <RouterProvider router={router} />
      </StateProvider>
    </ConfigProvider>
  );
}

export default App;
