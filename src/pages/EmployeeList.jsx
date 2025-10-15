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
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TableSortLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import {useNavigate} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'


export default function EmployeeList() {
    const navigate = useNavigate()
    const {employees, fetchEmployees, deleteEmployee} = useEmployeesListStore()
    const [q, setQ] = useState('')

    const [openDialog, setOpenDialog] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const [order, setOrder] = useState('asc'); // 昇順か降順か
    const [orderBy, setOrderBy] = useState('name'); // どの列でソートするか

    useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase()
        if (!term) return employees
        return employees.filter((e) => [e.name, e.phone, e.department?.name, e.role?.name]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term)))
    }, [employees, q])

    // ダイアログを開く
    const handleOpenDialog = (id) => {
        setSelectedId(id)
        setOpenDialog(true)
    }

    // ダイアログを閉じる
    const handleCloseDialog = () => {
        setOpenDialog(false)
        setSelectedId(null)
    }

    const handleDelete = () => {
        if (selectedId !== null) {
            deleteEmployee(selectedId)
        }
        handleCloseDialog()
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedRows = useMemo(() => {
        const sorted = [...filtered];
        sorted.sort((a, b) => {

            const nameOrder = order === 'asc' ? 1 : -1;
            const aName = a.name || '';
            const bName = b.name || '';
            if (aName < bName) return -1 * nameOrder;
            if (aName > bName) return 1 * nameOrder;

            // 第2ソート: 部署名
            const deptCompare = (a.department?.name || '').localeCompare(b.department?.name || '');
            if (deptCompare !== 0) return deptCompare;

            return 0;
        });
        return sorted;
    }, [filtered, order, orderBy]);

    return (<Box>
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
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={() => handleRequestSort('name')}
                            >
                                ユーザー名
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>電話番号</TableCell>
                        <TableCell>部署</TableCell>
                        <TableCell>権限</TableCell>
                        <TableCell align="right">アクション</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {sortedRows.map((e) => (<TableRow key={e.id} hover>
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
                            <IconButton color="error" onClick={() => handleOpenDialog(e.id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>))}
                </TableBody>
            </Table>
        </TableContainer>


        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            sx={{'& .MuiDialog-paper': {p: 2,},}}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <InfoOutlineIcon/>削除の確認
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    本当にこのユーザーを削除してもよろしいですか？
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="grey" onClick={handleCloseDialog}>キャンセル</Button>
                <Button color="error" variant="contained" onClick={handleDelete}
                        startIcon={<DeleteIcon/>}>削除</Button>
            </DialogActions>
        </Dialog>
    </Box>)
}
