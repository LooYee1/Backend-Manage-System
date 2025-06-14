import React,{lazy, Suspense} from "react";
import { HashRouter, Route,Routes } from "react-router-dom";
// import NewsSandBox from "../views/sandbox/NewsSandBox";
// import Detail from "../views/news/Detail";
// import News from "../views/news/News";

const Login = React.lazy(()=>import("../views/login/Login"));
const NewsSandBox =React.lazy(()=>import("../views/sandbox/NewsSandBox"))
const Detail =React.lazy(()=>import("../views/news/Detail"))
const News = React.lazy(() => import('../views/news/News'));

export default function IndexRouter(){
    return(
        <Suspense fallback={<div>加载中......</div>}>
            <Routes>
                <Route path="/login" element={<Login/> }></Route>
                <Route path="/news" element={<News/> }></Route>
                <Route path="/detail/:id" element={<Detail/> }></Route>
                <Route path="*" element={<NewsSandBox/> }></Route>
                
            </Routes>
        </Suspense>
    )
}