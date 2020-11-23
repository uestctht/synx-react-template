import React from "react";
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import App from "./App.js";
const HighApp = (
  <ConfigProvider locale={zhCN}>
    <HashRouter>
      <App></App>
    </HashRouter>
  </ConfigProvider>
);
render(HighApp, document.getElementById("root"));
