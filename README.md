# Team proteam

Chạy ```docker-compose up --build``` là các container sẽ tự chạy.

Lần đầu thì build, lần sau chỉ cần chạy ```docker-compose up -d``` là được.

Có 6 service
```API_GATEWAY``` chạy port 3000
```AUTH_SERVICE``` chạy port 3001 với prefix ```/auth```
```USER_SERVICE``` chạy port 3002 với prefix ```/user```
```...```
```mysql``` chạy port 3008 ở local

##Swagger
```localhost:3000/api```
```USER_SERVICE``` chạy port 3002 với prefix ```localhost:3000/user/api```

##mysql
Tạo CSDL ```proteam``` trong localhost:3308 ```root-123456```
Thêm dữ liệu từ file ```proteam.sql```
