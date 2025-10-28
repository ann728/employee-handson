import React, {useCallback, useEffect, useState} from 'react'
import {
    Box,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Grid, Link,
    Breadcrumbs as MuiBreadcrumbs,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Card as MuiCard, Toolbar,


} from '@mui/material';
import {NavLink, useNavigate,} from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import useDepartmentsListStore from '../store/useDepartmentsListStore.js';
import useAuthStore from '../store/useAuthStore.js'
import DeleteDialog from '../components/dialogs/DeleteDialog';
import {useTranslation} from 'react-i18next';
import EditIcon from "@mui/icons-material/Edit";
import {Helmet} from "react-helmet-async";
import {Add as AddIcon} from "@mui/icons-material";
import styled from "@emotion/styled";
import {spacing} from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);


const Spacer = styled.div`
    flex: 1 1 100%;
`;

const ToolbarTitle = styled.div`
    min-width: 150px;
`;

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
                        部署ー覧
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

function EnhancedTable({openDialog, onCloseDialog, onOpenDialog}) {
    const navigate = useNavigate();
    //const {t, i18n} = useTranslation();
    const {t} = useTranslation();
    const {departments, fetchDepartments, addDepartment, deleteDepartment, saveDepartment} = useDepartmentsListStore();
    //const [openAddDialog, setOpenAddDialog] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    //const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const {isLoggedIn} = useAuthStore();

    //ログインしていない場合ログイン画面へリダイレクト
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (!openDialog) {
            setSelectedId(null);
            setName('');
            setError('');
        }
    }, [openDialog]);

    // const handleOpenAddDialog = () => {
    //     setSelectedId(null);
    //     setName('');
    //     setError('');
    // }

    const handleOpenEditDialog = (department) => {
        setSelectedId(department.id);
        setName(department.name);
        setError('');
        //setOpenDialog(true);
        onOpenDialog();
    };

    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // }

    const handleSave = async () => {
        if (!name.trim()) {
            setError(t('departmentList.errorName'))
            return
        }

        const dep = selectedId ? {id: selectedId, name} : {name};
        await saveDepartment(dep);

        setSelectedId(null);
        // handleCloseDialog();
        onCloseDialog();

    }
    const handleOpenDeleteDialog = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedId(null);
    }

    const handleDelete = () => {
        if (selectedId !== null) {
            deleteDepartment(selectedId);
        }
        handleCloseDeleteDialog();
    }
    // const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    // };

    return (
        <Box>
            {/*<Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>*/}
            {/*    <Typography variant="h5">{t('departmentList.title')}</Typography>*/}
            {/*    <Button variant="action" onClick={handleOpenAddDialog}>*/}
            {/*        {t('departmentList.addButton')}*/}
            {/*    </Button>*/}
            {/*</Box>*/}
            {/*<Box sx={{display: 'flex', gap: 1}}>*/}
            {/*    <Button variant="outlined" onClick={() => changeLanguage("ja")}>日本語</Button>*/}
            {/*    <Button variant="outlined" onClick={() => changeLanguage("en")}>English</Button>*/}
            {/*</Box>*/}

            <EnhancedTableToolbar/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {t('departmentList.tableHeader.name')}
                            </TableCell>
                            <TableCell align="right">{t('departmentList.tableHeader.action')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((department) => {
                            return (
                                <TableRow key={department.id} hover>
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenEditDialog(department)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(department.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={onCloseDialog} sx={{'& .MuiDialog-paper': {p: 2}}}>
                <DialogTitle id="form-dialog-title">
                    {selectedId === null
                        ? t('departmentList.dialogTitle')
                        : t('departmentList.editDialogTitle')}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        label={t('departmentList.labelName')}
                        value={name}
                        error={!!error}
                        helperText={error || ''}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={onCloseDialog}>{t('departmentList.cancel')}</Button>
                    <Button color="primary" onClick={handleSave}>
                        {t('departmentList.save')}
                    </Button>
                </DialogActions>
            </Dialog>


            <DeleteDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onDelete={handleDelete}
            />
        </Box>
    );
}

function DepartmentList() {

    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <>
            <React.Fragment>
                <Helmet title="社員一覧"/>
                <Grid justifyContent="space-between" container spacing={10}>
                    <Grid>
                        <Typography variant="h3" gutterBottom display="inline">
                            部署一覧
                        </Typography>

                        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                            <Link component={NavLink} to="/">
                                社員管理
                            </Link>
                            <Typography>部署一覧</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid>
                        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                            < AddIcon/>
                            部署の追加
                        </Button>
                    </Grid>
                </Grid>

                <Divider my={6}/>

                <Grid container spacing={6}>
                    <Grid size={12}>
                        <EnhancedTable
                            openDialog={openDialog}
                            onCloseDialog={() => setOpenDialog(false)}
                            onOpenDialog={() => setOpenDialog(true)}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        </>
    );
}

export default DepartmentList;