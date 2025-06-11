import React from 'react'
import { Table, Tag} from 'antd'

export default function NewsPublish(props){
    
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: "新闻分类",
            dataIndex: 'category',
            render: (category) => {
                // 安全访问：使用可选链操作符 ?. 并设置默认值
                return <Tag color="pink">{category?.title || "未分类"}</Tag>
            }    
        },
        {
            title:"操作",
            render:(item)=>{
                return <div>
                    
                    {props.button(item.id)}
                </div>
            }
        }
        
    ];

    
    return(
        <div>
            <Table dataSource={props.dataSource} columns={columns}
                pagination={
                    {pageSize:5}
                }
                rowKey={item=>item.id}
            />
        </div>
    )
}