## Zod を使用したスキーマバリデーション

複雑なフォームでは、Zod を使ってバリデーションルールを一箇所にまとめて管理できます。Zod は TypeScript との相性が良く、型推論に優れたスキーマバリデーションライブラリです。

### インストール

`npm install zod @hookform/resolvers`

### 基本的な使い方

    import { useForm, Controller } from "react-hook-form";
    import { TextField } from "@mui/material";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { z } from "zod";
    
    // バリデーションスキーマを定義
    const schema = z.object({
        username: z.string().min(3, "3文字以上で入力してください").max(20, "20文字以内で入力してください"),
        email: z.string().email("有効なメールアドレスを入力してください"),
        age: z.number({ invalid_type_error: "数値を入力してください" }).int("整数を入力してください")
            .min(18, "18歳以上である必要があります").max(120, "120歳以下で入力してください"),
        password: z.string().min(8, "8文字以上で入力してください")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,"小文字、大文字、数字を含める必要があります"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "パスワードが一致しません",
        path: ["confirmPassword"]
    });
    
    function ZodValidationForm() {
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema)  // Zod スキーマを適用
    });
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
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
                    name="age"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, ...field }, fieldState: { error } }) => (
                        <TextField
                            {...field}
                            onChange={(e) => onChange(Number(e.target.value))}
                            type="number"
                            label="年齢"
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

### Zod のバリデーションメソッド一覧

#### 文字列（string）

    z.string()
    .min(3, "3文字以上で入力してください")
    .max(100, "100文字以内で入力してください")
    .email("有効なメールアドレスを入力してください")
    .url("有効なURLを入力してください")
    .uuid("有効なUUIDを入力してください")
    .regex(/^[A-Za-z]+$/, "英字のみ入力可能です")
    .trim()  // 前後の空白を削除
    .toLowerCase()  // 小文字に変換
    .toUpperCase()  // 大文字に変換
    .startsWith("hello", "helloで始まる必要があります")
    .endsWith(".com", ".comで終わる必要があります")
    .includes("@", "@を含む必要があります")
    .length(10, "10文字である必要があります")
    .nonempty("空欄にできません")
    .optional()  // オプショナル（省略可能）

#### 数値（number）

    z.number({ invalid_type_error: "数値を入力してください" })
    .min(0, "0以上の値を入力してください")
    .max(100, "100以下の値を入力してください")
    .positive("正の数を入力してください")
    .negative("負の数を入力してください")
    .nonnegative("0以上の数を入力してください")
    .nonpositive("0以下の数を入力してください")
    .int("整数を入力してください")
    .multipleOf(5, "5の倍数を入力してください")
    .finite("有限の数値を入力してください")
    .safe("安全な範囲の数値を入力してください")

#### 真偽値（boolean）

    z.boolean()
    
    // チェックボックスが必ずtrueである必要がある場合
    z.boolean().refine((val) => val === true, {
    message: "同意する必要があります"
    })

#### 日付（date）

    z.date({ invalid_type_error: "日付を入力してください" })
    .min(new Date("2020-01-01"), "2020年1月1日以降の日付を選択してください")
    .max(new Date("2030-12-31"), "2030年12月31日までの日付を選択してください")

#### 配列（array）

    z.array(z.string())  // 文字列の配列
    .min(1, "最低1つ選択してください")
    .max(5, "最大5つまで選択可能です")
    .length(3, "正確に3つ選択してください")
    .nonempty("少なくとも1つ選択してください")
    
    // 特定の値のみを許可
    z.array(z.enum(["red", "green", "blue"]))

#### オブジェクト（object）

    z.object({
        name: z.string(),
        age: z.number(),
        address: z.object({
            zip: z.string(),
            city: z.string()
        })
    })

#### 列挙型（enum）

    z.enum(["admin", "user", "guest"], {
        errorMap: () => ({ message: "admin、user、guestのいずれかを選択してください" })
    })

#### オプショナル・nullable

    z.string().optional()  // undefined を許可
    z.string().nullable()  // null を許可
    z.string().nullish()  // undefined と null の両方を許可
    
    // デフォルト値を設定
    z.string().default("デフォルト値")

#### ユニオン型

    z.union([z.string(), z.number()])  // 文字列または数値
    
    // より簡潔な書き方
    z.string().or(z.number())

### 複数フィールド間のバリデーション

#### パスワードの一致確認

    const schema = z.object({
        password: z.string().min(8, "8文字以上で入力してください"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "パスワードが一致しません",
        path: ["confirmPassword"]  // エラーを表示するフィールドを指定
    });

#### 条件付きバリデーション

    const schema = z.object({
        accountType: z.enum(["personal", "business"]),
        companyName: z.string().optional(),
        vatNumber: z.string().optional()
    }).refine((data) => {
        if (data.accountType === "business") {
            return !!data.companyName;
        }
        return true;
    }, {
        message: "会社名は必須です",
        path: ["companyName"]
    }).refine((data) => {
        if (data.accountType === "business") {
            return !!data.vatNumber;
        }
        return true;
    }, {
        message: "VAT番号は必須です",
        path: ["vatNumber"]
    });

    // または superRefine を使用
    const schema = z.object({
        accountType: z.enum(["personal", "business"]),
        companyName: z.string().optional(),
        vatNumber: z.string().optional()
    }).superRefine((data, ctx) => {
        if (data.accountType === "business") {
            if (!data.companyName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "会社名は必須です",
                    path: ["companyName"]
                });
            }
            if (!data.vatNumber) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "VAT番号は必須です",
                    path: ["vatNumber"]
                });
            }
        }
    });

