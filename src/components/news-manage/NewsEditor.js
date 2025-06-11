

import { useRef } from 'react';
import React, { useEffect, useState } from'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';
 
import { Form } from 'antd'; // 导入 Ant Design 的 Form, Input, DatePicker 和 Button 组件

// 配置 Quill 工具栏，添加图片上传按钮
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ]
};
 
// 配置 Quill 格式
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'link', 'image',
  'align', 'direction', 'size', 'color', 'background',
  'block'
];
 
export default function NewsEditor({onContentChange,content:propContent}) {
  const [editorContent, setEditorContent] = useState('');
  const quillRef = useRef(null);
  const isInitialized = useRef(false);

  // 当传入的content发生变化时，更新编辑器内容
  useEffect(() => {
    console.log('NewsEditor接收到的content:', propContent);
    
    if (propContent !== undefined && propContent !== null) {
      setEditorContent(propContent);
      
      // 如果 Quill 实例已经存在，直接设置内容
      if (quillRef.current && quillRef.current.getEditor) {
        const editor = quillRef.current.getEditor();
        if (editor && editor.root.innerHTML !== propContent) {
          editor.root.innerHTML = propContent;
          isInitialized.current = true;
        }
      }
    }
  }, [propContent]);

  // 处理编辑器内容变化
  const handleContentChange = (newContent) => {
    console.log('编辑器内容变化:', newContent);
    setEditorContent(newContent);
    
    // 通知父组件内容变化
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  // 编辑器准备就绪后的处理
  const handleEditorReady = () => {
    if (quillRef.current && propContent && !isInitialized.current) {
      const editor = quillRef.current.getEditor();
      editor.root.innerHTML = propContent;
      isInitialized.current = true;
    }
  };


  return (
    <div style={{ width: '80%', margin: '0 auto' } } key={propContent || 'empty'}>
      <h1>编辑文章</h1>
      <Form layout="vertical" >
        
        <Form.Item label="内容:" name="content">
          <ReactQuill
            ref={quillRef}
            value={editorContent}
            onChange={handleContentChange}
            onFocus={handleEditorReady}
            modules={modules}
            formats={formats}
            style={{minHeight:'300px'}}
          />
        </Form.Item>
        
      </Form>
    </div>
  );
}
