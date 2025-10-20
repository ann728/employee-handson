import React, {useEffect, useState} from 'react'
import {Routes, Route, useNavigate} from 'react-router-dom'
import {
    createTheme,
    ThemeProvider,
    CssBaseline,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem
} from '@mui/material'
import EmployeeList from './pages/EmployeeList'
import EmployeeForm from './pages/EmployeeForm'
import DepartmentList from "./pages/DepartmentList";
import useEmployeesListStore from './store/useEmployeesListStore.js'

const theme = createTheme({});

export default function App() {
    const navigate = useNavigate();
    const fetchMasters = useEmployeesListStore((s) => s.fetchMasters);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    useEffect(() => {
        fetchMasters();
    }, [fetchMasters]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        社員名簿
                    </Typography>
                    <Button id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            variant="contained"
                    >
                        ダッシュボード
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() => {
                                navigate('/')
                                handleMenuClose()
                            }}>ユーザー一覧</MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigate('/departments')
                                handleMenuClose()
                            }}>部署一覧</MenuItem>
                        <MenuItem
                            onClick={() => {
                                navigate('/new')
                                handleMenuClose()
                            }}>ユーザーの作成</MenuItem>
                    </Menu>
                    {/*<Button variant="contained" onClick={() => navigate('/')}>ユーザー一覧</Button>*/}
                    {/*<Button sx={{ ml: 1 }} variant="outlined" onClick={() => navigate('/new')}>ユーザーの作成</Button>*/}
                </Toolbar>
            </AppBar>
            <Container sx={{mt: 3}}>
                <Routes>
                    <Route path="/" element={<EmployeeList/>}/>
                    <Route path="/departments" element={<DepartmentList/>}/>
                    <Route path="/new" element={<EmployeeForm/>}/>
                    <Route path="/edit/:id" element={<EmployeeForm/>}/>
                </Routes>
            </Container>
        </ThemeProvider>)
}
