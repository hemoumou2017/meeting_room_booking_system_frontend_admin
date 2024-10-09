/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-08 17:09:42
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-09 16:53:21
 * @FilePath: /meeting_room_booking_system_frontend_admin/src/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-08 17:09:42
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-08 17:23:35
 * @FilePath: /meeting_room_booking_system_frontend_admin/src/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter, Link, Outlet } from 'react-router-dom';
import { Index } from './pages/Index/Index';
import { ErrorPage } from './pages/ErrorPage/ErrorPage';
import { UserManage } from './pages/UserManage/UserManage';
import { Login } from './pages/Login/Login';
import { Menu } from './pages/Menu/Menu';
import { ModifyMenu } from './pages/ModifyMenu/ModifyMenu';
import { InfoModify } from './pages/InfoModify/InfoModify';
import { PasswordModify } from './pages/PasswordModify/PasswordModify';
import { MeetingRoomManage } from './pages/MeetingRoomManage/MeetingRoomManage';
import { BookingManage } from './pages/BookingManage/BookingManage';
import { Statistics } from './pages/Statistics/Statistics';

const routes = [
  {
    path: "/",
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Menu></Menu>,
        children: [
          {
            path: '/',
            element: <MeetingRoomManage/>
        },
        {
            path: 'user_manage',
            element: <UserManage/>
        },
        {
            path: 'meeting_room_manage',
            element: <MeetingRoomManage/>
        },
        {
            path: 'booking_manage',
            element: <BookingManage/>
        },
        {
            path: 'statistics',
            element: <Statistics/>
        }
          
        ]
      },
      {
        path: "/user",
        element: <ModifyMenu></ModifyMenu>,
        children: [
          {
            path: 'info_modify',
            element: <InfoModify/>
          },
          {
            path: 'password_modify',
            element: <PasswordModify/>
          },
        ]
    },
    ]
  },
  {
    path: "login",
    element: <Login />,
  }
];
export const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<RouterProvider router={router}/>);

