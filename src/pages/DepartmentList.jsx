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

function DepartmentList() {
    const {departments, fetchDepartments, addDepartment} = useDepartmentsListStore();
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setName('')
        setError('')
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = async () => {
        if (!name.trim()) {
            setError('部署名を入力してください')
            return
        }
        await addDepartment({name});
        handleClose();
    }
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">部署一覧</Typography>
                <Button variant="contained" onClick={handleOpen}>部署の追加</Button>
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
                                        <IconButton color="error">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>部署追加</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
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
                    <Button onClick={handleClose}>キャンセル</Button>
                    <Button variant="contained" onClick={handleSave}>
                        保存
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default DepartmentList;