/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-09 16:52:06
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-10 16:53:53
 * @FilePath: /meeting_room_booking_system_frontend_admin/src/pages/BookingManage/BookingManage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { useEffect, useState } from "react";
import { MeetingRoomSearchResult } from "../MeetingRoomManage/MeetingRoomManage";
import { User } from "../UserManage/UserManage";
import { Button, DatePicker, Form, Input, message, Popconfirm, Table, TimePicker } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import './booking_manage.css'
import { apply, getBookingList, reject, unbind } from "../../interfaces/interfaces";

export interface SearchBooking {
    username: string;
    meetingRoomName: string;
    meetingRoomPosition: string;
    rangeStartDate: Date;
    rangeStartTime: Date;
    rangeEndDate: Date;
    rangeEndTime: Date;
}

interface BookingSearchResult {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
    note: string;
    createTime: string;
    updateTime: string;
    user: User,
    room: MeetingRoomSearchResult
}


export function BookingManage() {
    const [pageNo, setPageNo] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [bookingSearchResult,  setBookingSearchResult] = useState<Array<BookingSearchResult>>([]);
    const [num,setNum] = useState<number>(0);

    const columns: ColumnsType<BookingSearchResult> = [
        {
            title: '会议室名称',
            dataIndex: 'room',
            render(_, record) {
                return record.room.name
            }
        },
        {
            title: '会议室位置',
            dataIndex: 'room',
            render(_, record) {
                return record.room.location
            }
        },
        {
            title: '预定人',
            dataIndex: 'user',
            render(_, record) {
                return record.user.username
            }
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            render(_, record) {
                return dayjs(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            render(_, record) {
                return dayjs(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '审批状态',
            dataIndex: 'status',
            onFilter: (value, record) => record.status.startsWith(value as string),
            filters: [
                {
                    text: '审批通过',
                    value: '审批通过',
                },
                {
                    text: '审批驳回',
                    value: '审批驳回',
                },
                {
                    text: '申请中',
                    value: '申请中',
                },
                {
                    text: '已解除',
                    value: '已解除'
                },
            ],
        },
        {
            title: '预定时间',
            dataIndex: 'createTime',
            render(_, record) {
                return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss')
            }
        },
        {
            title: '备注',
            dataIndex: 'note'
        },
        {
            title: '描述',
            dataIndex: 'description'
        },
        {
            title: '操作',
            render: (_, record) => (
                <div>
                    <Popconfirm
                        title="通过申请"
                        description="确认通过吗？"
                        onConfirm={() => changeStatus(record.id, 'apply')}
                        okText="Yes"
                        cancelText="No"
                    >  
                        <a href="#">通过</a>
                    </Popconfirm>
                    <br/>
                    <Popconfirm
                        title="驳回申请"
                        description="确认驳回吗？"
                        onConfirm={() => changeStatus(record.id, 'reject')}
                        okText="Yes"
                        cancelText="No"
                    >  
                        <a href="#">驳回</a>
                    </Popconfirm>
                    <br/>
                    <Popconfirm
                        title="解除申请"
                        description="确认解除吗？"
                        onConfirm={() => changeStatus(record.id, 'unbind')}
                        okText="Yes"
                        cancelText="No"
                    >  
                        <a href="#">解除</a>
                    </Popconfirm>
                    <br/>
                </div>
            )
        }
    ];
    const changePage = (page: number, size: number) => {
        setPageNo(page);
        setPageSize(size);
    }
    const [form] = useForm()
    const searchBooking = async(values: SearchBooking) => {
        console.log(values)
        
        const res = await getBookingList(values, pageNo, pageSize)
        const { data } = res.data;
        
        if (res.status === 200 || res.status === 201) {
            setBookingSearchResult(data.bookings.map((item: BookingSearchResult) => {
                return {
                    key: item.id,
                    ...item
                }
            }))
        } else {
            message.error(data || "系统繁忙，请稍后再试")
        }
        
    }

    async function changeStatus(id: number, status: 'apply' | 'reject' | 'unbind') {
        const methods = {
            apply,
            reject,
            unbind
        }
        const res = await methods[status](id);
    
        if(res.status === 201 || res.status === 200) {
            message.success('状态更新成功');
            setNum(Math.random());
        } else {
            message.error(res.data.data);
        }
    }

    useEffect(() => {
        searchBooking({
            username: form.getFieldValue('username'),
            meetingRoomName: form.getFieldValue('meetingRoomName'),
            meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
            rangeStartDate: form.getFieldValue('rangeStartDate'),
            rangeStartTime: form.getFieldValue('rangeStartTime'),
            rangeEndDate: form.getFieldValue('rangeEndDate'),
            rangeEndTime: form.getFieldValue('rangeEndTime')
        });
    }, [pageNo, pageSize, num])

    return <div id="bookingManage-container">
        <div className="bookingManage-form">
            <Form 
                form={form}
                colon={false}
                name="search"
                layout='inline'
                onFinish={searchBooking}
            >
                <Form.Item name="username" label="预定人">
                    <Input />
                </Form.Item>
                <Form.Item name="meetingRoomName" label="会议室名称">
                    <Input />
                </Form.Item>
                <Form.Item name="rangeStartDate" label="预定开始日期">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="rangeStartTime" label="预定开始时间">
                    <TimePicker />
                </Form.Item>
                <Form.Item name="rangeEndDate" label="预定结束日期">
                    <DatePicker />
                </Form.Item>
                <Form.Item name="rangeEndTime" label="预定结束时间">
                    <TimePicker />
                </Form.Item>
                <Form.Item name="meetingRoomPosition" label="会议室位置">
                    <Input />
                </Form.Item>
                <Form.Item label="  ">
                    <Button type="primary" htmlType="submit">
                        搜索预定申请
                    </Button>
                </Form.Item>
            </Form>
        </div>
        <div className="bookingManege-table">
            <Table columns={columns} dataSource={bookingSearchResult} pagination={ {
                current: pageNo,
                pageSize: pageSize,
                onChange: changePage
            } } />
        </div>
    </div>
}