import React, {useEffect, useMemo, useState, useCallback} from 'react'
import {Box, Button, Grid, MenuItem, Paper, TextField, Typography} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'
import useEmployeeDetailStore from '../store/useEmployeeDetailStore.js'
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod';


const initial = {id: undefined, name: '', phone: '', departmentId: '', roleId: ''}

export const employeeSchema = z.object({
    name: z.string().min(1, "名前は必須です"),
    phone: z
        .string()
        .min(1, "電話番号は必須です")
        .regex(/^0\d{9,10}$/, "電話番号の形式で入力してください"),
    departmentId: z.string().min(1, "所属は必須です"),
    roleId: z.string().min(1, "権限は必須です"),
})


export default function EmployeeForm() {

    const navigate = useNavigate()
    const {id} = useParams()
    const {roles, departments, fetchMasters} = useEmployeesListStore()

    // useEmployeeDetailStore から詳細データを取得
    const {
        loading: storeLoading, error: storeError, fetchEmployeeById, saveEmployee,
    } = useEmployeeDetailStore()

    // useForm フックを初期化
    const {
        handleSubmit, control, reset, formState: {errors}, register,
    } = useForm({
        resolver: zodResolver(employeeSchema), defaultValues: initial,
    });

    useEffect(() => {
        async function load() {
            if (id) {

                const data = await fetchEmployeeById(id)
                console.log("fetch result:", data)
                reset({
                    id: data.id != null ? String(data.id) : '',
                    name: data.name,
                    phone: data.phone,
                    departmentId: data.departmentId != null ? String(data.departmentId) : '',
                    roleId: data.roleId != null ? String(data.roleId) : ''

                });
            } else {
                reset(initial);
            }
        }

        load()
    }, [id, fetchEmployeeById, reset])

    useEffect(() => {
        if (!roles.length || !departments.length) {
            fetchMasters()
        }
    }, [roles.length, departments.length, fetchMasters])

    const onSubmit = async (data) => {
        console.log("submit data:", data);
        const payload = {
            ...data,
            // id: data.id ? Number(data.id) : undefined,
            id: id,
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
                            render={({field}) => (
                                <TextField
                                {...field}
                                fullWidth
                                label="ユーザー名"
                                // required
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({field}) => (<TextField
                                {...field}
                                fullWidth
                                label="電話番号"
                                // required
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                onChange={(e) => {
                                    const formattedValue = e.target.value.replace(/[-\s]/g, '');
                                    field.onChange(formattedValue);
                                }}
                            />)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="departmentId"
                            control={control}
                            render={({field}) => (<TextField
                                {...field}
                                select
                                fullWidth
                                label="所属"
                                // required
                                error={!!errors.departmentId}
                                helperText={errors.departmentId?.message}
                            >
                                <MenuItem value="">
                                    <em>選択してください</em>
                                </MenuItem>
                                {departments.map((d) => (
                                    <MenuItem key={d.id} value={d.id.toString()}>{d.name}</MenuItem>))}
                            </TextField>)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="roleId"
                            control={control}
                            render={({field}) => (<TextField
                                {...field}
                                select
                                fullWidth
                                label="権限"
                                // required
                                error={!!errors.roleId}
                                helperText={errors.roleId?.message}
                            >
                                <MenuItem value="">
                                    <em>選択してください</em>
                                </MenuItem>
                                {roles.map((r) => (
                                    <MenuItem key={r.id} value={r.id.toString()}>{r.name}</MenuItem>))}
                            </TextField>)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </>)
}
