import {create} from 'zustand'
import {employeeService} from '../services/employeeService'

const useEmployeeDetailStore = create((set, get) => ({
    employee: null,
    loading: false,
    error: null,

    async fetchEmployeeById(id) {
        try {
            set({loading: true, error: null})
            const employee = await employeeService.get(id)
            set({employee})
        } catch (e) {
            set({error: e.message})
        } finally {
            set({loading: false})
        }
    },

    async saveEmployee(emp) {
        const isNew = !emp.id
        if (isNew) {
            await employeeService.create(emp)
        } else {
            await employeeService.update(emp.id, emp)
        }

        return true;
    },

    reset: () => set({ employee: null, loading: false, error: null }),
}))

export default useEmployeeDetailStore