import React, { useEffect } from "react";
import SideMenu from "../../components/sandbox/SideMenu"
import TopHeader from "../../components/sandbox/TopHeader"
import { Layout,theme } from "antd";
import './NewsSandBox.css'
import '../../components/sandbox/NewsRouter'
import NewsRouter from "../../components/sandbox/NewsRouter";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function NewsSandBox(){

  NProgress.start()
    useEffect(()=>{
        NProgress.done()
    })
    const {  Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    return (
       
        <div>
             <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
            <TopHeader></TopHeader>
            <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>

           
            </Layout>
            </Layout>
           
        </div>
       
    )
}