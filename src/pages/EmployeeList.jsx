import React, {useEffect, useMemo, useState,forwardRef} from 'react'
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
    Alert,
    Slide
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import {useNavigate} from 'react-router-dom'
import useEmployeesListStore from '../store/useEmployeesListStore.js'

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

 function EmployeeList() {
    const navigate = useNavigate()
    const {employees, fetchEmployees, deleteEmployee} = useEmployeesListStore()
    const [q, setQ] = useState('')

    const [openDialog, setOpenDialog] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    // 昇順か降順か
    const [order, setOrder] = useState('asc');

    // どの列でソートするか
    const [orderBy, setOrderBy] = useState('name');

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

    //ソート方向をトグル（昇順⇄降順）する
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedRows = useMemo(() => {
        const sorted = [...filtered];
        sorted.sort((a, b) => {
            const isAsc = order === 'asc' ? 1 : -1;

            // 比較対象
            const aName = a.name || '';
            const bName = b.name || '';
            const aDept = a.department?.name || '';
            const bDept = b.department?.name || '';
            const aRole = a.role?.name || '';
            const bRole = b.role?.name || '';
            const aPhone = a.phone || '';
            const bPhone = b.phone || '';

            let aValue = '';
            let bValue = '';

            // 第1ソートキー
            switch (orderBy) {
                case 'department':
                    aValue = aDept;
                    bValue = bDept;
                    break;
                case 'role':
                    aValue = aRole;
                    bValue = bRole;
                    break;
                case 'phone':
                    aValue = aPhone;
                    bValue = bPhone;
                    break;
                case 'name':
                default:
                    aValue = aName;
                    bValue = bName;
                    break;
            }

            // 第1ソート
            const primaryCompare = aValue.localeCompare(bValue);
            if (primaryCompare !== 0) {
                return primaryCompare * isAsc;
            }

            // 第2ソートの切り替え
            if (orderBy === 'name') {
                // 名前が同じなら部署順
                return aDept.localeCompare(bDept) * isAsc;
            } else {
                // それ以外なら名前順
                return aName.localeCompare(bName) * isAsc;
            }
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
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'phone'}
                                direction={orderBy === 'phone' ? order : 'asc'}
                                onClick={() => handleRequestSort('phone')}
                            >
                                電話番号
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'department'}
                                direction={orderBy === 'department' ? order : 'asc'}
                                onClick={() => handleRequestSort('department')}
                            >
                                部署
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'role'}
                                direction={orderBy === 'role' ? order : 'asc'}
                                onClick={() => handleRequestSort('role')}
                            >
                                権限
                            </TableSortLabel>
                        </TableCell>
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
            sx={{'& .MuiDialog-paper': {p: 2}}}
            slots={{
                transition: Transition,
            }}
        >
            {/*<DialogTitle>*/}
            {/*    <Box display="flex" alignItems="center" gap={1}>*/}
            {/*        <InfoOutlineIcon/>削除の確認*/}
            {/*    </Box>*/}
            {/*</DialogTitle>*/}

            {/*<DialogContent>*/}
            {/*    <DialogContentText>*/}
            {/*        本当にこのユーザーを削除してもよろしいですか？*/}
            {/*    </DialogContentText>*/}
            {/*</DialogContent>*/}

            <DialogContent>
                {/*<Alert icon={<CheckIcon fontSize="inherit" />} variant="outlined" severity="info"  >*/}
                <Alert variant="outlined" severity="info">
                    本当にこのユーザーを削除してもよろしいですか？
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button color="grey" onClick={handleCloseDialog}>キャンセル</Button>
                <Button color="error" variant="contained" onClick={handleDelete}
                        startIcon={<DeleteIcon/>}>削除</Button>
            </DialogActions>
        </Dialog>
    </Box>)
}
export default EmployeeList;
