import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./routes/DashBoard.jsx";
import Signin from "./components/Signin.jsx";
import Header from "./components/Header.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
]);

export default router;
