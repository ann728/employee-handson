import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {Link as RouterLink} from "react-router-dom";
import {Controller} from "react-hook-form";
// import { v4 as uuid } from "uuid";

// import * as Yup from "yup";
// import {Formik} from "formik";

import {
    Alert as MuiAlert,
    Checkbox,
    FormControlLabel,
    Button as MuiButton,
    TextField as MuiTextField,
    Link,
    Typography as MuiTypography,
} from "@mui/material";
import {spacing} from "@mui/system";

//import useAuth from "@/hooks/useAuth";
import useAuthStore from '../../store/useAuthStore'
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";


const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const Centered = styled(MuiTypography)`
    text-align: center;
`;

const Typography = styled(MuiTypography)(spacing);

const loginSchema = z.object({
    email: z
        .string()
        .email("正しいメールアドレスを入力してください")
        .nonempty("メールアドレスは必須です"),
    password: z.string().nonempty("パスワードは必須です"),
    remember: z.boolean().optional(),
});

function SignIn() {
    const navigate = useNavigate();
    const {login, autoLogin, error, loading, isLoggedIn} = useAuthStore();
    const [rehydrated, setRehydrated] = useState(false);

    //const { signIn } = useAuth();

    const {
        control,
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: "", password: "", remember: false},
    });

    const onSubmit = async (data) => {
        console.log("送信データ:", data);
        const success = await login(data.email, data.password, data.remember,);
        if (!success) return;

        navigate("/employees", {
            state: {showSnackbar: true, message: "ログインが完了しました"},
        });
    };

    useEffect(() => {
        const tryAutoLogin = async () => {
            const success = await autoLogin();
            if (success) {
                navigate("/employees", {
                    state: {showSnackbar: true, message: "自動ログインしました"},
                });
            }
        };
        tryAutoLogin();
    }, [autoLogin, navigate])
    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     navigate('/employees');
    // };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/employees');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => setRehydrated(true), 0);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (rehydrated) {
            useAuthStore.setState({loading: false});
        }
    }, [rehydrated]);

    return (

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Alert mt={3} mb={3} severity="info">
                <strong>test@example.com</strong> and{" "}
                <strong>aaaa</strong><br/>
                を使用してログインしてください。
            </Alert>
            {error && (
                <Alert mt={2} mb={3} severity="warning">
                    {error}
                </Alert>
            )}
            <Controller
                name="email"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="メールアドレス"
                        type="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        my={2}
                    />
                )}
            />
            <Controller
                name="password"
                control={control}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="パスワード"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        my={2}
                    />
                )}
            />
            <Typography as="div" mb={2} variant="caption">
                <Link to="../reset-password" component={RouterLink}>
                    パスワードを忘れてしまった場合
                </Link>
            </Typography>
            {/*<FormControlLabel*/}
            {/*    control={*/}
            {/*    <Checkbox*/}
            {/*        {...register("remember")}*/}
            {/*        color="primary"*/}
            {/*        onChange={(e) => {*/}
            {/*            e.target.value = e.target.checked;*/}
            {/*        }}*/}
            {/*    />}*/}
            {/*    label="ログイン状態を保持しますか"*/}

            {/*/>*/}
            <Controller
                name="remember"
                control={control}
                render={({field}) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!field.value}
                                {...field}
                                //onChange={(e) => field.onChange(e.target.checked)} // ← ここが最重要！！
                                name={field.name}
                                color="primary"
                            />
                        }
                        label="ログイン状態を保持しますか"
                    />
                )}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                mb={3}
            >
                ログイン
            </Button>
            <Centered>
                まだアカウントをお持ちではありませんか?{" "}
                <Link to="../sign-up" component={RouterLink}>
                    新規登録
                </Link>
            </Centered>
        </form>
    );
}

export default SignIn;
