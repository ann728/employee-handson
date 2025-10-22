import React, {useEffect, useState} from 'react'
import {
    Box,
    Typography,
    Button,
    TableContainer,
    Paper,
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
    DialogActions,
} from '@mui/material';
import {useNavigate} from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import useDepartmentsListStore from '../store/useDepartmentsListStore.js';
import useAuthStore from '../store/useAuthStore.js'
import DeleteDialog from '../components/dialogs/DeleteDialog';
import {useTranslation} from 'react-i18next';

function DepartmentList() {
    const navigate = useNavigate();
    const {t,i18n} = useTranslation();
    const {departments, fetchDepartments, addDepartment, deleteDepartment} = useDepartmentsListStore();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

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

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
        setName('')
        setError('')
    }

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    }

    const handleSave = async () => {
        if (!name.trim()) {
            setError(t('departmentList.errorName'))
            return
        }
        await addDepartment({name});
        handleCloseAddDialog();
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
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">{t('departmentList.title')}</Typography>
                <Button variant="contained" onClick={handleOpenAddDialog}>
                    {t('departmentList.addButton')}
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={() => changeLanguage("ja")}>日本語</Button>
                <Button variant="outlined" onClick={() => changeLanguage("en")}>English</Button>
            </Box>

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

            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} sx={{'& .MuiDialog-paper': {p: 2}}}>
                <DialogTitle>{t('departmentList.dialogTitle')}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
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
                    <Button onClick={handleCloseAddDialog}>{t('departmentList.cancel')}</Button>
                    <Button variant="contained" onClick={handleSave}>
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

export default DepartmentList;