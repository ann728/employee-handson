import React, {useEffect,useMemo} from 'react'
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useDepartmentsListStore from '../store/useDepartmentsListStore.js';

function DepartmentList() {
    const {departments, fetchDepartments} = useDepartmentsListStore();
    //const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h5">部署一覧</Typography>
                <Button variant="contained" >部署の追加</Button>
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

        </Box>
    );
}

export default DepartmentList;