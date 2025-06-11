import React, { useState }  from "react";
import { useEffect } from "react";
import {  Layout, Menu } from 'antd';
import { useSelector } from 'react-redux'; // 引入 Redux 状态选择器

import {
  
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import './index.css'


import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';



export default function SideMenu(props ){

  // 从 Redux Store 中获取侧边栏折叠状态（state.sidebar 对应 store 中的注册名称）
  const collapsed = useSelector((state) => state.sidebar.collapsed);

  const { Sider  } = Layout;



  const[menu,setMenu]=useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      
      
      setMenu(res.data)
    })
  },[])

  

  const tokenData = JSON.parse(localStorage.getItem("token")) || {};
  const rawRights = tokenData.role?.rights || {}; 
  // 关键：如果 rights 是对象，取 checked 数组；如果是数组，直接使用；否则默认空数组
  const rights = Array.isArray(rawRights) 
    ? rawRights 
    : rawRights.checked || []; 



  const checkPagePermisson=(item)=>{
    return item.pagepermisson===1 && rights.includes(item.key);
  };

  const location = useLocation();

  // 原代码中的 selectKeys 和 openKeys 改为使用 location.pathname
  const selectKeys = [location.pathname];
  const openKeys = ["/" + location.pathname.split("/")[1]];
  const navigate=useNavigate()

  const renderMenu = (menuData) => {
    // 递归过滤：保留有权限且子项至少有一个有权限的菜单项
    return menuData
      .filter(item => {
        // 过滤无权限的项
        if (!checkPagePermisson(item)) return false;
        
        // 递归过滤子项，并检查是否有有效子项
        if (item.children && item.children.length > 0) {
          const validChildren = renderMenu(item.children); // 递归处理子项
          return validChildren.length > 0; // 子项有效才保留父项
        }
        
        // 无后代但自身有权限，保留
        return true;
      })
      .map((item) => {
        const iconMap = {
          "/home": <UserOutlined />,
          "/user-manage": <VideoCameraOutlined />,
          "/right-manage": <UploadOutlined />, // 修正key匹配（原代码可能笔误）
        };
        
        const validChildren = item.children ? renderMenu(item.children) : undefined;
        const finalChildren = validChildren?.length > 0 ? validChildren : undefined;
        return {
          key: item.key,
          icon:  iconMap[item.key], // 使用item.icon或默认图标
          label:  item.title, 
          children: finalChildren, // 仅保留有效子项
          onClick: () => {
            if (!finalChildren) { // 无有效子项时跳转
              navigate(item.key);
            }
          },
        };
      });
  };
    return (

      
        <Sider trigger={null} collapsible 
        collapsed={collapsed}
        style={
          {
          
            overflow: 'auto',   
          
          }
        }
        >
   
        <div className="logo" >
          <span>全球新闻发布</span>
          <span>后台管理系统</span>
        </div>
        <div style={{flex:1}}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectKeys}
          defaultOpenKeys={openKeys}
          items={renderMenu(menu)}
          
        />
       
      </div>

      </Sider>
        
    )
}

