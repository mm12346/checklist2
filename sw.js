// ชื่อของ Cache Storage ที่จะใช้เก็บไฟล์
const CACHE_NAME = 'online-checker-cache-v5';

// รายการไฟล์ที่ต้องการให้ถูกแคชไว้เพื่อให้ทำงานออฟไลน์ได้
const urlsToCache = [
  './', // แคชหน้าหลัก
  './index.html', // แคชไฟล์ HTML
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;700&display=swap'
];

// Event: install - เกิดขึ้นเมื่อ Service Worker ถูกติดตั้ง
self.addEventListener('install', event => {
  // รอจนกว่าจะทำการเปิด cache และเพิ่มไฟล์ทั้งหมดลงไป
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and adding files to cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: fetch - เกิดขึ้นทุกครั้งที่มีการร้องขอไฟล์ (request)
self.addEventListener('fetch', event => {
  event.respondWith(
    // ตรวจสอบว่า request ที่เข้ามามีอยู่ใน cache หรือไม่
    caches.match(event.request)
      .then(response => {
        // ถ้ามีใน cache ให้ส่ง response จาก cache กลับไปเลย
        if (response) {
          return response;
        }
        // ถ้าไม่มีใน cache ให้ทำการ fetch จาก network ตามปกติ
        return fetch(event.request);
      })
  );
});

// Event: activate - เกิดขึ้นเมื่อ Service Worker เริ่มทำงาน
// ใช้สำหรับลบ cache เก่าที่ไม่จำเป็นแล้ว
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // รายชื่อ cache เวอร์ชันปัจจุบันที่ต้องการเก็บไว้
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // หาก cache ที่เจอไม่ใช่เวอร์ชันปัจจุบัน ให้ลบทิ้ง
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
