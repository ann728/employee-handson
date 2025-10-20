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
            const sorted = departments.sort((a, b) => a.id - b.id);
            set({departments: sorted}
            );
        } catch (e) {
            set({error: e.message});
        } finally {
            set({loading: false});
        }
    }
}))
export default useDepartmentsListStore;