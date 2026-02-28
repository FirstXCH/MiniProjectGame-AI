# ⌨️ Emoji Typing 🎮

"Emoji Typing" เป็นเกมที่เปลี่ยนความน่าเบื่อของการท่องจำคำศัพท์และการฝึกพิมพ์ดีด ให้กลายเป็นการเอาชีวิตรอดที่ท้าทาย พร้อมระบบอัปเกรดพลังสไตล์ Roguelite

### 🔗 Quick Links
* 🎮 **Play the Game:** [emoji-typing.vercel.app](https://emoji-typing.vercel.app)
* 📄 **Game Documentation (GDD):** [Read on Google Docs](https://docs.google.com/document/d/13rBS3GVWC7xQfGEmBF1UeO6k06qKE9QwWuA8EjyDgfw/edit?usp=sharing)
* 👨‍💻 **Source Code:** [GitHub Repository](ลิงก์-repo-ของคุณ)

## 🎯 แนวคิดหลักของเกม (Core Concept)
* [cite_start]ผู้เล่นจะต้องต่อสู้กับ "บอส" ด้วยการพิมพ์คำศัพท์ภาษาอังกฤษให้ถูกต้องและรวดเร็ว [cite: 29]
* [cite_start]มี "อิโมจิ (Emoji)" เป็นตัวช่วยใบ้ความหมาย เพื่อให้สมองจดจำความหมายเป็นภาพ [cite: 29, 55]
* [cite_start]ผสมผสานระบบ Roguelite เมื่อเลเวลอัปสามารถเลือกพลังพิเศษ แบบสุ่มได้ [cite: 30]
* [cite_start]มีระบบฟาร์มคำศัพท์ (Dictionary) เพื่อเก็บสะสมคำศัพท์ไว้ทบทวนความหมายภาษาไทยในภายหลังได้ [cite: 30]

## ⚙️ ระบบกลไกหลัก (Gameplay Mechanics)
* [cite_start]**Typing Combat:** พิมพ์ตัวอักษรให้ตรงกับคำศัพท์และอิโมจิเพื่อทำการโจมตีบอส [cite: 35]
* [cite_start]**Survival:** หากพิมพ์ช้า บอสจะโจมตี หาก HP ผู้เล่นเหลือ 0 จะ Game Over [cite: 36]
* [cite_start]**Progression:** การโจมตีและการพิมพ์สำเร็จจะมอบ EXP เมื่อเลเวลอัปจะได้รับพลังพิเศษแบบสุ่ม (Skill Draft) [cite: 38, 39]
* [cite_start]**Scaling Difficulty:** บอสตัวถัดไปจะมีเลือดและพลังโจมตีสูงขึ้น บังคับให้ผู้เล่นต้องพิมพ์เร็วขึ้น [cite: 40]

## 💻 เทคโนโลยีที่ใช้ (Technology Stack)
[cite_start]เกมนี้พัฒนาในรูปแบบ Single Page Application (SPA)[cite: 64]:
* [cite_start]**Languages:** JavaScript (JSX), HTML5, CSS3 [cite: 65]
* [cite_start]**Frontend Framework:** React (จัดการ UI และ State แบบ Real-time เช่น หลอดเลือด, การกดปุ่ม) [cite: 69]
* [cite_start]**Build Tool:** Vite (ช่วยให้การรัน Local server และ Build รวดเร็ว) [cite: 70, 71]
* [cite_start]**Styling:** Tailwind CSS (จัดการสไตล์แบบ Neon Dark Mode และ Responsive Design) [cite: 72]
* [cite_start]**Deployment:** Vercel (CI/CD ดึงโค้ดจาก GitHub ไป Build และ Deploy อัตโนมัติ) [cite: 77, 80, 82]

## 👥 ผู้พัฒนา (Developers)
[cite_start]โปรเจกต์นี้เป็นส่วนหนึ่งของวิชา โครงสร้างข้อมูลและอัลกอริทึม (Data structures and algorithms) มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน ว.ขอนแก่น [cite: 1, 3, 4, 15]

1. [cite_start]**นาย กานต์นิธิ ยะโส ** - รหัสนักศึกษา 67332110223-9 [cite: 8, 9]
2. [cite_start]**นาย ธนวัฒน์ นามเหง้า** - รหัสนักศึกษา 67332110293-4 [cite: 10, 11]

[cite_start]เสนอ: อาจารย์ ประภาส ผ่องสนาม [cite: 12, 13]

---

# ⌨️ Emoji Typing 🎮 (English Version)

[cite_start]"Emoji Typing" is a game that turns the boredom of memorizing vocabulary and practicing typing into a challenging survival action game with roguelite-style power-ups. [cite: 29, 30]

### 🔗 Quick Links
* 🎮 **Play the Game:** [emoji-typing.vercel.app](https://emoji-typing.vercel.app)
* 📄 **Game Documentation (GDD):** [Read on Google Docs](https://docs.google.com/document/d/13rBS3GVWC7xQfGEmBF1UeO6k06qKE9QwWuA8EjyDgfw/edit?usp=sharing)
* 👨‍💻 **Source Code:** [GitHub Repository](Your-Repo-Link-Here)

## 🎯 Core Concept
* [cite_start]Players must fight "bosses" by typing English vocabulary words correctly and quickly. [cite: 29]
* [cite_start]Uses "Emojis" as visual cues to help the brain associate and remember meanings as images. [cite: 29, 55]
* [cite_start]Incorporates a Roguelite system where leveling up allows players to choose random special powers (buffs/passives). [cite: 30]
* [cite_start]Features a vocabulary farming system (Dictionary) to collect completed words for reviewing their Thai translations later. [cite: 30, 43, 44]

## ⚙️ Gameplay Mechanics
* [cite_start]**Typing Combat:** Type characters that match the vocabulary and emoji to deal damage to the boss. [cite: 35]
* **Survival:** If you type too slowly or let time pass, the boss will attack. [cite_start]If the player's HP reaches 0, it's Game Over. [cite: 36]
* **Progression:** Successfully typing words and attacking the boss grants EXP. [cite_start]Leveling up grants an immediate random special power (Skill Draft). [cite: 38, 39]
* [cite_start]**Scaling Difficulty:** The next boss to appear will have increased health and attack power, forcing the player to type faster. [cite: 40]

## 💻 Technology Stack
[cite_start]This game is developed as a modern Single Page Application (SPA)[cite: 64]:
* [cite_start]**Languages:** JavaScript (JSX), HTML5, CSS3 [cite: 65]
* [cite_start]**Frontend Framework:** React (Handles UI components and real-time state management, such as HP bars and keystrokes). [cite: 69]
* [cite_start]**Build Tool:** Vite (Provides a highly efficient and fast local development server and production build). [cite: 70, 71]
* [cite_start]**Styling:** Tailwind CSS (Handles styling with a Neon Dark Mode theme and fully Responsive Design). [cite: 72]
* [cite_start]**Deployment:** Vercel (CI/CD workflow that automatically pulls code from GitHub to build and deploy). [cite: 77, 80, 82]

## 👥 Developers
[cite_start]This project is part of the Data Structures and Algorithms course at Rajamangala University of Technology Isan, Khon Kaen Campus. [cite: 1, 3, 4, 15]

1. **Mr. [cite_start]Kanniti Yaso** - Student ID: 67332110223-9 [cite: 8, 9]
2. **Mr. [cite_start]Tanawat Namngao** - Student ID: 67332110293-4 [cite: 10, 11]

[cite_start]Presented to: Ajarn Prapas Phongsanarm [cite: 12, 13]
