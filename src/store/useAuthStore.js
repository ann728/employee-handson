// src/store/useAuthStore.js
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {employeeService, rememberMeService} from '../services/api.js'

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

            remember: false,

            setUser: (userData) =>
                set({
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    departmentId: userData.departmentId,
                    roleId: userData.roleId,
                    loading: false,


                }),

            login: async (email, password, remember = false) => {
                try {
                    set({loading: true, error: null});

                    //  const users = await employeeService.list();
                    const user = await employeeService.login(email, password);

                    if (!user) {
                        set({error: 'メールアドレスまたはパスワードが違います'});
                        return false;
                    }

                    get().setUser(user);
                    set({isLoggedIn: true, remember});

                    //remember meチェック時
                    if (remember) {
                        const token = await rememberMeService.create(user.id);
                        localStorage.setItem('rememberMeToken', token);
                    }
                    return true;
                } catch (err) {
                    set({error: 'ログインに失敗しました'});
                    return false;
                } finally {
                    set({loading: false});

                }
            },

            //自動ログイン
            //ページ初期表示時にlocalStorage内のトークンをチェック
            autoLogin: async () => {
                const token = localStorage.getItem('rememberMeToken');
                if (!token) {
                    return false;
                }

                const user_token = await rememberMeService.get(token);
                if (!user_token) {
                    return false;
                }

                // 有効期限切れの場合は削除
                const now = new Date();
                const expires = new Date(user_token.expires_at);
                if (now > expires) {
                    await rememberMeService.delete(token);
                    localStorage.removeItem('rememberMeToken');
                    return false;
                }

                // 期限内ユーザー情報再取得
                const user = await employeeService.get(user_token.user_id);
                get().setUser(user);
                set({isLoggedIn: true, remember: true});
                return true;
            },
            // logout: () =>
            //     set({
            //         id: null,
            //         name: '',
            //         email: '',
            //         phone: '',
            //         departmentId: null,
            //         roleId: null,
            //         password: '',
            //         error: null,
            //         isLoggedIn: false,
            //     }),

            logout: async () => {
                const {remember} = get();
                if (remember) {
                    const token = localStorage.getItem('rememberMeToken');
                    if (token) {
                        await rememberMeService.delete(token);
                        localStorage.removeItem('rememberMeToken');
                    }
                }
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
                    remember: false,
                })
            }
        }),
        {
            name: 'user-storage'
        },
    )
)

export default useAuthStore;
