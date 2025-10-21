import {create} from 'zustand'
import {employeeService,masterService} from '../services/api.js'

const useEmployeesListStore = create((set, get) => ({
    employees: [],
    roles: [],
    departments: [],
    loading: false,
    error: null,

    async fetchMasters() {
      try {
        set({ loading: true, error: null })
        const [roles, departments] = await Promise.all([
          masterService.roles(),
          masterService.departments(),
        ])
        set({ roles, departments })
      } catch (e) {
        set({ error: e.message })
      } finally {
        set({ loading: false })
      }
    },

    async fetchEmployees() {
        try {
            set({loading: true, error: null})
            const employees = await employeeService.list()
            set({employees})
        } catch (e) {
            set({error: e.message})
        } finally {
            set({loading: false})
        }
    },

    async deleteEmployee(id) {
        await employeeService.remove(id)
        set({employees: get().employees.filter((e) => e.id !== id)})
    },
}))

export default useEmployeesListStore
