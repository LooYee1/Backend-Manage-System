import React, { useEffect, useState,useRef} from "react";
import { Button, Steps,Form,Input, Select, message,notification, } from 'antd';
import style from './News.module.css'
import NewsEditor from "../../../components/news-manage/NewsEditor";
import axios from 'axios'
import { ArrowLeftOutlined  } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
export default function NewsUpdate(props){
    const [size, setSize] = useState(''); 

    const [Current,setCurrent] = useState(0)
    const [categoryList,setCategoryList] = useState([])

    const [formInfo,setformInfo]=useState({})
    const [content,setContent]=useState("")
    
    const NewsForm=useRef(null)
    const [isLoading, setIsLoading] = useState(true); // 加载状态
    const [newsData, setNewsData] = useState(null); // 存储完整的新闻数据
    const navigate=useNavigate()
    const handleSave = async(auditState)=>{
      // 获取表单数据
    const formInfo = await NewsForm.current.validateFields();

    
    // 关键：将字符串categoryId转为数字（如"1"→1）
    const numericCategoryId = Number(formInfo.categoryId); 

      await axios.patch(`/news/${id}`,{
            ...formInfo,
            "content": content,
            "auditState": auditState,
            categoryId: numericCategoryId
      });
        navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')

        notification.info({
          message: `通知`,
          description:
            `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
          placement:"bottomRight"
      });

      
    }
    useEffect(() => {
      axios.get("/categories").then(res => {
        setCategoryList(res.data);
        console.log("分类数据：", res.data); // 验证分类数据是否正常
      });
    }, []);
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
      
      const { id } = useParams(); 
      useEffect(()=>{
        axios.get("/categories").then(res=>{
            setCategoryList(res.data)
            
        })
      },[])

      useEffect(() => {
        const fetchNewsData = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`/news/${id}?_expand=category&_expand=role`);
                const { title, categoryId, content } = res.data;
                

                
                // 设置表单数据
                NewsForm.current.setFieldsValue({
                    title,
                    categoryId: categoryId.toString()
                });
                
                // 设置内容和完整数据
                setContent(content || ""); // 确保有默认值
                setNewsData(res.data);
                setIsLoading(false);
                
                console.log('获取到的新闻内容:', content);
            } catch (error) {
                console.error('获取新闻数据失败:', error);
                message.error('获取新闻数据失败');
                setIsLoading(false);
            }
        };

        if (id) {
            fetchNewsData();
        }
    }, [id])
   
    
    return(


      
<div>
<div className={style.backButtonWrapper}>
<Button type="primary" shape="round" icon={<ArrowLeftOutlined />} size={size} onClick={()=>navigate('/news-manage/draft')}>
    回到草稿箱
  </Button>
</div>

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

    <div className={Current===1 ?'':style.active}>
        {/* 现在做到需要让草稿箱页面重新收集新闻内容并渲染出来 */}
        { <NewsEditor onContentChange={setContent} content={content}
          key={`editor-${id}`}
        ></NewsEditor> }
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