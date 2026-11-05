import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000');
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: automatically handles expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (data: any) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me')
}

export const membersAPI = {
    getAll: () => api.get('/members'),
    getById: (id: number) => api.get(`/members/${id}`),
    create: (data: any) => api.post('/members', data),
    update: (id: number, data: any) => api.put(`/members/${id}`, data),
    delete: (id: number) => api.delete(`/members/${id}`)
}

export const meetingsAPI = {
    getAll: () => api.get('/meetings'),
    getById: (id: number) => api.get(`/meetings/${id}`),
    create: (data: any) => api.post('/meetings', data),
    update: (id: number, data: any) => api.put(`/meetings/${id}`, data),
    delete: (id: number) => api.delete(`/meetings/${id}`)
}

export const tasksAPI = {
    getAll: () => api.get('/tasks'),
    getById: (id: number) => api.get(`/tasks/${id}`),
    create: (data: any) => api.post('/tasks', data),
    update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
    delete: (id: number) => api.delete(`/tasks/${id}`)
}

export const financesAPI = {
    getAll: () => api.get('/finances'),
    getSummary: () => api.get('/finances/summary/totals'),
    create: (data: any) => api.post('/finances', data),
    update: (id: number, data: any) => api.put(`/finances/${id}`, data),
    delete: (id: number) => api.delete(`/finances/${id}`)
}

export const attendanceAPI = {
    getAll: () => api.get('/attendance'),
    getByMeeting: (meetingId: number) => api.get(`/attendance/meeting/${meetingId}`),
    record: (data: any) => api.post('/attendance', data),
    update: (id: number, data: any) => api.put(`/attendance/${id}`, data),
    delete: (id: number) => api.delete(`/attendance/${id}`)
}

export const loansAPI = {
    getAll: () => api.get('/loans'),
    getById: (id: number) => api.get(`/loans/${id}`),
    getByMember: (memberId: number) => api.get(`/loans/member/${memberId}`),
    getSummary: () => api.get('/loans/summary/stats'),
    create: (data: any) => api.post('/loans', data),
    update: (id: number, data: any) => api.put(`/loans/${id}`, data),
    delete: (id: number) => api.delete(`/loans/${id}`)
}
export const loanPaymentsAPI = {
    getByLoan: (loanId: number) => api.get(`/loan-payments/loan/${loanId}`),
    getById: (id: number) => api.get(`/loan-payments/${id}`),
    record: (data: any) => api.post('/loan-payments', data),
    update: (id: number, data: any) => api.put(`/loan-payments/${id}`, data),
    delete: (id: number) => api.delete(`/loan-payments/${id}`)
}
export const exportsAPI = {
    exportMembersPDF: () => api.get('/exports/members/pdf', { responseType: 'blob' }),
    exportMembersExcel: () => api.get('/exports/members/excel', { responseType: 'blob' }),
    exportFinancesPDF: () => api.get('/exports/finances/pdf', { responseType: 'blob' }),
    exportFinancesExcel: () => api.get('/exports/finances/excel', { responseType: 'blob' }),
}

export default api

