import axios from "axios"
import cookie from "react-cookies"

export const BASE_URL = 'http://localhost:8080/api/'

export const endpoints = {
    // APIs for auth
    'register_student': '/auth/register/student',
    'register_lecturer': '/auth/register/lecturer',
    'login': '/auth/login',


    'current-user': '/user/current-user',
    // 'update-user': '/secure/update-profile',


    // APIs for user
    'classrooms': '/user/classrooms',
    'classroom-details': (classroomId) => `/user/classrooms/${classroomId}`,
    'sport_fields': '/user/sport-fields',
    'sport_field-details': (sportFieldId) => `/user/sport-fields/${sportFieldId}`,
    'equipments': '/user/equipments',
    'equipment-details': (equipmentId) => `/user/equipments/${equipmentId}`,
    'bookings': (userId) => `/bookings/user/${userId}`,
    'boooking-details': (bookingId) => `/bookings/${bookingId}`,
    'create-booking': '/bookings/create',
    'cancel-booking': (bookingId) => `/bookings/cancel/${bookingId}`,
    'invoiceByBooking': (bookingId) => `/invoices/by-booking/${bookingId}`,




    // APIs for Momo
    'retuernURL': '/api/payment/momo/return',
    'momoInit': (invoiceId) => `/payments/momo/init/${invoiceId}`,



    // APIs for admin
    'createClassroom': '/admin/classrooms',
    'updateClassroom': (classroomId) => `/admin/classrooms/${classroomId}`,
    'deleteClassroom': (classroomId) => `/admin/classrooms/${classroomId}`,
    'getClassrooms': '/admin/classrooms',
    'getClassroomDetails': (classroomId) => `/admin/classrooms/${classroomId}`,
    'createSportField': '/admin/sport_fields',
    'updateSportField': (sportFieldId) => `/admin/sport_fields/${sportFieldId}`,
    'deleteSportField': (sportFieldId) => `/admin/sport_fields/${sportFieldId}`,
    'getSportFields': '/admin/sport_fields',
    'getSportField-details': (sportFieldId) => `/admin/sport-fields/${sportFieldId}`,
    'createEquipment': '/admin/equipments',
    'updateEquipment': (equipmentId) => `/admin/equipments/${equipmentId}`,
    'deleteEquipment': (equipmentId) => `/admin/equipments/${equipmentId}`,
    'getEquipments': '/admin/equipments',
    'getEquipment-details': (equipmentId) => `/admin/equipments/${equipmentId}`,
    'getPendingBookings': '/admin/bookings/pending',
    'approveBooking': (bookingId) => `/admin/bookings/${bookingId}/approve`,
    'rejectBooking': (bookingId) => `/admin/bookings/${bookingId}/reject`,
    'getAllBookings': '/admin/bookings',
    'getBookingDetails': (bookingId) => `/admin/bookings/${bookingId}`,


    // User management
    getAllUsers: "/admin/users",
    lockUser: (id) => `/admin/users/${id}/lock`,
    unlockUser: (id) => `/admin/users/${id}/unlock`,

    // Lecturer requests
    getLecturerRequests: "/admin/lecturer-requests",
    approveLecturer: (id) => `/admin/lecturer-requests/${id}/approve`,
    rejectLecturer: (id) => `/admin/lecturer-requests/${id}/reject`,
    report_monthly_raw: (month, year) =>
        `/report/raw/monthly?month=${month}&year=${year}`,
    report_range_raw: (from, to) =>
        `/report/raw/range?from=${from}&to=${to}`,

    report_bookings_by_type: (from, to) =>
        `/report/raw/bookings-by-type?from=${from}&to=${to}`,
    report_bookings_by_status: (from, to) =>
        `/report/raw/bookings-by-status?from=${from}&to=${to}`,
    report_revenue_sport_field: (from, to) =>
        `/report/raw/revenue-sport-field?from=${from}&to=${to}`,
    report_peak_hours: (from, to) =>
        `/report/raw/peak-hours?from=${from}&to=${to}`,

    report_analysis_monthly: (m, y, mom = true) =>
        `/report/analysis?month=${m}&year=${y}&mom=${mom}`,
    report_analysis_range: (from, to) =>
        `/report/analysis-range?from=${from}&to=${to}`,





}


export const authAPIs = () => {
    const token = cookie.load("jwtToken");
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}



export default axios.create({
    baseURL: BASE_URL
});