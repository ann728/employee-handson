import {create} from 'zustand';
import {masterService} from '../services/employeeService'

const useDepartmentsListStore = create((set, get) => ({
    departments: [],
    loading: false,
    error: null,

    async fetchDepartments() {
        try {
            set({loading: true, error: null});
            const departments = await masterService.departments();
            set({departments});
        } catch (e) {
            set({error: e.message});
        } finally {
            set({loading: false});
        }
    }
}))
export default useDepartmentsListStore;