# Introduction

## Standart App

generate awal nestjs akan mengahasilkan 4 file

1. main.ts -> sebagai entry point nestjs app
2. app.module.ts -> tepat import semua module
3. app.service.ts -> handling service
4. app.controller.ts -> handling request sebelum ke service
5. app.controller.spec.ts -> untuk membuat testing endpoint

## Fitur Utama Nest js

1. Modular: Nest js menggunakan module untuk membungkus komponen terkait, sehingga app lebih mudah dipahami dan dipelihara
2. Dependency Injection: Nest js menyediakan DI untuk mendukung reusabel code dan kemudahan pengujian dengan memanfaatkan Typescript Decorator
3. Compitable with Express Js: Nest Js dibangun diatas kerangka Express Js yang berarti terintegrasi dengan fitur fitur yang ada di expressJs
4. WebSocket: App realtime mudah di aplikasikan di nest js berkat dukungan bawaan untuk websocket

Generate app nest js

```bash
nest new [appName]
```
