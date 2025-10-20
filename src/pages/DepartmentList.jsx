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
import DeleteIcon from '@mui/icons-material/Delete';
import useDepartmentsListStore from '../store/useDepartmentsListStore.js';
import DeleteDialog from './common/DeleteDialog';

function DepartmentList() {
    const {departments, fetchDepartments, addDepartment,deleteDepartment} = useDepartmentsListStore();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

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
            setError('部署名を入力してください')
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

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">部署一覧</Typography>
                <Button variant="contained" onClick={handleOpenAddDialog}>部署の追加</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                部署名
                            </TableCell>
                            <TableCell align="right">アクション</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.map((department) => {
                            return (
                                <TableRow key={department.id} hover>
                                    <TableCell>{department.name}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error"  onClick={() => handleOpenDeleteDialog(department.id)}>
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
                <DialogTitle>部署追加</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="部署名"
                        value={name}
                        error={!!error}
                        helperText={error || ''}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog}>キャンセル</Button>
                    <Button variant="contained" onClick={handleSave}>
                        保存
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