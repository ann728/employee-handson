import React, {useEffect, useMemo, useState, useCallback} from 'react'
import {Box, Button, Grid, MenuItem, Paper, TextField, Typography} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'
import {employeeService} from '../services/employeeService.js'
import useEmployeeDetailStore from '../store/useEmployeeDetailStore.js'
import {useForm, Controller} from 'react-hook-form';


const initial = {id: undefined, name: '', phone: '', departmentId: '', roleId: ''}

export default function EmployeeForm() {
    const navigate = useNavigate()
    const {id} = useParams()
    const {roles, departments, fetchMasters} = useEmployeesListStore()

    // useEmployeeDetailStore から詳細データを取得
    const {
        employee,
        loading: storeLoading,
        error: storeError,
        fetchEmployeeById,
        saveEmployee,
        reset: resetDetailStore
    } = useEmployeeDetailStore()

    // const [model, setModel] = useState(initial)
    // const [errors, setErrors] = useState({})

    // useForm フックを初期化
    const {
        handleSubmit,
        control,
        reset, // フォームの値をリセットするために使用
        formState: {errors}, // バリデーションエラーを取得 (以前の errors state を代替)
    } = useForm({
        defaultValues: initial, // 既存の initial を defaultValues として使用
    });

    useEffect(() => {
        async function load() {
            if (id) {
                // const data = await employeeService.get(id)
                // setModel({...data, departmentId: data.departmentId ?? '', roleId: data.roleId ?? ''})
                const data = await fetchEmployeeById(id)
                reset({
                    ...data,
                    departmentId: data.departmentId ?? '',
                    roleId: data.roleId ?? ''
                })
            } else {
                reset(initial);
                resetDetailStore();
                // setErrors({});
            }
        }

        load()
    }, [id, fetchEmployeeById, resetDetailStore, reset])

    useEffect(() => {
        if (!roles.length || !departments.length) {
            fetchMasters()
        }
    }, [roles.length, departments.length, fetchMasters])

    // const validate = useMemo(() => (m) => {
    //     const e = {}
    //     if (!m.name?.trim()) e.name = 'ユーザー名の入力は必須です'
    //     if (!m.phone?.trim()) e.phone = '電話番号の入力は必須です'
    //     else if (!/^0\d{9,10}$/.test(m.phone.replace(/[-\s]/g, ''))) e.phone = '電話番号の形式で入力してください'
    //     if (!m.departmentId) e.departmentId = '所属は必須です'
    //     if (!m.roleId) e.roleId = '権限は必須です'
    //     return e
    // }, [])

    // const handleSubmit = async (ev) => {
    //     ev.preventDefault()
    //     const e = validate(model)
    //     setErrors(e)
    //     if (Object.keys(e).length) return
    //     const payload = {...model, departmentId: Number(model.departmentId), roleId: Number(model.roleId)}
    //     // await saveEmployee(payload)
    //     const result = await saveEmployee(payload)
    //     navigate('/')
    // }

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            departmentId: data.departmentId === '' ? null : Number(data.departmentId),
            roleId: data.roleId === '' ? null : Number(data.roleId),
        };
        const result = await saveEmployee(payload);
        if (result) {
            navigate('/');
        }
    };

    return (
        <>
            <Typography variant="h5">ユーザー設定</Typography>
            <Box>
                <Button variant="outlined" onClick={() => navigate('/')}>ユーザー一覧</Button>
                <Button sx={{ml: 1}} type="submit" variant="contained">ユーザーの保存</Button>
            </Box>
            <Paper sx={{p: 3}} component="form" onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h5">ユーザー設定</Typography>
                    <Box>
                        <Button variant="outlined" onClick={() => navigate('/')}>ユーザー一覧</Button>
                        <Button sx={{ml: 1}} type="submit" variant="contained">ユーザーの保存</Button>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{required: 'ユーザー名の入力は必須です'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="ユーザー名"
                                    required
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: '電話番号の入力は必須です',
                                pattern: {
                                    value: /^0\d{9,10}$/,
                                    message: '電話番号の形式で入力してください',
                                },
                            }}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="電話番号"
                                    required
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    onChange={(e) => {
                                        const formattedValue = e.target.value.replace(/[-\s]/g, '');
                                        field.onChange(formattedValue);
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="departmentId"
                            control={control}
                            rules={{required: '所属は必須です'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    label="所属"
                                    required
                                    error={!!errors.departmentId}
                                    helperText={errors.departmentId?.message}
                                >
                                    <MenuItem value="">
                                        <em>選択してください</em>
                                    </MenuItem>
                                    {departments.map((d) => (
                                        <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="roleId"
                            control={control}
                            rules={{required: '権限は必須です'}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    label="権限"
                                    required
                                    error={!!errors.roleId}
                                    helperText={errors.roleId?.message}
                                >
                                    <MenuItem value="">
                                        <em>選択してください</em>
                                    </MenuItem>
                                    {roles.map((r) => (
                                        <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}
