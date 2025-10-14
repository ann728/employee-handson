import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeesListStore from '../store/useEmployeesListStore.js';
import useEmployeeDetailStore from '../store/useEmployeeDetailStore.js';

export default function EmployeeForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { roles, departments, fetchMasters } = useEmployeesListStore();

    const {
        id: employeeId,
        name,
        phone,
        departmentId,
        roleId,
        loading: storeLoading,
        error: storeError,
        fetchEmployeeById,
        saveEmployee,
        reset: resetDetailStore,
        setName,
        setPhone,
        setDepartmentId,
        setRoleId,
    } = useEmployeeDetailStore();

    const [errors, setErrors] = useState({});

    const validate = () => {
        const currentErrors = {};
        if (!name?.trim()) currentErrors.name = 'ユーザー名の入力は必須です';
        if (!phone?.trim()) currentErrors.phone = '電話番号の入力は必須です';
        else if (!/^0\d{9,10}$/.test(phone.replace(/[-\s]/g, ''))) currentErrors.phone = '電話番号の形式で入力してください';
        if (!departmentId) currentErrors.departmentId = '所属は必須です';
        if (!roleId) currentErrors.roleId = '権限は必須です';

        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    useEffect(() => {
        async function loadEmployeeData() {
            if (id) {
                await fetchEmployeeById(id);
            } else {
                resetDetailStore();
                setErrors({});
            }
        }
        loadEmployeeData();
    }, [id, fetchEmployeeById, resetDetailStore]);

    useEffect(() => {
        if (!roles.length || !departments.length) {
            fetchMasters();
        }
    }, [roles.length, departments.length, fetchMasters]);


    const onSubmit = async (ev) => {
        ev.preventDefault();

        if (!validate()) {
            return;
        }

        const success = await saveEmployee();
        if (success) {
            navigate('/');
        } else {
            console.error("従業員の保存に失敗しました:", storeError);
        }
    };

    if (storeLoading) {
        return <Typography>Loading...</Typography>;
    }
    if (storeError) {
        return <Typography color="error">Error: {storeError}</Typography>;
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">ユーザー設定</Typography>
                <Box>
                    <Button variant="outlined" onClick={() => navigate('/')}>ユーザー一覧</Button>
                    <Button sx={{ ml: 1 }} type="submit" variant="contained" onClick={onSubmit}>ユーザーの保存</Button>
                </Box>
            </Box>

            <Paper sx={{ p: 3 }} component="form" onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="ユーザー名"
                            required
                            value={name}

                            // onChange={(e) => set({ name: e.target.value })}
                            onChange={(e) => setName(e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="電話番号"
                            required
                            value={phone}

                            onChange={(e) => {
                                const formattedValue = e.target.value.replace(/[-\s]/g, '');
                                // set({ phone: formattedValue });
                                setPhone(formattedValue);
                            }}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="所属"
                            required
                            value={departmentId}

                            // onChange={(e) => set({ departmentId: e.target.value })}
                            onChange={(e) => setDepartmentId(e.target.value)}
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
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            label="権限"
                            required
                            value={roleId}

                            // onChange={(e) => set({ roleId: e.target.value })}
                            onChange={(e) => setRoleId(e.target.value)}
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
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}