import {create} from 'zustand';
import {employeeService} from '../services/api';

// フォームフィールドの初期状態を定義
const initialEmployeeState = {
    id: undefined,
    name: '',
    phone: '',
    departmentId: '',
    roleId: ''
};

const useEmployeeDetailStore = create((set, get) => ({

    ...initialEmployeeState,
    loading: false,
    error: null,

    setId: (id) => set({ id }),
    setName: (name) => set({ name }),
    setPhone: (phone) => set({ phone }),
    setDepartmentId: (departmentId) => set({ departmentId }),
    setRoleId: (roleId) => set({ roleId }),

    async fetchEmployeeById(id) {
        try {
            set({loading: true, error: null});
            const employeeData = await employeeService.get(id);

            set({
                id: employeeData.id,
                name: employeeData.name,
                phone: employeeData.phone,
                departmentId: employeeData.departmentId ?? '',
                roleId: employeeData.roleId ?? ''
            });
        } catch (e) {
            console.error("Failed to fetch employee by ID:", e);
            set({error: e.message || '従業員データの取得に失敗しました'});
        } finally {
            set({loading: false});
        }
    },

    async saveEmployee() {

        const {id, name, phone, departmentId, roleId} = get();
        const payload = {
            id,
            name,
            phone,
            departmentId: departmentId === '' ? null : Number(departmentId),
            roleId: roleId === '' ? null : Number(roleId),
        };

        const isNew = !payload.id;

        if (isNew) {
            await employeeService.create(payload);
        } else {
            await employeeService.update(payload.id, payload);
        }
        return true;

    },

    reset: () => set({...initialEmployeeState, loading: false, error: null}),
}));

export default useEmployeeDetailStore;