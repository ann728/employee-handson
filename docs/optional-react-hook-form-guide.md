### 非同期バリデーション（DBのユニークチェック）

データベースに問い合わせてユニークチェックを行う場合は、`validate` に非同期関数を使用します。

#### 基本的な非同期バリデーション

    import { Controller, useForm } from "react-hook-form";
    import { TextField } from "@mui/material";
    import axios from "axios";
    
    function UserRegistrationForm() {
    const { handleSubmit, control } = useForm();
    
        // ユーザー名の重複チェック
        const checkUsernameUnique = async (value) => {
            if (!value) return true; // 空の場合はスキップ（requiredで別途チェック）
            
            try {
                const response = await axios.get(`/api/users/check-username?username=${value}`);
                return response.data.isAvailable || "このユーザー名は既に使用されています";
            } catch (error) {
                return "ユーザー名の確認に失敗しました";
            }
        };
    
        // メールアドレスの重複チェック
        const checkEmailUnique = async (value) => {
            if (!value) return true;
            
            try {
                const response = await axios.get(`/api/users/check-email?email=${value}`);
                return response.data.isAvailable || "このメールアドレスは既に登録されています";
            } catch (error) {
                return "メールアドレスの確認に失敗しました";
            }
        };
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "ユーザー名は必須です",
                        minLength: { value: 3, message: "3文字以上で入力してください" },
                        validate: checkUsernameUnique  // 非同期バリデーション
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="ユーザー名"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
    
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "メールアドレスは必須です",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "有効なメールアドレスを入力してください"
                        },
                        validate: checkEmailUnique  // 非同期バリデーション
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="メールアドレス"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
    
                <button type="submit">登録</button>
            </form>
        );
    }

#### デバウンス付き非同期バリデーション

ユーザーが入力中に何度もAPIを呼ばないよう、デバウンス（入力後一定時間待ってからチェック）を実装します。

    import { Controller, useForm } from "react-hook-form";
    import { TextField, CircularProgress } from "@mui/material";
    import axios from "axios";
    import { useState } from "react";
    
    function UserRegistrationFormWithDebounce() {
    const { handleSubmit, control } = useForm({ mode: "onChange" });
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    
        // デバウンス関数
        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                return new Promise((resolve) => {
                    timeoutId = setTimeout(async () => {
                        const result = await func(...args);
                        resolve(result);
                    }, delay);
                });
            };
        };
    
        // ユーザー名の重複チェック（デバウンス付き）
        const checkUsernameUniqueDebounced = debounce(async (value) => {
            if (!value || value.length < 3) return true;
            
            setIsCheckingUsername(true);
            try {
                const response = await axios.get(`/api/users/check-username?username=${value}`);
                setIsCheckingUsername(false);
                return response.data.isAvailable || "このユーザー名は既に使用されています";
            } catch (error) {
                setIsCheckingUsername(false);
                return "ユーザー名の確認に失敗しました";
            }
        }, 500); // 500ms待ってからチェック
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "ユーザー名は必須です",
                        minLength: { value: 3, message: "3文字以上で入力してください" },
                        validate: checkUsernameUniqueDebounced
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="ユーザー名"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment: isCheckingUsername && <CircularProgress size={20} />
                            }}
                        />
                    )}
                />
    
                <button type="submit">登録</button>
            </form>
        );
    }

#### lodash を使ったデバウンス実装

    プロジェクトで既に lodash を使用している場合は、より簡単に実装できます。
    
    import { Controller, useForm } from "react-hook-form";
    import { TextField } from "@mui/material";
    import axios from "axios";
    import { debounce } from "lodash";
    import { useMemo } from "react";
    
    function UserRegistrationFormWithLodash() {
    const { handleSubmit, control } = useForm({ mode: "onChange" });
    
        // useMemoでデバウンス関数をメモ化
        const checkUsernameUnique = useMemo(
            () => debounce(async (value) => {
                if (!value || value.length < 3) return true;
                
                try {
                    const response = await axios.get(`/api/users/check-username?username=${value}`);
                    return response.data.isAvailable || "このユーザー名は既に使用されています";
                } catch (error) {
                    return "ユーザー名の確認に失敗しました";
                }
            }, 500),
            []
        );
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "ユーザー名は必須です",
                        minLength: { value: 3, message: "3文字以上で入力してください" },
                        validate: checkUsernameUnique
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="ユーザー名"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
    
                <button type="submit">登録</button>
            </form>
        );
    }

#### 編集時のユニークチェック（自分自身は除外）

既存データを編集する際は、自分自身のデータは重複チェックから除外する必要があります。

    function UserEditForm({ userId, initialData }) {
    const { handleSubmit, control } = useForm({
    defaultValues: initialData
    });
    
        // 編集時のユーザー名重複チェック（自分自身を除外）
        const checkUsernameUnique = async (value) => {
            if (!value) return true;
            
            // 初期値と同じ場合はチェックしない
            if (value === initialData.username) return true;
            
            try {
                const response = await axios.get(
                    `/api/users/check-username?username=${value}&excludeUserId=${userId}`
                );
                return response.data.isAvailable || "このユーザー名は既に使用されています";
            } catch (error) {
                return "ユーザー名の確認に失敗しました";
            }
        };
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    rules={{
                        required: "ユーザー名は必須です",
                        validate: checkUsernameUnique
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            label="ユーザー名"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
    
                <button type="submit">更新</button>
            </form>
        );
    }


#### ポイント

1. **非同期関数を使用**: `validate` に async 関数を渡す
2. **デバウンスを実装**: 入力の度にAPIを呼ばないようにする
3. **エラーハンドリング**: API呼び出しの失敗に備える
4. **編集時の除外処理**: 自分自身のデータは重複チェックから除外
5. **バリデーションタイミングの制御**: `mode` オプションで適切なタイミングを設定

---
