import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice'; // 引入侧边栏 reducer

// 配置全局 store
export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer, // 将侧边栏状态注册到 store 中
  },
});

let isSaving = false;
store.subscribe(() => {
  if (!isSaving) {
    isSaving = true;
    setTimeout(() => {
      const currentState = store.getState().sidebar;
      localStorage.setItem('sidebarState', JSON.stringify(currentState));
      isSaving = false;
    }, 100); // 延迟 100ms 写入，避免高频操作
  }
});