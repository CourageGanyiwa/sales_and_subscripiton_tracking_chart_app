import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DashBoard from "./components/Dashboard";
import Header from "./Header";
import { useActionState } from "react";

function App() {
  return (
    <>
      <Header />
      <DashBoard />
    </>
  );
}

export default App;
