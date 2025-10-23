// src/store/useAuthStore.js
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {employeeService} from '../services/api.js'

const useAuthStore = create(
    persist(
        (set, get) => ({
            // ユーザー情報
            id: null,
            name: '',
            email: '',
            phone: '',
            departmentId: null,
            roleId: null,
            password: '',

            // 状態管理
            loading: false,
            error: null,

            isLoggedIn: false,

            setUser: (userData) =>
                set({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    departmentId: userData.departmentId,
                    roleId: userData.roleId,

                }),

            login: async (email, password) => {
                try {
                    set({loading: true, error: null});

                    //  const users = await employeeService.list();
                    const user = await employeeService.login(email, password);

                    if (!user) {
                        set({error: 'メールアドレスまたはパスワードが違います'});
                        return false;
                    }

                    get().setUser(user);
                    set({isLoggedIn: true});
                    return true;
                } catch (err) {
                    set({error: 'ログインに失敗しました'});
                    return false;
                } finally {
                    set({loading: false});

                }
            },
            logout: () =>
                set({
                    id: null,
                    name: '',
                    email: '',
                    phone: '',
                    departmentId: null,
                    roleId: null,
                    password: '',
                    error: null,
                    isLoggedIn: false,
                }),
        }),
        {
            name: 'user-storage',
        },
    )
)

export default useAuthStore;
