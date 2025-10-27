import React from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import {
    CssBaseline,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from "@mui/material";
import Sidebar from "./components/sidebar/Sidebar";
import dashboardItems from "./components/sidebar/dashboardItems";
import EmployeeList from "./pages/EmployeeList";
import DepartmentList from "./pages/DepartmentList";
import EmployeeForm from "./pages/EmployeeForm";
import Login from "./pages/Login";
import useAuthStore from "./store/useAuthStore";
import {ThemeProvider} from "@mui/material/styles";
import createTheme from "@/theme";


export default function App() {
    const navigate = useNavigate();
    const {isLoggedIn, logout} = useAuthStore();
    const theme = createTheme("DARK");

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Box sx={{display: "flex"}}>
                    <Sidebar items={dashboardItems}/>

                    <Box sx={{flexGrow: 1}}>
                        <AppBar position="static" color="default" elevation={0}>
                            <Toolbar>
                                <Typography variant="h6" sx={{flexGrow: 1}}>
                                    従業員管理アプリ
                                </Typography>
                                {isLoggedIn && (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            logout();
                                            navigate("/");
                                        }}
                                    >
                                        ログアウト
                                    </Button>
                                )}
                            </Toolbar>
                        </AppBar>

                        <Container sx={{mt: 3}}>
                            <Routes>
                                <Route path="/" element={<Login/>}/>
                                <Route path="/employees" element={<EmployeeList/>}/>
                                <Route path="/departments" element={<DepartmentList/>}/>
                                <Route path="/new" element={<EmployeeForm/>}/>
                            </Routes>
                        </Container>
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
}
