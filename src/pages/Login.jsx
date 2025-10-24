import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import {Box, Button, Container, TextField, Typography, Paper, Alert} from '@mui/material';
import {useForm} from 'react-hook-form'
import useAuthStore from '../store/useAuthStore'
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

export const loginSchema = z.object({
    email: z.string()
        .email('正しいメールアドレスを入力してください'),
    // .refine(async (email) => {
    //     const res = await employeeService.list();
    //     return res.some(user => user.email === email);
    // }, { message: '存在しないメールアドレスです' }),
    password: z.string().min(1, 'パスワードは必須です'),
});

const Login = () => {
    const navigate = useNavigate();
    const {login, error, loading, isLoggedIn} = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (!success) return;

        navigate('/employees', { state: { showSnackbar: true, message: 'ログインが完了しました' } });

    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        navigate('/employees');
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/employees');
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

                    {error && (
                        <Box sx={{mt: 2}}>
                            <Alert severity="error" sx={{width: '100%'}} >
                                {error}
                            </Alert>
                        </Box>
                    )}
                    <Button
                        variant="action"
                        type="submit"
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