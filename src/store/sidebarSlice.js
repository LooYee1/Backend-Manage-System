import {createSlice} from '@reduxjs/toolkit'
import { Collapse } from 'antd'


const getInitialState = ()=>{
    try{
        const storedState = localStorage.getItem('sidebarState')
        return storedState?JSON.parse(storedState):{collapsed:false}
    }catch(error){
        console.error("读取本地存储失败,使用默认状态",error);
        return {collapsed:false}
        
    }
}

const initialState = getInitialState();


const sidebarSlice = createSlice({
    name:'sidebar',
    initialState,
    reducers:{
        toggleCollapsed:(state)=>{
            state.collapsed = !state.collapsed
        }
    }
})


export const {toggleCollapsed} =sidebarSlice.actions
// 导出切片 reducer（用于配置 store）
export default sidebarSlice.reducer;