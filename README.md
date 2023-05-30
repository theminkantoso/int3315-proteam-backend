# Team proteam

Chạy ```docker-compose up --build``` là các container sẽ tự chạy.

Thay đổi code thì build, còn không thì ```docker-compose up -d``` là được.

Có 6 service
```API_GATEWAY``` chạy port 3000

```AUTH_SERVICE``` chạy port 3001 với prefix ```/auth```

```USER_SERVICE``` chạy port 3002 với prefix ```/user```

```...```

```mysql``` chạy port 3008 ở local

## Swagger
```localhost:3000/api```

```AUTH_SERVICE``` swagger chạy port 3001, truy cập qua ```localhost:3000/auth/api``` hoặc ```localhost:3001/auth/api```

```USER_SERVICE``` swagger chạy port 3002, truy cập qua ```localhost:3000/user/api``` hoặc ```localhost:3001/user/api```

## mysql
Tạo CSDL ```proteam``` trong localhost:3308 ```root-123456```

Thêm dữ liệu từ file ```proteam.sql```
=======
Lần đầu thì build, lần sau chỉ cần chạy ```docker-compose up -d``` là được.
