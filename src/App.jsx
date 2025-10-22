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
    MenuItem,
    Box,
    Snackbar,
    Alert
} from '@mui/material'
import EmployeeList from './pages/EmployeeList'
import EmployeeForm from './pages/EmployeeForm'
import DepartmentList from "./pages/DepartmentList";
import Login from "./pages/Login";
import useEmployeesListStore from './store/useEmployeesListStore.js'
import useAuthStore from './store/useAuthStore.js'
import {useTranslation} from 'react-i18next'

const theme = createTheme({});

export default function App() {
    const {t} = useTranslation();

    const navigate = useNavigate();
    const fetchMasters = useEmployeesListStore((s) => s.fetchMasters);
    const {isLoggedIn, logout} = useAuthStore();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        fetchMasters();
    }, [fetchMasters]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {t('app.title')}
                    </Typography>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <Button id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                variant="contained"
                        >
                            {t('app.menu.dashboard')}
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
                                }}>
                                {t('employeeList.title')}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    navigate('/departments')
                                    handleMenuClose()
                                }}>
                                {t('departmentList.title')}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    navigate('/new')
                                    handleMenuClose()
                                }}>
                                {t('employeeList.create')}

                            </MenuItem>
                        </Menu>
                        {isLoggedIn && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    logout();
                                    navigate('/');
                                    setSnackbarOpen(true);
                                }}
                            >
                                ログアウト
                            </Button>
                        )}
                    </Box>
                    {/*<Button variant="contained" onClick={() => navigate('/')}>ユーザー一覧</Button>*/}
                    {/*<Button sx={{ ml: 1 }} variant="outlined" onClick={() => navigate('/new')}>ユーザーの作成</Button>*/}
                </Toolbar>
            </AppBar>
            <Container sx={{mt: 3}}>
                <Routes>
                    <Route path="/employees" element={<EmployeeList/>}/>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/departments" element={<DepartmentList/>}/>
                    <Route path="/new" element={<EmployeeForm/>}/>
                    <Route path="/edit/:id" element={<EmployeeForm/>}/>
                </Routes>
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    ログアウトしました
                </Alert>
            </Snackbar>
        </ThemeProvider>)
}
