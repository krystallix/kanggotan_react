import http from 'k6/http';
import { check, sleep } from 'k6';

// Daftar nama-nama orang Indonesia untuk search query
const indonesianNames = [
    'Ahmad', 'Budi', 'Siti', 'Andi', 'Dewi', 'Agus', 'Fitri',
    'Hadi', 'Indra', 'Joko', 'Wati', 'Rini', 'Yanto', 'Sri',
    'Eko', 'Ratna', 'Bambang', 'Lina', 'Hendra', 'Ani',
    'Dedi', 'Maya', 'Tono', 'Sari', 'Rudi', 'Dian', 'Arief',
    'Rina', 'Wahyu', 'Nita', 'Santoso', 'Putri', 'Ridwan',
    'Ayu', 'Gunawan', 'Yuli', 'Sutrisno', 'Ningsih', 'Pranowo',
    'Suci', 'Susanto', 'Ika', 'Widodo', 'Retno', 'Mulyadi'
];

export const options = {
    stages: [
        { duration: '2m', target: 200 },   // Ramp-up ke 200 users dalam 2 menit
        { duration: '3m', target: 500 },   // Naik ke 500 users dalam 3 menit
        { duration: '2m', target: 1000 },  // Naik ke 1000 users dalam 2 menit
        { duration: '5m', target: 1000 },  // Hold 1000 users selama 5 menit
        { duration: '2m', target: 0 },     // Ramp-down ke 0 users dalam 2 menit
    ],
    thresholds: {
        http_req_duration: ['p(95)<3000'], // 95% request harus di bawah 3 detik
        http_req_failed: ['rate<0.01'],    // Error rate harus di bawah 1%
    },
};

export default function () {
    // Pilih nama random dari array
    const randomName = indonesianNames[Math.floor(Math.random() * indonesianNames.length)];

    // Buat URL dengan query parameters yang berubah-ubah
    const page = Math.floor(Math.random() * 5) + 1; // Random page 1-5
    const url = `http://kanggotan.arkane.my.id/haul-massal?year=2025&search=${randomName}&page=${page}`;

    // Kirim request
    const response = http.get(url);

    // Validasi response
    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time < 5s': (r) => r.timings.duration < 5000,
    });

    // Sleep 1-3 detik untuk simulasi user behavior yang realistis
    sleep(Math.random() * 2 + 1);
}
