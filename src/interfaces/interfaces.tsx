/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-10-08 17:27:59
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-10-14 15:00:50
 * @FilePath: /meeting_room_booking_system_frontend_admin/src/interfaces/interfaces.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { message } from "antd";
import axios from "axios";
import { UserInfo } from "../pages/InfoModify/InfoModify";
import { UpdatePassword } from "../pages/PasswordModify/PasswordModify";
import { CreateMeetingRoomForm } from "../pages/MeetingRoomManage/CreateMeetingRoomModal";
import { UpdateMeetingRoom } from "../pages/MeetingRoomManage/UpdateMeetingRoom";
import { SearchBooking } from "../pages/BookingManage/BookingManage";
import dayjs from "dayjs";

const axiosInstance = axios.create({
    baseURL: 'http://8.148.23.54/api',
    timeout: 3000
});
axiosInstance.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');

    if(accessToken) {
        config.headers.authorization = 'Bearer ' + accessToken;
    }
    return config;
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        let { data, config } = error.response;

        if (data.code === 401 && !config.url.includes('/user/admin/refresh')) {
            
            const res = await refreshToken();

            if(res.status === 200 || res.status === 201) {
                return axiosInstance(config);
            } else {
                message.error(res.data);

                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
            
        } else {
            return error.response;
        }
    }
)

async function refreshToken() {
    const res = await axiosInstance.get('/user/admin/refresh', {
        params: {
          refresh_token: localStorage.getItem('refresh_token')
        }
    });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    return res;
}

export async function userSearch(username: string, nickName: string, email: string, pageNo: number, pageSize: number) {
    return await axiosInstance.get('/user/list', {
        params: {
            username,
            nickName,
            email,
            pageNo,
            pageSize
        }
    });
}


export async function login(username: string, password: string) {
    return await axiosInstance.post('/user/admin/login', {
        username, password
    });
}

export async function freeze(id: number) {
    return await axiosInstance.get('/user/freeze', {
        params: {
            id
        }
    });
}
export async function getUserInfo() {
    return await axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
    return await axiosInstance.post('/user/admin/update', data);
}

export async function updateUserInfoCaptcha() {
    return await axiosInstance.get('/user/update/captcha');
}

export async function updatePasswordCaptcha(email: string) {
    return await axiosInstance.get('/user/update_password/captcha', {
        params: {
            address: email
        }
    });
}

export async function updatePassword(data: UpdatePassword) {
    return await axiosInstance.post('/user/admin/update_password', data);
}

export async function getMeetingRoomList(name: string, capacity: number, equipment: string, pageNo: number, pageSize: number) {
    return await axiosInstance.get('/meeting-room/list', {
        params: {
            name,
            capacity,
            equipment,
            pageNo,
            pageSize
        }
    });
}

export async function deleteMeetingRoom(id: number) {
    return await axiosInstance.delete('/meeting-room/' + id );
}


export async function createMeetingRoom(meetingRoom: CreateMeetingRoomForm) {
    return await axiosInstance.post('/meeting-room/create', meetingRoom);
}

export async function updateMeetingRoom(meetingRoom: UpdateMeetingRoom) {
    return await axiosInstance.put('/meeting-room/update', meetingRoom);
}

export async function findMeetingRoom(id: number) {
    return await axiosInstance.get('/meeting-room/' + id);
}



export async function getBookingList(searchBooking: SearchBooking, pageNo: number, pageSize: number) {
    let bookingTimeRangeStart;
    let bookingTimeRangeEnd;
    
    if (searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
        const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD');
        const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm');
        bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf();
    }

    if (searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
        const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD');
        const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm');
        bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf();
    }

    return await axiosInstance.get('/booking/list', {
        params: {
            username: searchBooking.username,
            meetingRoomName: searchBooking.meetingRoomName,
            meetingRoomPosition: searchBooking.meetingRoomPosition,
            bookingTimeRangeStart,
            bookingTimeRangeEnd,
            pageNo,
            pageSize
        }
    })
}


export async function apply(id: number) {
    return await axiosInstance.get('/booking/apply/'+ id)
}

export async function reject(id: number) {
    return await axiosInstance.get('/booking/reject/' + id);
}

export async function unbind(id: number) {
    return await axiosInstance.get('/booking/unbind/' + id);
}

export async function meetingRoomBookingCount(startTime: string, endTime: string) {
    return await axiosInstance.get('/statistic/meetingRoomBookingCount', {
        params: {
            startTime,
            endTime
        }
    })
}

export async function userBookingCount(startTime: string, endTime: string) {
    return await axiosInstance.get('/statistic/userBookingCount', {
        params: {
            startTime,
            endTime
        }
    })
}
