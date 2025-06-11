// src/App.js（修改后）

import { ConfigProvider } from 'antd'; // 确保已导入 ConfigProvider
import IndexRouter from './router/IndexRouter';
function App() {
  return (
    
      <ConfigProvider>
        <IndexRouter />
      </ConfigProvider>
    
  );
}

export default App;