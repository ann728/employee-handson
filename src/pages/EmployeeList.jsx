import React, {useEffect, useMemo, useState} from 'react'
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {useNavigate} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'

export default function EmployeeList() {
    const navigate = useNavigate()
    const {employees, fetchEmployees, deleteEmployee} = useEmployeesListStore()
    const [q, setQ] = useState('')

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase()
        if (!term) return employees
        return employees.filter((e) =>
            [e.name, e.phone, e.department?.name, e.role?.name]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(term))
        )
    }, [employees, q])

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">ユーザー一覧</Typography>
                <Button variant="contained" onClick={() => navigate('/new')}>ユーザーの作成</Button>
            </Box>
            <TextField fullWidth size="small" placeholder="検索" value={q} onChange={(e) => setQ(e.target.value)}
                       sx={{mb: 2}}/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ユーザー名</TableCell>
                            <TableCell>電話番号</TableCell>
                            <TableCell>部署</TableCell>
                            <TableCell>権限</TableCell>
                            <TableCell align="right">アクション</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map((e) => (
                            <TableRow key={e.id} hover>
                                <TableCell>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <Avatar>{e.name?.[0]?.toUpperCase()}</Avatar>
                                        {e.name}
                                    </Box>
                                </TableCell>
                                <TableCell>{e.phone}</TableCell>
                                <TableCell>{e.department?.name}</TableCell>
                                <TableCell>{e.role?.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => navigate(`/edit/${e.id}`)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton color="error" onClick={() => deleteEmployee(e.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
