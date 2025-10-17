import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import {EmployeeList} from './pages/EmployeeList.jsx'
import EmployeeForm from './pages/EmployeeForm'
import useEmployeesListStore from './store/useEmployeesListStore.js'

const theme = createTheme({})

export default function App() {
  const navigate = useNavigate()
  const fetchMasters = useEmployeesListStore((s) => s.fetchMasters)

  useEffect(() => {
    fetchMasters()
  }, [fetchMasters])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            社員名簿
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>ユーザー一覧</Button>
          <Button sx={{ ml: 1 }} variant="outlined" onClick={() => navigate('/new')}>ユーザーの作成</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/new" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}
