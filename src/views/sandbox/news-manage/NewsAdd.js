import React, { useEffect, useState,useRef} from "react";
import { Button, Steps,Form,Input, Select, message,notification } from 'antd';
import style from './News.module.css'
import NewsEditor from "../../../components/news-manage/NewsEditor";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function NewsAdd(props){
   
    const [Current,setCurrent] = useState(0)
    const [categoryList,setCategoryList] = useState([])

    const [formInfo,setformInfo]=useState({})
    const [content,setContent]=useState("")
    const User =JSON.parse(localStorage.getItem("token"))
    const NewsForm=useRef(null)
    const navigate = useNavigate()
    const handleSave = async(auditState)=>{

    
// 1. 先获取当前所有新闻数据
    const res = await axios.get("/news");
    const existingNews = res.data;
    
    // 2. 计算当前最大ID（假设ID是数字类型）
    const maxId = existingNews.length > 0 
      ? Math.max(...existingNews.map(item => item.id)) 
      : 0;
    
    // 3. 生成新ID（最大ID + 1）
    const newId = maxId + 1;

      await axios.post('news',{
        ...formInfo,
            "id":newId.toString(),
            "content": content,
            "region": User.region?User.region:"全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
      });
        navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')

        notification.info({
          message: `通知`,
          description:
            `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
          placement:"bottomRight"
      });

      
    }

    const handleNext=()=>{
        if(Current===0){
            NewsForm.current.validateFields().then(res=>{
              console.log(res)
              // 将categoryId转为数字
              const formattedRes = { ...res, categoryId: Number(res.categoryId) };

              setformInfo(res) 
              setCurrent(Current+1)
            }).catch(error=>{
              console.log(error);              
            })                        
        }        
        else{
          if(content===""||content.trim()==="<p></p>"){message.error("新闻内容不能为空")}
          else{  
            setCurrent(Current+1)
          }
        }
    }

    const handlePrevious=()=>{
        setCurrent(Current-1)
    }
    const onFinish = values => {
        console.log('Success:', values);
      };
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

      const handleChange = value => {
        console.log(`selected ${value}`);
      };

      useEffect(()=>{
        axios.get("/categories").then(res=>{
            setCategoryList(res.data)
            
        })
      },[])
    return(


      
<div>


<Steps
    current={Current}
    items={[
      {
        title: "基本信息",
        description:"新闻标题,新闻分类"
      },
      {
        title: "新闻内容",
        description:"新闻主体内容",
        
      },
      {
        title: "新闻提交",
        description:"保存草稿或者提交审核"
      },
    ]}
  />
    <div className={Current===0?'':style.active}>
    <Form
    ref={NewsForm}
    name="basic"
    labelCol={{ span: 4 }}
    wrapperCol={{ span: 20 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="新闻标题"
      name="title"
      rules={[{ required: true, message: "请填写标题" }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="新闻分类"
      name="categoryId"
      rules={[{ required: true, message: "请选择分类" }]}
    >
      <Select 
      
      defaultValue=""
      style={{ width: 120 }}
      onChange={handleChange}>
        {
            categoryList.map(item=><Select.Option value={item.id} key={item.id}>
                {item.title}
            </Select.Option>)
        }
      </Select>
    </Form.Item>
    
    
    
  </Form>

    </div>

    <div className={Current===1?'':style.active}>
        { <NewsEditor onContentChange={setContent}></NewsEditor> }
    </div>

    <div className={Current===2?'':style.active}>
        
        
    </div>



    <div>
        {
            Current===2 && <span>
                <Button type="primary" onClick={()=>handleSave(0)}>保存草稿箱</Button>
                <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
            </span> 
        }
        {
            Current<2  &&<Button type="primary" onClick={handleNext}>下一步</Button>
        }
        {
            Current>0 &&<Button onClick={handlePrevious}>上一步</Button>
        }
    </div>

  </div>
)

    
}