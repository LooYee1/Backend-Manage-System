import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as Echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;

// import axios from 'axios'
export default function Home() {
    const [viewList, setviewList] = useState([])
    const [starList, setstarList] = useState([])
    const [allList, setallList] = useState([])
    const [open, setopen] = useState(false)
    const [pieChart, setpieChart] = useState(null)
    const barRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
            // console.log(res.data)
            setviewList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
            // console.log(res.data)
            setstarList(res.data)
        })
    }, [])

    useEffect(() => {

        axios.get("/news?publishState=2&_expand=category").then(res => {
            // console.log(res.data)
            // console.log()
            renderBarView(_.groupBy(res.data, item => item.category.title))

            setallList(res.data)
        })

        return () => {
            window.onresize = null
        }
    }, [])

    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数量',
                type: 'bar',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);


        window.onresize = () => {
            // console.log("resize")
            myChart.resize()
        }
    }

    const renderPieView = (obj) => {
        //数据处理工作

        var currentList =allList.filter(item=>item.author===username)
        var groupObj = _.groupBy(currentList,item=>item.category.title)
        var list = []
        for(var i in groupObj){
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        var myChart;
        if(!pieChart){
            myChart = Echarts.init(pieRef.current);
            setpieChart(myChart)
        }else{
            myChart = pieChart
        }
        var option;

        option = {
            title: {
              text: '当前用户新闻分类图示',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            // 关键：图例放到底部，水平居中
            legend: {
              orient: 'horizontal', // 水平排列
              bottom: '1%',         // 距离底部10%
              left: 'center',        // 水平居中
              itemGap: 20            // 图例项之间的间距
            },
            series: [
              {
                name: '发布数量',
                type: 'pie',
                radius: '50%',
                data: list,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                // 标签配置：让ECharts自动布局（去掉强制position，改用默认智能布局）
                label: {
                  show: true,
                  position: 'outside', // 标签放外部
                  fontSize: 12,
                  formatter: '{b}: {c}'
                },
                // 引导线配置：加长+弯曲，让标签远离饼图
                labelLine: {
                  show: true,
                  length: 30,   // 第一段长度（从饼图到引导线拐点）
                  length2: 40,  // 第二段长度（从拐点到标签）
                  smooth: 0.5   // 引导线弯曲度
                },
                minAngle: 10
              }
            ]
          };

        option && myChart.setOption(option);

    }

    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" variant="borderless">
                        <List
                            size="small"
                            // bordered
                            dataSource={viewList}
                            renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" variant="borderless">
                        <List
                            size="small"
                            // bordered
                            dataSource={starList}
                            renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                
                                    setopen(true)
                                    setTimeout(() => {
                                    // init初始化
                                    renderPieView()
                                }, 0)
                            }} />,
                            
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span style={{
                                        paddingLeft: "30px"
                                    }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                width="500px"
                title="个人新闻分类"
                placement="right"
                closable={true}
                onClose={() => {
                    setopen(false)
                }}
                open={open}
            >
                <div ref={pieRef} style={{
                    width: '100%',
                    height: "400px",
                    marginTop: "30px"
                }}></div>
            </Drawer>


            <div ref={barRef} style={{
                width: '100%',
                height: "400px",
                marginTop: "30px"
            }}></div>
        </div>
    )
}
