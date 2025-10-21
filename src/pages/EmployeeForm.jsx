import React, {useEffect, useMemo, useState, useCallback} from 'react'
import {Box, Button, Grid, MenuItem, Paper, TextField, Typography} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'
import useEmployeeDetailStore from '../store/useEmployeeDetailStore.js'
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod';
import {useTranslation} from 'react-i18next';


const initial = {id: undefined, name: '', phone: '', departmentId: '', roleId: ''}

export function useEmployeeSchema() {
    const {t} = useTranslation();

    return z.object({
        name: z.string().min(1, t('employeeForm.errors.name')),
        phone: z
            .string()
            .min(1, t('employeeForm.errors.phone.required'))
            .regex(/^0\d{9,10}$/, t('employeeForm.errors.phone.format')),
        departmentId: z.string().min(1, t('employeeForm.errors.department')),
        roleId: z.string().min(1, t('employeeForm.errors.role')),
    });
}


export default function EmployeeForm() {

    const {t} = useTranslation();
    const navigate = useNavigate()
    const {id} = useParams()
    const {roles, departments, fetchMasters} = useEmployeesListStore();

    const employeeSchema = useEmployeeSchema();

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
                    <Typography variant="h5">{t('employeeForm.title')}</Typography>
                    <Box>
                        <Button variant="outlined" onClick={() => navigate('/')}>{t('employeeForm.buttons.back')}</Button>
                        <Button sx={{ml: 1}} type="submit" variant="contained">{t('employeeForm.buttons.save')}</Button>
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
                                    label={t('employeeForm.labels.name')}
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
                                label={t('employeeForm.labels.phone')}

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
                                label={t('employeeForm.labels.department')}
                                // required
                                error={!!errors.departmentId}
                                helperText={errors.departmentId?.message}
                            >
                                <MenuItem value="">
                                    <em>{t('employeeForm.placeholders.select')}</em>
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
                                label={t('employeeForm.labels.role')}
                                // required
                                error={!!errors.roleId}
                                helperText={errors.roleId?.message}
                            >
                                <MenuItem value="">
                                    <em>{t('employeeForm.placeholders.select')}</em>
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
