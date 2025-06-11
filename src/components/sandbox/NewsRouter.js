import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import { Route,Routes } from 'react-router-dom'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from  '../../views/sandbox/news-manage/NewsPreview'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
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
    
    )



}