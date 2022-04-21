# Foodart

## Website review món ăn số 1 Việt Nam

[![N|Power by Express](https://img.shields.io/badge/express-powered-brightgreen)](https://img.shields.io/badge/express-powered-brightgreen)

Review Mon An là một trang web review món ăn dành cho mọi người.



## Chức năng

## Tech

Sử dụng một số mã nguồn mở

- [node.js] - evented I/O for the backend
- [Expressjs] - fast node.js network app framework [@tjholowaychuk]
- [Tailwindcss] - A utility-first CSS framework

[Xem thêm tại đây](/package.json)

## Installation

Yêu cầu [Node.js](https://nodejs.org/) v10+ để chạy.

Tạo một file .env với nội dung
```sh
MONGODB_URI=URL_STRING
SENDGRID_API_KEY=APIKEY
SESSION_SECRET=RANDOM_SECRET
JWT_SECRET=RANDOM_SECRET
DOMAIN_NAME=https://localhost:3000
```

Cài đặt dependencies, devDependencies và khởi chạy server.

```sh
npm i
npm run css:dev // css sẽ được compile trước khi re-run server
npm run dev // css không được compile trước
```

For production environments...

```sh
npm run start
```
