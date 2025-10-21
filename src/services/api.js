import axios from 'axios'

const api = axios.create({baseURL: 'http://localhost:8080'})


export const employeeService = {
    async list() {
        const res = await api.get('/employees?_expand=department&_expand=role')
        return res.data
    },
    async get(id) {
        const res = await api.get(`/employees/${id}`)
        return res.data
    },
    async create(payload) {
        const res = await api.post('/employees', payload)
        return res.data
    },
    async update(id, payload) {
        const res = await api.put(`/employees/${id}`, payload)
        return res.data
    },
    async remove(id) {
        await api.delete(`/employees/${id}`)
    },
    async login(email, password) {
        const res = await api.get(`/employees?email=${email}&password=${password}&_expand=department&_expand=role`)
        // 該当するユーザーがいれば配列の最初の要素を返す
        return res.data.length > 0 ? res.data[0] : null
    },
}

export const masterService = {
    async roles() {
        const res = await api.get('/roles')
        return res.data
    },
    async departments() {
        const res = await api.get('/departments')
        return res.data
    },
    async addDepartment(payload) {
        const res = await api.post('/departments', payload)
        return res.data
    },
    async removeDepartment(id) {
        await api.delete(`/departments/${id}`);
    }
}


