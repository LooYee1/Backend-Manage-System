import React, { useEffect, useState,Suspense } from 'react'
import { Route,Routes,useNavigate,Navigate } from 'react-router-dom'
import axios from 'axios'

const Home = React.lazy(() => import('../../views/sandbox/home/Home'));
const Nopermission = React.lazy(() => import('../../views/sandbox/nopermission/Nopermission'));
const RightList = React.lazy(() => import('../../views/sandbox/right-manage/RightList'));
const RoleList = React.lazy(() => import('../../views/sandbox/right-manage/RoleList'));
const UserList = React.lazy(() => import('../../views/sandbox/user-manage/UserList'));
const NewsAdd = React.lazy(() => import('../../views/sandbox/news-manage/NewsAdd'));
const NewsDraft = React.lazy(() => import('../../views/sandbox/news-manage/NewsDraft'));
const NewsCategory = React.lazy(() => import('../../views/sandbox/news-manage/NewsCategory'));
const NewsPreview = React.lazy(() => import('../../views/sandbox/news-manage/NewsPreview'));
const Audit = React.lazy(() => import('../../views/sandbox/audit-manage/Audit'));
const AuditList = React.lazy(() => import('../../views/sandbox/audit-manage/AuditList'));
const Unpublished = React.lazy(() => import('../../views/sandbox/publish-manage/Unpublished'));
const Published = React.lazy(() => import('../../views/sandbox/publish-manage/Published'));
const Sunset = React.lazy(() => import('../../views/sandbox/publish-manage/Sunset'));
const NewsUpdate = React.lazy(() => import('../../views/sandbox/news-manage/NewsUpdate'));

export default function NewsRouter(){
    const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate()
    const LocalRouterMap={
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
        "/news-manage/add": NewsAdd,
        "/news-manage/draft": NewsDraft,
        "/news-manage/category": NewsCategory,
        "/news-manage/preview/:id":NewsPreview,
        "/news-manage/update/:id":NewsUpdate, 
        "/audit-manage/audit": Audit,
        "/audit-manage/list": AuditList,
        "/publish-manage/unpublished": Unpublished,
        "/publish-manage/published": Published,
        "/publish-manage/sunset": Sunset
    }

    const [BackRouteList,setBackRouteList]=useState([])

    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
            
        ]).then(res=>{
            setBackRouteList([...res[0].data,...res[1].data])
   
   
        })},[])

        const checkRoute=(item)=>{
            return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
        }

        const checkUserPermission=(item)=>{
            return rights.includes(item.key)
        }
    return(
        <Suspense fallback={<div>加载中...</div>}>
        <Routes>
           
        {
        BackRouteList.map(item => {
            const TargetComponent = LocalRouterMap[item.key];
        if (checkRoute(item) && checkUserPermission(item)) {
       return (
        <Route 
          path={item.key} 
          key={item.key} 
          element={<TargetComponent />} // 用变量接收，更清晰
        />
      );
    }
           return null; }) }
            {/* 默认重定向到/home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      
      {/* 无权限或404 */}
      <Route path="*" element={<Nopermission />} />
      
            </Routes>
            </Suspense>
    )



}