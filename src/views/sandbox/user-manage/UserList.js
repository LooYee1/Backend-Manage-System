import React, { useState, useEffect, useRef } from 'react'
import { Button, Form,Table, Modal, Input,Radio,Switch,Select, } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

const { confirm } = Modal

export default function UserList(){
    const [dataSource, setdataSource] = useState([])
    const { confirm } = Modal;
    const [regionList, setregionList] = useState([])
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState();
    const [open, setOpen] = useState(false);
    const {Option}=Select;
    const [roleList,setroleList]=useState([])
    const userFormRef = useRef(); // 用于操作UserForm的ref
    const [isUpdateOpen, setIsUpdateOpen] = useState(false); // 更新模态框显示状态
    const [selectedUser, setSelectedUser] = useState(null); // 当前选中的

    const {roleId,region}=JSON.parse(localStorage.getItem("token"))
    const userInfo = JSON.parse(localStorage.getItem("token")) || {};
    const currentRoleId = userInfo.role?.id; // 当前用户角色ID（如1:超级管理员，2:区域管理员，3:区域编辑）
    
    useEffect(()=>{
        axios.get("/regions").then(res=>{
            const list = res.data
            setregionList(list)
        })
    },[])

    useEffect(()=>{
        axios.get("/roles").then(res=>{
          const allRoles = res.data;
          // 根据当前用户角色过滤角色（仅保留区域管理员和编辑）
          const allowedRoles = 
            currentRoleId === 1 // 超级管理员可选所有角色
              ? allRoles 
              : allRoles.filter(role => [2, 3].includes(role.id)); // 区域管理员仅可选2/3
      
          setroleList(allowedRoles); // 更新角色列表为过滤后的值
        })
    },[currentRoleId])

    const onCreate = values => {
        console.log('Received values of form: ', values);
        setFormValues(values);
        setOpen(false);
      };
    useEffect(()=>{

      const roleObj={
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
      }
        axios.get("/users").then((userRes) => {
            // 再获取角色列表
            axios.get("/roles").then((roleRes) => {
              const roles = roleRes.data;
              // 为每个用户添加 role 对象（通过 roleId 匹配）
              const usersWithRole = userRes.data.map((user) => ({
                ...user,
                role: roles.find((role) => role.id === user.roleId),
              }));
              // 根据当前用户角色过滤用户列表
               const filteredUsers = 
              currentRoleId === 1 // 超级管理员显示所有用户
              ? usersWithRole 
               : usersWithRole.filter(user => [2, 3].includes(user.roleId)); // 区域管理员仅显示roleId=2/3

              setdataSource(filteredUsers);
            });
        })
    },[currentRoleId])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',

            filters:[
                ...regionList.map(item=>({
                    text:item.title,
                    value:item.value
                })),
                {
                    text:"全球",
                    value:"全球"
                }
            ],

            onFilter:(value,item)=>{
                if(value==="全球"){
                    return item.region===""
                }
                return item.region===value
            },

            render:(region)=>{
                return <b>{region===""?'全球':region}</b> 
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render:(role)=>{
                return role?.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: 'username',
            
        },
        {
            title: "用户状态",
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}> </Switch>
            }
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    
                    <Button danger shape="circle" icon={<DeleteOutlined />} 
                    onClick={()=>confirmMethod(item)}
                    disabled={item.default}
                    />
                  
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                    disabled={item.default}
                    onClick={()=> {
                        setSelectedUser(item); // 保存选中用户
                        setIsUpdateOpen(true); // 打开更新模态框
                    }}
                        />
                      
                </div>
            }
        }
        
    ];


    //用户状态改变
    const handleChange=(item)=>{
        console.log(item);
        item.roleState=!item.roleState
        setdataSource([...dataSource])

        //后端同步
        axios.patch(`/users/${item.id}`,{
            roleState:item.roleState
        })
    }

    //更新用户
    const handleUpdateFinish = async (values) => {
        try {
          // 发送更新请求（使用 PATCH 只更新修改的字段）
          const res = await axios.patch(`/users/${selectedUser.id}`, {
            ...values,
            region: values.roleId === '1' ? '全球' : values.region // 角色为1时区域设为全球
          });
      
          // 更新前端数据源
          setdataSource(dataSource.map(user => 
            user.id === res.data.id ? res.data : user
          ));
      
          setIsUpdateOpen(false); // 关闭模态框
          userFormRef.current.resetFields(); // 重置表单
        } catch (error) {
          console.log("更新失败:", error);
        }
      };



 // 表单提交回调
 const handleFormFinish = async (values) => {
    try {
      // 步骤1：获取当前所有用户的 id（可能是字符串或数字）
      const currentIds = dataSource.map(user => user.id);
      
      // 步骤2：提取其中的数字 id（过滤非数字，避免 NaN）
      const numericIds = currentIds.filter(id => !isNaN(Number(id))).map(Number);
      
      // 步骤3：计算最大数字 id（若没有数字 id，默认从 1000 开始）
      const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 1000;
      
      // 步骤4：生成新 id（maxId + 1）
      const newId = maxId + 1;
      
      // 步骤5：将新 id 合并到提交的数据中
      const newUser = { ...values, id: newId.toString(), roleState: true, default: false,region: values.roleId === '1' ? '全球' : values.region  };
      
      // 步骤6：提交到后端（JSON Server 会使用你传递的 id）
      const res = await axios.post("/users", newUser);
      
      // 步骤7：更新前端数据源（确保显示新 id）
      setdataSource([...dataSource, { ...res.data, role: roleList.find(r => r.id === res.data.roleId) }]);
      
      setOpen(false);
      userFormRef.current.resetFields(); // 重置表单
    } catch (error) {
      console.log("添加失败:", error);
    }
  };
    
//确认
    const confirmMethod=(item)=> { 
        confirm({
        title: '您确定要删除吗?',
        icon: <ExclamationCircleFilled />,
        
        onOk() {
          deleteMethod(item)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    const deleteMethod=(item)=>{
                // console.log(item)
        // 当前页面同步状态 + 后端同步
       setdataSource(dataSource.filter(data=>data.id!==item.id))

       axios.delete(`/users/${item.id}`)
        
    }
    return(
        <div>
            <Button type='primary' onClick={()=>{
                setOpen(true)
            }}> 添加用户 </Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={
                    {pageSize:5}
                }
                rowKey={(item)=>item.id}
            />

<Modal
        open={open}
        title="添加新用户"
        okText="创建"
        cancelText="取消"
        onCancel={() => {
          setOpen(false);
          userFormRef.current?.resetFields(); // 关闭时重置表单
        }}
        onOk={() => userFormRef.current?.form.submit()} // 触发表单提交
      >
        <UserForm 
          ref={userFormRef}
          regionList={regionList} 
          roleList={roleList} 
          onFinish={handleFormFinish} 
        />
      </Modal>


      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false);
          userFormRef.current?.resetFields(); // 关闭时重置表单
        }}
        onOk={() => userFormRef.current?.form.submit()} // 触发表单提交
      >
        <UserForm 
          ref={userFormRef}
          regionList={regionList} 
          roleList={roleList} 
          onFinish={handleUpdateFinish}
          initialValues={selectedUser} 
        />
      </Modal>
        </div>
    )
}