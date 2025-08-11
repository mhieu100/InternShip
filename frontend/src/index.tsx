import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import App from 'App'
import 'index.css'
import enUS from 'antd/locale/en_US'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)
const theme = {
  token: {
    colorPrimary: '#3b82f6',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif'
  }
}

root.render(
  <ConfigProvider theme={theme} locale={enUS}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
)
