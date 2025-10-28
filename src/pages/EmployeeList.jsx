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
    TableSortLabel,
    Snackbar,
    Alert,
    TablePagination,
    Divider as MuiDivider,
    Breadcrumbs as MuiBreadcrumbs,
    Grid,
    Link,
    Chip as MuiChip,
    Tooltip,
    Toolbar
} from '@mui/material';
import {
    Add as AddIcon,
    Archive as ArchiveIcon,
    FilterList as FilterListIcon,
    RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate, useLocation} from 'react-router-dom';
import useEmployeesListStore from '../store/useEmployeesListStore.js';
import useAuthStore from '../store/useAuthStore.js'
import DeleteDialog from '../components/dialogs/DeleteDialog';
import {useTranslation} from 'react-i18next';

//import {Add as AddIcon} from "@mui/icons-material";
import {spacing} from "@mui/system";
import {NavLink} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import { green, orange, red } from "@mui/material/colors";

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Chip = styled(MuiChip)`
    ${spacing};

    background: ${(props) => props.shipped && green[500]};
    background: ${(props) => props.processing && orange[700]};
    background: ${(props) => props.cancelled && red[500]};
    color: ${(props) => props.theme.palette.common.white};
`;

const Spacer = styled.div`
    flex: 1 1 100%;
`;

const ToolbarTitle = styled.div`
    min-width: 150px;
`;

// const Transition = forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

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

const EnhancedTableToolbar = (props) => {
    // Here was 'let'
    const {numSelected} = props;

    return (
        <Toolbar>
            <ToolbarTitle>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Orders
                    </Typography>
                )}
            </ToolbarTitle>
            <Spacer/>
            {/*<div>*/}
            {/*    {numSelected > 0 ? (*/}
            {/*        <Tooltip title="Delete">*/}
            {/*            <IconButton aria-label="Delete" size="large">*/}
            {/*                <ArchiveIcon/>*/}
            {/*            </IconButton>*/}
            {/*        </Tooltip>*/}
            {/*    ) : (*/}
            {/*        <Tooltip title="Filter list">*/}
            {/*            <IconButton aria-label="Filter list" size="large">*/}
            {/*                <FilterListIcon/>*/}
            {/*            </IconButton>*/}
            {/*        </Tooltip>*/}
            {/*    )}*/}
            {/*</div>*/}
        </Toolbar>
    );
};

function EnhancedTable() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {employees, fetchEmployees, deleteEmployee} = useEmployeesListStore();
    const {isLoggedIn} = useAuthStore();
    const [q, setQ] = useState('');

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [order, setOrder] = useState('asc'); // 昇順か降順か
    const [orderBy, setOrderBy] = useState('name'); // どの列でソートするか

    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    // 現在のページ番号
    const [page, setPage] = useState(0);

    // 1ページの件数
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // const [selected, setSelected] = React.useState([]);

    // const handleSelectAllClick = (event) => {
    //     if (event.target.checked) {
    //         const newSelecteds = rows.map((n) => n.id);
    //         setSelected(newSelecteds);
    //         return;
    //     }
    //     setSelected([]);
    // };
    //
    // const handleClick = (event, id) => {
    //     const selectedIndex = selected.indexOf(id);
    //     let newSelected = [];
    //
    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, id);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1)
    //         );
    //     }
    //
    //     setSelected(newSelected);
    // };
    // const isSelected = (id) => selected.indexOf(id) !== -1;

    useEffect(() => {
        if (location.state?.showSnackbar) {
            setMessage(location.state.message || '');
            setOpen(true);
        }
    }, [location.state]);

    //ログインしていない場合ログイン画面へリダイレクト
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
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
                if (nameCompare !== 0) return nameCompare;
                // console.log("nameCompare:", a.name, b.name, nameCompare, a.id, b.id)
                return a.id - b.id;

            }
        });

    }, [filtered, order, orderBy])

    return (
        <Box>
            {/*<Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>*/}
            {/*    <Typography variant="h5">{t('employeeList.title')}</Typography>*/}
            {/*    <Button variant="action" onClick={() => navigate('/new')}>*/}
            {/*        {t('employeeList.create')}*/}
            {/*    </Button>*/}
            {/*</Box>*/}

            <TextField
                fullWidth
                size="small"
                placeholder={t('employeeList.placeholder.search')}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                sx={{mb: 2}}
            />

            {/*<EnhancedTableToolbar numSelected={selected.length}/>*/}
            <EnhancedTableToolbar/>
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
                                    {t('employeeList.name')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'phone'}
                                    direction={orderBy === 'phone' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'phone')}
                                >
                                    {t('employeeList.phone')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'department'}
                                    direction={orderBy === 'department' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'department')}
                                >
                                    {t('employeeList.department')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'role'}
                                    direction={orderBy === 'role' ? order : 'asc'}
                                    onClick={(e) => handleRequestSort(e, 'role')}
                                >
                                    {t('employeeList.role')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                {t('employeeList.actions')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows.length > 0 ?
                            (sortedRows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((e) => (
                                        <TableRow key={e.id} hover>
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                    <Avatar>{e.name?.[0]?.toUpperCase()}</Avatar>
                                                    {e.name}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{e.phone}</TableCell>
                                            <TableCell>{e.department?.name}</TableCell>
                                            <TableCell>
                                                {/*{e.role?.name}*/}
                                                {e.role?.name === "管理者"&& (
                                                    <Chip
                                                        size="small"
                                                        mr={1}
                                                        mb={1}
                                                        label="管理者"
                                                        shipped={+true}
                                                    />
                                                )}
                                                {e.role?.name === "一般" && (
                                                    <Chip
                                                        size="small"
                                                        mr={1}
                                                        mb={1}
                                                        label="一般"
                                                        processing={+true}
                                                    />
                                                )}

                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton color="primary" onClick={() => navigate(`/edit/${e.id}`)}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton color="error" onClick={() => handleOpenDialog(e.id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        {t('employeeList.noResults')}
                                    </TableCell>
                                </TableRow>
                            )}

                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={sortedRows.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20]}
                labelRowsPerPage={t('employeeList.pagination.label')}
            />


            <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}
                      anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity="success" variant="filled">
                    {message}
                </Alert>
            </Snackbar>

            <DeleteDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onDelete={handleDelete}
            />
        </Box>
    );
}

function EmployeeList() {

    const navigate = useNavigate();

    return (
        <>
            <React.Fragment>
                <Helmet title="従業員一覧"/>
                <Grid justifyContent="space-between" container spacing={10}>
                    <Grid>
                        <Typography variant="h3" gutterBottom display="inline">
                            従業員一覧
                        </Typography>

                        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                            <Link component={NavLink} to="/">
                                社員管理
                            </Link>
                            <Typography>従業員一覧</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid>
                        <Button variant="contained" color="primary" onClick={() => navigate('/new')}>
                            <AddIcon/>
                            ユーザーの作成
                        </Button>
                    </Grid>
                </Grid>

                <Divider my={6}/>

                <Grid container spacing={6}>
                    <Grid size={12}>
                        <EnhancedTable/>
                    </Grid>
                </Grid>
            </React.Fragment>
        </>
    );
}

export default EmployeeList;
