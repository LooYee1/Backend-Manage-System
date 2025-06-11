import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal,Popover, Switch} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons'

export default function RightList(){
    const [dataSource, setdataSource] = useState([])
    const { confirm } = Modal;
  

    useEffect(()=>{
        axios.get("/rights?_embed=children").then(res=>{
            const list = res.data
            list.forEach(item => {
                if(item.children.length===0){
                    item.children= ""
                }
            });
            setdataSource(list)
        })
    })

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title'
        },
        {
            title: "权限路径",
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="pink">{key}</Tag>
            }    
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    
                    <Button danger shape="circle" icon={<DeleteOutlined />} 
                    onClick={()=>confirmMethod(item)}
                    />
                    <Popover content={<div style={{textAlign:"center"}}>
                        <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
                    </div>} title="页面开关" trigger="click">
                    <Button type="primary" shape="circle" icon={<EditOutlined />}
                        disabled={item.pagepermisson===undefined} />
                    </Popover>
                </div>
            }
        }
        
    ];

    const switchMethod = async (item)=>{
        const newPagePermission = item.pagepermisson === 1 ? 0 : 1;
        const newDataSource = dataSource.map(data => 
          data.id === item.id ? { ...data, pagepermisson: newPagePermission } : data
        );
        setdataSource(newDataSource);
      
        try {
          // 2. 同步更新后端数据（关键）
          await axios.patch(`/rights/${item.id}`, {
            pagepermisson: newPagePermission
          });
        } catch (error) {
          // 如果后端更新失败，回滚前端状态
          setdataSource(dataSource);
          console.error("更新权限状态失败:", error);
        }
    }


    
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
        console.log("当前要删除的 item.id：", item.id); // 检查是否为 undefined 或错误值
        if (item.grade === 1) {
            setdataSource(dataSource.filter(data => data.id !== item.id))
            axios.delete(`/rights/${item.id}`)
        }else{
            let list = dataSource.filter(data=>data.id===item.rightId)
            list[0].children = list[0].children.filter(data=>data.id!==item.id)
            setdataSource([...dataSource])
            axios.delete(`/children/${item.id}`)
        }
        
        
    }
    return(
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={
                    {pageSize:5}
                }
            />
        </div>
    )
}