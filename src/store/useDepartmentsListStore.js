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

    // async addDepartment(payload) {
    //     try {
    //         const department = await masterService.addDepartment(payload);
    //         set((state) => ({
    //             departments: [...state.departments, department]
    //         }));
    //     } catch (e) {
    //         set({error: e.message});
    //     }
    // },

    async saveDepartment(dep) {
        const idNum = Number(dep.id);
        const isNew = !idNum;

        const savedDep = isNew
            ? await masterService.addDepartment(dep)
            : await masterService.updateDepartment(dep.id, dep);

        set((state) => ({
            departments: isNew
                ? [...state.departments, savedDep]
                : state.departments.map((d) => (d.id === dep.id ? savedDep : d)),
        }));

        return savedDep;
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