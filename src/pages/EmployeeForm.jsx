import React, {useEffect, useMemo, useState} from 'react'
import {Box, Button, Grid, MenuItem, Paper, TextField, Typography} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'
import {employeeService} from '../services/employeeService.js'
import useEmployeeDetailStore from '../store/useEmployeeDetailStore.js'


const initial = {id: undefined, name: '', phone: '', departmentId: '', roleId: ''}

export default function EmployeeForm() {
    const navigate = useNavigate()
    const {id} = useParams()
    const {roles, departments,fetchMasters} = useEmployeesListStore()

    // useEmployeeDetailStore から詳細データを取得
    const {
        employee,
        loading: storeLoading,
        error: storeError,
        fetchEmployeeById,
        saveEmployee,
        reset: resetDetailStore
    } = useEmployeeDetailStore()

    const [model, setModel] = useState(initial)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        async function load() {
            if (id) {
                // const data = await employeeService.get(id)
                // setModel({...data, departmentId: data.departmentId ?? '', roleId: data.roleId ?? ''})
                const data = await fetchEmployeeById(id)
                setModel({
                    ...data,
                    departmentId: data.departmentId ?? '',
                    roleId: data.roleId ?? ''
                })
            }else {
                setModel(initial);
                resetDetailStore();
                setErrors({});
            }
        }
        load()
    }, [id, fetchEmployeeById,resetDetailStore])

    useEffect(() => {
        if (!roles.length || !departments.length) {
            fetchMasters()
        }
    }, [roles.length, departments.length, fetchMasters])

    const validate = useMemo(() => (m) => {
        const e = {}
        if (!m.name?.trim()) e.name = 'ユーザー名の入力は必須です'
        if (!m.phone?.trim()) e.phone = '電話番号の入力は必須です'
        else if (!/^0\d{9,10}$/.test(m.phone.replace(/[-\s]/g, ''))) e.phone = '電話番号の形式で入力してください'
        if (!m.departmentId) e.departmentId = '所属は必須です'
        if (!m.roleId) e.roleId = '権限は必須です'
        return e
    }, [])

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const e = validate(model)
        setErrors(e)
        if (Object.keys(e).length) return
        const payload = {...model, departmentId: Number(model.departmentId), roleId: Number(model.roleId)}
        // await saveEmployee(payload)
        const result = await saveEmployee(model.id, payload)
        navigate('/')
    }

    return (
        <>
            <Typography variant="h5">ユーザー設定</Typography>
            <Box>
                <Button variant="outlined" onClick={() => navigate('/')}>ユーザー一覧</Button>
                <Button sx={{ml: 1}} type="submit" variant="contained">ユーザーの保存</Button>
            </Box>
            <Paper sx={{p: 3}} component="form" onSubmit={handleSubmit}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h5">ユーザー設定</Typography>
                    <Box>
                        <Button variant="outlined" onClick={() => navigate('/')}>ユーザー一覧</Button>
                        <Button sx={{ml: 1}} type="submit" variant="contained">ユーザーの保存</Button>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="ユーザー名" required value={model.name}
                                   error={!!errors.name} helperText={errors.name}
                                   onChange={(e) => setModel({...model, name: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="電話番号" required value={model.phone}
                                   error={!!errors.phone} helperText={errors.phone}
                                   onChange={(e) => setModel({...model, phone: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField select fullWidth label="所属" value={model.departmentId}
                                   error={!!errors.departmentId} helperText={errors.departmentId}
                                   onChange={(e) => setModel({...model, departmentId: e.target.value})}
                        >
                            {departments.map((d) => (
                                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField select fullWidth label="権限" value={model.roleId}
                                   error={!!errors.roleId} helperText={errors.roleId}
                                   onChange={(e) => setModel({...model, roleId: e.target.value})}
                        >
                            {roles.map((r) => (
                                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}
