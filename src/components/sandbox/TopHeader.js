import React from "react";
import { Button, Layout,  theme } from 'antd';
import { Dropdown, Space } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  
  } from '@ant-design/icons';
  import { Avatar } from 'antd';

import { UserOutlined } from '@ant-design/icons';

import {useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // 引入 Redux 派发器
import { toggleCollapsed } from '../../store/sidebarSlice'; // 引入折叠状态 action
import { useSelector } from "react-redux";

export default function TopHeader(){

  const token = localStorage.getItem("token");
  let roleName = '';
  let username = '';

  if (token) {
      const userData = JSON.parse(token);
      console.log('完整的token数据:',userData);
      
      roleName = userData.role?.roleName || '';
      username = userData.username || '';
  }

  const navigate=useNavigate()
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" >
          {roleName}
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" >
          切换账号 (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" >
          个人信息 (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label:(
        <div style={{ width: '100%', padding: '4px 16px' }}>退出</div>
      ),
      onClick: () => {
        console.log('退出操作，跳转到登录页');
        navigate('/login');
      },
      
    },
  ];
  const { Header } = Layout;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return '上午好';
    if (hour >= 12 && hour < 18) return '下午好';
    if (hour >= 18 && hour < 24) return '晚上好';
    return '凌晨好'; // 0-5点
  };

  const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const dispatch = useDispatch(); // 获取派发器实例，用于触发 action
// 获取当前折叠状态（可选：如果需要动态显示图标）
    const collapsed = useSelector((state) => state.sidebar.collapsed); // 可选，根据需求

    // 折叠按钮点击事件：触发 Redux action
  const handleToggle = () => {
    dispatch(toggleCollapsed()); // 派发 action，触发状态变更
  };

    // const [collapsed,setCollapsed] = useState(false)
    return (
        
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggle}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ float: "right", display: "flex", alignItems: "center", gap: "8px" }}>
  {/* 时间问候 + 角色 + 用户名 */}
  <span style={{ 
    fontSize: "14px", 
    color: "#595959", 
    fontWeight: 500 
  }}>
    {getGreeting()}，{roleName ? `${roleName} ` : ''}{username}
  </span>
  
  {/* 可选：添加状态图标（如在线状态） */}
  <span style={{ 
    width: "8px", 
    height: "8px", 
    borderRadius: "50%", 
    backgroundColor: "#52c41a", 
    boxShadow: "0 0 0 2px rgba(82,196,26,0.1)" 
  }} />
            <Dropdown menu={{ items }}>
           <a onClick={e => e.preventDefault()}>
             <Space>
             <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#3f51b5' }}/>
        <DownOutlined />
           </Space>
            </a>
           </Dropdown>
          </div>
        </Header>
      
    )
}