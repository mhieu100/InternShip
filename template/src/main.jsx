import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ConfigProvider } from "antd";
import vi_VN from 'antd/es/locale/vi_VN';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider locale={vi_VN}>
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
