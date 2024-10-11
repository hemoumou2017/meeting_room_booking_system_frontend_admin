/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-09 16:52:29
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-11 11:42:44
 * @FilePath: /meeting_room_booking_system_frontend_admin/src/pages/Statistics/Statistics.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { DatePicker, Form, Select, Button, message } from 'antd'
import './Statistics.css'
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { meetingRoomBookingCount, userBookingCount } from '../../interfaces/interfaces'
import { useForm } from 'antd/es/form/Form'


interface UserBookingData {
    userId: string,
    bookingCount: string,
    username: string
}
interface MeetingRoomUsedData {
    meetingRoomName: string;
    meetingRoomId: number;
    bookingCount: string;
}

export function Statistics() {
    const [userBookingData, setUserBookingData] = useState<Array<UserBookingData>>()
    const [meetingRoomUsedData, setMeetingRoomUsedData] = useState<Array<MeetingRoomUsedData>>();

    const containerRef = useRef<HTMLDivElement>(null)
    const containerRef2 = useRef<HTMLDivElement>(null)
    async function getStatisticData(values: { startTime: string, endTime: string }) {
        const startTime = dayjs(values.startTime).format('YYYY-MM-DD')
        const endTime = dayjs(values.endTime).format('YYYY-MM-DD')
        const res = await userBookingCount(startTime, endTime)
        const {data} = res.data

        if (res.status === 200 || res.status === 201) {
            setUserBookingData(data)
        } else {
            message.error(data || '系统繁忙，请稍后再试')
        }
        

        const res2 = await meetingRoomBookingCount(startTime, endTime);
        
        const { data: data2 } = res2.data;
        if(res2.status === 201 || res2.status === 200) {
            setMeetingRoomUsedData(data2);
        } else {
            message.error(data2 || '系统繁忙，请稍后再试');
        }
        
    }
    useEffect(() => {
        const myChart = echarts.init(containerRef2.current);

        if(!meetingRoomUsedData) {
            return;
        }
    
        myChart.setOption({
            title: {
                text: '会议室使用情况'
            },
            tooltip: {},
            xAxis: {
                data: meetingRoomUsedData?.map(item => item.meetingRoomName)
            },
            yAxis: {},
            series: [
                {
                    name: '使用次数',
                    type: form.getFieldValue('chartType'),
                    data: meetingRoomUsedData?.map(item => {
                        return {
                            name: item.meetingRoomName,
                            value: item.bookingCount
                        }
                    })
                }
            ]
        });
    }, [meetingRoomUsedData]);

    useEffect(() => {
        const myChart = echarts.init(containerRef.current)
        myChart.setOption({
            title: {
                text: '用户预定情况'
            },
            tooltip: {},
            xAxis: {
                data: userBookingData?.map(item => item.username)   
            },
            yAxis: {},
            series: [
                {
                    name: '预定次数',
                    type: form.getFieldValue('chartType'),
                    data: userBookingData?.map(item => {
                        return {
                            name: item.username,
                            value: item.bookingCount
                        }
                    })
                }
            ]
        });

    }, [userBookingData])
    
    
    const  [form] = useForm()
    return <div id='statistics-container'>
        <div className='statistics-form'>
            <Form form={form} onFinish={getStatisticData} colon={false} layout='inline' name='search'>
                <Form.Item label='开始日期' name='startTime'>
                    <DatePicker />
                </Form.Item>
                <Form.Item label='结束日期' name='endTime'>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="图标类型" name="chartType" initialValue={"bar"}>
                    <Select>
                        <Select.Option value="bar">柱状图</Select.Option>
                        <Select.Option value="pie">饼图</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div className='statistics-chart-container'>
            <div className='statistics-chart' ref={containerRef}></div>
            <div className="statistics-chart" ref={containerRef2}></div>
        </div>
        
    </div>
}
