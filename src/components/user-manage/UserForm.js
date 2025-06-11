import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
const UserForm = forwardRef(({ regionList, roleList,onFinish,initialValues  }, ref) => {
  const [form] = Form.useForm();
const[isDisabled,setisDisabled]=useState(false)
  // 暴露重置表单方法给父组件
  useImperativeHandle(ref, () => ({
    resetFields: () => form.resetFields(),
    form: form // 新增：暴露表单实例
  }));


 // 关键：当 initialValues 变化时，设置表单初始值
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        username: initialValues.username,
        password: '', // 密码通常不回显，保持空
        region: initialValues.region,
        roleId: initialValues.roleId
      });
    }
  }, [initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      name="user-form"
      onFinish={onFinish}
      requiredMark="optional"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled?[]:[{ required: true, message: '请选择区域' }]}
      >
        <Select placeholder="请选择区域" disabled={isDisabled}>
          {regionList.map(item => (
            <Select.Option key={item.id} value={item.value}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select 
        placeholder="请选择角色"
        onChange={(value)=>{
                    // console.log(value)
                    if(value === "1"){
                        setisDisabled(true)
                        form.setFieldValue({
                            region:""
                        })
                    }else{
                        setisDisabled(false)
                    }
                }}>

          {roleList.map(item => (
            <Select.Option key={item.id} value={item.id}>
              {item.roleName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;