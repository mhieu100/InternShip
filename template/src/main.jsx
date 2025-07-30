import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ConfigProvider } from "antd";
import vi_VN from 'antd/es/locale/vi_VN';

const theme = {
  token: {
    colorPrimary: '#3b82f6',
    borderRadius: 6,
  },
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider theme={theme} locale={vi_VN}>
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
