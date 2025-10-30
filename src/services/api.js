import axios from 'axios'
import bcrypt from 'bcryptjs';
import { v4 as uuid } from "uuid";
;

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
        const res = await api.patch(`/employees/${id}`, payload)
        return res.data
    },
    async remove(id) {
        await api.delete(`/employees/${id}`)
    },
    async login(email, password) {

        const res = await api.get(`/employees?email=${email}`)
        const user = res.data[0];
        if (user) {
            const isMatch = bcrypt.compareSync(password, user.password);
            if (isMatch) {
                return user;
            }
        }
        return null;
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
    },
    async updateDepartment(id, payload) {
        const res = await api.put(`/departments/${id}`, payload);
        return res.data;
    },
}

export const rememberMeService = {

    //トークン発行
    async create(userId) {
        const token = uuid();
        const expires = new Date();

        //有効期限7日に設定
        expires.setDate(expires.getDate() + 7);
        const payload = {
            user_id: userId,
            token,
            expires_at: expires.toISOString(),
        }
        const res = await api.post('/remember_tokens', payload);
        return token;
    },

    //トークン検索
    async get(token) {
        const res = await api.get(`/remember_tokens?token=${token}`);
        return res.data[0];
    },

    //トークン削除
    async delete(token) {

        const res = await api.get(`/remember_tokens?token=${token}`);
        const user_token = res.data[0];

        if (user_token) {
            await api.delete(`/remember_tokens?/{user_token.id}`);
        }
    }


}


