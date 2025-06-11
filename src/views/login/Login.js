import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

export default function Login() {
  const navigate= useNavigate()
  const onFinish = values => {
    console.log('Success:', values);
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
      .then(res => {
        if (res.data.length === 0) {
          message.error('用户名或密码错误');
        } else {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          navigate('/')
        }
      });
  };

// 游客登录逻辑：直接跳转到新闻页
  const handleGuestLogin = () => {
    // 可选：清除可能存在的用户token（如果有）
    localStorage.removeItem("token");
    // 跳转到新闻页面（路由配置中的/news）
    navigate('/news')
  };
  
  return (
    <div className="login-background">
      <div className="formContainer">
        <div className="logintitle">用户登录</div>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className='login-btn'>
              立即登录
            </Button>
          </Form.Item>
        </Form>

        <Form.Item>
        <Button 
    type="danger"  
    htmlType="button" 
    block  // 占满父容器宽度
    size="large"  
    onClick={handleGuestLogin}
    style={{ 
      marginTop: '1px', 
      backgroundColor: '#7a5af8',  // 主标题下划线颜色
      borderColor: '#7a5af8', 
      color: 'white', 
      fontSize: '16px', 
      height: '44px', 
      borderRadius: '8px'
    }}
  >
    游客浏览
  </Button>
        </Form.Item>
      </div>
     
{/* 动态背景元素：地球 + NEWS碎片 */}
{/* 中心旋转地球 */}
<div className="background-globe"></div>

 {/* 动态背景：新闻碎片（可增减） */}
 {[...Array(30)].map((_, index) => (
    <div key={index} className={`news-fragment fragment-${index + 1}`} />
  ))}
    </div>
  );
}