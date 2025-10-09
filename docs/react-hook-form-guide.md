# React Hook Form 使用ガイド

このドキュメントでは、React Hook Form の基本的な使い方を説明します。

## 目次
1. [React Hook Form とは](#react-hook-form-とは)
2. [インストール](#インストール)
3. [基本的な使い方](#基本的な使い方)
4. [Material-UI (MUI) との連携](#material-ui-mui-との連携)
5. [バリデーション](#バリデーション)
6. [応用パターン](#応用パターン)

---

## React Hook Form とは

React Hook Form は、Reactでフォームを簡単に扱うためのライブラリです。

### 主な特徴
- **高パフォーマンス**: 不要な再レンダリングを最小限に抑える
- **シンプルな API**: hooks を使った直感的な記述
- **軽量**: 他のフォームライブラリと比べて軽い
- **柔軟なバリデーション**: 簡単にバリデーションルールを設定可能
- **外部 UI ライブラリとの統合が容易**: Material-UI などと組み合わせやすい

---

## インストール

`npm install react-hook-form`

---

## 基本的な使い方

### 最小限の例

    import { useForm } from "react-hook-form";
    
    function SimpleForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
        const onSubmit = (data) => {
            console.log(data); // { username: "入力値", email: "入力値" }
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("username")} placeholder="ユーザー名" />
                <input {...register("email")} placeholder="メールアドレス" />
                <button type="submit">送信</button>
            </form>
        );
    }

### useForm の主な返り値

const {
register,      // 入力フィールドを登録する関数
handleSubmit,  // フォーム送信時のハンドラー
formState,     // フォームの状態（エラー、送信状態など）
watch,         // フィールドの値を監視
reset,         // フォームをリセット
setValue,      // フィールドの値を設定
getValues,     // フィールドの値を取得
control        // Controller で使用（外部UIライブラリ用）
} = useForm();

---

## Material-UI (MUI) との連携

MUI の TextField などを使う場合は `Controller` を使用します。

### Controller の基本構造

    import { Controller, useForm } from "react-hook-form";
    import { TextField } from "@mui/material";
    
    function MuiForm() {
    const { handleSubmit, control, formState: { errors } } = useForm();
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"              // フォームデータのキー名
                    control={control}            // useForm から取得した control
                    defaultValue=""              // 初期値
                    rules={{ required: "ユーザー名は必須です" }}  // バリデーションルール
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}           // value, onChange などが自動設定される
                            label="ユーザー名"
                            error={!!error}      // エラーがあれば true
                            helperText={error?.message}  // エラーメッセージ
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
                <button type="submit">送信</button>
            </form>
        );
    }

### Controller のプロパティ

| プロパティ | 説明 |
|----------|------|
| `name` | フォームデータのキー名（必須） |
| `control` | useForm の control オブジェクト（必須） |
| `defaultValue` | フィールドの初期値 |
| `rules` | バリデーションルール |
| `render` | レンダリング関数。field と error を受け取る |

---

## バリデーション

### 基本的なバリデーションルール

    <Controller
        name="email"
        control={control}
        rules={{
            required: "メールアドレスは必須です",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "有効なメールアドレスを入力してください"
            }
        }}
        render={({ field, fieldState: { error } }) => (
            <TextField
                {...field}
                error={!!error}
                helperText={error?.message}
            />
        )}
    />

### よく使うバリデーションルール

    rules={{
    // 必須チェック
    required: "この項目は必須です",
    
        // 最小文字数
        minLength: {
            value: 5,
            message: "5文字以上入力してください"
        },
        
        // 最大文字数
        maxLength: {
            value: 100,
            message: "100文字以内で入力してください"
        },
        
        // 最小値（数値）
        min: {
            value: 0,
            message: "0以上の値を入力してください"
        },
        
        // 最大値（数値）
        max: {
            value: 100,
            message: "100以下の値を入力してください"
        },
        
        // 正規表現
        pattern: {
            value: /^[A-Za-z]+$/,
            message: "英字のみ入力可能です"
        },
        
        // カスタムバリデーション
        validate: {
            positive: (value) => parseFloat(value) > 0 || "正の数を入力してください",
            lessThan10: (value) => parseFloat(value) < 10 || "10未満の数を入力してください",
        }
    }}

#### バリデーションのタイミング制御

`useForm` の `mode` オプションでバリデーションのタイミングを制御できます。

    const { control, handleSubmit } = useForm({
    mode: "onBlur"      // フィールドからフォーカスが外れた時
    // mode: "onChange"  // 値が変更される度（デフォルトはonSubmit）
    // mode: "onSubmit"  // フォーム送信時のみ
    // mode: "onTouched" // フィールドに触れた後、変更時
    // mode: "all"       // onChange + onBlur
    });

非同期バリデーションを使う場合は、`mode: "onBlur"` または `mode: "onChange"` を推奨します。

### 複数フィールドのバリデーション例

    function RegistrationForm() {
    const { handleSubmit, control, watch } = useForm();
    const password = watch("password"); // パスワードを監視
    
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
                        minLength: { value: 3, message: "3文字以上で入力してください" }
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
                        }
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
    
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "パスワードは必須です",
                        minLength: { value: 8, message: "8文字以上で入力してください" }
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="パスワード"
                            error={!!error}
                            helperText={error?.message}
                            fullWidth
                            margin="normal"
                        />
                    )}
                />
    
                <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "パスワード（確認）は必須です",
                        validate: (value) => value === password || "パスワードが一致しません"
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="パスワード（確認）"
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

