import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, notification} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined,UploadOutlined,ExclamationCircleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default function NewsDraft(props){
    const [dataSource, setdataSource] = useState([])
    const { confirm } = Modal;
    const {username} = JSON.parse(localStorage.getItem("token"))

    const navigate=useNavigate()

    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
            const list = res.data
            
            setdataSource(list)
        })
    },[username])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item)=>{
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        
        { 
            title: '新闻分类',
            dataIndex: 'category',
            render:(category)=>{
                return category.title
            }
        },
        
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    
                    <Button danger shape="circle" icon={<DeleteOutlined />} 
                    onClick={()=>confirmMethod(item)}
                    />
                    {/* 更新 */}
                    <Button  shape="circle" icon={<EditOutlined />}
                         onClick={()=>{
                            navigate(`/news-manage/update/${item.id}`)
                         }}/>
                    
                    <Button type="primary" shape="circle" 
                            icon={<UploadOutlined />}
                            onClick={()=>handleCheck(item.id)}
                    
                         />

                </div>
            }
        }
        
    ];

    const handleCheck = (id)=>{
        axios.patch(`/news/${id}`,{
            auditState:1
        }).then(res=>{
            navigate('/audit-manage/list')

            notification.info({
              message: `通知`,
              description:
                `您可以到审核列表中查看您的新闻`,
              placement:"bottomRight"})
        })
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
                
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/news/${item.id}`)
    }
    return(
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={
                    {pageSize:5}
                }
                rowKey={item=>item.id}
            />
        </div>
    )
}