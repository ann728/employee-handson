import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import {Box, Button, Container, TextField, Typography, Paper,Alert} from '@mui/material';
import {useForm} from 'react-hook-form'
import useAuthStore from '../store/useAuthStore'

const Login = () => {

    const { login, error, loading, isLoggedIn } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (!success) return;
        navigate('/employees')
    }

    useEffect(() => {
        console.log("isLoggedIn:", isLoggedIn)
        if (isLoggedIn) {
            navigate('/employees')
        }
    }, [isLoggedIn, navigate]);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{p: 4, mt: 8, borderRadius: 3, textAlign: 'center',}}>
                <Typography variant="h4" align="center">
                    ログイン
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        mt: 3,
                    }}
                >
                    <TextField
                        label="メールアドレス"
                        type="email"
                        {...register('email', {
                            required: 'メールアドレスは必須です',
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}

                    />
                    <TextField
                        label="パスワード"
                        type="password"
                        {...register('password', {
                            required: 'パスワードは必須です',
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    {error && <Typography>{error}</Typography>}

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"
                        disabled={loading}
                    >
                        {loading ? 'ログイン中...' : 'ログイン'}
                    </Button>

                </Box>
            </Paper>
        </Container>
    );
}
export default Login;