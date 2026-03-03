# Shop Management Application

แอปพลิเคชันสำหรับจัดการข้อมูลร้านค้าและแดชบอร์ดแสดงยอดขาย (Sales Dashboard) ที่มาพร้อมกับระบบจัดการคำสั่งซื้อ การคำนวณยอดต่างๆ อัตโนมัติ และการเปรียบเทียบประสิทธิภาพการขายระหว่างแพลตฟอร์มต่างๆ (เช่น TikTok และ Shopee)

## ✨ ฟีเจอร์หลัก (Key Features)

- **ระบบยืนยันตัวตน (Authentication):** ล็อกอินและจัดการสิทธิ์ผู้ใช้งาน
- **จัดการคำสั่งซื้อ (Order Management):** บันทึก ตรวจสอบ และคำนวณยอดขาย/ต้นทุน/กำไร อัตโนมัติ
- **แดชบอร์ดเปรียบเทียบยอดขาย (Sales Dashboard):** วิเคราะห์และเปรียบเทียบยอดขายจากหลายแพลตฟอร์ม (TikTok vs Shopee)
- **CI/CD Integration:** รองรับการทำงานร่วมกับระบบ CI/CD ผ่าน GitHub Actions (ในโฟลเดอร์ `.github`)

## 🛠️ โครงสร้างเทคโนโลยี (Tech Stack)

### Frontend (ระบบหน้าบ้าน)
- **Framework:** Vue.js 3 (Composition API)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Routing:** Vue Router
- **HTTP Client:** Axios
- **UI/UX:** SweetAlert2 สำหรับแจ้งเตือน

### Backend (ระบบหลังบ้าน)
- **Framework:** Node.js พร้อม Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT) & bcrypt สำหรับเข้ารหัสรหัสผ่าน
- **Development Tool:** Nodemon & ts-node

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### ส่วน Backend

1. เข้าไปที่โฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. ตั้งค่า Environment Variables:
   สร้างไฟล์ `.env` ในโฟลเดอร์ `backend` และกำหนดค่าการเชื่อมต่อฐานข้อมูล (Database URL) และ JWT Secret
4. รัน Database Migration (ผ่าน Prisma):
   ```bash
   npx prisma generate
   npx prisma db push
   # หรือ npx prisma migrate dev
   ```
5. รันเซิร์ฟเวอร์โหมด Development:
   ```bash
   npm run dev
   ```
   > เซิร์ฟเวอร์จะรันด้วย `nodemon` และรีโหลดอัตโนมัติเมื่อมีการแก้ไขโค้ด

### ส่วน Frontend

1. เข้าไปที่โฟลเดอร์ `frontend`:
   ```bash
   cd frontend
   ```
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. รันโปรเจกต์โหมด Development:
   ```bash
   npm run dev
   ```
   > โปรเจกต์รันผ่าน Vite สามารถเข้าใช้งานผ่าน URL ที่ปรากฏใน Terminal ได้ทันที (เช่น `http://localhost:5173`)

## 📁 โครงสร้างโฟลเดอร์ที่สำคัญ

- `backend/`: โค้ดของฝั่งเซิร์ฟเวอร์ (API, Database Models)
- `frontend/`: โค้ดของฝั่งหน้าเว็บ (Vue Components, Views, Store)
- `.github/`: ตั้งค่าสำหรับ GitHub Actions (CI/CD)
- `render.yaml`: ไฟล์กำหนดค่า (Infrastructure as Code) สำหรับ Deploy บน Render

## ☁️ การนำแอปพลิเคชันขึ้นระบบจริง (Deployment - Render)

โปรเจกต์นี้ได้รับการตั้งค่าให้รองรับการ Deploy ไปยัง [Render.com](https://render.com) ได้ง่ายๆ โดยใช้ไฟล์ `render.yaml` เป็น Blueprint (Infrastructure as Code) ซึ่งจะจัดการทั้ง Backend (Web Service) และ Frontend (Static Site) ในคราวเดียว

1. หลังจากอัปโหลดโค้ดนี้ขึ้น GitHub `main` branch
2. ล็อกอินเข้าสู่ **Render Dashboard** และไปที่แท็บ **Blueprints**
3. คลิกปุ่ม **New Blueprint Instance** มุมขวาบน
4. ลิงก์เข้ากับ Repository รูปแบบนี้
5. ระบุค่า Environment Variables เล็กๆ น้อยๆ สำหรับ Database (`DATABASE_URL`) และ Secret (`JWT_SECRET`) ที่หน้า Dashboard
6. กดปุ่ม `Apply` และให้ Render จัดการให้ได้เลย

นอกจากนี้ การ Deploy ซ้ำแบบอัตโนมัติ (CD) ได้ตั้งค่าไว้แล้วใน `.github/workflows/cd.yml` ที่จะยิง Webhook (Deploy Hook URL) ไปยัง Render เมื่อมีการอัปเดตโค้ดเข้าสู่ `main` branch

## 📄 License
ISC License (กำหนดใน Backend)
