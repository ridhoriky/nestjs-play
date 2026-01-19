# Pipes di NestJS

## Pendahuluan

**Pipe** di NestJS adalah salah satu komponen inti yang berfungsi untuk **memproses data sebelum masuk ke handler (controller method)**.

Pipe bekerja **setelah request diterima**, tetapi **sebelum data diteruskan ke controller**, sehingga sangat cocok untuk:

- Validasi input
- Transformasi data
- Normalisasi payload
- Melempar error lebih awal jika data tidak valid

> Singkatnya:  
> **Middleware → Guard → Pipe → Controller**

---

## Tujuan Penggunaan Pipe

### 1. Validasi Input

Memastikan data dari client sesuai dengan format dan aturan yang diharapkan.

Contoh:

- ID harus angka
- Body tidak boleh kosong
- Email harus valid

---

### 2. Transformasi Data

Mengubah data input ke format yang diinginkan.

Contoh:

- String → Number
- String → Boolean
- Normalisasi casing (lowercase, uppercase)

---

### 3. Penanganan Error Lebih Awal

Pipe dapat melempar exception sebelum logic bisnis dijalankan.

Keuntungan:

- Logic controller tetap bersih
- Error handling konsisten
- Menghindari data invalid masuk ke service

---

### 4. Reusabilitas Kode

Pipe dapat digunakan kembali di:

- Parameter
- Method
- Controller
- Global scope

---

## Cara Membuat Pipe

Pipe dibuat dengan:
cli generate piep

```bash
nest generate pipe ParseInt
```

- Mengimplementasikan interface `PipeTransform`
- (Disarankan) menggunakan decorator `@Injectable()`

Struktur PipeTransform

```js
transform(value: any, metadata: ArgumentMetadata)
```

value adalah Data asli dari request

Bisa berasal dari:

- @Body()
- @Param()
- @Query()
- metadata

Berisi informasi tentang data:

```js
{
  type: 'body' | 'param' | 'query' | 'custom',
  metatype?: any,
  data?: string
}
```

Contoh implementasi sederhana validasi di pipes

```ts
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const numberValue = parseInt(value, 10);
    if (isNaN(numberValue)) {
      throw new BadRequestException("Invalid nput, must be an integer");
    }
    return numberValue;
  }
}
```

## Cara penggunaan pipes

1. Di Parameter (Paling Umum & Direkomendasikan)

   ```js
   @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number) {
   return id;
   }
   ```

   ✅ Paling bersih, ✅ Scope paling kecil, ✅ Mudah dibaca

2. Di Method

   ```js
   @Get(':id')
   @UsePipes(ParseIntPipe)
   findOne(@Param('id') id: number) {
   return id;
   }
   ```

3. Di Controller

   ```js
   @UsePipes(ParseIntPipe)
   @Controller("users")
   export class UsersController {}
   ```

4. Global Pipe (Untuk Seluruh Aplikasi)

   ```js
   app.useGlobalPipes(new ValidationPipe());
   ```

   Atau (best practice dengan DI):

   ```ts
   providers: [
     {
       provide: APP_PIPE,
       useClass: ValidationPipe,
     },
   ];
   ```

Built-in Pipes di NestJS, NestJS menyediakan banyak pipe bawaan:

- ParseIntPipe: Fungsinya String → Number
- ParseBoolPipe: Fungsinya String → Boolean
- ParseUUIDPipe: Fungsinya Validasi UUID
- ValidationPipe: Fungsinya Validasi DTO
- DefaultValuePipe: Fungsinya Nilai default

## Analogi Axios vs NestJS (Paling Mudah Dipahami)

Untuk mempermudah pemahaman, konsep **Pipe** dan **Exception Filter** di NestJS dapat dianalogikan dengan **Interceptor di Axios**.

---

### 🟢 Pipe ≈ Axios Request Interceptor

Dipanggil sebelum request diproses

Contoh di Axios:

```ts
axios.interceptors.request.use((config) => {
  // validasi & transform data
  return config;
});
```

Di NestJS:

Pipe → validasi & transform input

Kesamaan antara keduanya yaitu:

- Berjalan sebelum logic utama

- Digunakan untuk: Validasi data, Transformasi data

- Dapat menghentikan proses dengan melempar error (throw exception)

---

### 🔴 Exception Filter ≈ Axios Response / Error Interceptor

Dipanggil setelah terjadi error

Contoh di Axios:

```ts
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle & format error
    return Promise.reject(error);
  }
);
```

Di NestJS:

Exception Filter → menangkap & memformat error

Kesamaan antara keduanya yaitu:

- Berjalan setelah terjadi error

- Fokus pada: Error handling, Formatting response error

- Tidak mengubah data request

---

## Catatan Penting (Agar Tidak Salah Kaprah)

🔹 Pipe BUKAN Interceptor

- Pipe hanya fokus pada input data

- Pipe tidak bisa mengakses response

- Pipe berjalan sebelum controller

🔹 Exception Filter BUKAN Response Transformer

- Exception Filter hanya bekerja saat error

- Tidak dipanggil pada response sukses

📌 Untuk memproses response sukses di NestJS, dapat menggunakan Interceptor
