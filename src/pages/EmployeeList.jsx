import React, {useEffect, useMemo, useState, forwardRef} from 'react';
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
    TableSortLabel,
    Alert,
    Slide
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate} from 'react-router-dom';
import useEmployeesListStore from '../store/useEmployeesListStore.js';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

//
// function compare(a, b) {
//     if (a < b) return -1; // aが先
//     if (a > b) return 1;  // bが先
//     return 0;
// }

//降順で比較する関数
function descendingComparator(a, b, orderBy) {
    const getValue = (obj) => {
        switch (orderBy) {
            case 'department':
                return obj.department?.name || '';
            case 'role':
                return obj.role?.name || '';
            case 'phone':
                return obj.phone || '';
            case 'name':
            default:
                return obj.name || '';
        }
    };
    const aValue = getValue(a);
    const bValue = getValue(b);

    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
}

//現在の order に応じて昇順／降順の関数を返す
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function EmployeeList() {
    const navigate = useNavigate();
    const {employees, fetchEmployees, deleteEmployee} = useEmployeesListStore();
    const [q, setQ] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [order, setOrder] = useState('asc'); // 昇順か降順か
    const [orderBy, setOrderBy] = useState('name'); // どの列でソートするか

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return employees;
        return employees.filter((e) => [e.name, e.phone, e.department?.name, e.role?.name]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term)));
    }, [employees, q]);

    const handleOpenDialog = (id) => {
        setSelectedId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedId(null);
    };

    const handleDelete = () => {
        if (selectedId !== null) {
            deleteEmployee(selectedId);
        }
        handleCloseDialog();
    };

    //クリックされた列が現在ソート中で昇順なら降順に切替
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    //返された比較関数を使って実際に並べ替える
    const sortedRows = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const comparator = getComparator(order, orderBy);
            const primaryCompare = comparator(a, b);

            if (primaryCompare !== 0) return primaryCompare;

            // 第2・第3ソートをルールに従って追加
            if (orderBy === 'name') {
                // ユーザー名ソート時 → 第2ソートはID順
                // console.log("nameCompare:", a.name, b.name, nameCompare, a.id, b.id)
                return a.id - b.id;
            } else {
                // その他列ソート時 → 第2: ユーザー名、第3: ID
                const nameCompare = (a.name || '').localeCompare(b.name || '');
                // if (nameCompare !== 0) return nameCompare;
                // console.log("nameCompare:", a.name, b.name, nameCompare, a.id, b.id)
                return a.id - b.id;

            }
        });

    }, [filtered, order, orderBy])

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">ユーザー一覧</Typography>
                <Button variant="contained" onClick={() => navigate('/new')}>ユーザーの作成</Button>
            </Box>

            <TextField
                fullWidth
                size="small"
                placeholder="検索"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                sx={{mb: 2}}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'name')}
                                >
                                    ユーザー名
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'phone'}
                                    direction={orderBy === 'phone' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'phone')}
                                >
                                    電話番号
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'department'}
                                    direction={orderBy === 'department' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'department')}
                                >
                                    部署
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'role'}
                                    direction={orderBy === 'role' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'role')}
                                >
                                    権限
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">アクション</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows.map((e) => (
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
                <DialogContent>
                    <Alert variant="outlined" severity="info">
                        本当にこのユーザーを削除してもよろしいですか？
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button color="grey" onClick={handleCloseDialog}>キャンセル</Button>
                    <Button color="error" variant="contained" onClick={handleDelete} startIcon={<DeleteIcon/>}>
                        削除
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>);
}

export default EmployeeList;
