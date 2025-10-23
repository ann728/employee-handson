import {create} from 'zustand'
import {employeeService} from '../services/api.js'
import bcrypt from 'bcryptjs'

//詳細画面専用のストア
const useEmployeeDetailStore = create((set, get) => ({
    employee: null,
    loading: false,
    error: null,

    async fetchEmployeeById(id) {
        try {
            set({loading: true, error: null})
            const employee = await employeeService.get(id)

            set({employee})
            return employee;
        } catch (e) {
            set({error: e.message})
        } finally {
            set({loading: false})
        }
    },

    //ID有無で新規 or 更新を判定して API 呼び出し
    async saveEmployee(emp) {
        const idNum = Number(emp.id);
        const isNew = !idNum;


        if (!emp.password) {
            delete emp.password;
        } else {
            emp.password = bcrypt.hashSync(emp.password, 10);
        }

        if (isNew) {
            await employeeService.create(emp);
        } else {
            await employeeService.update(emp.id, emp);
        }



        return true;
    },


}))

export default useEmployeeDetailStore