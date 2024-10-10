import { Badge, Button, Form, Image, Input, message } from 'antd'
import './userManage.css'
import { useCallback, useEffect, useMemo, useState } from 'react';
import Table, { ColumnsType } from 'antd/es/table';
import { freeze, userSearch } from '../../interfaces/interfaces';
import { useForm } from 'antd/es/form/Form';

interface SearchUser {
    username: string,
    nickname: string,
    email: string
}
export interface User {
    id: number,
    username: string,
    nickname: string,
    email: string,
    headPic: string,
    createTime: string,
    isFrozen: boolean
}



export function UserManage() {
    const [pageNo, setPageNo] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [userResult, setUserResult] = useState<User[]>()
    const [num,setNum] = useState<number>(0)
    const columns: ColumnsType<User> = useMemo(() =>  [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '头像',
            dataIndex: 'headPic',
            render: value => {
                return value ? <Image width={50} src={`http://localhost:3001/${value}`} /> : '暂无头像'
            }
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '注册时间',
            dataIndex: 'createTime',
        },
        {
            title: '状态',
            dataIndex: 'isFrozen',
            render: (_, record) => (
                record.isFrozen ? <Badge status="success">已冻结</Badge> : ''
            )
        },
        {
            title: '操作',
            render: (_, record) => (
                <a href="#" onClick={() => {freezeUser(record.id)}}>冻结</a>
            )
        }
        
    ], [])

    const freezeUser = useCallback(async(id: number) => {
        const res = await freeze(id);
    
        const { data } = res.data;
        if(res.status === 201 || res.status === 200) {
            message.success('冻结成功');
            setNum(Math.random())
        } else {
            message.error(data || '系统繁忙，请稍后再试');
        }
    }, [])
    const searchUser = useCallback(async(values: SearchUser) => {
        const res = await userSearch(values.username, values.nickname, values.email, pageNo, pageSize)
        
        const { data } = res.data;
        if(res.status === 200 || res.status === 201) {
            setUserResult(data.users.map((item: User)=> {
                return {
                    key: item.username,
                    ...item
                }
            }))
        } else {
            message.error(data || '系统繁忙，请稍后再试')
        }
    }, []);
    useEffect(() => {
        searchUser({
            username: form.getFieldValue('username'),
            email: form.getFieldValue('email'),
            nickname: form.getFieldValue('nickname')
        });
    }, [pageNo, pageSize, num]);
    const changePage = useCallback((page:number, pageSize:number) => {
        setPageNo(page)
        setPageSize(pageSize)
    }, [])
    const [form] = useForm();
    return <div id='userManage-container'>
        <div className='userManage-form'>
            <Form onFinish={searchUser} layout='inline' name='search' colon={false} form={form}>
                <Form.Item label='用户名' name='username'>
                    <Input />
                </Form.Item>
                <Form.Item label='昵称' name='nickname'>
                    <Input />
                </Form.Item>
                <Form.Item label='邮箱' name='email'
                    rules={[{ type: 'email', message: '请输入正确的邮箱地址' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label=' '>
                    <Button type='primary' htmlType='submit'>搜索用户</Button>
                </Form.Item>
            </Form>
        </div>
        <div className='userManage-table'>
            <Table columns={columns} dataSource={userResult} pagination={
                {
                    current: pageNo,
                    pageSize: pageSize,
                    onChange: changePage
                }
            } />
        </div>
        
    </div>

}