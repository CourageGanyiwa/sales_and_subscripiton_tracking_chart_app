import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Dashboard from "./components/Dashboard";
import NewDashBoard from "./components/NewDashBoard";

function App() {
  return (
    <>
      {/* <Dashboard /> */}

      <NewDashBoard />
    </>
  );
}

export default App;
