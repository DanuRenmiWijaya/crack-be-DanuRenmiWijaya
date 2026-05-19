const { execSync } = require('child_process');

// 1. Definisikan string koneksi pooler IPv4 Supabase secara presisi di dalam skrip
const databaseUrl = "postgresql://postgres.vbpjijegrcphtvejtmbi:DannWijayaGo@://supabase.com";

try {
  console.log('⏳ Memulai sinkronisasi paksa ke cloud Supabase...');
  
  // 2. KUNCI SUKSES: Jalankan perintah dengan menyuntikkan variabel murni di level proses Node, membypass seluruh Environment Windows
  execSync('npx prisma db push', {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl
    },
    stdio: 'inherit' // Menampilkan log keluaran Prisma langsung ke terminal Anda
  });

  console.log('✅ Sinkronisasi skema tabel database berhasil!');
} catch (error) {
  console.error('❌ Gagal mengeksekusi sinkronisasi:', error.message);
  process.exit(1);
}
