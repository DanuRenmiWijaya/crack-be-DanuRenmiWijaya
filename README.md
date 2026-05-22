# SIMRS Plus - Backend API (NestJS)

Repositori ini merupakan sistem pusat (Backend API) dari Sistem Informasi Manajemen Rumah Sakit (SIMRS Plus). Dibangun menggunakan **NestJS**, **TypeScript**, dan **Prisma ORM** dengan database **PostgreSQL**. 

Sistem ini mengelola autentikasi ganda (Admin & Pasien), kontrol data medis (CRUD), kalkulasi nomor antrean otomatis, ekspor laporan berbasis waktu, dan penyediaan visualisasi data.

## 🚀 Fitur Utama
- **Dual-Role Authentication:** Login admin/dokter menggunakan Password Hashing (Bcrypt) dan login pasien instan menggunakan verifikasi NIK & Tanggal Lahir.
- **Patient & EMR Management:** Full CRUD data pasien dan pengelolaan Rekam Medis (EMR) yang aman terikat dengan ID Dokter (pemeriksa).
- **Automated Queueing System:** Sistem otomatisasi kalkulasi nomor antrean per poli (department) secara real-time berbasis tanggal kunjungan.
- **Reporting & Analytics:** Endpoint statistik harian, data tren kunjungan bulanan, dan ekspor data pasien ke format Excel (`exceljs`).
- **API Documentation:** Integrasi penuh dengan **Swagger UI** untuk pengujian endpoint secara interaktif.

## 🛠️ Tech Stack & Libraries
- **Framework:** NestJS (v11+)
- **Language:** TypeScript
- **Database ORM:** Prisma Client
- **Database:** PostgreSQL
- **Security:** Passport JWT, Bcrypt, Class-Validator
- **Utilities:** ExcelJS

## 📂 Struktur Folder (Modular Architecture)
```text
src/
├── auth/                 # Autentikasi Admin & Pasien + JWT Strategy
├── patients/             # Manajemen Profil Pasien, Statistik, & Export Excel
├── appointments/         # Logika Antrean Online, Live Tracking, Update/Cancel
├── medical-records/      # Pengelolaan Data Rekam Medis Dokter
├── prisma/               # Instansiasi PrismaService tunggal (Singleton)
├── main.ts               # Konfigurasi aplikasi, CORS, & Swagger Docs
└── app.module.ts         # Modul utama konfigurasi proyek
```

## Beckend Testing
![Testing Backend](./assets/screenshot-testing.png)

###
Deployment :`https://crack-be-danu-renmi-wijaya.vercel.app/v1`

### Jalankan Server Lokal
API akan berjalan secara lokal di: `http://localhost:5000/api/v1`  
Dokumentasi Swagger UI dapat diakses di: `http://localhost:5000/api/docs`
