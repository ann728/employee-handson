FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:stable-alpine

# Node.js と npm を追加
RUN apk add nodejs npm

# json-server をインストール
RUN npm install -g json-server

# フロント静的ファイルをコピー
COPY --from=build /app/dist /usr/share/nginx/html

# json-server 用データ
COPY ./webapi/app_data.json /app/app_data.json

# ポート設定
EXPOSE 80 3000

# Nginx と json-server を同時起動
CMD ["sh", "-c", "nginx -g 'daemon off;' & json-server --watch /app/app_data.json --port 3000 --host 0.0.0.0"]
