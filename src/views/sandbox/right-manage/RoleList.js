import React, { useState, useEffect } from 'react'
import { Table, Button, Modal,Tree } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'

export default function RoleList(){
    const [dataSource,setdataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights,setcurrentRights]=useState([])
    const [currentId,setcurrentId]=useState([0])
    const { confirm } = Modal;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const columns=[{
        title: 'ID',
        dataIndex: 'id',
        render: (id) => {
            return <b>{id}</b>
        }
        },
        {
            title:'角色名称',
            dataIndex: 'roleName'
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    
                    <Button danger shape="circle" icon={<DeleteOutlined />} 
                    onClick={()=>confirmMethod(item)}
                    />
                    
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                         onClick={()=>{
                            setIsModalOpen(true)
                            setcurrentRights(item.rights)
                            setcurrentId(item.id)
                         }}/>
                    
                </div>
            }
        }

]

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
//删除
 const deleteMethod=(item)=>{
                // console.log(item)
        // 当前页面同步状态 + 后端同步
        console.log("当前要删除的 item.id：", item.id); // 检查是否为 undefined 或错误值
         // console.log(item)
         setdataSource(dataSource.filter(data => data.id !== item.id))
         axios.delete(`/roles/${item.id}`)
        }



    useEffect(()=>{
        axios.get("/roles").then(res=>{
            setdataSource(res.data)
        })
    }

    ,[])

    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            // console.log(res.data)
            setRightList(res.data)
        })
    }, [])


    const handleOk = () => {
        setIsModalOpen(false);
        // 同步前端数据源（确保是数组）
        const newDataSource = dataSource.map(item => {
          if (item.id === currentId) {
            return {
              ...item,
              rights: Array.isArray(currentRights) ? currentRights : currentRights.checked // 兼容处理
            };
          }
          return item;
        });
        setdataSource(newDataSource);
      
        // 同步后端（只发送数组）
        axios.patch(`/roles/${currentId}`, {
          rights: Array.isArray(currentRights) ? currentRights : currentRights.checked // 确保是数组
        });
      };

    const handleCancel=()=>{
        setIsModalOpen(false)
    }
    
    const onCheck=(checkKeys)=>{
        console.log(checkKeys);
        setcurrentRights(checkKeys)
    }
    return(
        <div>
           <Table dataSource={dataSource} columns={columns}
           rowKey={(item)=>item.id}
           ></Table>
           <Modal
        title="权限分配"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          <Tree
      checkable
      onCheck={onCheck}
      checkedKeys={currentRights}
      checkStrictly={true}
      treeData={rightList}
    />
      </Modal>
        </div>
    )
}