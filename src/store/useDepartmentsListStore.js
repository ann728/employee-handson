import {create} from 'zustand';
import {masterService} from '../services/api.js'

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
    },

    async addDepartment(payload) {
        try {
            const department = await masterService.addDepartment(payload);
            set((state) => ({
                departments: [...state.departments, department]
            }));
        } catch (e) {
            set({error: e.message});
        }
    },

    async deleteDepartment(id) {
        try {
            await masterService.removeDepartment(id);
            set((state) => ({
                departments: state.departments.filter(dep => dep.id !== id)
            }));
        } catch (e) {
            set({error: e.message});
        }
    }
}))
export default useDepartmentsListStore;