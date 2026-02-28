# ⌨️ Emoji Typing 🎮

"Emoji Typing" เป็นเกมที่เปลี่ยนความน่าเบื่อของการท่องจำคำศัพท์และการฝึกพิมพ์ดีด ให้กลายเป็นการเอาชีวิตรอดที่ท้าทาย พร้อมระบบอัปเกรดพลังสไตล์ Roguelite

### 🔗 Quick Links
* 🎮 **Play the Game:** [emoji-typing.vercel.app](https://emoji-typing.vercel.app)
* 📄 **Game Documentation (GDD):** [Read on Google Docs](https://docs.google.com/document/d/13rBS3GVWC7xQfGEmBF1UeO6k06qKE9QwWuA8EjyDgfw/edit?usp=sharing)
* 👨‍💻 **Source Code:** [GitHub Repository](ใส่ลิงก์-repo-ของคุณที่นี่)

## 🎯 แนวคิดหลักของเกม (Core Concept)
* ผู้เล่นจะต้องต่อสู้กับ "บอส" ด้วยการพิมพ์คำศัพท์ภาษาอังกฤษให้ถูกต้องและรวดเร็ว
* มี "อิโมจิ (Emoji)" เป็นตัวช่วยใบ้ความหมาย เพื่อให้สมองจดจำความหมายเป็นภาพ
* ผสมผสานระบบ Roguelite เมื่อเลเวลอัปสามารถเลือกพลังพิเศษแบบสุ่มได้
* มีระบบฟาร์มคำศัพท์ (Dictionary) เพื่อเก็บสะสมคำศัพท์ไว้ทบทวนความหมายภาษาไทยในภายหลังได้

## ⚙️ ระบบกลไกหลัก (Gameplay Mechanics)
* **Typing Combat:** พิมพ์ตัวอักษรให้ตรงกับคำศัพท์และอิโมจิเพื่อทำการโจมตีบอส
* **Survival:** หากพิมพ์ช้า บอสจะโจมตี หาก HP ผู้เล่นเหลือ 0 จะ Game Over
* **Progression:** การโจมตีและการพิมพ์สำเร็จจะมอบ EXP เมื่อเลเวลอัปจะได้รับพลังพิเศษแบบสุ่ม (Skill Draft)
* **Scaling Difficulty:** บอสตัวถัดไปจะมีเลือดและพลังโจมตีสูงขึ้น บังคับให้ผู้เล่นต้องพิมพ์เร็วขึ้น

## 💻 เทคโนโลยีที่ใช้ (Technology Stack)
เกมนี้พัฒนาในรูปแบบ Single Page Application (SPA):
* **Languages:** JavaScript (JSX), HTML5, CSS3
* **Frontend Framework:** React (จัดการ UI และ State แบบ Real-time เช่น หลอดเลือด, การกดปุ่ม)
* **Build Tool:** Vite (ช่วยให้การรัน Local server และ Build รวดเร็ว)
* **Styling:** Tailwind CSS (จัดการสไตล์แบบ Neon Dark Mode และ Responsive Design)
* **Deployment:** Vercel (CI/CD ดึงโค้ดจาก GitHub ไป Build และ Deploy อัตโนมัติ)

## 👥 ผู้พัฒนา (Developers)
โปรเจกต์นี้เป็นส่วนหนึ่งของวิชา โครงสร้างข้อมูลและอัลกอริทึม (Data structures and algorithms) มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน ว.ขอนแก่น

1. **นาย กานต์นิธิ ยะโส** - รหัสนักศึกษา 67332110223-9
2. **นาย ธนวัฒน์ นามเหง้า** - รหัสนักศึกษา 67332110293-4

เสนอ: อาจารย์ ประภาส ผ่องสนาม

---

# ⌨️ Emoji Typing 🎮 (English Version)

"Emoji Typing" is a game that turns the boredom of memorizing vocabulary and practicing typing into a challenging survival action game with roguelite-style power-ups.

### 🔗 Quick Links
* 🎮 **Play the Game:** [emoji-typing.vercel.app](https://emoji-typing.vercel.app)
* 📄 **Game Documentation (GDD):** [Read on Google Docs](https://docs.google.com/document/d/13rBS3GVWC7xQfGEmBF1UeO6k06qKE9QwWuA8EjyDgfw/edit?usp=sharing)
* 👨‍💻 **Source Code:** [GitHub Repository](Your-Repo-Link-Here)

## 🎯 Core Concept
* Players must fight "bosses" by typing English vocabulary words correctly and quickly.
* Uses "Emojis" as visual cues to help the brain associate and remember meanings as images.
* Incorporates a Roguelite system where leveling up allows players to choose random special powers (buffs/passives).
* Features a vocabulary farming system (Dictionary) to collect completed words for reviewing their Thai translations later.

## ⚙️ Gameplay Mechanics
* **Typing Combat:** Type characters that match the vocabulary and emoji to deal damage to the boss.
* **Survival:** If you type too slowly or let time pass, the boss will attack. If the player's HP reaches 0, it's Game Over.
* **Progression:** Successfully typing words and attacking the boss grants EXP. Leveling up grants an immediate random special power (Skill Draft).
* **Scaling Difficulty:** The next boss to appear will have increased health and attack power, forcing the player to type faster.

## 💻 Technology Stack
This game is developed as a modern Single Page Application (SPA):
* **Languages:** JavaScript (JSX), HTML5, CSS3
* **Frontend Framework:** React (Handles UI components and real-time state management, such as HP bars and keystrokes).
* **Build Tool:** Vite (Provides a highly efficient and fast local development server and production build).
* **Styling:** Tailwind CSS (Handles styling with a Neon Dark Mode theme and fully Responsive Design).
* **Deployment:** Vercel (CI/CD workflow that automatically pulls code from GitHub to build and deploy).

## 👥 Developers
This project is part of the Data Structures and Algorithms course at Rajamangala University of Technology Isan, Khon Kaen Campus.

1. **Mr. Kanniti Yaso** - Student ID: 67332110223-9
2. **Mr. Tanawat Namngao** - Student ID: 67332110293-4

Presented to: Ajarn Prapas Phongsanarm
