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
    Alert,
    Switch
} from '@mui/material'
import EmployeeList from './pages/EmployeeList'
import EmployeeForm from './pages/EmployeeForm'
import DepartmentList from "./pages/DepartmentList";
import Login from "./pages/Login";
import useEmployeesListStore from './store/useEmployeesListStore.js'
import useAuthStore from './store/useAuthStore.js'
import {useTranslation} from 'react-i18next'

export const lightTheme = createTheme({
    palette: { mode: 'light' },
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'action' },
                    style: {
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        fontWeight: 700,
                        height: 40,
                        '&:hover': { backgroundColor: '#388e3c' },
                    },
                },
                {
                    props: { variant: 'action.outlined' },
                    style: {
                        color: '#4caf50',
                        fontWeight: 700,
                        height: 40,
                        border: '2px solid #4caf50',
                        '&:hover': { backgroundColor: '#e8f5e9' },
                    },
                },
            ],
        },
    },
});

export const darkTheme = createTheme({
    palette: { mode: 'dark' },
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'action' },
                    style: {
                        backgroundColor: '#388e3c',
                        color: '#fff',
                        fontWeight: 700,
                        height: 40,
                        '&:hover': { backgroundColor: '#2e7d32' },
                    },
                },
                {
                    props: { variant: 'action.outlined' },
                    style: {
                        backgroundColor: 'transparent',
                        color: '#81c784',
                        fontWeight: 700,
                        height: 40,
                        border: '2px solid #81c784',
                        '&:hover': { backgroundColor: '#2e7d3233' },
                    },
                },
            ],
        },
    },
});


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
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchMasters();
    }, [fetchMasters]);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline/>
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        {t('app.title')}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Typography>ライト / ダーク</Typography>
                        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                    </Box>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <Button id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                variant="action"
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
                                variant="action"
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
                autoHideDuration={1000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={() => setSnackbarOpen(false)} variant="filled" severity="success" sx={{width: '100%'}}>
                    ログアウトしました
                </Alert>
            </Snackbar>
        </ThemeProvider>)
}
