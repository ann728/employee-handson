# 新人研修タスクメモ

## ◆◆ 従業員表・ワークスペース表

### ◆ 従業員表作りの修正

現状のプログラムは構成や機能がイケていないため、修正する。

---

#### 現状の構成の把握・よくないところ

- `useEmployeesListStore` が微妙  
  → 従業員一覧の管理のはずが、個別データの処理（`saveEmployee`）まで含んでいる
- serviceの処理がコンポーネントから直呼びされている  
  → `EmployeeForm` 等。設計思想としては store からのみ通信をさせたい
- バリデーション処理が手組み  
  → React の機能を使って簡易かつメンテナンス性を上げたい
- Gridコンポーネントが非推奨（Deprecated）
- （後回し）上部メニューが `App.jsx` に直書き  
  → テンプレート化して呼び出した方が良い

---

#### 現状の機能の問題点

- 削除がワンクリックで実行される  
  → 確認ダイアログを追加する
- 表がソート不可
- 上部メニューが拡張性に乏しい（将来機能増加に対応しづらい）
- 部署が編集できない

---

### ◆ `EmployeeForm` のデータを store 化

- `useState(initial)` → `useEmployeeStore` に変更
- `employeeService.get(id)` や `saveEmployee` を store 内に移動

---

### ◆ Grid コンポーネントの置き換え

- EmployeeForm 内の Grid コンポーネントを下記に従って修正  
  https://mui.com/material-ui/migration/upgrade-to-grid-v2/

---

### ◆ React Hook Form の導入

- 現状は手組み → React Hook Form へ移行 
- 参考：[docs/react-hook-form-guide.md](./docs/react-hook-form-guide.md)（自作資料）

チェック項目：
- ユーザー名 必須チェック
- 電話番号 必須チェック／形式チェック
- 所属 必須チェック
- 権限 必須チェック

---

### ◆ バリデーションの Zod 化

- zod を使用
- 今回は必須ではないが、複雑なバリデーション対応の準備として
- 参考：[docs/react-hook-form-zod-guide.md](./docs/react-hook-form-zod-guide.md)（自作資料）
---

### ◆ 従業員電話番号のユニークチェック

- 通信制御が複雑なため今回はスキップ

---

### ◆ 削除ダイアログの追加

- 参考：MUI アラートダイアログ  
  https://mui.com/material-ui/react-dialog/

---

### ◆ 表のソート機能追加

- 参考：MUI Table の Sorting 機能  
  https://mui.com/material-ui/react-table/

---

### ◆ 上部メニューボタンのリスト化

- メニューを1ボタンにして、押下時にリスト表示
- 参考：Basic Menu  
  https://mui.com/material-ui/react-menu/

---

## ◆◆ 部署マスタ編集機能の追加

### ◆ 部署一覧ページの作成

- `部署一覧 store` の作成
- `部署一覧コンポーネント` の作成
- ルーティング追加（例：`/departmentList`）
- メニューボタンに遷移追加
- MUI Table を使って部署一覧を表示（ID順／ソート不要）

---

### ◆ 部署追加機能の作成

- モーダル形式（項目は名前のみ）

作業内容：
- `addDepartment` 関数作成（`api.post('/departments', payload)`）
- 一覧画面に「追加」ボタンを作成
- モーダル内容：
    - タイトル「部署追加」
    - `TextField`（部署名入力）
    - キャンセルボタン（閉じる）
    - 保存ボタン（保存して閉じる）

※ユニークチェックは今回は不要、必須チェックのみでOK

---

### ◆ 部署削除機能の追加

- 一覧に削除ボタン追加（従業員一覧と同様）
- `deleteDepartment` 関数作成（`api.delete(/departments/${id})`）

---

## ◆◆ ワークスペース機能の追加

（※内容は未記載）

---

## ◆◆ ログイン機能の追加

（※内容は未記載）