### 非同期バリデーション（DBのユニークチェック）

    import axios from "axios";
    import { z } from "zod";
    
    const schema = z.object({
        username: z.string().min(3, "3文字以上で入力してください")
    .refine(
        async (value) => {
            if (value.length < 3) return true;
            try {
                const response = await axios.get(`/api/users/check-username?username=${value}`);
                return response.data.isAvailable;
            } catch (error) {
                return false;
            }
        },
        { message: "このユーザー名は既に使用されています" }
    ),
        email: z
            .string()
            .email("有効なメールアドレスを入力してください")
            .refine(
                async (value) => {
                    try {
                        const response = await axios.get(`/api/users/check-email?email=${value}`);
                        return response.data.isAvailable;
                    } catch (error) {
                        return false;
                    }
                },
                { message: "このメールアドレスは既に登録されています" }
            )
    });
    
    function FormWithAsyncValidation() {
    const { handleSubmit, control } = useForm({
        resolver: zodResolver(schema),
        mode: "onBlur"  // フォーカスが外れた時にバリデーション
    });
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* フォームフィールド */}
            </form>
        );
    }

### スキーマの再利用とモジュール化

バリデーションスキーマを別ファイルに切り出して再利用できます。

#### schemas/userSchema.js

    import { z } from "zod";
    
    // 共通のバリデーションルール
    export const usernameSchema = z
    .string()
    .min(3, "3文字以上で入力してください")
    .max(20, "20文字以内で入力してください")
    .regex(/^[a-zA-Z0-9_]+$/, "英数字とアンダースコアのみ使用可能です");
    
    export const emailSchema = z
    .string()
    .email("有効なメールアドレスを入力してください");
    
    export const passwordSchema = z
    .string()
    .min(8, "8文字以上で入力してください")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,"小文字、大文字、数字を含める必要があります");
    
    // ユーザー登録用スキーマ
    export const userRegistrationSchema = z.object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "パスワードが一致しません",
        path: ["confirmPassword"]
    });
    
    // プロフィール更新用スキーマ（パスワード不要）
    export const userProfileSchema = z.object({
        username: usernameSchema,
        email: emailSchema,
        bio: z.string().max(500, "500文字以内で入力してください").optional(),
        website: z.string().url("有効なURLを入力してください").optional()
    });
    
    // パスワード変更用スキーマ
    export const passwordChangeSchema = z.object({
        currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
        newPassword: passwordSchema,
        confirmNewPassword: z.string()
    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "新しいパスワードが一致しません",
        path: ["confirmNewPassword"]
    }).refine((data) => data.currentPassword !== data.newPassword, {
        message: "現在のパスワードと同じパスワードは使用できません",
        path: ["newPassword"]
    });

#### 使用例

    import { useForm, Controller } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { userRegistrationSchema } from "./schemas/userSchema";
    import { TextField } from "@mui/material";
    
    function RegistrationForm() {
    const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(userRegistrationSchema)
    });
    
        const onSubmit = (data) => {
            console.log(data);
        };
    
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
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

### 実践的な例

#### 住所フォーム

    import { z } from "zod";
    
    const addressSchema = z.object({
    postalCode: z
    .string()
    .regex(/^\d{3}-\d{4}$/, "郵便番号は XXX-XXXX の形式で入力してください"),
        prefecture: z.enum([
        "北海道", "青森県", "岩手県", "宮城県", "秋田県", // ... 他の都道府県
        ], { errorMap: () => ({ message: "都道府県を選択してください" }) }),
        city: z.string().min(1, "市区町村を入力してください"),
        street: z.string().min(1, "町名・番地を入力してください"),
        building: z.string().optional()
    });

#### 商品フォーム（動的フィールド）

    import { z } from "zod";
    
    const productItemSchema = z.object({
        name: z.string().min(1, "商品名を入力してください"),
        price: z.number().positive("正の数を入力してください"),
        quantity: z.number().int("整数を入力してください").positive("1以上の値を入力してください")
    });
    
    const orderSchema = z.object({
        customerName: z.string().min(1, "顧客名を入力してください"),
        items: z.array(productItemSchema).min(1, "最低1つの商品を追加してください")
    }).refine((data) => {
        const total = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return total > 0;
    }, {
        message: "合計金額は0より大きい必要があります",
        path: ["items"]
    });

### Zod のメリット

1. **TypeScript との統合**: 型推論が自動的に行われる
2. **シンプルなAPI**: 直感的で読みやすい
3. **柔軟性**: 複雑なバリデーションも実装可能
4. **エラーメッセージのカスタマイズ**: 詳細なエラーメッセージを設定できる
5. **再利用性**: スキーマを簡単に組み合わせて再利用できる
6. **パフォーマンス**: 高速なバリデーション処理

### よくあるパターン

#### 電話番号

    z.string().regex(/^0\d{9,10}$/, "有効な電話番号を入力してください")

#### クレジットカード番号

    z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "XXXX-XXXX-XXXX-XXXX の形式で入力してください")

#### 日本の郵便番号

    z.string().regex(/^\d{3}-\d{4}$/, "XXX-XXXX の形式で入力してください")

#### URL（http/https のみ）

    z.string().url().refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
        message: "http:// または https:// で始まるURLを入力してください"
    })  
