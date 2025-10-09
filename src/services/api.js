import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080' })

// Service functions
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
}