---

## 応用パターン

### 1. フォームのリセット

    const { reset } = useForm();
    
    // デフォルト値にリセット
    const handleReset = () => {
    reset();
    };
    
    // 特定の値にリセット
    const handleResetWithValues = () => {
    reset({
    username: "デフォルト名",
    email: "default@example.com"
    });
    };

### 2. 値の取得と設定

    const { getValues, setValue, watch } = useForm();
    
    // 特定フィールドの値を取得
    const username = getValues("username");
    
    // 全フィールドの値を取得
    const allValues = getValues();
    
    // 値を設定
    setValue("username", "新しい値");
    
    // リアルタイムで値を監視
    const watchedUsername = watch("username");

### 3. 動的なフィールドの追加（useFieldArray）

    import { useForm, useFieldArray, Controller } from "react-hook-form";
    import { TextField, Button } from "@mui/material";
    
        function DynamicForm() {
        const { control, handleSubmit } = useForm({
        defaultValues: {
        items: [{ name: "", price: "" }]
        }
        });
    
        const { fields, append, remove } = useFieldArray({
            control,
            name: "items"
        });
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                    <div key={field.id}>
                        <Controller
                            name={`items.${index}.name`}
                            control={control}
                            defaultValue={field.name}
                            render={({ field }) => (
                                <TextField {...field} label="商品名" />
                            )}
                        />
                        <Controller
                            name={`items.${index}.price`}
                            control={control}
                            defaultValue={field.price}
                            render={({ field }) => (
                                <TextField {...field} label="価格" type="number" />
                            )}
                        />
                        <Button onClick={() => remove(index)}>削除</Button>
                    </div>
                ))}
                <Button onClick={() => append({ name: "", price: "" })}>追加</Button>
                <button type="submit">送信</button>
            </form>
        );
    }

### 4. 送信状態の管理

    function FormWithLoading() {
    const { handleSubmit, control, formState: { isSubmitting } } = useForm();
    
        const onSubmit = async (data) => {
            // API呼び出しなどの非同期処理
            await fetch("/api/submit", {
                method: "POST",
                body: JSON.stringify(data)
            });
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} label="ユーザー名" />
                    )}
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "送信中..." : "送信"}
                </button>
            </form>
        );
    }

### 5. デフォルト値の設定

    // useForm に defaultValues を渡す
    const { control, handleSubmit } = useForm({
        defaultValues: {
            username: "太郎",
            email: "taro@example.com",
            age: 25
        }
    });
    
    // または、非同期でデフォルト値を設定
    useEffect(() => {
        // APIからデータを取得
        fetch("/api/user/1")
        .then(res => res.json())
        .then(data => {
             reset(data); // reset で値を設定
        });
    }, [reset]);

---

## まとめ

### React Hook Form の基本フロー

1. `useForm()` でフォームを初期化
2. `Controller` または `register` でフィールドを登録
3. `rules` でバリデーションを設定
4. `handleSubmit(onSubmit)` でフォーム送信を処理
5. `formState.errors` でエラーを表示

### よく使う機能

| 機能 | 使い方 |
|-----|-------|
| フィールド登録（通常） | `{...register("name")}` |
| フィールド登録（MUI） | `<Controller>` |
| バリデーション | `rules={{ required: "必須" }}` |
| エラー表示 | `errors.name?.message` |
| フォームリセット | `reset()` |
| 値の監視 | `watch("name")` |
| 値の設定 | `setValue("name", "value")` |
| 送信状態 | `formState.isSubmitting` |
