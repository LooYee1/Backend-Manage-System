import React from "react";
import { HashRouter, Route,Routes } from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import Detail from "../views/news/Detail";
import News from "../views/news/News";
import { Navigate } from 'react-router-dom';
export default function IndexRouter(){
    return(
        
            <Routes>
                <Route path="/login" element={<Login/> }></Route>
                <Route path="/news" element={<News/> }></Route>
                <Route path="/detail/:id" element={<Detail/> }></Route>
                <Route path="*" element={<NewsSandBox/> }></Route>
                
            </Routes>
        
    )
}