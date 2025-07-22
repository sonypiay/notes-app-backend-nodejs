import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfigurasi load test
export const options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp up ke 10 virtual users dalam 30 detik
    { duration: '50s', target: 50 },  // Maintain 10 users selama 1 menit
    { duration: '10s', target: 0 },  // Ramp down ke 0 users dalam 30 detik
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% request harus di bawah 500ms
    http_req_failed: ['rate<0.01'],   // Error rate di bawah 1%
  },
};

// Sample data untuk testing
const sampleNotes = [
  {
    title: 'Meeting Notes',
    body: 'Agenda: Discuss project timeline and deliverables',
    tags: ['meeting', 'work', 'project']
  },
  {
    title: 'Shopping List',
    body: 'Milk, Bread, Eggs, Coffee, Apples',
    tags: ['shopping', 'groceries', 'personal']
  },
  {
    title: 'Book Recommendations',
    body: 'Clean Code by Robert Martin, Design Patterns by Gang of Four',
    tags: ['books', 'programming', 'learning']
  },
  {
    title: 'Travel Plans',
    body: 'Visit Bali next month, check flights and accommodation',
    tags: ['travel', 'vacation', 'planning']
  },
  {
    title: 'Code Review Notes',
    body: 'Need to refactor the authentication module, add unit tests',
    tags: ['coding', 'review', 'refactoring']
  }
];

export default function () {
  // Pilih random note dari sample data
  const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];

  // Headers untuk request
  const headers = {
    'Content-Type': 'application/json',
  };

  // Kirim POST request
  const response = http.post(
      'http://localhost:3000/notes',
      JSON.stringify(randomNote),
      { headers }
  );

  // Validasi response
  check(response, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'response has body': (r) => r.body.length > 0,
  });

  // Log jika ada error
  if (response.status >= 400) {
    console.error(`Request failed with status: ${response.status}, body: ${response.body}`);
  }
}