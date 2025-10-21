import React, {useState} from 'react';
import {Box, Button, Container, TextField, Typography, Paper} from '@mui/material';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <Container maxWidth="sm">
            <Paper  elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                <Typography variant="h4"  align="center" >
                    ログイン
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required

                    />
                    <TextField
                        label="パスワード"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="large"

                    >
                        ログイン
                    </Button>

                </Box>
            </Paper>
        </Container>
    );
}
export default Login;