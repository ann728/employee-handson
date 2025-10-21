import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {employeeService} from '../services/api.js'

const useAuthStore = create(
    persist(
        (set, get) => ({
            id: null,
            name: '',
            email: '',
            phone: '',
            departmentId: null,
            roleId: null,
            password: '',

            setUser: (userData) => set({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                departmentId: userData.departmentId,
                roleId: userData.roleId,
                password: userData.password,
            }),


            clearUser: () => set({
                id: null,
                name: '',
                email: '',
                phone: '',
                departmentId: null,
                roleId: null,
                password: '',
            }),
        }),
        {name: 'user-storage'}
    )
)

export default useAuthStore;
