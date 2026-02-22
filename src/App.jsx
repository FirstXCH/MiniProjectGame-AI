import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Zap, Shield, Flame, 
  ChevronsRight, Crown, Sword, 
  Droplets, Snowflake, Star, ArrowLeft,
  Info, RotateCcw, FastForward, Castle, Play, Home,
  Bomb, MoveRight, Coins, BookOpen, Eye, EyeOff, Search,
  Volume2, VolumeX, Sparkles
} from 'lucide-react';

// --- GLOBAL CONSTANTS ---

const MAX_PLAYER_HP = 100;
const BASE_DRAIN_RATE = 2.5; 
const HEAL_PER_WORD = 4; 
const BASE_ENEMY_HP = 250; 
const BASE_XP_REQ = 100; 
const TYPO_PENALTY = 10;
const TICK_RATE = 16; 
const WIN_BOSS_COUNT = 20;
const MAX_SKILL_LEVEL = 3;
const PANIC_HP_THRESHOLD = 30;

// Image IDs
const IMG_CASTLE_ID = "14SlsJ9Nky-pqF-l2Npd33Gxq6fmp9QUi";
const getDriveImg = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w500`;

// --- 3 PRIMARY SKILLS ---
const SKILLS = [
  { id: 'burn', name: 'Fire', icon: <Flame className="text-orange-500" />, desc: 'Bonus Damage on every hit', color: 'border-orange-500' },
  { id: 'freeze', name: 'Ice', icon: <Snowflake className="text-cyan-400" />, desc: 'Stuns boss briefly on hit', color: 'border-cyan-400' },
  { id: 'push', name: 'Push', icon: <MoveRight className="text-yellow-400" />, desc: 'Knocks boss back on hit', color: 'border-yellow-400' },
  { id: 'god', name: 'GOD', icon: <Sparkles className="text-white animate-pulse" />, desc: 'The Ultimate Power of the Gods!', color: 'border-white shadow-[0_0_20px_white]' },
];

const GLOBAL_WORD_POOL = [
    // Original
    { word: "CAT", meaning: "แมว", len: 3, emoji: "🐱" },
    { word: "DOG", meaning: "สุนัข", len: 3, emoji: "🐶" },
    { word: "RUN", meaning: "วิ่ง", len: 3, emoji: "🏃" },
    { word: "SKY", meaning: "ท้องฟ้า", len: 3, emoji: "☁️" },
    { word: "RED", meaning: "สีแดง", len: 3, emoji: "🔴" },
    { word: "CODE", meaning: "รหัส/โค้ด", len: 4, emoji: "💻" },
    { word: "DATA", meaning: "ข้อมูล", len: 4, emoji: "💾" },
    { word: "LOOP", meaning: "วนซ้ำ", len: 4, emoji: "🔄" },
    { word: "JAVA", meaning: "ภาษา Java", len: 4, emoji: "☕" },
    { word: "WALK", meaning: "เดิน", len: 4, emoji: "🚶" },
    { word: "FISH", meaning: "ปลา", len: 4, emoji: "🐟" },
    { word: "LOVE", meaning: "รัก", len: 4, emoji: "❤️" },
    { word: "HELLO", meaning: "สวัสดี", len: 5, emoji: "👋" },
    { word: "WORLD", meaning: "โลก", len: 5, emoji: "🌍" },
    { word: "APPLE", meaning: "แอปเปิ้ล", len: 5, emoji: "🍎" },
    { word: "CONST", meaning: "ค่าคงที่", len: 5, emoji: "🔒" },
    { word: "CLASS", meaning: "คลาส", len: 5, emoji: "🏷️" },
    { word: "HAPPY", meaning: "มีความสุข", len: 5, emoji: "😊" },
    { word: "MONEY", meaning: "เงิน", len: 5, emoji: "💰" },
    { word: "PYTHON", meaning: "ภาษา Python", len: 6, emoji: "🐍" },
    { word: "SERVER", meaning: "เซิร์ฟเวอร์", len: 6, emoji: "🖥️" },
    { word: "CLIENT", meaning: "ผู้ใช้งาน", len: 6, emoji: "👤" },
    { word: "SCRIPT", meaning: "ชุดคำสั่ง", len: 6, emoji: "📜" },
    { word: "RETURN", meaning: "ส่งค่ากลับ", len: 6, emoji: "↩️" },
    { word: "OBJECT", meaning: "วัตถุ", len: 6, emoji: "📦" },
    { word: "FRIEND", meaning: "เพื่อน", len: 6, emoji: "👯" },
    { word: "SCHOOL", meaning: "โรงเรียน", len: 6, emoji: "🏫" },
    { word: "NETWORK", meaning: "เครือข่าย", len: 7, emoji: "🌐" },
    { word: "PROGRAM", meaning: "โปรแกรม", len: 7, emoji: "📱" },
    { word: "BROWSER", meaning: "บราวเซอร์", len: 7, emoji: "🌏" },
    { word: "PROMISE", meaning: "คำสัญญา", len: 7, emoji: "🤝" },
    { word: "DISPLAY", meaning: "หน้าจอ", len: 7, emoji: "🖥️" },
    { word: "VARIABLE", meaning: "ตัวแปร", len: 8, emoji: "🔣" },
    { word: "FUNCTION", meaning: "ฟังก์ชัน", len: 8, emoji: "⚙️" },
    { word: "DATABASE", meaning: "ฐานข้อมูล", len: 8, emoji: "🗄️" },
    { word: "KEYBOARD", meaning: "คีย์บอร์ด", len: 8, emoji: "⌨️" },
    { word: "LANGUAGE", meaning: "ภาษา", len: 8, emoji: "🗣️" },
    { word: "INTERFACE", meaning: "ส่วนประสาน", len: 9, emoji: "🔌" },
    { word: "COMPONENT", meaning: "ส่วนประกอบ", len: 9, emoji: "🧩" },
    { word: "ALGORITHM", meaning: "อัลกอริทึม", len: 9, emoji: "🧠" },
    { word: "JAVASCRIPT", meaning: "ภาษา JS", len: 10, emoji: "📜" },
    // --- NEW WORDS (50+) ---
    { word: "FIRE", meaning: "ไฟ", len: 4, emoji: "🔥" },
    { word: "ICE", meaning: "น้ำแข็ง", len: 3, emoji: "🧊" },
    { word: "WIND", meaning: "ลม", len: 4, emoji: "💨" },
    { word: "EARTH", meaning: "โลก/ดิน", len: 5, emoji: "🌍" },
    { word: "MOON", meaning: "พระจันทร์", len: 4, emoji: "🌙" },
    { word: "STAR", meaning: "ดาว", len: 4, emoji: "⭐" },
    { word: "RAIN", meaning: "ฝน", len: 4, emoji: "🌧️" },
    { word: "SNOW", meaning: "หิมะ", len: 4, emoji: "❄️" },
    { word: "TREE", meaning: "ต้นไม้", len: 4, emoji: "🌳" },
    { word: "FLOWER", meaning: "ดอกไม้", len: 6, emoji: "🌸" },
    { word: "FOREST", meaning: "ป่า", len: 6, emoji: "🌲" },
    { word: "RIVER", meaning: "แม่น้ำ", len: 5, emoji: "🏞️" },
    { word: "MOUNTAIN", meaning: "ภูเขา", len: 8, emoji: "⛰️" },
    { word: "OCEAN", meaning: "มหาสมุทร", len: 5, emoji: "🌊" },
    { word: "BEACH", meaning: "ชายหาด", len: 5, emoji: "🏖️" },
    { word: "LION", meaning: "สิงโต", len: 4, emoji: "🦁" },
    { word: "TIGER", meaning: "เสือ", len: 5, emoji: "🐯" },
    { word: "BEAR", meaning: "หมี", len: 4, emoji: "🐻" },
    { word: "PANDA", meaning: "แพนด้า", len: 5, emoji: "🐼" },
    { word: "ZEBRA", meaning: "ม้าลาย", len: 5, emoji: "🦓" },
    { word: "SNAKE", meaning: "งู", len: 5, emoji: "🐍" },
    { word: "BIRD", meaning: "นก", len: 4, emoji: "🐦" },
    { word: "PIZZA", meaning: "พิซซ่า", len: 5, emoji: "🍕" },
    { word: "BURGER", meaning: "เบอร์เกอร์", len: 6, emoji: "🍔" },
    { word: "FRIES", meaning: "มันฝรั่งทอด", len: 5, emoji: "🍟" },
    { word: "SUSHI", meaning: "ซูชิ", len: 5, emoji: "🍣" },
    { word: "BREAD", meaning: "ขนมปัง", len: 5, emoji: "🍞" },
    { word: "CAKE", meaning: "เค้ก", len: 4, emoji: "🍰" },
    { word: "MILK", meaning: "นม", len: 4, emoji: "🥛" },
    { word: "COFFEE", meaning: "กาแฟ", len: 6, emoji: "☕" },
    { word: "TEA", meaning: "ชา", len: 3, emoji: "🍵" },
    { word: "SWORD", meaning: "ดาบ", len: 5, emoji: "⚔️" },
    { word: "SHIELD", meaning: "โล่", len: 6, emoji: "🛡️" },
    { word: "BOW", meaning: "ธนู", len: 3, emoji: "🏹" },
    { word: "ARROW", meaning: "ลูกธนู", len: 5, emoji: "💘" },
    { word: "MAGIC", meaning: "เวทมนตร์", len: 5, emoji: "✨" },
    { word: "HEAL", meaning: "รักษา", len: 4, emoji: "❤️" },
    { word: "MANA", meaning: "มานา", len: 4, emoji: "💧" },
    { word: "XP", meaning: "ค่าประสบการณ์", len: 2, emoji: "⭐" },
    { word: "LEVEL", meaning: "เลเวล", len: 5, emoji: "🆙" },
    { word: "QUEST", meaning: "ภารกิจ", len: 5, emoji: "📜" },
    { word: "PARTY", meaning: "ปาร์ตี้", len: 5, emoji: "🎉" },
    { word: "GUILD", meaning: "กิลด์", len: 5, emoji: "🏰" },
    { word: "BOSS", meaning: "บอส", len: 4, emoji: "👹" },
    { word: "HERO", meaning: "ฮีโร่", len: 4, emoji: "🦸" },
    { word: "JUMP", meaning: "กระโดด", len: 4, emoji: "🦘" },
    { word: "SLEEP", meaning: "นอน", len: 5, emoji: "😴" },
    { word: "READ", meaning: "อ่าน", len: 4, emoji: "📖" },
    { word: "WRITE", meaning: "เขียน", len: 5, emoji: "✍️" },
    { word: "LISTEN", meaning: "ฟัง", len: 6, emoji: "👂" },
    { word: "SPEAK", meaning: "พูด", len: 5, emoji: "🗣️" },
    { word: "CAT", meaning: "แมว", len: 3, emoji: "🐱" },
    { word: "DOG", meaning: "สุนัข", len: 3, emoji: "🐶" },
    { word: "RAT", meaning: "หนู", len: 3, emoji: "🐀" },
    { word: "BAT", meaning: "ค้างคาว", len: 3, emoji: "🦇" },
    { word: "PIG", meaning: "หมู", len: 3, emoji: "🐷" },
    { word: "COW", meaning: "วัว", len: 3, emoji: "🐮" },
    { word: "FOX", meaning: "จิ้งจอก", len: 3, emoji: "🦊" },
    { word: "OWL", meaning: "นกฮูก", len: 3, emoji: "🦉" },
    { word: "ANT", meaning: "มด", len: 3, emoji: "🐜" },
    { word: "BEE", meaning: "ผึ้ง", len: 3, emoji: "🐝" },
    { word: "FLY", meaning: "แมลงวัน/บิน", len: 3, emoji: "🪰" },
    { word: "YAK", meaning: "จามรี", len: 3, emoji: "🐂" },
    { word: "EEL", meaning: "ปลาไหล", len: 3, emoji: "🐍" },
    { word: "APE", meaning: "ลิงไร้หาง", len: 3, emoji: "🦍" },
    { word: "KOI", meaning: "ปลาคาร์ฟ", len: 3, emoji: "🎏" },
    { word: "SUN", meaning: "พระอาทิตย์", len: 3, emoji: "☀️" },
    { word: "MOON", meaning: "พระจันทร์", len: 3, emoji: "🌙" },
    { word: "SKY", meaning: "ท้องฟ้า", len: 3, emoji: "☁️" },
    { word: "SEA", meaning: "ทะเล", len: 3, emoji: "🌊" },
    { word: "ICE", meaning: "น้ำแข็ง", len: 3, emoji: "🧊" },
    { word: "HOT", meaning: "ร้อน", len: 3, emoji: "🔥" },
    { word: "RED", meaning: "สีแดง", len: 3, emoji: "🔴" },
    { word: "RUN", meaning: "วิ่ง", len: 3, emoji: "🏃" },
    { word: "HIT", meaning: "ตี", len: 3, emoji: "👊" },
    { word: "CUT", meaning: "ตัด", len: 3, emoji: "✂️" },
    { word: "EAT", meaning: "กิน", len: 3, emoji: "🍽️" },
    { word: "MAP", meaning: "แผนที่", len: 3, emoji: "🗺️" },
    { word: "KEY", meaning: "กุญแจ", len: 3, emoji: "🔑" },
    { word: "BOX", meaning: "กล่อง", len: 3, emoji: "📦" },
    { word: "GEM", meaning: "อัญมณี", len: 3, emoji: "💎" },
    { word: "AXE", meaning: "ขวาน", len: 3, emoji: "🪓" },
    { word: "BOW", meaning: "ธนู", len: 3, emoji: "🏹" },
    { word: "GUN", meaning: "ปืน", len: 3, emoji: "🔫" },
    { word: "HAT", meaning: "หมวก", len: 3, emoji: "🧢" },
    { word: "BAG", meaning: "กระเป๋า", len: 3, emoji: "🎒" },
    { word: "PEN", meaning: "ปากกา", len: 3, emoji: "🖊️" },
    { word: "CPU", meaning: "ซีพียู", len: 3, emoji: "💻" },
    { word: "RAM", meaning: "แรม", len: 3, emoji: "💾" },
    { word: "BUG", meaning: "บั๊ก", len: 3, emoji: "🐛" },
    { word: "BOT", meaning: "บอท", len: 3, emoji: "🤖" },
    { word: "NET", meaning: "เน็ต/ตาข่าย", len: 3, emoji: "🌐" },
    { word: "WEB", meaning: "เว็บ/ใยแมงมุม", len: 3, emoji: "🕸️" },
    { word: "APP", meaning: "แอปพลิเคชัน", len: 3, emoji: "📱" },
    { word: "API", meaning: "เอพีไอ", len: 3, emoji: "🔌" },
    { word: "GUI", meaning: "หน้าจอผู้ใช้", len: 3, emoji: "🖼️" },
    { word: "LOG", meaning: "บันทึก/ท่อนไม้", len: 3, emoji: "🪵" },
    { word: "TAG", meaning: "แท็ก", len: 3, emoji: "🏷️" },
    { word: "WIN", meaning: "ชนะ", len: 3, emoji: "🏆" },
    { word: "NEW", meaning: "ใหม่", len: 3, emoji: "🆕" },
    { word: "OLD", meaning: "เก่า", len: 3, emoji: "👴" },
    { word: "LION", meaning: "สิงโต", len: 4, emoji: "🦁" },
    { word: "BEAR", meaning: "หมี", len: 4, emoji: "🐻" },
    { word: "WOLF", meaning: "หมาป่า", len: 4, emoji: "🐺" },
    { word: "DEER", meaning: "กวาง", len: 4, emoji: "🦌" },
    { word: "DUCK", meaning: "เป็ด", len: 4, emoji: "🦆" },
    { word: "SWAN", meaning: "หงส์", len: 4, emoji: "🦢" },
    { word: "BIRD", meaning: "นก", len: 4, emoji: "🐦" },
    { word: "DOVE", meaning: "นกพิราบ", len: 4, emoji: "🕊️" },
    { word: "CROW", meaning: "อีกา", len: 4, emoji: "🐦‍⬛" },
    { word: "FROG", meaning: "กบ", len: 4, emoji: "🐸" },
    { word: "FISH", meaning: "ปลา", len: 4, emoji: "🐟" },
    { word: "TUNA", meaning: "ปลาทูน่า", len: 4, emoji: "🍣" },
    { word: "CRAB", meaning: "ปู", len: 4, emoji: "🦀" },
    { word: "GOAT", meaning: "แพะ", len: 4, emoji: "🐐" },
    { word: "JAVA", meaning: "ภาษา Java", len: 4, emoji: "☕" },
    { word: "CODE", meaning: "โค้ด", len: 4, emoji: "💻" },
    { word: "DATA", meaning: "ข้อมูล", len: 4, emoji: "📊" },
    { word: "BYTE", meaning: "ไบต์", len: 4, emoji: "💾" },
    { word: "FILE", meaning: "ไฟล์", len: 4, emoji: "📁" },
    { word: "LINK", meaning: "ลิงก์", len: 4, emoji: "🔗" },
    { word: "NODE", meaning: "โหนด", len: 4, emoji: "🟢" },
    { word: "LOOP", meaning: "วนซ้ำ", len: 4, emoji: "🔄" },
    { word: "NULL", meaning: "ค่าว่าง", len: 4, emoji: "🚫" },
    { word: "VOID", meaning: "ไม่มีค่าคืน", len: 4, emoji: "🕳️" },
    { word: "TRUE", meaning: "จริง", len: 4, emoji: "✅" },
    { word: "BOOL", meaning: "ตรรกะ", len: 4, emoji: "⚖️" },
    { word: "CHAR", meaning: "ตัวอักษร", len: 4, emoji: "🔤" },
    { word: "LIST", meaning: "รายการ", len: 4, emoji: "📝" },
    { word: "TREE", meaning: "ต้นไม้", len: 4, emoji: "🌳" },
    { word: "WOOD", meaning: "ไม้", len: 4, emoji: "🪵" },
    { word: "FIRE", meaning: "ไฟ", len: 4, emoji: "🔥" },
    { word: "WIND", meaning: "ลม", len: 4, emoji: "💨" },
    { word: "RAIN", meaning: "ฝน", len: 4, emoji: "🌧️" },
    { word: "SNOW", meaning: "หิมะ", len: 4, emoji: "❄️" },
    { word: "STAR", meaning: "ดาว", len: 4, emoji: "⭐" },
    { word: "GOLD", meaning: "ทอง", len: 4, emoji: "💰" },
    { word: "IRON", meaning: "เหล็ก", len: 4, emoji: "🔩" },
    { word: "ROCK", meaning: "หิน", len: 4, emoji: "🪨" },
    { word: "SAND", meaning: "ทราย", len: 4, emoji: "🏖️" },
    { word: "GAME", meaning: "เกม", len: 4, emoji: "🎮" },
    { word: "PLAY", meaning: "เล่น", len: 4, emoji: "▶️" },
    { word: "HERO", meaning: "ฮีโร่", len: 4, emoji: "🦸" },
    { word: "BOSS", meaning: "บอส", len: 4, emoji: "👹" },
    { word: "MANA", meaning: "มานา", len: 4, emoji: "✨" },
    { word: "ITEM", meaning: "ไอเทม", len: 4, emoji: "🎒" },
    { word: "HEAL", meaning: "รักษา", len: 4, emoji: "💊" },
    { word: "DEAD", meaning: "ตาย", len: 4, emoji: "💀" },
    { word: "LOCK", meaning: "ล็อค", len: 4, emoji: "🔒" },
    { word: "OPEN", meaning: "เปิด", len: 4, emoji: "🔓" },
    { word: "DOOR", meaning: "ประตู", len: 4, emoji: "🚪" },
    { word: "BOOK", meaning: "หนังสือ", len: 4, emoji: "📖" },
    { word: "READ", meaning: "อ่าน", len: 4, emoji: "👀" },
    { word: "WALK", meaning: "เดิน", len: 4, emoji: "🚶" },
    { word: "JUMP", meaning: "กระโดด", len: 4, emoji: "🦘" },
    { word: "SWIM", meaning: "ว่ายน้ำ", len: 4, emoji: "🏊" },
    { word: "COOK", meaning: "ทำอาหาร", len: 4, emoji: "🍳" },
    { word: "FOOD", meaning: "อาหาร", len: 4, emoji: "🍖" },
    { word: "MEAT", meaning: "เนื้อ", len: 4, emoji: "🥩" },
    { word: "RICE", meaning: "ข้าว", len: 4, emoji: "🍚" },
    { word: "MILK", meaning: "นม", len: 4, emoji: "🥛" },
    { word: "CAKE", meaning: "เค้ก", len: 4, emoji: "🍰" },
    { word: "LOVE", meaning: "รัก", len: 4, emoji: "❤️" },
    { word: "HATE", meaning: "เกลียด", len: 4, emoji: "😡" },
    { word: "GOOD", meaning: "ดี", len: 4, emoji: "👍" },
    { word: "COOL", meaning: "เจ๋ง/เย็น", len: 4, emoji: "😎" },
    { word: "BLUE", meaning: "สีฟ้า", len: 4, emoji: "🔵" },
    { word: "PINK", meaning: "สีชมพู", len: 4, emoji: "💗" },
    { word: "TIGER", meaning: "เสือ", len: 5, emoji: "🐅" },
    { word: "ZEBRA", meaning: "ม้าลาย", len: 5, emoji: "🦓" },
    { word: "PANDA", meaning: "แพนด้า", len: 5, emoji: "🐼" },
    { word: "KOALA", meaning: "โคอาล่า", len: 5, emoji: "🐨" },
    { word: "HORSE", meaning: "ม้า", len: 5, emoji: "🐎" },
    { word: "SHEEP", meaning: "แกะ", len: 5, emoji: "🐑" },
    { word: "SNAKE", meaning: "งู", len: 5, emoji: "🐍" },
    { word: "SHARK", meaning: "ฉลาม", len: 5, emoji: "🦈" },
    { word: "WHALE", meaning: "วาฬ", len: 5, emoji: "🐋" },
    { word: "EAGLE", meaning: "นกอินทรี", len: 5, emoji: "🦅" },
    { word: "APPLE", meaning: "แอปเปิ้ล", len: 5, emoji: "🍎" },
    { word: "GRAPE", meaning: "องุ่น", len: 5, emoji: "🍇" },
    { word: "LEMON", meaning: "มะนาว", len: 5, emoji: "🍋" },
    { word: "MANGO", meaning: "มะม่วง", len: 5, emoji: "🥭" },
    { word: "MELON", meaning: "เมล่อน", len: 5, emoji: "🍈" },
    { word: "BERRY", meaning: "เบอร์รี่", len: 5, emoji: "🍒" },
    { word: "PIZZA", meaning: "พิซซ่า", len: 5, emoji: "🍕" },
    { word: "BREAD", meaning: "ขนมปัง", len: 5, emoji: "🍞" },
    { word: "WATER", meaning: "น้ำ", len: 5, emoji: "💧" },
    { word: "CLASS", meaning: "คลาส", len: 5, emoji: "📦" },
    { word: "ARRAY", meaning: "อาร์เรย์", len: 5, emoji: "🗂️" },
    { word: "CONST", meaning: "ค่าคงที่", len: 5, emoji: "🗿" },
    { word: "FLOAT", meaning: "เลขทศนิยม", len: 5, emoji: "🔢" },
    { word: "SHORT", meaning: "จำนวนสั้น", len: 5, emoji: "📏" },
    { word: "WHILE", meaning: "ขณะที่", len: 5, emoji: "⏳" },
    { word: "BREAK", meaning: "หยุด/หัก", len: 5, emoji: "🛑" },
    { word: "PRINT", meaning: "พิมพ์", len: 5, emoji: "🖨️" },
    { word: "INPUT", meaning: "นำเข้า", len: 5, emoji: "⌨️" },
    { word: "LOGIN", meaning: "เข้าสู่ระบบ", len: 5, emoji: "🔑" },
    { word: "ADMIN", meaning: "ผู้ดูแล", len: 5, emoji: "👮" },
    { word: "ERROR", meaning: "ข้อผิดพลาด", len: 5, emoji: "❌" },
    { word: "DEBUG", meaning: "แก้บั๊ก", len: 5, emoji: "🛠️" },
    { word: "PIXEL", meaning: "พิกเซล", len: 5, emoji: "👾" },
    { word: "SWORD", meaning: "ดาบ", len: 5, emoji: "⚔️" },
    { word: "MAGIC", meaning: "เวทมนตร์", len: 5, emoji: "🪄" },
    { word: "GHOST", meaning: "ผี", len: 5, emoji: "👻" },
    { word: "SLIME", meaning: "สไลม์", len: 5, emoji: "💧" },
    { word: "ROBOT", meaning: "หุ่นยนต์", len: 5, emoji: "🤖" },
    { word: "ALIEN", meaning: "เอเลี่ยน", len: 5, emoji: "👽" },
    { word: "DEMON", meaning: "ปีศาจ", len: 5, emoji: "👿" },
    { word: "ANGEL", meaning: "นางฟ้า", len: 5, emoji: "👼" },
    { word: "WORLD", meaning: "โลก", len: 5, emoji: "🌍" },
    { word: "HOUSE", meaning: "บ้าน", len: 5, emoji: "🏠" },
    { word: "TABLE", meaning: "โต๊ะ", len: 5, emoji: "🪑" },
    { word: "CHAIR", meaning: "เก้าอี้", len: 5, emoji: "🪑" },
    { word: "CLOCK", meaning: "นาฬิกา", len: 5, emoji: "⏰" },
    { word: "PHONE", meaning: "โทรศัพท์", len: 5, emoji: "📱" },
    { word: "MONEY", meaning: "เงิน", len: 5, emoji: "💵" },
    { word: "SCORE", meaning: "คะแนน", len: 5, emoji: "💯" },
    { word: "LEVEL", meaning: "เลเวล", len: 5, emoji: "🆙" },
    { word: "HEART", meaning: "หัวใจ", len: 5, emoji: "❤️" },
    { word: "SMILE", meaning: "ยิ้ม", len: 5, emoji: "😊" },
    { word: "ANGRY", meaning: "โกรธ", len: 5, emoji: "😠" },
    { word: "HAPPY", meaning: "มีความสุข", len: 5, emoji: "😄" },
    { word: "GREEN", meaning: "สีเขียว", len: 5, emoji: "🟢" },
    { word: "WHITE", meaning: "สีขาว", len: 5, emoji: "⚪" },
    { word: "BLACK", meaning: "สีดำ", len: 5, emoji: "⚫" },
    { word: "MONKEY", meaning: "ลิง", len: 6, emoji: "🐒" },
    { word: "RABBIT", meaning: "กระต่าย", len: 6, emoji: "🐇" },
    { word: "TURTLE", meaning: "เต่า", len: 6, emoji: "🐢" },
    { word: "SPIDER", meaning: "แมงมุม", len: 6, emoji: "🕷️" },
    { word: "ORANGE", meaning: "ส้ม/สีส้ม", len: 6, emoji: "🍊" },
    { word: "BANANA", meaning: "กล้วย", len: 6, emoji: "🍌" },
    { word: "TOMATO", meaning: "มะเขือเทศ", len: 6, emoji: "🍅" },
    { word: "POTATO", meaning: "มันฝรั่ง", len: 6, emoji: "🥔" },
    { word: "COFFEE", meaning: "กาแฟ", len: 6, emoji: "☕" },
    { word: "PYTHON", meaning: "ภาษาไพธอน", len: 6, emoji: "🐍" },
    { word: "OBJECT", meaning: "วัตถุ", len: 6, emoji: "📦" },
    { word: "STRING", meaning: "ข้อความ", len: 6, emoji: "🔤" },
    { word: "NUMBER", meaning: "ตัวเลข", len: 6, emoji: "#️⃣" },
    { word: "DOUBLE", meaning: "ทศนิยมคู่", len: 6, emoji: "2️⃣" },
    { word: "PUBLIC", meaning: "สาธารณะ", len: 6, emoji: "📢" },
    { word: "STATIC", meaning: "คงที่", len: 6, emoji: "🛑" },
    { word: "RETURN", meaning: "คืนค่า", len: 6, emoji: "↩️" },
    { word: "SWITCH", meaning: "สวิตช์", len: 6, emoji: "🔀" },
    { word: "IMPORT", meaning: "นำเข้า", len: 6, emoji: "📥" },
    { word: "SYSTEM", meaning: "ระบบ", len: 6, emoji: "⚙️" },
    { word: "SERVER", meaning: "เซิร์ฟเวอร์", len: 6, emoji: "🖥️" },
    { word: "CLIENT", meaning: "ลูกค้า/ไคลเอนต์", len: 6, emoji: "👤" },
    { word: "SCRIPT", meaning: "สคริปต์", len: 6, emoji: "📜" },
    { word: "ATTACK", meaning: "โจมตี", len: 6, emoji: "⚔️" },
    { word: "DEFEND", meaning: "ป้องกัน", len: 6, emoji: "🛡️" },
    { word: "DAMAGE", meaning: "ความเสียหาย", len: 6, emoji: "💥" },
    { word: "DRAGON", meaning: "มังกร", len: 6, emoji: "🐉" },
    { word: "ZOMBIE", meaning: "ซอมบี้", len: 6, emoji: "🧟" },
    { word: "CASTLE", meaning: "ปราสาท", len: 6, emoji: "🏰" },
    { word: "ISLAND", meaning: "เกาะ", len: 6, emoji: "🏝️" },
    { word: "FOREST", meaning: "ป่า", len: 6, emoji: "🌲" },
    { word: "DESERT", meaning: "ทะเลทราย", len: 6, emoji: "🏜️" },
    { word: "PLANET", meaning: "ดาวเคราะห์", len: 6, emoji: "🪐" },
    { word: "GALAXY", meaning: "กาแล็กซี", len: 6, emoji: "🌌" },
    { word: "ROCKET", meaning: "จรวด", len: 6, emoji: "🚀" },
    { word: "SCHOOL", meaning: "โรงเรียน", len: 6, emoji: "🏫" },
    { word: "MARKET", meaning: "ตลาด", len: 6, emoji: "🏪" },
    { word: "TEMPLE", meaning: "วัด", len: 6, emoji: "🛕" },
    { word: "DOCTOR", meaning: "หมอ", len: 6, emoji: "👨‍⚕️" },
    { word: "POLICE", meaning: "ตำรวจ", len: 6, emoji: "👮" },
    { word: "FRIEND", meaning: "เพื่อน", len: 6, emoji: "🤝" },
    { word: "FAMILY", meaning: "ครอบครัว", len: 6, emoji: "👨‍👩‍👧" },
    { word: "YELLOW", meaning: "สีเหลือง", len: 6, emoji: "🟡" },
    { word: "PURPLE", meaning: "สีม่วง", len: 6, emoji: "🟣" },
    { word: "ORANGE", meaning: "สีส้ม", len: 6, emoji: "🟠" },
    { word: "BOOLEAN", meaning: "ตรรกะ", len: 7, emoji: "⚖️" },
    { word: "INTEGER", meaning: "จำนวนเต็ม", len: 7, emoji: "1️⃣" },
    { word: "PACKAGE", meaning: "แพ็คเกจ", len: 7, emoji: "📦" },
    { word: "PRIVATE", meaning: "ส่วนตัว", len: 7, emoji: "🔒" },
    { word: "PROGRAM", meaning: "โปรแกรม", len: 7, emoji: "💻" },
    { word: "NETWORK", meaning: "เครือข่าย", len: 7, emoji: "🌐" },
    { word: "MONSTER", meaning: "มอนสเตอร์", len: 7, emoji: "👾" },
    { word: "WARRIOR", meaning: "นักรบ", len: 7, emoji: "⚔️" },
    { word: "DUNGEON", meaning: "ดันเจี้ยน", len: 7, emoji: "🗝️" },
    { word: "VILLAGE", meaning: "หมู่บ้าน", len: 7, emoji: "🏡" },
    { word: "DIAMOND", meaning: "เพชร", len: 7, emoji: "💎" },
    { word: "CRYSTAL", meaning: "คริสตัล", len: 7, emoji: "🔮" },
    { word: "STUDENT", meaning: "นักเรียน", len: 7, emoji: "👨‍🎓" },
    { word: "TEACHER", meaning: "ครู", len: 7, emoji: "👩‍🏫" },
    { word: "CHICKEN", meaning: "ไก่", len: 7, emoji: "🐔" },
    { word: "PENGUIN", meaning: "เพนกวิน", len: 7, emoji: "🐧" },
    { word: "DOLPHIN", meaning: "โลมา", len: 7, emoji: "🐬" },
    { word: "JOY", meaning: "ความสุข", len: 3, emoji: "😂" },
    { word: "SAD", meaning: "เศร้า", len: 3, emoji: "😢" },
    { word: "CRY", meaning: "ร้องไห้", len: 3, emoji: "😭" },
    { word: "MAD", meaning: "โกรธ/บ้า", len: 3, emoji: "😡" },
    { word: "HUG", meaning: "กอด", len: 3, emoji: "🤗" },
    { word: "KISS", meaning: "จูบ", len: 3, emoji: "💋" },
    { word: "LIP", meaning: "ริมฝีปาก", len: 3, emoji: "👄" },
    { word: "EAR", meaning: "หู", len: 3, emoji: "👂" },
    { word: "EYE", meaning: "ตา", len: 3, emoji: "👁️" },
    { word: "ARM", meaning: "แขน", len: 3, emoji: "💪" },
    { word: "LEG", meaning: "ขา", len: 3, emoji: "🦵" },
    { word: "TOE", meaning: "นิ้วเท้า", len: 3, emoji: "🦶" },
    { word: "MAN", meaning: "ผู้ชาย", len: 3, emoji: "👨" },
    { word: "BOY", meaning: "เด็กชาย", len: 3, emoji: "👦" },
    { word: "MOM", meaning: "แม่", len: 3, emoji: "👩" },
    { word: "DAD", meaning: "พ่อ", len: 3, emoji: "👨" },
    { word: "SON", meaning: "ลูกชาย", len: 3, emoji: "👶" },
    { word: "BUS", meaning: "รถเมล์", len: 3, emoji: "🚌" },
    { word: "CAR", meaning: "รถยนต์", len: 3, emoji: "🚗" },
    { word: "CAB", meaning: "รถแท็กซี่", len: 3, emoji: "🚕" },
    { word: "JET", meaning: "เครื่องบินเจ็ท", len: 3, emoji: "✈️" },
    { word: "VAN", meaning: "รถตู้", len: 3, emoji: "🚐" },
    { word: "OIL", meaning: "น้ำมัน", len: 3, emoji: "🛢️" },
    { word: "GAS", meaning: "แก๊ส", len: 3, emoji: "⛽" },
    { word: "WAY", meaning: "ทาง", len: 3, emoji: "🛣️" },
    { word: "TOP", meaning: "ยอด/บนสุด", len: 3, emoji: "🔝" },
    { word: "LOW", meaning: "ต่ำ", len: 3, emoji: "⬇️" },
    { word: "BIG", meaning: "ใหญ่", len: 3, emoji: "🐘" },
    { word: "FAT", meaning: "อ้วน", len: 3, emoji: "🐷" },
    { word: "DRY", meaning: "แห้ง", len: 3, emoji: "🌵" },
    { word: "WET", meaning: "เปียก", len: 3, emoji: "💦" },
    { word: "RAW", meaning: "ดิบ", len: 3, emoji: "🥩" },
    { word: "EGG", meaning: "ไข่", len: 3, emoji: "🥚" },
    { word: "TEA", meaning: "ชา", len: 3, emoji: "🍵" },
    { word: "JAR", meaning: "โหลแก้ว", len: 3, emoji: "🫙" },
    { word: "MUG", meaning: "แก้วมัค", len: 3, emoji: "☕" },
    { word: "CUP", meaning: "ถ้วย", len: 3, emoji: "🍵" },
    { word: "CAN", meaning: "กระป๋อง", len: 3, emoji: "🥫" },
    { word: "BED", meaning: "เตียง", len: 3, emoji: "🛏️" },
    { word: "RUG", meaning: "พรม", len: 3, emoji: "🧶" },
    { word: "ROSE", meaning: "กุหลาบ", len: 4, emoji: "🌹" },
    { word: "LILY", meaning: "ดอกลิลลี่", len: 4, emoji: "🌸" },
    { word: "LEAF", meaning: "ใบไม้", len: 4, emoji: "🍃" },
    { word: "SEED", meaning: "เมล็ด", len: 4, emoji: "🌱" },
    { word: "ROOT", meaning: "รากไม้", len: 4, emoji: "🪵" },
    { word: "PARK", meaning: "สวนสาธารณะ", len: 4, emoji: "🏞️" },
    { word: "FARM", meaning: "ฟาร์ม", len: 4, emoji: "🚜" },
    { word: "LAKE", meaning: "ทะเลสาบ", len: 4, emoji: "🌊" },
    { word: "HILL", meaning: "เนินเขา", len: 4, emoji: "⛰️" },
    { word: "CAVE", meaning: "ถ้ำ", len: 4, emoji: "🕳️" },
    { word: "SHIP", meaning: "เรือใหญ่", len: 4, emoji: "🚢" },
    { word: "BOAT", meaning: "เรือเล็ก", len: 4, emoji: "🚣" },
    { word: "BIKE", meaning: "จักรยาน", len: 4, emoji: "🚲" },
    { word: "TAXI", meaning: "แท็กซี่", len: 4, emoji: "🚕" },
    { word: "ROAD", meaning: "ถนน", len: 4, emoji: "🛣️" },
    { word: "CITY", meaning: "เมือง", len: 4, emoji: "🏙️" },
    { word: "TOWN", meaning: "เมืองเล็ก", len: 4, emoji: "🏘️" },
    { word: "SHOP", meaning: "ร้านค้า", len: 4, emoji: "🏪" },
    { word: "MALL", meaning: "ห้าง", len: 4, emoji: "🏬" },
    { word: "BANK", meaning: "ธนาคาร", len: 4, emoji: "🏦" },
    { word: "POST", meaning: "ส่ง/โพสต์", len: 4, emoji: "📮" },
    { word: "MAIL", meaning: "จดหมาย", len: 4, emoji: "✉️" },
    { word: "NEWS", meaning: "ข่าว", len: 4, emoji: "📰" },
    { word: "NOTE", meaning: "โน้ต", len: 4, emoji: "📝" },
    { word: "TEXT", meaning: "ข้อความ", len: 4, emoji: "💬" },
    { word: "WORD", meaning: "คำศัพท์", len: 4, emoji: "🔤" },
    { word: "FONT", meaning: "แบบอักษร", len: 4, emoji: "🅰️" },
    { word: "BOLD", meaning: "ตัวหนา", len: 4, emoji: "𝐁" },
    { word: "ICON", meaning: "ไอคอน", len: 4, emoji: "🖼️" },
    { word: "USER", meaning: "ผู้ใช้", len: 4, emoji: "👤" },
    { word: "HOST", meaning: "เจ้าบ้าน/โฮสต์", len: 4, emoji: "🏠" },
    { word: "PORT", meaning: "พอร์ต", len: 4, emoji: "🔌" },
    { word: "PING", meaning: "ปิง", len: 4, emoji: "📶" },
    { word: "WIFI", meaning: "ไวไฟ", len: 4, emoji: "📶" },
    { word: "COIN", meaning: "เหรียญ", len: 4, emoji: "🪙" },
    { word: "CASH", meaning: "เงินสด", len: 4, emoji: "💵" },
    { word: "SALE", meaning: "ลดราคา", len: 4, emoji: "🏷️" },
    { word: "BUY", meaning: "ซื้อ", len: 4, emoji: "🛍️" },
    { word: "SELL", meaning: "ขาย", len: 4, emoji: "🏪" },
    { word: "PAY", meaning: "จ่าย", len: 4, emoji: "💳" },
    { word: "COST", meaning: "ราคา", len: 4, emoji: "💰" },
    { word: "FREE", meaning: "ฟรี", len: 4, emoji: "🆓" },
    { word: "GIFT", meaning: "ของขวัญ", len: 4, emoji: "🎁" },
    { word: "TOY", meaning: "ของเล่น", len: 4, emoji: "🧸" },
    { word: "DOLL", meaning: "ตุ๊กตา", len: 4, emoji: "🎎" },
    { word: "BABY", meaning: "ทารก", len: 4, emoji: "👶" },
    { word: "KIDS", meaning: "เด็กๆ", len: 4, emoji: "🧒" },
    { word: "GIRL", meaning: "เด็กหญิง", len: 4, emoji: "👧" },
    { word: "LADY", meaning: "สุภาพสตรี", len: 4, emoji: "👩" },
    { word: "KING", meaning: "ราชา", len: 4, emoji: "👑" },
    { word: "POET", meaning: "กวี", len: 4, emoji: "📜" },
    { word: "SONG", meaning: "เพลง", len: 4, emoji: "🎵" },
    { word: "BAND", meaning: "วงดนตรี", len: 4, emoji: "🎸" },
    { word: "DRUM", meaning: "กลอง", len: 4, emoji: "🥁" },
    { word: "BASS", meaning: "เบส", len: 4, emoji: "🎸" },
    { word: "SOUP", meaning: "ซุป", len: 4, emoji: "🍲" },
    { word: "BEEF", meaning: "เนื้อวัว", len: 4, emoji: "🥩" },
    { word: "PORK", meaning: "เนื้อหมู", len: 4, emoji: "🍖" },
    { word: "CORN", meaning: "ข้าวโพด", len: 4, emoji: "🌽" },
    { word: "BEAN", meaning: "ถั่ว", len: 4, emoji: "🫘" },
    { word: "MOUSE", meaning: "หนู/เมาส์", len: 5, emoji: "🖱️" },
    { word: "CLICK", meaning: "คลิก", len: 5, emoji: "👆" },
    { word: "PRESS", meaning: "กด", len: 5, emoji: "👇" },
    { word: "ENTER", meaning: "เข้า/ปุ่ม Enter", len: 5, emoji: "⏎" },
    { word: "SHIFT", meaning: "ปุ่ม Shift", len: 5, emoji: "⇧" },
    { word: "SPACE", meaning: "อวกาศ/เว้นวรรค", len: 5, emoji: "🚀" },
    { word: "PASTE", meaning: "วาง", len: 5, emoji: "📋" },
    { word: "RESET", meaning: "รีเซ็ต", len: 5, emoji: "🔄" },
    { word: "SETUP", meaning: "ติดตั้ง", len: 5, emoji: "⚙️" },
    { word: "ADMIN", meaning: "ผู้ดูแลระบบ", len: 5, emoji: "🛠️" },
    { word: "LOGIN", meaning: "เข้าสู่ระบบ", len: 5, emoji: "🔑" },
    { word: "EMAIL", meaning: "อีเมล", len: 5, emoji: "📧" },
    { word: "PHONE", meaning: "โทรศัพท์", len: 5, emoji: "📱" },
    { word: "VIDEO", meaning: "วิดีโอ", len: 5, emoji: "📹" },
    { word: "AUDIO", meaning: "เสียง", len: 5, emoji: "🔊" },
    { word: "MUSIC", meaning: "ดนตรี", len: 5, emoji: "🎶" },
    { word: "MEDIA", meaning: "สื่อ", len: 5, emoji: "📼" },
    { word: "RADIO", meaning: "วิทยุ", len: 5, emoji: "📻" },
    { word: "MODEL", meaning: "โมเดล", len: 5, emoji: "🗿" },
    { word: "SCENE", meaning: "ฉาก", len: 5, emoji: "🎬" },
    { word: "STAGE", meaning: "เวที", len: 5, emoji: "🎭" },
    { word: "ACTOR", meaning: "นักแสดง", len: 5, emoji: "🤵" },
    { word: "DANCE", meaning: "เต้นรำ", len: 5, emoji: "💃" },
    { word: "PARTY", meaning: "ปาร์ตี้", len: 5, emoji: "🎉" },
    { word: "EVENT", meaning: "อีเวนต์", len: 5, emoji: "📅" },
    { word: "HOTEL", meaning: "โรงแรม", len: 5, emoji: "🏨" },
    { word: "STORE", meaning: "ร้านค้า/เก็บ", len: 5, emoji: "🏪" },
    { word: "PRICE", meaning: "ราคา", len: 5, emoji: "🏷️" },
    { word: "VALUE", meaning: "คุณค่า", len: 5, emoji: "💎" },
    { word: "STOCK", meaning: "สินค้าคงคลัง", len: 5, emoji: "📦" },
    { word: "ORDER", meaning: "คำสั่งซื้อ", len: 5, emoji: "📝" },
    { word: "CHECK", meaning: "ตรวจสอบ", len: 5, emoji: "✅" },
    { word: "LIMIT", meaning: "ขีดจำกัด", len: 5, emoji: "🛑" },
    { word: "RANGE", meaning: "ช่วง/ระยะ", len: 5, emoji: "📏" },
    { word: "INDEX", meaning: "ดัชนี", len: 5, emoji: "☝️" },
    { word: "COUNT", meaning: "นับ", len: 5, emoji: "🔢" },
    { word: "TOTAL", meaning: "ผลรวม", len: 5, emoji: "🧮" },
    { word: "SUMMER", meaning: "ฤดูร้อน", len: 5, emoji: "☀️" },
    { word: "BEACH", meaning: "ชายหาด", len: 5, emoji: "🏖️" },
    { word: "OCEAN", meaning: "มหาสมุทร", len: 5, emoji: "🌊" },
    { word: "RIVER", meaning: "แม่น้ำ", len: 5, emoji: "🏞️" },
    { word: "GRASS", meaning: "หญ้า", len: 5, emoji: "🌿" },
    { word: "PLANT", meaning: "พืช", len: 5, emoji: "🪴" },
    { word: "FLOWER", meaning: "ดอกไม้", len: 5, emoji: "🌸" },
    { word: "FRUIT", meaning: "ผลไม้", len: 5, emoji: "🍎" },
    { word: "SUGAR", meaning: "น้ำตาล", len: 5, emoji: "🍬" },
    { word: "SWEET", meaning: "หวาน", len: 5, emoji: "🍭" },
    { word: "SPICY", meaning: "เผ็ด", len: 5, emoji: "🌶️" },
    { word: "SALTY", meaning: "เค็ม", len: 5, emoji: "🧂" },
    { word: "LUNCH", meaning: "มื้อเที่ยง", len: 5, emoji: "🍱" },
    { word: "DINNER", meaning: "มื้อเย็น", len: 5, emoji: "🍽️" },
    { word: "SNACK", meaning: "ขนมขบเคี้ยว", len: 5, emoji: "🍿" },
    { word: "DRINK", meaning: "เครื่องดื่ม", len: 5, emoji: "🥤" },
    { word: "JUICE", meaning: "น้ำผลไม้", len: 5, emoji: "🍹" },
    { word: "CREAM", meaning: "ครีม", len: 5, emoji: "🧁" },
    { word: "ONION", meaning: "หัวหอม", len: 5, emoji: "🧅" },
    { word: "PAPER", meaning: "กระดาษ", len: 5, emoji: "📄" },
    { word: "COLOR", meaning: "สี", len: 5, emoji: "🎨" },
    { word: "PAINT", meaning: "ระบายสี", len: 5, emoji: "🖌️" },
    { word: "BRUSH", meaning: "แปรง", len: 5, emoji: "🖌️" },
    { word: "SHAPE", meaning: "รูปร่าง", len: 5, emoji: "🔶" },
    { word: "CIRCLE", meaning: "วงกลม", len: 6, emoji: "⭕" },
    { word: "SQUARE", meaning: "สี่เหลี่ยม", len: 6, emoji: "🟥" },
    { word: "CAMERA", meaning: "กล้องถ่ายรูป", len: 6, emoji: "📷" },
    { word: "PHOTOS", meaning: "รูปถ่าย", len: 6, emoji: "🖼️" },
    { word: "ALBUM", meaning: "อัลบั้ม", len: 5, emoji: "📒" },
    { word: "FRAME", meaning: "กรอบ", len: 5, emoji: "🖼️" },
    { word: "WATCH", meaning: "ดู/นาฬิกา", len: 5, emoji: "⌚" },
    { word: "CLOCK", meaning: "นาฬิกา", len: 5, emoji: "⏰" },
    { word: "ALARM", meaning: "นาฬิกาปลุก", len: 5, emoji: "⏰" },
    { word: "SLEEP", meaning: "นอนหลับ", len: 5, emoji: "💤" },
    { word: "DREAM", meaning: "ความฝัน", len: 5, emoji: "💭" },
    { word: "NIGHT", meaning: "กลางคืน", len: 5, emoji: "🌃" },
    { word: "LIGHT", meaning: "แสงสว่าง", len: 5, emoji: "💡" },
    { word: "POWER", meaning: "พลัง", len: 5, emoji: "⚡" },
    { word: "FORCE", meaning: "แรง", len: 5, emoji: "💪" },
    { word: "SPEED", meaning: "ความเร็ว", len: 5, emoji: "🏎️" },
    { word: "DRIVE", meaning: "ขับรถ", len: 5, emoji: "🚗" },
    { word: "TRACK", meaning: "ราง/ติดตาม", len: 5, emoji: "🛤️" },
    { word: "TRAIN", meaning: "รถไฟ", len: 5, emoji: "🚆" },
    { word: "TRUCK", meaning: "รถบรรทุก", len: 5, emoji: "🚚" },
    { word: "WHEEL", meaning: "ล้อ", len: 5, emoji: "🎡" },
    { word: "MOTOR", meaning: "มอเตอร์", len: 5, emoji: "⚙️" },
    { word: "ROBOT", meaning: "หุ่นยนต์", len: 5, emoji: "🤖" },
    { word: "DRONE", meaning: "โดรน", len: 5, emoji: "🚁" },
    { word: "LASER", meaning: "เลเซอร์", len: 5, emoji: "🔦" },
    { word: "RADAR", meaning: "เรดาร์", len: 5, emoji: "📡" },
    { word: "SPACE", meaning: "อวกาศ", len: 5, emoji: "🌌" },
    { word: "EARTH", meaning: "โลก", len: 5, emoji: "🌍" },
    { word: "STARS", meaning: "ดาว", len: 5, emoji: "✨" },
    { word: "COMET", meaning: "ดาวหาง", len: 5, emoji: "☄️" },
    { word: "OZONE", meaning: "โอโซน", len: 5, emoji: "🌫️" },
    { word: "CLOUD", meaning: "เมฆ", len: 5, emoji: "☁️" },
    { word: "STORM", meaning: "พายุ", len: 5, emoji: "⛈️" },
    { word: "ACT", meaning: "แสดง/กระทำ", len: 3, emoji: "🎬" },
    { word: "ADD", meaning: "เพิ่ม", len: 3, emoji: "➕" },
    { word: "AGE", meaning: "อายุ", len: 3, emoji: "🎂" },
    { word: "AIM", meaning: "เล็ง/เป้าหมาย", len: 3, emoji: "🎯" },
    { word: "AIR", meaning: "อากาศ", len: 3, emoji: "💨" },
    { word: "ASK", meaning: "ถาม", len: 3, emoji: "❓" },
    { word: "BAD", meaning: "แย่", len: 3, emoji: "👎" },
    { word: "BET", meaning: "เดิมพัน", len: 3, emoji: "🎰" },
    { word: "BID", meaning: "ประมูล", len: 3, emoji: "🙋" },
    { word: "BIT", meaning: "ชิ้นเล็กๆ/กัด", len: 3, emoji: "🤏" },
    { word: "BOW", meaning: "โค้งคำนับ", len: 3, emoji: "🙇" },
    { word: "CAP", meaning: "หมวกแก๊ป", len: 3, emoji: "🧢" },
    { word: "DAY", meaning: "วัน/กลางวัน", len: 3, emoji: "☀️" },
    { word: "DIE", meaning: "ตาย", len: 3, emoji: "💀" },
    { word: "DIG", meaning: "ขุด", len: 3, emoji: "⛏️" },
    { word: "DOT", meaning: "จุด", len: 3, emoji: "⚫" },
    { word: "END", meaning: "จบ", len: 3, emoji: "🏁" },
    { word: "FAN", meaning: "พัดลม/แฟนคลับ", len: 3, emoji: "🌀" },
    { word: "FAR", meaning: "ไกล", len: 3, emoji: "🔭" },
    { word: "FEW", meaning: "น้อย/สองสาม", len: 3, emoji: "🤏" },
    { word: "FIX", meaning: "ซ่อม", len: 3, emoji: "🔧" },
    { word: "FOG", meaning: "หมอก", len: 3, emoji: "🌫️" },
    { word: "FUN", meaning: "สนุก", len: 3, emoji: "🎡" },
    { word: "GAP", meaning: "ช่องว่าง", len: 3, emoji: "🕳️" },
    { word: "GET", meaning: "ได้รับ", len: 3, emoji: "🤲" },
    { word: "GOD", meaning: "พระเจ้า", len: 3, emoji: "🙏" },
    { word: "GYM", meaning: "โรงยิม", len: 3, emoji: "🏋️" },
    { word: "HEN", meaning: "แม่ไก่", len: 3, emoji: "🐔" },
    { word: "HIP", meaning: "สะโพก", len: 3, emoji: "🦴" },
    { word: "INK", meaning: "หมึก", len: 3, emoji: "✒️" },
    { word: "JAM", meaning: "แยม/รถติด", len: 3, emoji: "🍓" },
    { word: "JOB", meaning: "งาน", len: 3, emoji: "💼" },
    { word: "KID", meaning: "เด็ก", len: 3, emoji: "🧒" },
    { word: "KIT", meaning: "ชุดเครื่องมือ", len: 3, emoji: "🧰" },
    { word: "LAB", meaning: "ห้องแล็บ", len: 3, emoji: "⚗️" },
    { word: "LAW", meaning: "กฎหมาย", len: 3, emoji: "⚖️" },
    { word: "LIE", meaning: "โกหก/นอนลง", len: 3, emoji: "🤥" },
    { word: "LIP", meaning: "ริมฝีปาก", len: 3, emoji: "👄" },
    { word: "LOG", meaning: "ซุง/บันทึก", len: 3, emoji: "🪵" },
    { word: "LOT", meaning: "จำนวนมาก", len: 3, emoji: "🔢" },
    { word: "MIX", meaning: "ผสม", len: 3, emoji: "🥣" },
    { word: "MUD", meaning: "โคลน", len: 3, emoji: "💩" },
    { word: "NAP", meaning: "งีบหลับ", len: 3, emoji: "😴" },
    { word: "NOW", meaning: "ตอนนี้", len: 3, emoji: "⏱️" },
    { word: "NUT", meaning: "ถั่ว", len: 3, emoji: "🥜" },
    { word: "OAK", meaning: "ไม้โอ๊ก", len: 3, emoji: "🌳" },
    { word: "OFF", meaning: "ปิด", len: 3, emoji: "📴" },
    { word: "ONE", meaning: "หนึ่ง", len: 3, emoji: "1️⃣" },
    { word: "OUT", meaning: "ออก", len: 3, emoji: "🚪" },
    { word: "OWN", meaning: "เป็นเจ้าของ", len: 3, emoji: "🔑" },
    { word: "ACID", meaning: "กรด", len: 4, emoji: "🧪" },
    { word: "ALLY", meaning: "พันธมิตร", len: 4, emoji: "🤝" },
    { word: "AREA", meaning: "พื้นที่", len: 4, emoji: "📐" },
    { word: "ARMY", meaning: "กองทัพ", len: 4, emoji: "🎖️" },
    { word: "ATOM", meaning: "อะตอม", len: 4, emoji: "⚛️" },
    { word: "AUNT", meaning: "ป้า/น้า/อา", len: 4, emoji: "👩" },
    { word: "AUTO", meaning: "อัตโนมัติ", len: 4, emoji: "🤖" },
    { word: "AWAY", meaning: "ออกไป", len: 4, emoji: "👋" },
    { word: "BACK", meaning: "หลัง/กลับ", len: 4, emoji: "🔙" },
    { word: "BAKE", meaning: "อบ", len: 4, emoji: "🧁" },
    { word: "BALL", meaning: "ลูกบอล", len: 4, emoji: "⚽" },
    { word: "BAND", meaning: "วงดนตรี/แถบ", len: 4, emoji: "🎸" },
    { word: "BASE", meaning: "ฐาน", len: 4, emoji: "🏟️" },
    { word: "BATH", meaning: "อาบน้ำ", len: 4, emoji: "🛁" },
    { word: "BEAK", meaning: "จงอยปาก", len: 4, emoji: "🐦" },
    { word: "BEAM", meaning: "ลำแสง", len: 4, emoji: "🔦" },
    { word: "BEAN", meaning: "ถั่ว", len: 4, emoji: "🫘" },
    { word: "BEEP", meaning: "เสียงบี๊บ", len: 4, emoji: "🔊" },
    { word: "BELL", meaning: "ระฆัง/กระดิ่ง", len: 4, emoji: "🔔" },
    { word: "BELT", meaning: "เข็มขัด", len: 4, emoji: "👖" },
    { word: "BEND", meaning: "งอ/โค้ง", len: 4, emoji: "⤵️" },
    { word: "BEST", meaning: "ดีที่สุด", len: 4, emoji: "🥇" },
    { word: "BILL", meaning: "บิล/ใบเสร็จ", len: 4, emoji: "🧾" },
    { word: "BIND", meaning: "ผูก/มัด", len: 4, emoji: "🎀" },
    { word: "BITE", meaning: "กัด", len: 4, emoji: "🦷" },
    { word: "BLOW", meaning: "เป่า", len: 4, emoji: "🌬️" },
    { word: "BODY", meaning: "ร่างกาย", len: 4, emoji: "💪" },
    { word: "BOIL", meaning: "ต้ม", len: 4, emoji: "🍲" },
    { word: "BOMB", meaning: "ระเบิด", len: 4, emoji: "💣" },
    { word: "BONE", meaning: "กระดูก", len: 4, emoji: "🦴" },
    { word: "BOOT", meaning: "รองเท้าบูท", len: 4, emoji: "👢" },
    { word: "BOWL", meaning: "ชาม", len: 4, emoji: "🥣" },
    { word: "BURN", meaning: "เผาไหม้", len: 4, emoji: "🔥" },
    { word: "BUSY", meaning: "ยุ่ง", len: 4, emoji: "😫" },
    { word: "CAGE", meaning: "กรง", len: 4, emoji: "🔒" },
    { word: "CALL", meaning: "เรียก/โทร", len: 4, emoji: "📞" },
    { word: "CALM", meaning: "สงบ", len: 4, emoji: "😌" },
    { word: "CAMP", meaning: "ค่าย", len: 4, emoji: "⛺" },
    { word: "CARD", meaning: "การ์ด/ไพ่", len: 4, emoji: "🃏" },
    { word: "CARE", meaning: "ดูแล/ห่วงใย", len: 4, emoji: "🤲" },
    { word: "CASE", meaning: "กรณี/เคส", len: 4, emoji: "💼" },
    { word: "CELL", meaning: "เซลล์", len: 4, emoji: "🦠" },
    { word: "CHAT", meaning: "คุยเล่น", len: 4, emoji: "💬" },
    { word: "CHEF", meaning: "เชฟ", len: 4, emoji: "👨‍🍳" },
    { word: "CHEW", meaning: "เคี้ยว", len: 4, emoji: "🦷" },
    { word: "CHIN", meaning: "คาง", len: 4, emoji: "🧔" },
    { word: "CHIP", meaning: "ชิป/มันฝรั่งแผ่น", len: 4, emoji: "🥔" },
    { word: "CLAY", meaning: "ดินเหนียว", len: 4, emoji: "🏺" },
    { word: "CLUB", meaning: "ชมรม/ไม้กอล์ฟ", len: 4, emoji: "♣️" },
    { word: "COAL", meaning: "ถ่านหิน", len: 4, emoji: "🪨" },
    { word: "COAT", meaning: "เสื้อโค้ท", len: 4, emoji: "🧥" },
    { word: "COLD", meaning: "หนาว/เย็น", len: 4, emoji: "❄️" },
    { word: "COMB", meaning: "หวี", len: 4, emoji: "💈" },
    { word: "COME", meaning: "มา", len: 4, emoji: "👋" },
    { word: "COPY", meaning: "คัดลอก", len: 4, emoji: "📝" },
    { word: "CORE", meaning: "แกนกลาง", len: 4, emoji: "🍎" },
    { word: "CROP", meaning: "พืชผล", len: 4, emoji: "🌽" },
    { word: "DARK", meaning: "มืด", len: 4, emoji: "🌑" },
    { word: "DATE", meaning: "วันที่/เดท", len: 4, emoji: "📅" },
    { word: "DAWN", meaning: "รุ่งเช้า", len: 4, emoji: "🌅" },
    { word: "DEAF", meaning: "หูหนวก", len: 4, emoji: "🧏" },
    { word: "DEAL", meaning: "ข้อตกลง", len: 4, emoji: "🤝" },
    { word: "DEEP", meaning: "ลึก", len: 4, emoji: "🌊" },
    { word: "DESK", meaning: "โต๊ะทำงาน", len: 4, emoji: "🖥️" },
    { word: "DIET", meaning: "การคุมอาหาร", len: 4, emoji: "🥗" },
    { word: "DIRT", meaning: "ฝุ่น/ดิน", len: 4, emoji: "💩" },
    { word: "DISH", meaning: "จาน/เมนู", len: 4, emoji: "🍽️" },
    { word: "DIVE", meaning: "ดำน้ำ", len: 4, emoji: "🤿" },
    { word: "DONE", meaning: "เสร็จ", len: 4, emoji: "✅" },
    { word: "DOWN", meaning: "ลง/ข้างล่าง", len: 4, emoji: "⬇️" },
    { word: "DRAW", meaning: "วาด", len: 4, emoji: "✏️" },
    { word: "DROP", meaning: "ทำตก/หยด", len: 4, emoji: "💧" },
    { word: "DRUM", meaning: "กลอง", len: 4, emoji: "🥁" },
    { word: "DUAL", meaning: "คู่/สอง", len: 4, emoji: "✌️" },
    { word: "DUST", meaning: "ฝุ่น", len: 4, emoji: "💨" },
    { word: "DUTY", meaning: "หน้าที่", len: 4, emoji: "🫡" },
    { word: "EASY", meaning: "ง่าย", len: 4, emoji: "👌" },
    { word: "EDGE", meaning: "ขอบ", len: 4, emoji: "📐" },
    { word: "EDIT", meaning: "แก้ไข", len: 4, emoji: "📝" },
    { word: "ELSE", meaning: "อื่น", len: 4, emoji: "🤷" },
    { word: "ENVY", meaning: "อิจฉา", len: 4, emoji: "😒" },
    { word: "EPIC", meaning: "ยิ่งใหญ่", len: 4, emoji: "🏰" },
    { word: "EVEN", meaning: "คู่(เลข)/แม้ว่า", len: 4, emoji: "⚖️" },
    { word: "EVIL", meaning: "ชั่วร้าย", len: 4, emoji: "😈" },
    { word: "EXAM", meaning: "สอบ", len: 4, emoji: "📝" },
    { word: "FACE", meaning: "ใบหน้า", len: 4, emoji: "🙂" },
    { word: "FACT", meaning: "ความจริง", len: 4, emoji: "📌" },
    { word: "FAIL", meaning: "ล้มเหลว", len: 4, emoji: "❌" },
    { word: "FAIR", meaning: "ยุติธรรม/งานแฟร์", len: 4, emoji: "⚖️" },
    { word: "FALL", meaning: "ตก/ฤดูใบไม้ร่วง", len: 4, emoji: "🍂" },
    { word: "FAME", meaning: "ชื่อเสียง", len: 4, emoji: "🌟" },
    { word: "FAST", meaning: "เร็ว", len: 4, emoji: "⚡" },
    { word: "FEAR", meaning: "กลัว", len: 4, emoji: "😱" },
    { word: "FEED", meaning: "ให้อาหาร", len: 4, emoji: "🍼" },
    { word: "FEEL", meaning: "รู้สึก", len: 4, emoji: "❤️" },
    { word: "FILM", meaning: "หนัง/ฟิล์ม", len: 4, emoji: "🎬" },
    { word: "FIND", meaning: "หา", len: 4, emoji: "🔍" },
    { word: "FINE", meaning: "สบายดี/ค่าปรับ", len: 4, emoji: "👍" },
    { word: "FLAG", meaning: "ธง", len: 4, emoji: "🚩" },
    { word: "FLAT", meaning: "แบน/ราบ", len: 4, emoji: "🛣️" },
    { word: "FLOW", meaning: "ไหล", len: 4, emoji: "🌊" },
    { word: "FOAM", meaning: "โฟม/ฟอง", len: 4, emoji: "🫧" },
    { word: "FOLD", meaning: "พับ", len: 4, emoji: "📂" },
    { word: "FOOT", meaning: "เท้า", len: 4, emoji: "🦶" },
    { word: "FORK", meaning: "ส้อม", len: 4, emoji: "🍴" },
    { word: "FORM", meaning: "แบบฟอร์ม/รูปร่าง", len: 4, emoji: "📝" },
    { word: "FUEL", meaning: "เชื้อเพลิง", len: 4, emoji: "⛽" },
    { word: "FULL", meaning: "เต็ม", len: 4, emoji: "🌕" },
    { word: "FUND", meaning: "กองทุน", len: 4, emoji: "💰" },
    { word: "GAIN", meaning: "ได้รับ/เพิ่ม", len: 4, emoji: "📈" },
    { word: "GATE", meaning: "ประตูรั้ว", len: 4, emoji: "⛩️" },
    { word: "GEAR", meaning: "เกียร์/อุปกรณ์", len: 4, emoji: "⚙️" },
    { word: "GENE", meaning: "ยีน", len: 4, emoji: "🧬" },
    { word: "GIFT", meaning: "ของขวัญ", len: 4, emoji: "🎁" },
    { word: "GIVE", meaning: "ให้", len: 4, emoji: "🎁" },
    { word: "GLAD", meaning: "ยินดี", len: 4, emoji: "😊" },
    { word: "GLUE", meaning: "กาว", len: 4, emoji: "🧴" },
    { word: "GOAL", meaning: "เป้าหมาย/ประตู", len: 4, emoji: "🥅" },
    { word: "GOLF", meaning: "กอล์ฟ", len: 4, emoji: "⛳" },
    { word: "GOOD", meaning: "ดี", len: 4, emoji: "👍" },
    { word: "GRAY", meaning: "สีเทา", len: 4, emoji: "🌫️" },
    { word: "GROW", meaning: "เติบโต", len: 4, emoji: "🌱" },
    { word: "HAIR", meaning: "ผม", len: 4, emoji: "💇" },
    { word: "HALF", meaning: "ครึ่ง", len: 4, emoji: "🌗" },
    { word: "HALL", meaning: "ห้องโถง", len: 4, emoji: "🏢" },
    { word: "HAND", meaning: "มือ", len: 4, emoji: "✋" },
    { word: "HARD", meaning: "ยาก/แข็ง", len: 4, emoji: "🧱" },
    { word: "HEAD", meaning: "หัว", len: 4, emoji: "🗣️" },
    { word: "HEAR", meaning: "ได้ยิน", len: 4, emoji: "👂" },
    { word: "HEAT", meaning: "ความร้อน", len: 4, emoji: "🔥" },
    { word: "HELL", meaning: "นรก", len: 4, emoji: "😈" },
    { word: "HELP", meaning: "ช่วย", len: 4, emoji: "🆘" },
    { word: "HERO", meaning: "ฮีโร่", len: 4, emoji: "🦸" },
    { word: "HIGH", meaning: "สูง", len: 4, emoji: "⬆️" },
    { word: "HIKE", meaning: "เดินป่า", len: 4, emoji: "🥾" },
    { word: "HINT", meaning: "คำใบ้", len: 4, emoji: "💡" },
    { word: "HIRE", meaning: "จ้าง", len: 4, emoji: "🤝" },
    { word: "HOLD", meaning: "ถือ", len: 4, emoji: "✊" },
    { word: "HOLE", meaning: "รู/หลุม", len: 4, emoji: "🕳️" },
    { word: "HOME", meaning: "บ้าน", len: 4, emoji: "🏠" },
    { word: "HOPE", meaning: "หวัง", len: 4, emoji: "🤞" },
    { word: "HORN", meaning: "แตร/เขา", len: 4, emoji: "📯" },
    { word: "HOUR", meaning: "ชั่วโมง", len: 4, emoji: "⏳" },
    { word: "HUGE", meaning: "ใหญ่โต", len: 4, emoji: "🦕" },
    { word: "HUNT", meaning: "ล่า", len: 4, emoji: "🏹" },
    { word: "HURT", meaning: "เจ็บ", len: 4, emoji: "🤕" },
    { word: "IDEA", meaning: "ความคิด", len: 4, emoji: "💡" },
    { word: "IDOL", meaning: "ไอดอล", len: 4, emoji: "🎤" },
    { word: "INCH", meaning: "นิ้ว(หน่วย)", len: 4, emoji: "📏" },
    { word: "INFO", meaning: "ข้อมูล", len: 4, emoji: "ℹ️" },
    { word: "JAZZ", meaning: "ดนตรีแจ๊ส", len: 4, emoji: "🎷" },
    { word: "JOKE", meaning: "ตลก/ล้อเล่น", len: 4, emoji: "🤡" },
    { word: "KICK", meaning: "เตะ", len: 4, emoji: "🦶" },
    { word: "KILL", meaning: "ฆ่า", len: 4, emoji: "💀" },
    { word: "KIND", meaning: "ใจดี/ชนิด", len: 4, emoji: "😊" },
    { word: "KNEE", meaning: "เข่า", len: 4, emoji: "🦵" },
    { word: "KNOW", meaning: "รู้", len: 4, emoji: "🧠" },
    { word: "LACK", meaning: "ขาดแคลน", len: 4, emoji: "📉" },
    { word: "LAND", meaning: "พื้นดิน", len: 4, emoji: "🏞️" },
    { word: "LAST", meaning: "สุดท้าย", len: 4, emoji: "🔚" },
    { word: "LATE", meaning: "สาย", len: 4, emoji: "⏰" },
    { word: "LAZY", meaning: "ขี้เกียจ", len: 4, emoji: "🦥" },
    { word: "LEAD", meaning: "นำ", len: 4, emoji: "👑" },
    { word: "LEFT", meaning: "ซ้าย", len: 4, emoji: "⬅️" },
    { word: "LEND", meaning: "ให้ยืม", len: 4, emoji: "🤲" },
    { word: "LESS", meaning: "น้อยกว่า", len: 4, emoji: "➖" },
    { word: "LIFE", meaning: "ชีวิต", len: 4, emoji: "🧬" },
    { word: "LIFT", meaning: "ลิฟต์/ยก", len: 4, emoji: "🛗" },
    { word: "LIKE", meaning: "ชอบ/เหมือน", len: 4, emoji: "👍" },
    { word: "LINE", meaning: "เส้น/แถว", len: 4, emoji: "➖" },
    { word: "LIVE", meaning: "อาศัย/สด", len: 4, emoji: "🔴" },
    { word: "LOAD", meaning: "บรรทุก/โหลด", len: 4, emoji: "🚛" },
    { word: "LOAN", meaning: "เงินกู้", len: 4, emoji: "💸" },
    { word: "LONG", meaning: "ยาว/นาน", len: 4, emoji: "📏" },
    { word: "LOOK", meaning: "มอง", len: 4, emoji: "👀" },
    { word: "LORD", meaning: "ท่านลอร์ด/เจ้า", len: 4, emoji: "👑" },
    { word: "LOSE", meaning: "แพ้/ทำหาย", len: 4, emoji: "🏳️" },
    { word: "LOSS", meaning: "การสูญเสีย", len: 4, emoji: "📉" },
    { word: "LOUD", meaning: "เสียงดัง", len: 4, emoji: "📢" },
    { word: "LUCK", meaning: "โชค", len: 4, emoji: "🍀" },
    { word: "LUNG", meaning: "ปอด", len: 4, emoji: "🫁" },
    { word: "MAIN", meaning: "หลัก", len: 4, emoji: "🎯" },
    { word: "MAKE", meaning: "ทำ", len: 4, emoji: "🛠️" },
    { word: "MARK", meaning: "เครื่องหมาย", len: 4, emoji: "❌" },
    { word: "MASK", meaning: "หน้ากาก", len: 4, emoji: "😷" },
    { word: "MASS", meaning: "มวล", len: 4, emoji: "⚖️" },
    { word: "MATE", meaning: "เพื่อน/คู่", len: 4, emoji: "👥" },
    { word: "MATH", meaning: "คณิตศาสตร์", len: 4, emoji: "➕" },
    { word: "MEAL", meaning: "มื้ออาหาร", len: 4, emoji: "🍽️" },
    { word: "MEAN", meaning: "หมายถึง/ใจร้าย", len: 4, emoji: "😈" },
    { word: "MEET", meaning: "พบเจอ", len: 4, emoji: "🤝" },
    { word: "MELT", meaning: "ละลาย", len: 4, emoji: "🫠" },
    { word: "MENU", meaning: "เมนู", len: 4, emoji: "📜" },
    { word: "MESS", meaning: "เละเทะ", len: 4, emoji: "🚮" },
    { word: "MILD", meaning: "อ่อนโยน", len: 4, emoji: "😌" },
    { word: "MILK", meaning: "นม", len: 4, emoji: "🥛" },
    { word: "MIND", meaning: "จิตใจ", len: 4, emoji: "🧠" },
    { word: "MINE", meaning: "ของฉัน/เหมือง", len: 4, emoji: "⛏️" },
    { word: "MISS", meaning: "คิดถึง/พลาด", len: 4, emoji: "😢" },
    { word: "MODE", meaning: "โหมด", len: 4, emoji: "⚙️" },
    { word: "MOOD", meaning: "อารมณ์", len: 4, emoji: "🎭" },
    { word: "MORE", meaning: "มากกว่า", len: 4, emoji: "➕" },
    { word: "MOST", meaning: "ที่สุด", len: 4, emoji: "🔝" },
    { word: "MOVE", meaning: "ย้าย/ขยับ", len: 4, emoji: "🚚" },
    { word: "MUCH", meaning: "มาก", len: 4, emoji: "🛍️" },
    { word: "NAME", meaning: "ชื่อ", len: 4, emoji: "📛" },
    { word: "NEAR", meaning: "ใกล้", len: 4, emoji: "📍" },
    { word: "NECK", meaning: "คอ", len: 4, emoji: "🧣" },
    { word: "NEED", meaning: "ต้องการ", len: 4, emoji: "🙏" },
    { word: "NEST", meaning: "รัง", len: 4, emoji: "🪺" },
    { word: "NEXT", meaning: "ถัดไป", len: 4, emoji: "⏭️" },
    { word: "NICE", meaning: "ดี/น่ารัก", len: 4, emoji: "👌" },
    { word: "NOSE", meaning: "จมูก", len: 4, emoji: "👃" },
    { word: "NOTE", meaning: "โน้ต", len: 4, emoji: "📝" },
    { word: "OKAY", meaning: "โอเค", len: 4, emoji: "🙆" },
    { word: "ONCE", meaning: "ครั้งหนึ่ง", len: 4, emoji: "1️⃣" },
    { word: "ONLY", meaning: "เท่านั้น", len: 4, emoji: "☝️" },
    { word: "OPEN", meaning: "เปิด", len: 4, emoji: "🔓" },
    { word: "ORAL", meaning: "ทางปาก", len: 4, emoji: "🗣️" },
    { word: "OVER", meaning: "เกิน/จบ", len: 4, emoji: "🔚" },
    { word: "PACE", meaning: "ฝีเท้า", len: 4, emoji: "👣" },
    { word: "PACK", meaning: "ห่อ/ฝูง", len: 4, emoji: "📦" },
    { word: "PAGE", meaning: "หน้ากระดาษ", len: 4, emoji: "📄" },
    { word: "PAIN", meaning: "ความเจ็บปวด", len: 4, emoji: "😖" },
    { word: "PAIR", meaning: "คู่", len: 4, emoji: "👥" },
    { word: "PALM", meaning: "ฝ่ามือ/ต้นปาล์ม", len: 4, emoji: "✋" },
    { word: "PART", meaning: "ส่วน", len: 4, emoji: "🧩" },
    { word: "PASS", meaning: "ผ่าน", len: 4, emoji: "✅" },
    { word: "PAST", meaning: "อดีต", len: 4, emoji: "🕰️" },
    { word: "PATH", meaning: "เส้นทาง", len: 4, emoji: "🛣️" },
    { word: "PEAK", meaning: "จุดสูงสุด", len: 4, emoji: "🏔️" },
    { word: "PEAR", meaning: "ลูกแพร์", len: 4, emoji: "🍐" },
    { word: "PICK", meaning: "เลือก/หยิบ", len: 4, emoji: "👉" },
    { word: "PILE", meaning: "กอง", len: 4, emoji: "📚" },
    { word: "PILL", meaning: "ยาเม็ด", len: 4, emoji: "💊" },
    { word: "PINE", meaning: "ต้นสน", len: 4, emoji: "🌲" },
    { word: "PINK", meaning: "สีชมพู", len: 4, emoji: "💗" },
    { word: "PIPE", meaning: "ท่อ", len: 4, emoji: "🚰" },
    { word: "PLAN", meaning: "แผน", len: 4, emoji: "🗺️" },
    { word: "PLAY", meaning: "เล่น", len: 4, emoji: "🎮" },
    { word: "PLOT", meaning: "พล็อตเรื่อง", len: 4, emoji: "📖" },
    { word: "PLUG", meaning: "ปลั๊ก", len: 4, emoji: "🔌" },
    { word: "PLUS", meaning: "บวก", len: 4, emoji: "➕" },
    { word: "POEM", meaning: "บทกวี", len: 4, emoji: "📜" },
    { word: "POET", meaning: "กวี", len: 4, emoji: "✍️" },
    { word: "POND", meaning: "บ่อน้ำ", len: 4, emoji: "🐸" },
    { word: "POOL", meaning: "สระน้ำ", len: 4, emoji: "🏊" },
    { word: "POOR", meaning: "จน/น่าสงสาร", len: 4, emoji: "🥺" },
    { word: "PORT", meaning: "ท่าเรือ", len: 4, emoji: "⚓" },
    { word: "POST", meaning: "เสา/ส่ง", len: 4, emoji: "📮" },
    { word: "POUR", meaning: "เท/ราด", len: 4, emoji: "🫗" },
    { word: "PRAY", meaning: "อธิษฐาน", len: 4, emoji: "🙏" },
    { word: "PULL", meaning: "ดึง", len: 4, emoji: "✊" },
    { word: "PURE", meaning: "บริสุทธิ์", len: 4, emoji: "✨" },
    { word: "PUSH", meaning: "ผลัก", len: 4, emoji: "👐" },
    { word: "QUIT", meaning: "เลิก/ออก", len: 4, emoji: "🚪" },
    { word: "RACE", meaning: "แข่งขัน", len: 4, emoji: "🏁" },
    { word: "RAIL", meaning: "ราง", len: 4, emoji: "🛤️" },
    { word: "RAIN", meaning: "ฝน", len: 4, emoji: "🌧️" },
    { word: "RARE", meaning: "หายาก", len: 4, emoji: "💎" },
    { word: "RATE", meaning: "อัตรา", len: 4, emoji: "📊" },
    { word: "READ", meaning: "อ่าน", len: 4, emoji: "📖" },
    { word: "REAL", meaning: "จริง", len: 4, emoji: "💯" },
    { word: "REAR", meaning: "ด้านหลัง", len: 4, emoji: "🔙" },
    { word: "RELY", meaning: "พึ่งพา", len: 4, emoji: "🤝" },
    { word: "RENT", meaning: "เช่า", len: 4, emoji: "🏠" },
    { word: "REST", meaning: "พักผ่อน", len: 4, emoji: "🛌" },
    { word: "RICE", meaning: "ข้าว", len: 4, emoji: "🍚" },
    { word: "RICH", meaning: "รวย", len: 4, emoji: "💰" },
    { word: "RIDE", meaning: "ขี่/ขับ", len: 4, emoji: "🚴" },
    { word: "RING", meaning: "แหวน/เสียงกริ่ง", len: 4, emoji: "💍" },
    { word: "RISE", meaning: "ขึ้น/ตื่น", len: 4, emoji: "🌅" },
    { word: "RISK", meaning: "ความเสี่ยง", len: 4, emoji: "⚠️" },
    { word: "ROCK", meaning: "หิน", len: 4, emoji: "🪨" },
    { word: "ROLE", meaning: "บทบาท", len: 4, emoji: "🎭" },
    { word: "ROLL", meaning: "ม้วน/กลิ้ง", len: 4, emoji: "🧻" },
    { word: "ROOF", meaning: "หลังคา", len: 4, emoji: "🏠" },
    { word: "ROOM", meaning: "ห้อง", len: 4, emoji: "🚪" },
    { word: "ROOT", meaning: "ราก", len: 4, emoji: "🥕" },
    { word: "ROPE", meaning: "เชือก", len: 4, emoji: "🪢" },
    { word: "ROSE", meaning: "กุหลาบ", len: 4, emoji: "🌹" },
    { word: "RULE", meaning: "กฎ", len: 4, emoji: "📏" },
    { word: "RUSH", meaning: "รีบ", len: 4, emoji: "🏃" },
    { word: "SAFE", meaning: "ปลอดภัย", len: 4, emoji: "🛡️" },
    { word: "SAID", meaning: "พูด(อดีต)", len: 4, emoji: "🗣️" },
    { word: "SAIL", meaning: "ล่องเรือ", len: 4, emoji: "⛵" },
    { word: "SALE", meaning: "การขาย", len: 4, emoji: "🏷️" },
    { word: "SALT", meaning: "เกลือ", len: 4, emoji: "🧂" },
    { word: "SAME", meaning: "เหมือนกัน", len: 4, emoji: "👯" },
    { word: "SAND", meaning: "ทราย", len: 4, emoji: "🏖️" },
    { word: "SAVE", meaning: "บันทึก/ช่วย", len: 4, emoji: "💾" },
    { word: "SEAT", meaning: "ที่นั่ง", len: 4, emoji: "🪑" },
    { word: "SEED", meaning: "เมล็ดพันธุ์", len: 4, emoji: "🌱" },
    { word: "SEEK", meaning: "ค้นหา", len: 4, emoji: "🔍" },
    { word: "SEEM", meaning: "ดูเหมือน", len: 4, emoji: "🤔" },
    { word: "SELF", meaning: "ตนเอง", len: 4, emoji: "🤳" },
    { word: "SELL", meaning: "ขาย", len: 4, emoji: "🏪" },
    { word: "SEND", meaning: "ส่ง", len: 4, emoji: "📨" },
    { word: "SHIP", meaning: "เรือ", len: 4, emoji: "🚢" },
    { word: "SHOE", meaning: "รองเท้า", len: 4, emoji: "👞" },
    { word: "SHOP", meaning: "ร้านค้า", len: 4, emoji: "🛍️" },
    { word: "SHOT", meaning: "การยิง/ช็อต", len: 4, emoji: "🥃" },
    { word: "SHOW", meaning: "แสดง", len: 4, emoji: "🎭" },
    { word: "SHUT", meaning: "ปิด", len: 4, emoji: "🚪" },
    { word: "SICK", meaning: "ป่วย", len: 4, emoji: "🤒" },
    { word: "SIDE", meaning: "ด้านข้าง", len: 4, emoji: "↔️" },
    { word: "SIGN", meaning: "ป้าย/เซ็น", len: 4, emoji: "🪧" },
    { word: "SILK", meaning: "ผ้าไหม", len: 4, emoji: "🧣" },
    { word: "SING", meaning: "ร้องเพลง", len: 4, emoji: "🎤" },
    { word: "SINK", meaning: "จม/อ่าง", len: 4, emoji: "🚰" },
    { word: "SITE", meaning: "สถานที่/เว็บ", len: 4, emoji: "🏗️" },
    { word: "SIZE", meaning: "ขนาด", len: 4, emoji: "📏" },
    { word: "SKIN", meaning: "ผิวหนัง", len: 4, emoji: "🖐️" },
    { word: "SLOW", meaning: "ช้า", len: 4, emoji: "🐌" },
    { word: "SNOW", meaning: "หิมะ", len: 4, emoji: "❄️" },
    { word: "SOAP", meaning: "สบู่", len: 4, emoji: "🧼" },
    { word: "SOFT", meaning: "นุ่ม", len: 4, emoji: "🧸" },
    { word: "SOIL", meaning: "ดิน", len: 4, emoji: "🌱" },
    { word: "SOLD", meaning: "ขายแล้ว", len: 4, emoji: "🏷️" },
    { word: "SOLE", meaning: "โดดเดี่ยว/ฝ่าเท้า", len: 4, emoji: "🦶" },
    { word: "SOME", meaning: "บ้าง", len: 4, emoji: "🤏" },
    { word: "SONG", meaning: "เพลง", len: 4, emoji: "🎶" },
    { word: "SOON", meaning: "เร็วๆนี้", len: 4, emoji: "🔜" },
    { word: "SORT", meaning: "แยกประเภท", len: 4, emoji: "🗂️" },
    { word: "SOUL", meaning: "วิญญาณ", len: 4, emoji: "👻" },
    { word: "SOUP", meaning: "ซุป", len: 4, emoji: "🍲" },
    { word: "SOUR", meaning: "เปรี้ยว", len: 4, emoji: "🍋" },
    { word: "SPOT", meaning: "จุด/สถานที่", len: 4, emoji: "📍" },
    { word: "STAR", meaning: "ดาว", len: 4, emoji: "⭐" },
    { word: "STAY", meaning: "พักอยู่", len: 4, emoji: "🏨" },
    { word: "STEP", meaning: "ก้าว", len: 4, emoji: "👣" },
    { word: "STOP", meaning: "หยุด", len: 4, emoji: "🛑" },
    { word: "SUCH", meaning: "เช่นนี้", len: 4, emoji: "💁" },
    { word: "SUIT", meaning: "ชุดสูท/เหมาะ", len: 4, emoji: "🕴️" },
    { word: "SURE", meaning: "แน่ใจ", len: 4, emoji: "👍" },
    { word: "SWIM", meaning: "ว่ายน้ำ", len: 4, emoji: "🏊" },
    { word: "TAIL", meaning: "หาง", len: 4, emoji: "🐕" },
    { word: "TAKE", meaning: "เอาไป", len: 4, emoji: "🤏" },
    { word: "TALK", meaning: "คุย", len: 4, emoji: "🗣️" },
    { word: "TALL", meaning: "สูง", len: 4, emoji: "🦒" },
    { word: "TANK", meaning: "รถถัง/แทงค์", len: 4, emoji: "🪖" },
    { word: "TAPE", meaning: "เทป", len: 4, emoji: "📼" },
    { word: "TASK", meaning: "งาน/ภารกิจ", len: 4, emoji: "📋" },
    { word: "TEAM", meaning: "ทีม", len: 4, emoji: "🤝" },
    { word: "TEAR", meaning: "น้ำตา/ฉีก", len: 4, emoji: "😢" },
    { word: "TELL", meaning: "บอก", len: 4, emoji: "📢" },
    { word: "TENT", meaning: "เต็นท์", len: 4, emoji: "⛺" },
    { word: "TERM", meaning: "ระยะเวลา/คำ", len: 4, emoji: "⏳" },
    { word: "TEST", meaning: "ทดสอบ", len: 4, emoji: "📝" },
    { word: "TEXT", meaning: "ข้อความ", len: 4, emoji: "💬" },
    { word: "THAN", meaning: "กว่า", len: 4, emoji: "⚖️" },
    { word: "THAT", meaning: "นั่น", len: 4, emoji: "👉" },
    { word: "THEM", meaning: "พวกเขา", len: 4, emoji: "👥" },
    { word: "THEN", meaning: "จากนั้น", len: 4, emoji: "➡️" },
    { word: "THIN", meaning: "ผอม/บาง", len: 4, emoji: "📏" },
    { word: "THIS", meaning: "นี่", len: 4, emoji: "👇" },
    { word: "TIDE", meaning: "น้ำขึ้นน้ำลง", len: 4, emoji: "🌊" },
    { word: "TIDY", meaning: "เรียบร้อย", len: 4, emoji: "🧹" },
    { word: "TIED", meaning: "ผูกมัด", len: 4, emoji: "🪢" },
    { word: "TIME", meaning: "เวลา", len: 4, emoji: "⏰" },
    { word: "TINY", meaning: "จิ๋ว", len: 4, emoji: "🐜" },
    { word: "TOOL", meaning: "เครื่องมือ", len: 4, emoji: "🔨" },
    { word: "TOUR", meaning: "ทัวร์", len: 4, emoji: "🚌" },
    { word: "TOWN", meaning: "เมืองเล็ก", len: 4, emoji: "🏘️" },
    { word: "TRAP", meaning: "กับดัก", len: 4, emoji: "🪤" },
    { word: "TRAY", meaning: "ถาด", len: 4, emoji: "📥" },
    { word: "TRIP", meaning: "การเดินทาง", len: 4, emoji: "✈️" },
    { word: "TRUE", meaning: "จริง", len: 4, emoji: "✔️" },
    { word: "TUBE", meaning: "หลอด/ท่อ", len: 4, emoji: "🧪" },
    { word: "TUNE", meaning: "ทำนอง", len: 4, emoji: "🎵" },
    { word: "TURN", meaning: "เลี้ยว/หมุน", len: 4, emoji: "↩️" },
    { word: "TYPE", meaning: "ชนิด/พิมพ์", len: 4, emoji: "⌨️" },
    { word: "UGLY", meaning: "น่าเกลียด", len: 4, emoji: "👹" },
    { word: "UNIT", meaning: "หน่วย", len: 4, emoji: "🧱" },
    { word: "UPON", meaning: "เมื่อ/บน", len: 4, emoji: "🔝" },
    { word: "USER", meaning: "ผู้ใช้", len: 4, emoji: "👤" },
    { word: "VAIN", meaning: "ไร้ประโยชน์", len: 4, emoji: "🙄" },
    { word: "VAST", meaning: "กว้างใหญ่", len: 4, emoji: "🌌" },
    { word: "VEIL", meaning: "ผ้าคลุมหน้า", len: 4, emoji: "👰" },
    { word: "VERY", meaning: "มาก", len: 4, emoji: "‼️" },
    { word: "VEST", meaning: "เสื้อกั๊ก", len: 4, emoji: "🦺" },
    { word: "VIEW", meaning: "วิว/มุมมอง", len: 4, emoji: "🏞️" },
    { word: "VOTE", meaning: "โหวต", len: 4, emoji: "🗳️" },
    { word: "WAIT", meaning: "รอ", len: 4, emoji: "⏳" },
    { word: "WAKE", meaning: "ตื่น", len: 4, emoji: "⏰" },
    { word: "WALK", meaning: "เดิน", len: 4, emoji: "🚶" },
    { word: "WALL", meaning: "กำแพง", len: 4, emoji: "🧱" },
    { word: "WANT", meaning: "อยากได้", len: 4, emoji: "🤲" },
    { word: "WARM", meaning: "อบอุ่น", len: 4, emoji: "♨️" },
    { word: "WARN", meaning: "เตือน", len: 4, emoji: "⚠️" },
    { word: "WASH", meaning: "ล้าง", len: 4, emoji: "🧼" },
    { word: "WAVE", meaning: "คลื่น/โบกมือ", len: 4, emoji: "👋" },
    { word: "WEAK", meaning: "อ่อนแอ", len: 4, emoji: "🥀" },
    { word: "WEAR", meaning: "สวมใส่", len: 4, emoji: "👕" },
    { word: "WEEK", meaning: "สัปดาห์", len: 4, emoji: "🗓️" },
    { word: "WELL", meaning: "ดี/บ่อน้ำ", len: 4, emoji: "🕳️" },
    { word: "WENT", meaning: "ไป(อดีต)", len: 4, emoji: "🚶" },
    { word: "WEST", meaning: "ทิศตะวันตก", len: 4, emoji: "⬅️" },
    { word: "WHAT", meaning: "อะไร", len: 4, emoji: "❓" },
    { word: "WHEN", meaning: "เมื่อไหร่", len: 4, emoji: "🕒" },
    { word: "WHOM", meaning: "ใคร(กรรม)", len: 4, emoji: "👤" },
    { word: "WIDE", meaning: "กว้าง", len: 4, emoji: "↔️" },
    { word: "WIFE", meaning: "ภรรยา", len: 4, emoji: "👩" },
    { word: "WILD", meaning: "ป่าเถื่อน", len: 4, emoji: "🦁" },
    { word: "WILL", meaning: "จะ/พินัยกรรม", len: 4, emoji: "📜" },
    { word: "WIND", meaning: "ลม", len: 4, emoji: "🌬️" },
    { word: "WINE", meaning: "ไวน์", len: 4, emoji: "🍷" },
    { word: "WING", meaning: "ปีก", len: 4, emoji: "🦅" },
    { word: "WIPE", meaning: "เช็ด", len: 4, emoji: "🧻" },
    { word: "WIRE", meaning: "ลวด/สายไฟ", len: 4, emoji: "🔌" },
    { word: "WISE", meaning: "ฉลาด", len: 4, emoji: "🦉" },
    { word: "WISH", meaning: "ปรารถนา", len: 4, emoji: "🌠" },
    { word: "WITH", meaning: "กับ/ด้วย", len: 4, emoji: "➕" },
    { word: "WOLF", meaning: "หมาป่า", len: 4, emoji: "🐺" },
    { word: "WOOD", meaning: "ไม้", len: 4, emoji: "🪵" },
    { word: "WOOL", meaning: "ขนสัตว์", len: 4, emoji: "🐑" },
    { word: "WORD", meaning: "คำ", len: 4, emoji: "🔤" },
    { word: "WORK", meaning: "งาน", len: 4, emoji: "💼" },
    { word: "WORM", meaning: "หนอน", len: 4, emoji: "🪱" },
    { word: "WRAP", meaning: "ห่อ", len: 4, emoji: "🎁" },
    { word: "YARD", meaning: "สนาม/หลา", len: 4, emoji: "🏡" },
    { word: "YEAR", meaning: "ปี", len: 4, emoji: "🗓️" },
    { word: "YELL", meaning: "ตะโกน", len: 4, emoji: "📢" },
    { word: "ZERO", meaning: "ศูนย์", len: 4, emoji: "0️⃣" },
    { word: "ZONE", meaning: "โซน", len: 4, emoji: "🚧" },
    { word: "ZOOM", meaning: "ซูม/ขยาย", len: 4, emoji: "🔍" },
    { word: "ABOVE", meaning: "ข้างบน", len: 5, emoji: "⬆️" },
    { word: "ACTOR", meaning: "นักแสดง", len: 5, emoji: "🎭" },
    { word: "ADAPT", meaning: "ปรับตัว", len: 5, emoji: "🦎" },
    { word: "AGREE", meaning: "เห็นด้วย", len: 5, emoji: "🤝" },
    { word: "AHEAD", meaning: "ข้างหน้า", len: 5, emoji: "⏩" },
    { word: "ALARM", meaning: "สัญญาณเตือน", len: 5, emoji: "🚨" },
    { word: "ALIVE", meaning: "มีชีวิต", len: 5, emoji: "🌱" },
    { word: "ALLOW", meaning: "อนุญาต", len: 5, emoji: "✅" },
    { word: "ALONE", meaning: "คนเดียว", len: 5, emoji: "🚶" },
    { word: "ALONG", meaning: "ตามทาง", len: 5, emoji: "🛤️" },
    { word: "ALTER", meaning: "แก้ไข/เปลี่ยน", len: 5, emoji: "🔧" },
    { word: "AMONG", meaning: "ท่ามกลาง", len: 5, emoji: "🌲" },
    { word: "ANGER", meaning: "ความโกรธ", len: 5, emoji: "😠" },
    { word: "ANGLE", meaning: "มุม", len: 5, emoji: "📐" },
    { word: "ANGRY", meaning: "โกรธ", len: 5, emoji: "😡" },
    { word: "APPLY", meaning: "สมัคร/ใช้", len: 5, emoji: "📝" },
    { word: "ARGUE", meaning: "โต้เถียง", len: 5, emoji: "🗣️" },
    { word: "ARISE", meaning: "เกิดขึ้น", len: 5, emoji: "🌱" },
    { word: "ARROW", meaning: "ลูกศร", len: 5, emoji: "🏹" },
    { word: "ASIDE", meaning: "ข้างๆ", len: 5, emoji: "👉" },
    { word: "ASSET", meaning: "ทรัพย์สิน", len: 5, emoji: "💰" },
    { word: "AVOID", meaning: "หลีกเลี่ยง", len: 5, emoji: "🙅" },
    { word: "AWARD", meaning: "รางวัล", len: 5, emoji: "🏆" },
    { word: "AWARE", meaning: "ตระหนัก", len: 5, emoji: "💡" },
    { word: "BASIC", meaning: "พื้นฐาน", len: 5, emoji: "🧱" },
    { word: "BASIS", meaning: "รากฐาน", len: 5, emoji: "🏛️" },
    { word: "BEACH", meaning: "ชายหาด", len: 5, emoji: "🏖️" },
    { word: "BEGIN", meaning: "เริ่ม", len: 5, emoji: "🎬" },
    { word: "BELOW", meaning: "ข้างล่าง", len: 5, emoji: "⬇️" },
    { word: "BENCH", meaning: "ม้านั่ง", len: 5, emoji: "🪑" },
    { word: "BIRTH", meaning: "เกิด", len: 5, emoji: "👶" },
    { word: "BLACK", meaning: "สีดำ", len: 5, emoji: "⚫" },
    { word: "BLAME", meaning: "ตำหนิ", len: 5, emoji: "👉" },
    { word: "BLIND", meaning: "ตาบอด", len: 5, emoji: "🕶️" },
    { word: "BLOCK", meaning: "ก้อน/บล็อก", len: 5, emoji: "🧱" },
    { word: "BLOOD", meaning: "เลือด", len: 5, emoji: "🩸" },
    { word: "BOARD", meaning: "กระดาน", len: 5, emoji: "📋" },
    { word: "BOOST", meaning: "กระตุ้น", len: 5, emoji: "🚀" },
    { word: "BRAIN", meaning: "สมอง", len: 5, emoji: "🧠" },
    { word: "BRAND", meaning: "แบรนด์", len: 5, emoji: "🏷️" },
    { word: "BRAVE", meaning: "กล้าหาญ", len: 5, emoji: "🦁" },
    { word: "BREAD", meaning: "ขนมปัง", len: 5, emoji: "🍞" },
    { word: "BREAK", meaning: "แตก/พัก", len: 5, emoji: "💔" },
    { word: "BRICK", meaning: "อิฐ", len: 5, emoji: "🧱" },
    { word: "BRIEF", meaning: "สั้นๆ/สรุป", len: 5, emoji: "🤏" },
    { word: "BRING", meaning: "นำมา", len: 5, emoji: "🤲" },
    { word: "BROAD", meaning: "กว้าง", len: 5, emoji: "↔️" },
    { word: "BROWN", meaning: "สีน้ำตาล", len: 5, emoji: "🟤" },
    { word: "BUILD", meaning: "สร้าง", len: 5, emoji: "🏗️" },
    { word: "BUNCH", meaning: "พวง/กลุ่ม", len: 5, emoji: "🍇" },
    { word: "BUYER", meaning: "ผู้ซื้อ", len: 5, emoji: "🛒" },
    { word: "CABLE", meaning: "สายเคเบิล", len: 5, emoji: "🔌" },
    { word: "CAMEL", meaning: "อูฐ", len: 5, emoji: "🐪" },
    { word: "CANAL", meaning: "คลอง", len: 5, emoji: "🛶" },
    { word: "CANDY", meaning: "ลูกอม", len: 5, emoji: "🍬" },
    { word: "CARRY", meaning: "ถือ/แบก", len: 5, emoji: "🎒" },
    { word: "CATCH", meaning: "จับ", len: 5, emoji: "🎣" },
    { word: "CAUSE", meaning: "สาเหตุ", len: 5, emoji: "🔥" },
    { word: "CHAIN", meaning: "โซ่", len: 5, emoji: "⛓️" },
    { word: "CHAIR", meaning: "เก้าอี้", len: 5, emoji: "🪑" },
    { word: "CHART", meaning: "แผนภูมิ", len: 5, emoji: "📊" },
    { word: "CHASE", meaning: "ไล่ล่า", len: 5, emoji: "🏃" },
    { word: "CHEAP", meaning: "ราคาถูก", len: 5, emoji: "🏷️" },
    { word: "CHECK", meaning: "ตรวจสอบ", len: 5, emoji: "✅" },
    { word: "CHEST", meaning: "หน้าอก/หีบ", len: 5, emoji: "🧳" },
    { word: "CHIEF", meaning: "หัวหน้า", len: 5, emoji: "👮" },
    { word: "CHILD", meaning: "เด็ก", len: 5, emoji: "🧒" },
    { word: "CIVIL", meaning: "พลเรือน", len: 5, emoji: "👥" },
    { word: "CLAIM", meaning: "อ้างสิทธิ์", len: 5, emoji: "🙋" },
    { word: "CLEAN", meaning: "สะอาด", len: 5, emoji: "✨" },
    { word: "CLEAR", meaning: "ชัดเจน", len: 5, emoji: "🔍" },
    { word: "CLIMB", meaning: "ปีน", len: 5, emoji: "🧗" },
    { word: "CLOCK", meaning: "นาฬิกา", len: 5, emoji: "⏰" },
    { word: "CLOSE", meaning: "ปิด/ใกล้", len: 5, emoji: "🔒" },
    { word: "CLOUD", meaning: "เมฆ", len: 5, emoji: "☁️" },
    { word: "COACH", meaning: "โค้ช", len: 5, emoji: "🧢" },
    { word: "COAST", meaning: "ชายฝั่ง", len: 5, emoji: "🏖️" },
    { word: "COLOR", meaning: "สี", len: 5, emoji: "🎨" },
    { word: "COMIC", meaning: "การ์ตูน", len: 5, emoji: "📚" },
    { word: "COUNT", meaning: "นับ", len: 5, emoji: "🔢" },
    { word: "COURT", meaning: "ศาล/สนาม", len: 5, emoji: "⚖️" },
    { word: "COVER", meaning: "ปกคลุม", len: 5, emoji: "⛺" },
    { word: "CRAZY", meaning: "บ้า", len: 5, emoji: "🤪" },
    { word: "CREAM", meaning: "ครีม", len: 5, emoji: "🍦" },
    { word: "CRIME", meaning: "อาชญากรรม", len: 5, emoji: "🚓" },
    { word: "CROSS", meaning: "ข้าม/กากบาท", len: 5, emoji: "❌" },
    { word: "CROWD", meaning: "ฝูงชน", len: 5, emoji: "👨‍👩‍👧‍👦" },
    { word: "CROWN", meaning: "มงกุฎ", len: 5, emoji: "👑" },
    { word: "CURVE", meaning: "เส้นโค้ง", len: 5, emoji: "↪️" },
    { word: "CYCLE", meaning: "วงจร/จักรยาน", len: 5, emoji: "🚲" },
    { word: "DAILY", meaning: "รายวัน", len: 5, emoji: "📅" },
    { word: "DANCE", meaning: "เต้น", len: 5, emoji: "💃" },
    { word: "DELAY", meaning: "ล่าช้า", len: 5, emoji: "⏳" },
    { word: "DEPTH", meaning: "ความลึก", len: 5, emoji: "🌊" },
    { word: "DIRTY", meaning: "สกปรก", len: 5, emoji: "💩" },
    { word: "DOUBT", meaning: "สงสัย", len: 5, emoji: "🤔" },
    { word: "DRAFT", meaning: "ร่างงาน", len: 5, emoji: "📝" },
    { word: "DRAMA", meaning: "ดราม่า", len: 5, emoji: "🎭" },
    { word: "DREAM", meaning: "ฝัน", len: 5, emoji: "💭" },
    { word: "DRESS", meaning: "ชุดกระโปรง", len: 5, emoji: "👗" },
    { word: "DRINK", meaning: "ดื่ม", len: 5, emoji: "🥤" },
    { word: "DRIVE", meaning: "ขับรถ", len: 5, emoji: "🚗" },
    { word: "EARLY", meaning: "แต่เช้า", len: 5, emoji: "🌅" },
    { word: "EARTH", meaning: "โลก", len: 5, emoji: "🌍" },
    { word: "EIGHT", meaning: "แปด", len: 5, emoji: "8️⃣" },
    { word: "ELITE", meaning: "ชั้นยอด", len: 5, emoji: "💎" },
    { word: "EMPTY", meaning: "ว่างเปล่า", len: 5, emoji: "🈳" },
    { word: "ENEMY", meaning: "ศัตรู", len: 5, emoji: "⚔️" },
    { word: "ENJOY", meaning: "สนุก", len: 5, emoji: "🥳" },
    { word: "ENTRY", meaning: "ทางเข้า", len: 5, emoji: "🚪" },
    { word: "EQUAL", meaning: "เท่ากัน", len: 5, emoji: "=" },
    { word: "ERROR", meaning: "ข้อผิดพลาด", len: 5, emoji: "❌" },
    { word: "EVENT", meaning: "เหตุการณ์", len: 5, emoji: "📅" },
    { word: "EVERY", meaning: "ทุกๆ", len: 5, emoji: "♾️" },
    { word: "EXACT", meaning: "แม่นยำ/เป๊ะ", len: 5, emoji: "🎯" },
    { word: "EXIST", meaning: "มีอยู่", len: 5, emoji: "👁️" },
    { word: "EXTRA", meaning: "พิเศษ", len: 5, emoji: "➕" },
    { word: "FAITH", meaning: "ศรัทธา", len: 5, emoji: "🙏" },
    { word: "FALSE", meaning: "เท็จ", len: 5, emoji: "❌" },
    { word: "FAULT", meaning: "ความผิด", len: 5, emoji: "👎" },
    { word: "FIBER", meaning: "เส้นใย", len: 5, emoji: "🧵" },
    { word: "FIELD", meaning: "สนาม/ทุ่ง", len: 5, emoji: "🏟️" },
    { word: "FIFTH", meaning: "ที่ห้า", len: 5, emoji: "5️⃣" },
    { word: "FIFTY", meaning: "ห้าสิบ", len: 5, emoji: "5️⃣0️⃣" },
    { word: "FIGHT", meaning: "ต่อสู้", len: 5, emoji: "🥊" },
    { word: "FINAL", meaning: "สุดท้าย", len: 5, emoji: "🏁" },
    { word: "FIRST", meaning: "แรก/ที่หนึ่ง", len: 5, emoji: "🥇" },
    { word: "FLAME", meaning: "เปลวไฟ", len: 5, emoji: "🔥" },
    { word: "FLESH", meaning: "เนื้อหนัง", len: 5, emoji: "🥩" },
    { word: "SENSOR", meaning: "เซนเซอร์/ตัวตรวจจับ", len: 6, emoji: "📡" },
    { word: "SCREEN", meaning: "หน้าจอ", len: 6, emoji: "🖥️" },
    { word: "BUTTON", meaning: "ปุ่ม", len: 6, emoji: "🔘" },
    { word: "BINARY", meaning: "เลขฐานสอง", len: 6, emoji: "🔢" },
    { word: "DEVICE", meaning: "อุปกรณ์", len: 6, emoji: "📱" },
    { word: "SIGNAL", meaning: "สัญญาณ", len: 6, emoji: "📶" },
    { word: "MONITOR", meaning: "จอภาพ/เฝ้าสังเกต", len: 7, emoji: "🖥️" },
    { word: "BATTERY", meaning: "แบตเตอรี่", len: 7, emoji: "🔋" },
    { word: "CIRCUIT", meaning: "วงจรไฟฟ้า", len: 7, emoji: "⚡" },
    { word: "STORAGE", meaning: "หน่วยความจำ", len: 7, emoji: "📦" },
    { word: "CONSOLE", meaning: "เครื่องเกม/คอนโซล", len: 7, emoji: "🎮" },
    { word: "KEYBOARD", meaning: "คีย์บอร์ด", len: 8, emoji: "⌨️" },
    { word: "GRAPHICS", meaning: "กราฟิก", len: 8, emoji: "🖼️" },
    { word: "SOFTWARE", meaning: "ซอฟต์แวร์", len: 8, emoji: "💾" },
    { word: "HARDWARE", meaning: "ฮาร์ดแวร์", len: 8, emoji: "⚙️" },
    { word: "INTERNET", meaning: "อินเทอร์เน็ต", len: 8, emoji: "🌐" },
    { word: "DATABASE", meaning: "ฐานข้อมูล", len: 8, emoji: "🗄️" },
    { word: "PASSWORD", meaning: "รหัสผ่าน", len: 8, emoji: "🔑" },
    { word: "SECURITY", meaning: "ความปลอดภัย", len: 8, emoji: "🛡️" },
    { word: "ALGORITHM", meaning: "อัลกอริทึม", len: 9, emoji: "📐" },
    { word: "BLUETOOTH", meaning: "บลูทูธ", len: 9, emoji: "🦷" },
    { word: "INTERFACE", meaning: "ส่วนติดต่อผู้ใช้", len: 9, emoji: "🖱️" },
    { word: "PROCESSOR", meaning: "ตัวประมวลผล", len: 9, emoji: "🧠" },
    { word: "SMARTPHONE", meaning: "สมาร์ทโฟน", len: 10, emoji: "📱" },
    { word: "MOTHERBOARD", meaning: "เมนบอร์ด", len: 11, emoji: "📟" },
    { word: "ELECTRONICS", meaning: "อิเล็กทรอนิกส์", len: 11, emoji: "🧪" },
    { word: "APPLICATION", meaning: "แอปพลิเคชัน", len: 11, emoji: "📲" },
    { word: "DEVELOPMENT", meaning: "การพัฒนา", len: 11, emoji: "🏗️" },
    { word: "PROGRAMMING", meaning: "การเขียนโปรแกรม", len: 11, emoji: "💻" },
    { word: "ARCHITECTURE", meaning: "สถาปัตยกรรม", len: 12, emoji: "🏛️" },
    { word: "INTELLIGENCE", meaning: "ความฉลาด/ปัญญา", len: 12, emoji: "🤖" },
    { word: "MICROCONTROLLER", meaning: "ไมโครคอนโทรลเลอร์", len: 15, emoji: "🔌" },
    { word: "PLAYER", meaning: "ผู้เล่น", len: 6, emoji: "🎮" },
    { word: "BRIDGE", meaning: "สะพาน", len: 6, emoji: "🌉" },
    { word: "JUNGLE", meaning: "ป่าทึบ", len: 6, emoji: "🌿" },
    { word: "HAMMER", meaning: "ค้อน", len: 6, emoji: "🔨" },
    { word: "SHIELD", meaning: "โล่", len: 6, emoji: "🛡️" },
    { word: "WEAPON", meaning: "อาวุธ", len: 6, emoji: "⚔️" },
    { word: "POTION", meaning: "ยาเพิ่มพลัง", len: 6, emoji: "🧪" },
    { word: "PORTAL", meaning: "ประตูมิติ", len: 6, emoji: "🌀" },
    { word: "COMPASS", meaning: "เข็มทิศ", len: 7, emoji: "🧭" },
    { word: "VICTORY", meaning: "ชัยชนะ", len: 7, emoji: "✌️" },
    { word: "DUNGEON", meaning: "คุกใต้ดิน", len: 7, emoji: "🗝️" },
    { word: "MONSTER", meaning: "สัตว์ประหลาด", len: 7, emoji: "👾" },
    { word: "VOLCANO", meaning: "ภูเขาไฟ", len: 7, emoji: "🌋" },
    { word: "THUNDER", meaning: "สายฟ้า", len: 7, emoji: "⚡" },
    { word: "SKELETON", meaning: "โครงกระดูก", len: 8, emoji: "💀" },
    { word: "MOUNTAIN", meaning: "ภูเขา", len: 8, emoji: "⛰️" },
    { word: "TREASURE", meaning: "ขุมทรัพย์", len: 8, emoji: "💰" },
    { word: "BACKPACK", meaning: "กระเป๋าเป้", len: 8, emoji: "🎒" },
    { word: "CHARACTER", meaning: "ตัวละคร", len: 9, emoji: "👤" },
    { word: "ADVENTURE", meaning: "การผจญภัย", len: 9, emoji: "🗺️" },
    { word: "CHALLENGE", meaning: "ความท้าทาย", len: 9, emoji: "🏆" },
    { word: "INVENTORY", meaning: "ช่องเก็บของ", len: 9, emoji: "🎒" },
    { word: "SPACESHIP", meaning: "ยานอวกาศ", len: 9, emoji: "🚀" },
    { word: "EXPERIENCE", meaning: "ประสบการณ์", len: 10, emoji: "✨" },
    { word: "MULTIPLAYER", meaning: "ผู้เล่นหลายคน", len: 11, emoji: "👥" },
    { word: "BATTLEFIELD", meaning: "สนามรบ", len: 11, emoji: "⚔️" },
    { word: "COFFEE", meaning: "กาแฟ", len: 6, emoji: "☕" },
    { word: "SCHOOL", meaning: "โรงเรียน", len: 6, emoji: "🏫" },
    { word: "FLOWER", meaning: "ดอกไม้", len: 6, emoji: "🌸" },
    { word: "WINDOW", meaning: "หน้าต่าง", len: 6, emoji: "🪟" },
    { word: "KITCHEN", meaning: "ห้องครัว", len: 7, emoji: "🍳" },
    { word: "LIBRARY", meaning: "ห้องสมุด", len: 7, emoji: "📚" },
    { word: "WEATHER", meaning: "สภาพอากาศ", len: 7, emoji: "🌦️" },
    { word: "RAINBOW", meaning: "รุ้งกินน้ำ", len: 7, emoji: "🌈" },
    { word: "BICYCLE", meaning: "จักรยาน", len: 7, emoji: "🚲" },
    { word: "BALLOON", meaning: "ลูกโป่ง", len: 7, emoji: "🎈" },
    { word: "DIAMOND", meaning: "เพชร", len: 7, emoji: "💎" },
    { word: "NOTEBOOK", meaning: "สมุดบันทึก", len: 8, emoji: "📓" },
    { word: "HOSPITAL", meaning: "โรงพยาบาล", len: 8, emoji: "🏥" },
    { word: "AIRPLANE", meaning: "เครื่องบิน", len: 8, emoji: "✈️" },
    { word: "UMBRELLA", meaning: "ร่ม", len: 8, emoji: "☂️" },
    { word: "MUSHROOM", meaning: "เห็ด", len: 8, emoji: "🍄" },
    { word: "CHICKEN", meaning: "ไก่", len: 7, emoji: "🍗" },
    { word: "DOLPHIN", meaning: "โลมา", len: 7, emoji: "🐬" },
    { word: "OCTOPUS", meaning: "ปลาหมึก", len: 7, emoji: "🐙" },
    { word: "UNIVERSE", meaning: "จักรวาล", len: 8, emoji: "🌌" },
    { word: "ASTRONAUT", meaning: "นักบินอวกาศ", len: 9, emoji: "👨‍🚀" },
    { word: "SPAGHETTI", meaning: "สปาเกตตี", len: 9, emoji: "🍝" },
    { word: "CHOCOLATE", meaning: "ช็อกโกแลต", len: 9, emoji: "🍫" },
    { word: "HAMBURGER", meaning: "แฮมเบอร์เกอร์", len: 9, emoji: "🍔" },
    { word: "STRAWBERRY", meaning: "สตรอว์เบอร์รี", len: 10, emoji: "🍓" },
    { word: "TELEVISION", meaning: "โทรทัศน์", len: 10, emoji: "📺" },
    { word: "ENVIRONMENT", meaning: "สิ่งแวดล้อม", len: 11, emoji: "🌳" },
    { word: "CELEBRATION", meaning: "การเฉลิมฉลอง", len: 11, emoji: "🎉" },
    { word: "ENERGY", meaning: "พลังงาน", len: 6, emoji: "⚡" },
    { word: "HEALTH", meaning: "สุขภาพ", len: 6, emoji: "🏥" },
    { word: "FUTURE", meaning: "อนาคต", len: 6, emoji: "🔮" },
    { word: "MEMORY", meaning: "ความจำ", len: 6, emoji: "🧠" },
    { word: "SYSTEM", meaning: "ระบบ", len: 6, emoji: "⚙️" },
    { word: "KNOWLEDGE", meaning: "ความรู้", len: 9, emoji: "📖" },
    { word: "EDUCATION", meaning: "การศึกษา", len: 9, emoji: "🎓" },
    { word: "SUCCESS", meaning: "ความสำเร็จ", len: 7, emoji: "🏆" },
    { word: "FREEDOM", meaning: "อิสรภาพ", len: 7, emoji: "🕊️" },
    { word: "FRIENDSHIP", meaning: "มิตรภาพ", len: 10, emoji: "🤝" },
    { word: "IMAGINATION", meaning: "จินตนาการ", len: 11, emoji: "💭" },
    { word: "OPPORTUNITY", meaning: "โอกาส", len: 11, emoji: "🌟" },
    { word: "COMMUNICATION", meaning: "การสื่อสาร", len: 13, emoji: "🗣️" },
    { word: "TRANSPORTATION", meaning: "การขนส่ง", len: 14, emoji: "🚚" },
    // --- RPG & FANTASY (NEW) ---
    { word: "PALADIN", meaning: "พลาดิน/อัศวินศักดิ์สิทธิ์", len: 7, emoji: "🛡️" },
    { word: "WARLOCK", meaning: "วอร์ล็อค/ผู้วิเศษสายมืด", len: 7, emoji: "🧙" },
    { word: "SORCERER", meaning: "จอมขมังเวทย์", len: 8, emoji: "🪄" },
    { word: "ASSASSIN", meaning: "มือสังหาร", len: 8, emoji: "🗡️" },
    { word: "BERSERKER", meaning: "นักรบคลั่ง", len: 9, emoji: "🪓" },
    { word: "NECROMANCER", meaning: "ผู้ปลุกศพ", len: 11, emoji: "💀" },
    { word: "ALCHEMIST", meaning: "นักเล่นแร่แปรธาตุ", len: 9, emoji: "🧪" },
    { word: "EXCALIBUR", meaning: "ดาบเอ็กซ์คาลิเบอร์", len: 9, emoji: "🗡️" },
    { word: "MJOLNIR", meaning: "ค้อนมโยลนีร์", len: 7, emoji: "🔨" },
    { word: "ARTIFACT", meaning: "โบราณวัตถุ", len: 8, emoji: "🏺" },
    { word: "AMULET", meaning: "เครื่องราง", len: 6, emoji: "🧿" },
    { word: "POTION", meaning: "ยาโพชั่น", len: 6, emoji: "🧪" },
    { word: "ELIXIR", meaning: "ยาอายุวัฒนะ", len: 6, emoji: "🍶" },
    { word: "DUNGEON", meaning: "คุกใต้ดิน", len: 7, emoji: "🗝️" },
    { word: "LABYRINTH", meaning: "เขาวงกต", len: 9, emoji: "🌀" },
    { word: "SANCTUARY", meaning: "วิหารศักดิ์สิทธิ์", len: 9, emoji: "🏛️" },
    { word: "CITADEL", meaning: "ป้อมปราการ", len: 7, emoji: "🏰" },
    { word: "VILLAIN", meaning: "ตัวร้าย", len: 7, emoji: "🦹" },
    { word: "PHOENIX", meaning: "ฟีนิกซ์", len: 7, emoji: "🐦‍🔥" },
    { word: "GRIFFIN", meaning: "กริฟฟิน", len: 7, emoji: "🦁" },
    { word: "VALKYRIE", meaning: "วาลคิรี", len: 8, emoji: "🛡️" },
    { word: "RAGNAROK", meaning: "วันสิ้นโลกดินแดนเทพ", len: 8, emoji: "🌋" },
    { word: "TITAN", meaning: "ยักษ์ไททัน", len: 5, emoji: "🗿" },
    { word: "GOLEM", meaning: "โกเล็ม", len: 5, emoji: "🧱" },
    { word: "SKELETON", meaning: "โครงกระดูก", len: 8, emoji: "💀" },
    { word: "VAMPIRE", meaning: "แวมไพร์", len: 7, emoji: "🧛" },
    { word: "WEREWOLF", meaning: "มนุษย์หมาป่า", len: 8, emoji: "🐺" },
    { word: "BANSHEE", meaning: "วิญญาณโหยหวน", len: 7, emoji: "👻" },
    { word: "KRAKEN", meaning: "คราเคน/ปลาหมึกยักษ์", len: 6, emoji: "🦑" },
    { word: "HYDRA", meaning: "ไฮดรา", len: 5, emoji: "🐍" },
    { word: "CHIMERA", meaning: "คิเมร่า", len: 7, emoji: "🦁" },
    { word: "CERBERUS", meaning: "เชอร์เบอรัส", len: 8, emoji: "🐕" },
    { word: "PEGASUS", meaning: "เพกาซัส", len: 7, emoji: "🦄" },
    { word: "UNICORN", meaning: "ยูนิคอร์น", len: 7, emoji: "🦄" },
    { word: "CENTAUR", meaning: "เซนทอร์", len: 7, emoji: "🏹" },
    { word: "MINOTAUR", meaning: "มิโนทอร์", len: 8, emoji: "🐂" },
    { word: "LEVIATHAN", meaning: "เลวีอาธาน", len: 9, emoji: "🐋" },
    { word: "BEHEMOTH", meaning: "เบฮีมอธ", len: 8, emoji: "🐘" },
    { word: "ETERNITY", meaning: "นิรันดร์", len: 8, emoji: "♾️" },
    { word: "PARADISE", meaning: "สวรรค์", len: 8, emoji: "🌤️" },
    { word: "INFERNO", meaning: "ขุมนรกไฟ", len: 7, emoji: "🔥" },
    { word: "ABYSS", meaning: "เหวลิขิต", len: 5, emoji: "🕳️" },
    { word: "VOID", meaning: "ความว่างเปล่า", len: 4, emoji: "🌑" },
    { word: "DIMENSION", meaning: "มิติ", len: 9, emoji: "🌀" },
    { word: "PORTAL", meaning: "ประตูมิติ", len: 6, emoji: "🌀" },
    { word: "TALISMAN", meaning: "เครื่องรางนำโชค", len: 8, emoji: "🧧" },
    { word: "GRIMOIRE", meaning: "ตำราเวทย์", len: 8, emoji: "📖" },
    { word: "STAFF", meaning: "ไม้เท้า", len: 5, emoji: "🪄" },
    { word: "WAND", meaning: "ไม้กายสิทธิ์", len: 4, emoji: "🪄" },
    { word: "ORB", meaning: "ลูกแก้ว", len: 3, emoji: "🔮" },
    { word: "RUNE", meaning: "อักษรรูน", len: 4, emoji: "📜" },
    { word: "SPELL", meaning: "คาถา", len: 5, emoji: "✨" },
    { word: "CURSE", meaning: "คำสาป", len: 5, emoji: "👿" },
    { word: "BLESSING", meaning: "คำอวยพร", len: 8, emoji: "🙏" },
    { word: "MIRACLE", meaning: "ปาฏิหาริย์", len: 7, emoji: "✨" },
    { word: "FAITH", meaning: "ศรัทธา", len: 5, emoji: "⛪" },
    { word: "HONOR", meaning: "เกียรติยศ", len: 5, emoji: "🎖️" },
    { word: "GLORY", meaning: "ความรุ่งโรจน์", len: 5, emoji: "🌟" },
    { word: "LEGEND", meaning: "ตำนาน", len: 6, emoji: "📜" },
    { word: "MYTH", meaning: "เรื่องเล่าขาน", len: 4, emoji: "🐉" },
    { word: "HEROISM", meaning: "ความกล้าหาญ", len: 7, emoji: "🦸" },
    { word: "BRAVERY", meaning: "ความอาจหาญ", len: 7, emoji: "🦁" },
    { word: "VICTORY", meaning: "ชัยชนะ", len: 7, emoji: "🏆" },
    { word: "DEFEAT", meaning: "ความพ่ายแพ้", len: 6, emoji: "🏳️" },
    { word: "REVENGE", meaning: "การแก้แค้น", len: 7, emoji: "🗡️" },
    { word: "JUSTICE", meaning: "ความยุติธรรม", len: 7, emoji: "⚖️" },
    { word: "FORGE", meaning: "เตาหลอม", len: 5, emoji: "⚒️" },
    { word: "HAMMER", meaning: "ค้อน", len: 6, emoji: "🔨" },
    { word: "ANVIL", meaning: "ทั่ง", len: 5, emoji: "⚒️" },
    { word: "QUIVER", meaning: "ซองธนู", len: 6, emoji: "🏹" },
    { word: "SCABBARD", meaning: "ฝักดาบ", len: 8, emoji: "🗡️" },
    { word: "BATTLEAXE", meaning: "ขวานศึก", len: 9, emoji: "🪓" },
    { word: "CROSSBOW", meaning: "หน้าไม้", len: 8, emoji: "🏹" },
    { word: "HALBERD", meaning: "ง้าว", len: 7, emoji: "🔱" },
    { word: "JAVELIN", meaning: "หอกพุ่ง", len: 7, emoji: "🔱" },
    { word: "GAUNTLET", meaning: "ถุงมือเหล็ก", len: 8, emoji: "🧤" },
    { word: "HELMET", meaning: "หมวกเหล็ก", len: 6, emoji: "🪖" },
    { word: "BRACER", meaning: "สนับแขน", len: 6, emoji: "🛡️" },
    { word: "GREAVES", meaning: "สนับขา", len: 7, emoji: "🛡️" },
    { word: "BREASTPLATE", meaning: "เกราะอก", len: 11, emoji: "🛡️" },
    { word: "CHAINMAIL", meaning: "ชุดเกราะโซ่", len: 9, emoji: "⛓️" },
    { word: "THRONE", meaning: "บัลลังก์", len: 6, emoji: "👑" },
    { word: "SCEPTRE", meaning: "คทา", len: 7, emoji: "🪄" },
    { word: "EMPIRE", meaning: "อาณาจักร/จักรวรรดิ", len: 6, emoji: "🗺️" },
    { word: "KINGDOM", meaning: "ราชอาณาจักร", len: 7, emoji: "🏰" },
    { word: "DYNASTY", meaning: "ราชวงศ์", len: 7, emoji: "👑" },
    { word: "TREASURE", meaning: "ขุมทรัพย์", len: 8, emoji: "💰" },
    { word: "CHEST", meaning: "หีบ", len: 5, emoji: "📦" },
    { word: "LOOT", meaning: "ของดรอป", len: 4, emoji: "💰" },
    { word: "EXPEDITION", meaning: "การสำรวจ", len: 10, emoji: "🧭" },
    { word: "WARRIOR", meaning: "นักรบ", len: 7, emoji: "⚔️" },
    { word: "KNIGHT", meaning: "อัศวิน", len: 6, emoji: "🛡️" },
    { word: "SQUIRE", meaning: "อัศวินฝึกหัด", len: 6, emoji: "👦" },
    { word: "ARCHER", meaning: "มือธนู", len: 6, emoji: "🏹" },
    { word: "RANGER", meaning: "พรานป่า", len: 6, emoji: "🏹" },
    { word: "DRUID", meaning: "ผู้วิเศษแห่งป่า", len: 5, emoji: "🌿" },
    { word: "SHAMAN", meaning: "หมอผี", len: 6, emoji: "👹" },
    { word: "PRIEST", meaning: "นักบวช", len: 6, emoji: "⛪" },
    { word: "CLERIC", meaning: "นักบวชสายเวทย์", len: 6, emoji: "🛐" },
    { word: "BARD", meaning: "นักกวีดนตรี", len: 4, emoji: "🪕" },
    { word: "THIEF", meaning: "ขโมย", len: 5, emoji: "🥷" },
    { word: "ROGUE", meaning: "โจร", len: 5, emoji: "🗡️" },
    { word: "NINJA", meaning: "นินจา", len: 5, emoji: "🥷" },
    { word: "SAMURAI", meaning: "ซามูไร", len: 7, emoji: "⚔️" },
    { word: "VIKING", meaning: "ไวกิ้ง", len: 6, emoji: "🪓" },
    { word: "PIRATE", meaning: "โจรสลัด", len: 6, emoji: "🏴‍☠️" },
    { word: "BUCCANEER", meaning: "โจรสลัดทะเลแคริบเบียน", len: 9, emoji: "🦜" },
    { word: "CORSAIR", meaning: "โจรสลัดรับจ้าง", len: 7, emoji: "⛵" },
    { word: "GLADIATOR", meaning: "นักสู้กลาดิเอเตอร์", len: 9, emoji: "🏟️" },
    { word: "SPARTAN", meaning: "นักรบสปาร์ตัน", len: 7, emoji: "🛡️" },
    { word: "CENTURION", meaning: "แม่ทัพโรมัน", len: 9, emoji: "🏛️" },
    { word: "LEGION", meaning: "กองทหารโรมัน", len: 6, emoji: "🎖️" },
    { word: "CAVALRY", meaning: "กองทหารม้า", len: 7, emoji: "🐎" },
    { word: "INFANTRY", meaning: "กองทหารราบ", len: 8, emoji: "🥾" },
    { word: "ARTILLERY", meaning: "กองทหารปืนใหญ่", len: 9, emoji: "💣" },
    { word: "SIEGE", meaning: "การล้อมล้อม", len: 5, emoji: "🏰" },
    { word: "CATAPULT", meaning: "เครื่องยิงหิน", len: 8, emoji: "☄️" },
    { word: "BALLISTA", meaning: "เครื่องยิงธนูยักษ์", len: 8, emoji: "🏹" },
    { word: "TREBUCHET", meaning: "เครื่องยิงหินวิถีโค้ง", len: 9, emoji: "🏗️" },
    { word: "RAMPART", meaning: "กำแพงเมือง", len: 7, emoji: "🧱" },
    { word: "BATTLEMENT", meaning: "เชิงเทิน", len: 10, emoji: "🏰" },
    { word: "DRAWBRIDGE", meaning: "สะพานยก", len: 10, emoji: "🌉" },
    { word: "MOAT", meaning: "คูเมือง", len: 4, emoji: "🌊" },
    { word: "DUNGEON", meaning: "คุกใต้ดิน", len: 7, emoji: "⛓️" },
    { word: "KEEP", meaning: "หอคอยส่วนใน", len: 4, emoji: "🏰" },
    { word: "TOWER", meaning: "หอคอย", len: 5, emoji: "🗼" },
    { word: "GATEHOUSE", meaning: "ป้อมประตู", len: 9, emoji: "🏯" },
    { word: "FLAGSHIP", meaning: "เรือธง", len: 8, emoji: "🚩" },
    { word: "GALLEON", meaning: "เรือใบใหญ่", len: 7, emoji: "⛵" },
    { word: "FRIGATE", meaning: "เรือรบ", len: 7, emoji: "🚢" },
    { word: "CARAVEL", meaning: "เรือใบขนาดเล็ก", len: 7, emoji: "🛶" },
    { word: "JUNTO", meaning: "กลุ่มผู้ปกครอง", len: 5, emoji: "👥" },
    { word: "SULTAN", meaning: "สุลต่าน", len: 6, emoji: "👳" },
    { word: "CALIPH", meaning: "กาหลิบ", len: 6, emoji: "🕌" },
    { word: "EMPEROR", meaning: "จักรพรรดิ", len: 7, emoji: "👑" },
    { word: "CZAR", meaning: "ซาร์", len: 4, emoji: "❄️" },
    { word: "MONARCH", meaning: "กษัตริย์", len: 7, emoji: "👑" },
    { word: "REGENT", meaning: "ผู้สำเร็จราชการ", len: 6, emoji: "🏛️" },
    { word: "VICEROY", meaning: "อุปราช", len: 7, emoji: "👑" },
    { word: "DYNASTY", meaning: "ราชวงศ์", len: 7, emoji: "🛡️" },
    { word: "ARISTOCRAT", meaning: "ขุนนาง/ชนชั้นสูง", len: 10, emoji: "🤵" },
    { word: "NOBLE", meaning: "ขุนนาง", len: 5, emoji: "🎖️" },
    { word: "DUKE", meaning: "ดยุก", len: 4, emoji: "🏰" },
    { word: "COUNT", meaning: "เคานต์", len: 5, emoji: "🦇" },
    { word: "BARON", meaning: "บารอน", len: 5, emoji: "🎩" },
    { word: "PEASANT", meaning: "ชาวนา/คนยากจน", len: 7, emoji: "🌾" },
    { word: "SERF", meaning: "ทาส", len: 4, emoji: "⛓️" },
    { word: "CITIZEN", meaning: "พลเมือง", len: 7, emoji: "🏘️" },
    { word: "DENIZEN", meaning: "ผู้อยู่อาศัย", len: 7, emoji: "🏠" },
    { word: "OUTLAW", meaning: "คนนอกกฎหมาย", len: 6, emoji: "🤠" },
    { word: "RENEGADE", meaning: "ผู้ทรยศ", len: 8, emoji: "🚩" },
    { word: "TRAITOR", meaning: "คนทรยศ", len: 7, emoji: "🗡️" },
    { word: "MERCENARY", meaning: "ทหารรับจ้าง", len: 9, emoji: "💵" },
    { word: "BOUNTY", meaning: "ค่าหัว", len: 6, emoji: "🏷️" },
    { word: "REWARD", meaning: "รางวัล", len: 6, emoji: "🎁" },
    { word: "CONTRACT", meaning: "สัญญา", len: 8, emoji: "📜" },
    { word: "ALLIANCE", meaning: "พันธมิตร", len: 8, emoji: "🌐" },
    { word: "FACTION", meaning: "ฝ่าย", len: 7, emoji: "🚩" },
    { word: "COALITION", meaning: "กลุ่มพันธมิตร", len: 9, emoji: "🤝" },
    { word: "FEDERATION", meaning: "สหพันธ์", len: 10, emoji: "🗺️" },
    { word: "REPUBLIC", meaning: "สาธารณรัฐ", len: 8, emoji: "🏛️" },
    { word: "DEMOCRACY", meaning: "ประชาธิปไตย", len: 9, emoji: "🗽" },
    { word: "ANARCHY", meaning: "อนาธิปไตย", len: 7, emoji: "🏴" },
    { word: "TYRANNY", meaning: "ทรราชย์", len: 7, emoji: "⛓️" },
    { word: "DICTATOR", meaning: "เผด็จการ", len: 8, emoji: "🤵" },
    { word: "OPPRESSION", meaning: "การกดขี่", len: 10, emoji: "⛓️" },
    { word: "LIBERATION", meaning: "การปลดปล่อย", len: 10, emoji: "🕊️" },
    { word: "REVOLUTION", meaning: "การปฏิวัติ", len: 10, emoji: "🔥" },
    { word: "UPRISING", meaning: "การลุกฮือ", len: 8, emoji: "🚩" },
    { word: "REBELLION", meaning: "การกบฏ", len: 9, emoji: "✊" },
    { word: "INSURGENT", meaning: "ผู้ขัดขืน", len: 9, emoji: "🚩" },
    { word: "STRIKE", meaning: "การโจมตี/นัดหยุดงาน", len: 6, emoji: "✊" },
    { word: "OFFENSIVE", meaning: "การบุกโจมตี", len: 9, emoji: "💥" },
    { word: "DEFENSIVE", meaning: "การป้องกัน", len: 9, emoji: "🛡️" },
    { word: "TACTIC", meaning: "ยุทธวิธี", len: 6, emoji: "🧠" },
    { word: "STRATEGY", meaning: "กลยุทธ์", len: 8, emoji: "♟️" },
    { word: "LOGISTICS", meaning: "โลจิสติกส์", len: 9, emoji: "🚚" },
    { word: "SUPPLY", meaning: "เสบียง/จัดหา", len: 6, emoji: "📦" },
    { word: "RATION", meaning: "ปันส่วนอาหาร", len: 6, emoji: "🍱" },
    { word: "MARCH", meaning: "การเดินทัพ", len: 5, emoji: "🥾" },
    { word: "PARADE", meaning: "พาเหรด", len: 6, emoji: "🎺" },
    { word: "CEREMONY", meaning: "พิธีกรรม", len: 8, emoji: "⛪" },
    { word: "RITUAL", meaning: "พิธีกรรมทางศาสนา", len: 6, emoji: "🪄" },
    { word: "SACRIFICE", meaning: "การเสียสละ/เซ่นสรวง", len: 9, emoji: "🙏" },
    { word: "OFFERING", meaning: "เครื่องเซ่น", len: 8, emoji: "🏺" },
    { word: "ALTAR", meaning: "แท่นบูชา", len: 5, emoji: "🛐" },
    { word: "SHRINE", meaning: "ศาลเจ้า", len: 6, emoji: "⛩️" },
    { word: "CATHEDRAL", meaning: "อาสนวิหาร", len: 9, emoji: "⛪" },
    { word: "MONASTERY", meaning: "อาราม", len: 9, emoji: "🕍" },
    { word: "NUNNERY", meaning: "สำนักแม่ชี", len: 7, emoji: "✝️" },
    { word: "ABBEY", meaning: "สำนักสงฆ์", len: 5, emoji: "🕍" },
    { word: "PRAYER", meaning: "การสวดมนต์", len: 6, emoji: "🙏" },
    { word: "HYMN", meaning: "เพลงสวด", len: 4, emoji: "🎵" },
    { word: "PSALM", meaning: "บทเพลงสดุดี", len: 5, emoji: "📖" },
    { word: "GOSPEL", meaning: "พระวรสาร", len: 6, emoji: "⛪" },
    { word: "SERMON", meaning: "คำเทศนา", len: 6, emoji: "🗣️" },
    { word: "PROPHECY", meaning: "คำพยากรณ์", len: 8, emoji: "🔮" },
    { word: "ORACLE", meaning: "เทพพยากรณ์", len: 6, emoji: "👁️" },
    { word: "DIVINATION", meaning: "การทำนายดวง", len: 10, emoji: "🔮" },
    { word: "AUGURY", meaning: "ลางบอกเหตุ", len: 6, emoji: "🦅" },
    { word: "OMEN", meaning: "ลางร้าย/ดี", len: 4, emoji: "🌑" },
    { word: "CURSE", meaning: "คำสาปแช่ง", len: 5, emoji: "👿" },
    { word: "JINX", meaning: "ตัวซวย", len: 4, emoji: "🐈‍⬛" },
    { word: "CHARM", meaning: "เวทมนตร์เสน่ห์/เครื่องราง", len: 5, emoji: "✨" },
    { word: "HEX", meaning: "คำสาป", len: 3, emoji: "🧙" },
    { word: "EVOCATION", meaning: "การอัญเชิญ", len: 9, emoji: "🪄" },
    { word: "CONJURATION", meaning: "เวทมนตร์อัญเชิญ", len: 11, emoji: "✨" },
    { word: "ILLUSION", meaning: "ภาพลวงตา", len: 8, emoji: "🌀" },
    { word: "PHANTOM", meaning: "เงาหลอน/ปีศาจ", len: 7, emoji: "👻" },
    { word: "SPECTRE", meaning: "วิญญาณ", len: 7, emoji: "👻" },
    { word: "APPARITION", meaning: "การปรากฏร่างวิญญาณ", len: 10, emoji: "✨" },
    { word: "REPARTEE", meaning: "การโต้ตอบด้วยปัญญา", len: 8, emoji: "🗣️" },
    { word: "DIALOGUE", meaning: "บทสนทนา", len: 8, emoji: "💬" },
    { word: "MONOLOGUE", meaning: "บทพูดคนเดียว", len: 9, emoji: "🎤" },
    { word: "SOLILOQUY", meaning: "การพูดกับตัวเอง", len: 9, emoji: "🙍" },
    { word: "ELOQUENCE", meaning: "วาทศิลป์", len: 9, emoji: "🗣️" },
    { word: "RHETORIC", meaning: "วาทศาสตร์", len: 8, emoji: "📢" },
    { word: "PERSUASION", meaning: "การโน้มน้าว", len: 10, emoji: "💡" },
    { word: "DEBATE", meaning: "การโต้วาที", len: 6, emoji: "🏟️" },
    { word: "DISCOURSE", meaning: "การบรรยาย/สนทนา", len: 9, emoji: "📖" },
    { word: "NARRATIVE", meaning: "การเล่าเรื่อง", len: 9, emoji: "📖" },
    { word: "CHRONICLE", meaning: "พงศาวดาร/บันทึก", len: 9, emoji: "📜" },
    { word: "ARCHIVE", meaning: "หอจดหมายเหตุ/คลังเก็บ", len: 7, emoji: "📁" },
    { word: "MANUSCRIPT", meaning: "ต้นฉบับลายมือ", len: 10, emoji: "✍️" },
    { word: "SCROLL", meaning: "ม้วนคัมภีร์", len: 6, emoji: "📜" },
    { word: "PARCHMENT", meaning: "กระดาษหนัง", len: 9, emoji: "📄" },
    { word: "PAPYRUS", meaning: "กระดาษปาปิรัส", len: 7, emoji: "🌿" },
    { word: "TABLET", meaning: "แผ่นจารึก/แท็บเล็ต", len: 6, emoji: "🧱" },
    { word: "INSCRIPTION", meaning: "คำจารึก", len: 11, emoji: "🖋️" },
    { word: "EPITAPH", meaning: "คำจารึกหน้าหลุมศพ", len: 7, emoji: "🪦" },
    { word: "EULOGY", meaning: "คำไว้อาลัย", len: 6, emoji: "🎙️" },
    { word: "TRIBUTE", meaning: "เครื่องบรรณาการ", len: 7, emoji: "🏺" },
    { word: "HOMAGE", meaning: "การแสดงความเคารพ", len: 6, emoji: "🙇" },
    { word: "ALLEGIANCE", meaning: "ความจงรักภักดี", len: 10, emoji: "🫡" },
    { word: "FEALTY", meaning: "ความซื่อสัตย์ต่อเจ้านาย", len: 6, emoji: "🤝" },
    { word: "VASSAL", meaning: "ผู้อยู่ใต้บังคับบัญชา", len: 6, emoji: "🛡️" },
    { word: "FIEF", meaning: "ที่ดินศักดินา", len: 4, emoji: "🌾" },
    { word: "MANOR", meaning: "ที่ดินขุนนาง", len: 5, emoji: "🏠" },
    { word: "ESTATE", meaning: "อสังหาริมทรัพย์", len: 6, emoji: "🏡" },
    { word: "DOMAIN", meaning: "อาณาเขต/โดเมน", len: 6, emoji: "🌐" },
    { word: "TERRITORY", meaning: "ดินแดน", len: 9, emoji: "🗺️" },
    { word: "REGION", meaning: "ภูมิภาค", len: 6, emoji: "📐" },
    { word: "PROVINCE", meaning: "จังหวัด/แขวง", len: 8, emoji: "🏘️" },
    { word: "COUNTY", meaning: "เขตปกครอง", len: 6, emoji: "📍" },
    { word: "DISTRICT", meaning: "อำเภอ/เขต", len: 8, emoji: "🏢" },
    { word: "PRECINCT", meaning: "ท้องที่/เขตสถานีตำรวจ", len: 8, emoji: "👮" },
    { word: "WARD", meaning: "วอร์ด/เขตเลือกตั้ง", len: 4, emoji: "🏥" },
    { word: "PARISH", meaning: "เขตศาสนจักร", len: 6, emoji: "⛪" },
    { word: "BOROUGH", meaning: "เขตเทศบาล", len: 7, emoji: "🏘️" },
    { word: "METROPOLIS", meaning: "มหานคร", len: 10, emoji: "🏙️" },
    { word: "CITADEL", meaning: "ป้อมเมือง", len: 7, emoji: "🏰" },
    { word: "FORTRESS", meaning: "ป้อมปราการ", len: 8, emoji: "🛡️" },
    { word: "GARRISON", meaning: "กองทหารรักษาการณ์", len: 8, emoji: "💂" },
    { word: "OUTPOST", meaning: "ด่านหน้า", len: 7, emoji: "🔭" },
    { word: "FRONTIER", meaning: "ชายแดน/พรมแดน", len: 8, emoji: "🤠" },
    { word: "BORDER", meaning: "ชายแดน", len: 6, emoji: "🚧" },
    { word: "BOUNDARY", meaning: "เขตแดน", len: 8, emoji: "📐" },
    { word: "LIMIT", meaning: "ขีดจำกัด", len: 5, emoji: "🛑" },
    { word: "THRESHOLD", meaning: "ธรณีประตู/เกณฑ์", len: 9, emoji: "🚪" },
    { word: "VERGE", meaning: "ริม/ขอบ", len: 5, emoji: "🌿" },
    { word: "BRINK", meaning: "ริมตลิ่ง/ขอบเหว", len: 5, emoji: "🕳️" },
    { word: "MARGIN", meaning: "เส้นขอบ", len: 6, emoji: "📐" },
    { word: "PERIPHERY", meaning: "รอบนอก", len: 9, emoji: "🔭" },
    { word: "HORIZON", meaning: "เส้นขอบฟ้า", len: 7, emoji: "🌅" },
    { word: "ZENITH", meaning: "จุดสูงสุดเหนือศีรษะ", len: 6, emoji: "☀️" },
    { word: "APOGEE", meaning: "จุดไกลสุดของวงโคจร", len: 6, emoji: "🪐" },
    { word: "NADIR", meaning: "จุดต่ำสุด", len: 5, emoji: "🌑" },
    { word: "SUMMIT", meaning: "ยอดเขา", len: 6, emoji: "🏔️" },
    { word: "HEIGHT", meaning: "ความสูง", len: 6, emoji: "📏" },
    { word: "ALTITUDE", meaning: "ระดับความสูง", len: 8, emoji: "✈️" },
    { word: "ELEVATION", meaning: "การยกระดับ", len: 9, emoji: "📈" },
    { word: "ASCENT", meaning: "การขึ้น", len: 6, emoji: "🧗" },
    { word: "DESCENT", meaning: "การลง", len: 7, emoji: "🪂" },
    { word: "CLIMB", meaning: "ปีน", len: 5, emoji: "🧗" },
    { word: "SCALE", meaning: "มาตราส่วน/ตาชั่ง", len: 5, emoji: "⚖️" },
    { word: "MOUNT", meaning: "ภูเขา/ขึ้นขี่", len: 5, emoji: "⛰️" },
    { word: "PEAL", meaning: "เสียงดังกังวาน", len: 4, emoji: "🔔" },
    { word: "ECHO", meaning: "เสียงสะท้อน", len: 4, emoji: "🗣️" },
    { word: "RESONANCE", meaning: "ความกังวาน/การสั่นพ้อง", len: 9, emoji: "🎻" },
    { word: "VIBRATION", meaning: "การสั่นสะเทือน", len: 9, emoji: "📳" },
    { word: "OSCILLATION", meaning: "การแกว่ง", len: 11, emoji: "⏳" },
    { word: "FREQUENCY", meaning: "ความถี่", len: 9, emoji: "📶" },
    { word: "AMPLITUDE", meaning: "แอมพลิจูด", len: 9, emoji: "📈" },
    { word: "WAVELENGTH", meaning: "ความยาวคลื่น", len: 10, emoji: "🌊" },
    { word: "SPECTRUM", meaning: "สเปกตรัม", len: 8, emoji: "🌈" },
    { word: "RAINBOW", meaning: "รุ้งกินน้ำ", len: 7, emoji: "🌈" },
    { word: "PRISM", meaning: "ปริซึม", len: 5, emoji: "💎" },
    { word: "LUSTER", meaning: "ความเงางาม", len: 6, emoji: "✨" },
    { word: "GLIMMER", meaning: "การริบหรี่", len: 7, emoji: "🌟" },
    { word: "SHIMMER", meaning: "การแวววาว", len: 7, emoji: "✨" },
    { word: "SPARKLE", meaning: "การเป็นประกาย", len: 7, emoji: "✨" },
    { word: "GLARE", meaning: "แสงจ้า", len: 5, emoji: "😎" },
    { word: "GLAZE", meaning: "น้ำยาเคลือบ", len: 5, emoji: "🏺" },
    { word: "SHADOW", meaning: "เงา", len: 6, emoji: "👤" },
    { word: "SILHOUETTE", meaning: "ภาพเงา", len: 10, emoji: "🌑" },
    { word: "ECLIPSE", meaning: "สุริยุปราคา", len: 7, emoji: "🌑" },
    { word: "CORONA", meaning: "คอโรนา(แสงรอบดวงอาทิตย์)", len: 6, emoji: "☀️" },
    { word: "HALO", meaning: "รัศมี", len: 4, emoji: "😇" },
    { word: "AURA", meaning: "ออร่า", len: 4, emoji: "✨" },
    { word: "GLOW", meaning: "การวาวแสง", len: 4, emoji: "🌟" },
    { word: "BEAM", meaning: "ลำแสง", len: 4, emoji: "🔦" },
    { word: "RAY", meaning: "แสงสี/รังสี", len: 3, emoji: "☀️" },
    { word: "STREAM", meaning: "ลำธาร/สตรีมเมอร์", len: 6, emoji: "🌊" },
    { word: "CURRENT", meaning: "กระแสน้ำ/ปัจจุบัน", len: 7, emoji: "🌊" },
    { word: "TIDE", meaning: "น้ำขึ้นน้ำลง", len: 4, emoji: "🌊" },
    { word: "SURGE", meaning: "การพุ่งขึ้น", len: 5, emoji: "📈" },
    { word: "SWELL", meaning: "การบวม/คลื่นใหญ่", len: 5, emoji: "🏢" },
    { word: "RIPPLE", meaning: "ระลอกคลื่น", len: 6, emoji: "💦" },
    { word: "VORTEX", meaning: "น้ำวน", len: 6, emoji: "🌀" },
    { word: "CYCLONE", meaning: "ไซโคลน", len: 7, emoji: "🌪️" },
    { word: "TYPHOON", meaning: "ไต้ฝุ่น", len: 7, emoji: "🌀" },
    { word: "HURRICANE", meaning: "ฮอริเคน", len: 9, emoji: "⛈️" },
    { word: "TORNADO", meaning: "ทอร์นาโด", len: 7, emoji: "🌪️" },
    { word: "TWISTER", meaning: "พายุหมุน", len: 7, emoji: "🌪️" },
    { word: "ZEPHYR", meaning: "สายลมอ่อนๆ", len: 6, emoji: "🍃" },
    { word: "GALE", meaning: "ลมพายุ", len: 4, emoji: "🌬️" },
    { word: "BREEZE", meaning: "ลมโชย", len: 6, emoji: "🎏" },
    { word: "WHIFF", meaning: "กลิ่นลอยมา", len: 5, emoji: "👃" },
    { word: "SCENT", meaning: "กลิ่นหอม", len: 5, emoji: "🌸" },
    { word: "AROMA", meaning: "กลิ่นอายความหอม", len: 5, emoji: "☕" },
    { word: "FRAGRANCE", meaning: "น้ำหอม/กลิ่นหอม", len: 9, emoji: "🧴" },
    { word: "PARFUM", meaning: "น้ำหอมแท้", len: 6, emoji: "🧴" },
    { word: "ESSENCE", meaning: "สารสกัด/หัวใจสำคัญ", len: 7, emoji: "🧪" },
    { word: "EXTRACT", meaning: "สารสกัด", len: 7, emoji: "⚗️" },
    { word: "ALCHEMY", meaning: "การเล่นแร่แปรธาตุ", len: 7, emoji: "⚗️" },
    { word: "CHEMISTRY", meaning: "เคมี", len: 9, emoji: "🧪" },
    { word: "BIOLOGY", meaning: "ชีววิทยา", len: 7, emoji: "🧬" },
    { word: "PHYSICS", meaning: "ฟิสิกส์", len: 7, emoji: "⚛️" },
    { word: "GEOLOGY", meaning: "ธรณีวิทยา", len: 7, emoji: "🪨" },
    { word: "ASTRONOMY", meaning: "ดาราศาสตร์", len: 9, emoji: "🔭" },
    { word: "ECOLOGY", meaning: "นิเวศวิทยา", len: 7, emoji: "🌍" },
    { word: "BOTANY", meaning: "พฤกษศาสตร์", len: 6, emoji: "🌱" },
    { word: "ZOOLOGY", meaning: "สัตววิทยา", len: 7, emoji: "🦁" },
    { word: "ANATOMY", meaning: "กายวิภาคศาสตร์", len: 7, emoji: "🦴" },
    { word: "GENETICS", meaning: "พันธุศาสตร์", len: 8, emoji: "🧬" },
    { word: "QUANTUM", meaning: "ควอนตัม", len: 7, emoji: "⚛️" },
    { word: "GRAVITY", meaning: "แรงโน้มถ่วง", len: 7, emoji: "🍎" },
    { word: "RELATIVITY", meaning: "สัมพัทธภาพ", len: 10, emoji: "⏳" },
    { word: "ENTROPY", meaning: "เอนโทรปี/ความโกลาหล", len: 7, emoji: "🌀" },
    { word: "SYNERGY", meaning: "การประสานพลัง", len: 7, emoji: "🤝" },
    { word: "DYNAMIC", meaning: "แบบไดนามิก/คล่องตัว", len: 7, emoji: "🏃" },
    { word: "KINETIC", meaning: "พลังงานจลน์", len: 7, emoji: "🏎️" },
    { word: "POTENTIAL", meaning: "ศักยภาพ", len: 9, emoji: "🌟" },
    { word: "MOMENTUM", meaning: "โมเมนตัม", len: 8, emoji: "🚂" },
    { word: "VELOCITY", meaning: "ความเร็ววิถี", len: 8, emoji: "🚀" },
    { word: "ACCELERATE", meaning: "เร่งความเร็ว", len: 10, emoji: "🏎️" },
    { word: "DECELERATE", meaning: "ลดความเร็ว", len: 10, emoji: "🛑" },
    { word: "FRICTION", meaning: "แรงเสียดทาน", len: 8, emoji: "🔥" },
    { word: "TRACTION", meaning: "การยึดเกาะ", len: 8, emoji: "🚜" },
    { word: "TENSION", meaning: "ความตึงเครียด", len: 7, emoji: "😰" },
    { word: "PRESSURE", meaning: "ความกดดัน", len: 8, emoji: "🌡️" },
    { word: "VACUUM", meaning: "สุญญากาศ", len: 6, emoji: "🌑" },
    { word: "DENSITY", meaning: "ความหนาแน่น", len: 7, emoji: "⚖️" },
    { word: "VOLUME", meaning: "ปริมาตร/ระดับเสียง", len: 6, emoji: "🔊" },
    { word: "CAPACITY", meaning: "ความจุ", len: 8, emoji: "🔋" },
    { word: "EFFICIENCY", meaning: "ประสิทธิภาพ", len: 10, emoji: "⚡" },
    { word: "OPTIMIZE", meaning: "ปรับปรุงให้ดีสุด", len: 8, emoji: "🛠️" },
    { word: "MAXIMIZE", meaning: "ทำให้มากที่สุด", len: 8, emoji: "📈" },
    { word: "MINIMIZE", meaning: "ให้น้อยที่สุด", len: 8, emoji: "📉" },
    { word: "BALANCE", meaning: "สมดุล", len: 7, emoji: "⚖️" },
    { word: "STABILITY", meaning: "เสถียรภาพ", len: 9, emoji: "🧱" },
    { word: "EQUILIBRIUM", meaning: "สภาวะสมดุล", len: 11, emoji: "⚖️" },
    { word: "HARMONY", meaning: "ความกลมกลืน", len: 7, emoji: "🎻" },
    { word: "MELODY", meaning: "ทำนองเพลง", len: 6, emoji: "🎵" },
    { word: "RHYTHM", meaning: "จังหวะ", len: 6, emoji: "🥁" },
    { word: "CHORD", meaning: "คอร์ดดนตรี", len: 5, emoji: "🎸" },
    { word: "TEMPO", meaning: "ความเร็วเพลง", len: 5, emoji: "⏱️" },
    { word: "BEAT", meaning: "บีท/จังหวะเคาะ", len: 4, emoji: "🎧" },
    { word: "SYMPHONY", meaning: "ซิมโฟนี", len: 8, emoji: "🎻" },
    { word: "ORCHESTRA", meaning: "วงออเคสตรา", len: 9, emoji: "🎷" },
    { word: "CONCERT", meaning: "คอนเสิร์ต", len: 7, emoji: "🎟️" },
    { word: "SOLO", meaning: "เดี่ยว", len: 4, emoji: "🎤" },
    { word: "DUET", meaning: "คู่ประสาน", len: 4, emoji: "👥" },
    { word: "TRIO", meaning: "กลุ่มสามคน", len: 4, emoji: "🕺" },
    { word: "QUARTET", meaning: "กลุ่มสี่คน", len: 7, emoji: "🎻" },
    { word: "QUINTET", meaning: "กลุ่มห้าคน", len: 7, emoji: "🎷" },
    { word: "CHORUS", meaning: "ประสานเสียง/ฮุค", len: 6, emoji: "🎶" },
    { word: "OPERA", meaning: "โอเปร่า", len: 5, emoji: "🎭" },
    { word: "BALLET", meaning: "บัลเล่ต์", len: 6, emoji: "🩰" },
    { word: "DRAMA", meaning: "ละคร", len: 5, emoji: "🎭" },
    { word: "COMEDY", meaning: "ตลก", len: 6, emoji: "🤣" },
    { word: "TRAGEDY", meaning: "โศกนาฏกรรม", len: 7, emoji: "😢" },
    { word: "POETRY", meaning: "กวีนิพนธ์", len: 6, emoji: "📖" },
    { word: "FICTION", meaning: "นิยาย", len: 7, emoji: "📚" },
    { word: "NOVEL", meaning: "นวนิยายเมเรื่อง", len: 5, emoji: "📘" },
    { word: "FABLE", meaning: "นิทานอีสป", len: 5, emoji: "🦊" },
    { word: "STORY", meaning: "เรื่องราว", len: 5, emoji: "📚" },
    { word: "LEGEND", meaning: "ตำนาน", len: 6, emoji: "🐉" },
    { word: "MYTHOLOGY", meaning: "เทพปกรณัม", len: 9, emoji: "🕍" },
    { word: "HISTORY", meaning: "ประวัติศาสตร์", len: 7, emoji: "⏳" },
    { word: "CULTURE", meaning: "วัฒนธรรม", len: 7, emoji: "👘" },
    { word: "HERITAGE", meaning: "มรดก", len: 8, emoji: "🏺" },
    { word: "TRADITION", meaning: "ประเพณี", len: 9, emoji: "⛩️" },
    { word: "CUSTOM", meaning: "ธรรมเนียม", len: 6, emoji: "👘" },
    { word: "HABIT", meaning: "นิสัย/ความเคยชิน", len: 5, emoji: "🔄" },
    { word: "ROUTINE", meaning: "กิจวัตร", len: 7, emoji: "📅" },
    { word: "LIFESTYLE", meaning: "ไลฟ์สไตล์", len: 9, emoji: "🚲" },
    { word: "LEISURE", meaning: "ความเพลิดเพลิน", len: 7, emoji: "🏖️" },
    { word: "HEALTH", meaning: "สุขภาพ", len: 6, emoji: "🍎" },
    { word: "FITNESS", meaning: "ความฟิต", len: 7, emoji: "🏋️" },
    { word: "WELLNESS", meaning: "ความเป็นอยู่ที่ดี", len: 8, emoji: "🧘" },
    { word: "THERAPY", meaning: "การบำบัด", len: 7, emoji: "🩺" },
    { word: "RECOVERY", meaning: "การพักฟื้น", len: 8, emoji: "🩹" },
    { word: "VITALITY", meaning: "ความมีชีวิตชีวา", len: 8, emoji: "🔋" },
    { word: "ENDURANCE", meaning: "ความอดทน", len: 9, emoji: "🏃" },
    { word: "STRENGTH", meaning: "ความแข็งแกร่ง", len: 8, emoji: "💪" },
    { word: "AGILITY", meaning: "ความคล่องแคล่ว", len: 7, emoji: "🦊" },
    { word: "WISDOM", meaning: "สติปัญญา", len: 6, emoji: "🧠" },
    { word: "INTELLECT", meaning: "สติปัญญา", len: 9, emoji: "🧐" },
    { word: "GENIUS", meaning: "อัจฉริยะ", len: 6, emoji: "🎓" },
    { word: "CREATIVE", meaning: "ความคิดสร้างสรรค์", len: 8, emoji: "🎨" },
    { word: "TALENT", meaning: "พรสวรรค์", len: 6, emoji: "🌟" },
    { word: "SKILL", meaning: "ทักษะ", len: 5, emoji: "🎯" },
    { word: "EXPERT", meaning: "ผู้เชี่ยวชาญ", len: 6, emoji: "🎩" },
    { word: "MASTER", meaning: "ผู้ชำนาญการ/ปรมาจารย์", len: 6, emoji: "🥋" },
    { word: "SCHOLAR", meaning: "นักวิชาการ", len: 7, emoji: "📚" },
    { word: "ACADEMIC", meaning: "วิชาการ", len: 8, emoji: "🏫" },
    { word: "STUDY", meaning: "ศึกษา/วิจัย", len: 5, emoji: "📖" },
    { word: "RESEARCH", meaning: "การวิจัย", len: 8, emoji: "⚗️" },
    { word: "ANALYSIS", meaning: "การวิเคราะห์", len: 8, emoji: "📊" },
    { word: "THEORY", meaning: "ทฤษฎี", len: 6, emoji: "📝" },
    { word: "HYPOTHESIS", meaning: "สมมติฐาน", len: 10, emoji: "💡" },
    { word: "EVIDENCE", meaning: "หลักฐาน", len: 8, emoji: "🔎" },
    { word: "LOGIC", meaning: "ตรรกะ", len: 5, emoji: "⚖️" },
    { word: "REASON", meaning: "เหตุผล", len: 6, emoji: "🔍" },
    { word: "THOUGHT", meaning: "ความคิด", len: 7, emoji: "💭" },
    { word: "BELIEF", meaning: "ความเชื่อ", len: 6, emoji: "⛪" },
    { word: "OPINION", meaning: "ความคิดเห็น", len: 7, emoji: "📢" },
    { word: "DEBATE", meaning: "การโต้เถียง", len: 6, emoji: "🗣️" },
    { word: "VOICE", meaning: "เสียงพูด", len: 5, emoji: "🗣️" },
    { word: "WHISPER", meaning: "กระซิบ", len: 7, emoji: "🤫" },
    { word: "SHOUT", meaning: "ตะโกน", len: 5, emoji: "📢" },
    { word: "SCREAM", meaning: "กรีดร้อง", len: 6, emoji: "😱" },
    { word: "LAUGH", meaning: "หัวเราะ", len: 5, emoji: "😄" },
    { word: "CHUCKLE", meaning: "หัวเราะเบาๆ", len: 7, emoji: "🤭" },
    { word: "GIGGLE", meaning: "หัวเราะคิกคัก", len: 6, emoji: "😆" },
    { word: "SMILE", meaning: "รอยยิ้ม", len: 5, emoji: "😊" },
    { word: "WINK", meaning: "ขยิบตา", len: 4, emoji: "😉" },
    { word: "FROWN", meaning: "หน้านิ่วคิ้วขมวด", len: 5, emoji: "☹️" },
    { word: "GLANCE", meaning: "การชำเลืองมอง", len: 6, emoji: "👀" },
    { word: "GAZE", meaning: "การจ้องมอง", len: 4, emoji: "🤩" },
    { word: "STARE", meaning: "การจ้อง", len: 5, emoji: "🧐" },
    { word: "BLINK", meaning: "กะพริบตา", len: 5, emoji: "👁️" },
    { word: "FOCUS", meaning: "โฟกัส", len: 5, emoji: "🎯" },
    { word: "DANGER", meaning: "อันตราย", len: 6, emoji: "⚠️" },
    { word: "SAFETY", meaning: "ความปลอดภัย", len: 6, emoji: "🛡️" },
    { word: "WARNING", meaning: "คำเตือน", len: 7, emoji: "🚧" },
    { word: "CAUTION", meaning: "ความระมัดระวัง", len: 7, emoji: "⚠️" },
    { word: "ALERT", meaning: "การแจ้งเตือน", len: 5, emoji: "🔔" },
    { word: "NOTICE", meaning: "ประกาศ/สังเกต", len: 6, emoji: "📢" },
    { word: "SIGNAL", meaning: "สัญญาณ", len: 6, emoji: "📡" },
    { word: "BEACON", meaning: "หอประภาคาร/สัญญาณไฟ", len: 6, emoji: "🚨" },
    { word: "RESCUE", meaning: "การช่วยเหลือ", len: 6, emoji: "🚁" },
    { word: "ESCAPE", meaning: "การหลบหนี", len: 6, emoji: "🏃" },
    { word: "REWARD", meaning: "ของรางวัล", len: 6, emoji: "🎁" },
    { word: "PENALTY", meaning: "บทลงโทษ/จุดโทษ", len: 7, emoji: "⚽" },
    { word: "PRIZE", meaning: "รางวัลชนะเลิศ", len: 5, emoji: "🏆" },
    { word: "TROPHY", meaning: "ถ้วยรางวัล", len: 6, emoji: "🥇" },
    { word: "MEDAL", meaning: "เหรียญรางวัล", len: 5, emoji: "🏅" },
    { word: "CHAMPION", meaning: "แชมป์เปี้ยน", len: 8, emoji: "👑" },
    { word: "WINNER", meaning: "ผู้ชนะ", len: 6, emoji: "🏆" },
    { word: "LOSER", meaning: "ผู้แพ้", len: 5, emoji: "🏳️" },
    { word: "DRAW", meaning: "เสมอ/วาด", len: 4, emoji: "✏️" },
    { word: "SCORE", meaning: "คะแนน", len: 5, emoji: "💯" },
    { word: "POINTS", meaning: "แต้มคะแนน", len: 6, emoji: "📈" },
    { word: "BONUS", meaning: "โบนัส", len: 5, emoji: "💹" },
    { word: "COMBO", meaning: "คอมโบ", len: 5, emoji: "⚡" },
    { word: "STREAK", meaning: "ความต่อเนื่อง", len: 6, emoji: "🔥" },
    { word: "RECORD", meaning: "สถิติ/บันทึก", len: 6, emoji: "📜" },
    { word: "FINISH", meaning: "เส้นชัย/เสร็จสิ้น", len: 6, emoji: "🏁" },
    { word: "START", meaning: "จุดเริ่มต้น", len: 5, emoji: "🚩" },
    { word: "READY", meaning: "พร้อม", len: 5, emoji: "👌" },
    { word: "BEGIN", meaning: "เริ่ม", len: 5, emoji: "🆕" },
    { word: "PREPARE", meaning: "เตรียมตัว", len: 7, emoji: "🎒" },
    { word: "PRACTICE", meaning: "ฝึกฝน", len: 8, emoji: "🎯" },
    { word: "TRAINING", meaning: "การฝึกหัด", len: 8, emoji: "💪" },
    { word: "COACH", meaning: "โค้ช", len: 5, emoji: "🧢" },
    { word: "PLAYER", meaning: "ผู้เล่น", len: 6, emoji: "🕹️" },
    { word: "TEAM", meaning: "ทีม", len: 4, emoji: "🤝" },
    { word: "COOP", meaning: "เล่นเป็นทีม(Co-op)", len: 4, emoji: "👥" },
    { word: "SOLO", meaning: "เล่นเดี่ยว", len: 4, emoji: "👤" },
    { word: "ONLINE", meaning: "ออนไลน์", len: 6, emoji: "🌐" },
    { word: "OFFLINE", meaning: "ออฟไลน์", len: 7, emoji: "📴" },
    { word: "STATUS", meaning: "สถานะ", len: 6, emoji: "📊" },
    { word: "PROFILE", meaning: "โปรไฟล์", len: 7, emoji: "👤" },
    { word: "AVATAR", meaning: "อวตาร", len: 6, emoji: "🎭" },
    { word: "ACCOUNT", meaning: "บัญชี", len: 7, emoji: "🔐" },
    { word: "PASSWORD", meaning: "รหัสผ่าน", len: 8, emoji: "🗝️" },
    { word: "SECURITY", meaning: "ความปลอดภัย", len: 8, emoji: "🛡️" },
    { word: "PRIVACY", meaning: "ความเป็นส่วนตัว", len: 7, emoji: "🕶️" },
    { word: "SETTING", meaning: "การตั้งค่า", len: 7, emoji: "⚙️" },
    { word: "CONFIG", meaning: "การกำหนดค่า", len: 6, emoji: "🔧" },
    { word: "INSTALL", meaning: "ติดตั้ง", len: 7, emoji: "📥" },
    { word: "UPDATE", meaning: "อัปเดต", len: 6, emoji: "⬆️" },
    { word: "UPGRADE", meaning: "อัปเกรด", len: 7, emoji: "🚀" },
    { word: "LOAD", meaning: "โหลด", len: 4, emoji: "🚛" },
    { word: "SAVE", meaning: "บันทึก/เซฟ", len: 4, emoji: "💾" },
    { word: "EXIT", meaning: "ออก", len: 4, emoji: "🚪" },
    { word: "QUIT", meaning: "เลิกเล่น", len: 4, emoji: "🛑" },
    { word: "RESUME", meaning: "เล่นต่อ", len: 6, emoji: "▶️" },
    { word: "RESTART", meaning: "เริ่มใหม่", len: 7, emoji: "🔄" },
    { word: "RETRY", meaning: "ลองอีกครั้ง", len: 5, emoji: "🔁" },
    { word: "OPTION", meaning: "ตัวเลือก", len: 6, emoji: "⚙️" },
    { word: "SELECT", meaning: "เลือก", len: 6, emoji: "👈" },
    { word: "CONFIRM", meaning: "ยืนยัน", len: 7, emoji: "✅" },
    { word: "CANCEL", meaning: "ยกเลิก", len: 6, emoji: "❌" },
    { word: "ACCEPT", meaning: "ตอบรับ", len: 6, emoji: "🤝" },
    { word: "REJECT", meaning: "ปฏิเสธ", len: 6, emoji: "🚫" },
    { word: "SUBMIT", meaning: "ส่งคำร้อง", len: 6, emoji: "📤" },
    { word: "SEARCH", meaning: "ค้นหา", len: 6, emoji: "🔍" },
    { word: "BROWSE", meaning: "เรียกดู", len: 6, emoji: "🌐" },
    { word: "FILTER", meaning: "กรอง", len: 6, emoji: "☕" },
    { word: "SORT", meaning: "เรียงลำดับ", len: 4, emoji: "🗂️" },
    { word: "GROUP", meaning: "กลุ่ม", len: 5, emoji: "👥" },
    { word: "LIST", meaning: "รายการ/ลิสต์", len: 4, emoji: "📝" },
    { word: "VIEW", meaning: "ดู/มุมมอง", len: 4, emoji: "👁️" },
    { word: "IMAGE", meaning: "รูปภาพ", len: 5, emoji: "🖼️" },
    { word: "SLIDE", meaning: "สไลด์", len: 5, emoji: "📽️" },
    { word: "GALLERY", meaning: "แกลเลอรี", len: 7, emoji: "🖼️" },
    { word: "CANVAS", meaning: "พื้นผ้าใบ", len: 6, emoji: "🎨" },
    { word: "LAYOUT", meaning: "โครงร่าง", len: 6, emoji: "📐" },
    { word: "DESIGN", meaning: "ออกแบบ", len: 6, emoji: "🎨" },
    // --- SCIENCE & TECH (EXTENDED) ---
    { word: "ALGORITHM", meaning: "อัลกอริทึม", len: 9, emoji: "🔢" },
    { word: "FRAMEWORK", meaning: "เฟรมเวิร์ก", len: 9, emoji: "🏗️" },
    { word: "DATABASE", meaning: "ฐานข้อมูล", len: 8, emoji: "🗄️" },
    { word: "PROTOCOL", meaning: "โพรโทคอล", len: 8, emoji: "📡" },
    { word: "CRYPTOGRAPHY", meaning: "การเข้ารหัสลับ", len: 12, emoji: "🔐" },
    { word: "ENCRYPTION", meaning: "การเข้ารหัส", len: 10, emoji: "🔒" },
    { word: "DECRYPTION", meaning: "การถอดรหัส", len: 10, emoji: "🔓" },
    { word: "CYBERSECURITY", meaning: "ความปลอดภัยไซเบอร์", len: 13, emoji: "🛡️" },
    { word: "VIRTUALIZATION", meaning: "การสร้างระบบเสมือน", len: 14, emoji: "💻" },
    { word: "BLOCKCHAIN", meaning: "บล็อกเชน", len: 10, emoji: "⛓️" },
    { word: "ETHERNET", meaning: "อีเธอร์เน็ต", len: 8, emoji: "🌐" },
    { word: "BANDWIDTH", meaning: "แบนด์วิดท์", len: 9, emoji: "📶" },
    { word: "BROADBAND", meaning: "บรอดแบนด์", len: 9, emoji: "📡" },
    { word: "FIBEROPTIC", meaning: "ใยแก้วนำแสง", len: 10, emoji: "🔌" },
    { word: "SEMICONDUCTOR", meaning: "สารกึ่งตัวนำ", len: 13, emoji: "🔋" },
    { word: "TRANSISTOR", meaning: "ทรานซิสเตอร์", len: 10, emoji: "📻" },
    { word: "CIRCUITRY", meaning: "วงจรไฟฟ้า", len: 9, emoji: "⚡" },
    { word: "CAPACITOR", meaning: "ตัวเก็บประจุ", len: 9, emoji: "🔋" },
    { word: "RESISTOR", meaning: "ตัวต้านทาน", len: 8, emoji: "🪛" },
    { word: "VOLTAGE", meaning: "แรงดันไฟฟ้า", len: 7, emoji: "⚡" },
    { word: "WATTAGE", meaning: "กำลังไฟฟ้า", len: 7, emoji: "🔌" },
    { word: "TELEMETRY", meaning: "การวัดระยะไกล", len: 9, emoji: "📡" },
    { word: "SATELLITE", meaning: "ดาวเทียม", len: 9, emoji: "🛰️" },
    { word: "ASTRONAUT", meaning: "นักบินอวกาศ", len: 9, emoji: "👨‍🚀" },
    { word: "COSMOS", meaning: "คอสมอส/จักรวาล", len: 6, emoji: "🌌" },
    { word: "NEBULA", meaning: "เนบิวลา", len: 6, emoji: "☁️" },
    { word: "METEOR", meaning: "อุกกาบาต", len: 6, emoji: "☄️" },
    { word: "ASTEROID", meaning: "ดาวเคราะห์น้อย", len: 8, emoji: "🌑" },
    { word: "TELESCOPE", meaning: "กล้องโทรทรรศน์", len: 9, emoji: "🔭" },
    { word: "MICROSCOPE", meaning: "กล้องจุลทรรศน์", len: 10, emoji: "🔬" },
    { word: "LABORATORY", meaning: "ห้องปฏิบัติการ", len: 10, emoji: "🧪" },
    { word: "EXPERIMENT", meaning: "การทดลอง", len: 10, emoji: "⚗️" },
    { word: "INNOVATION", meaning: "นวัตกรรม", len: 10, emoji: "💡" },
    { word: "INVENTION", meaning: "สิ่งประดิษฐ์", len: 9, emoji: "⚙️" },
    { word: "DISCOVERY", meaning: "การค้นพบ", len: 9, emoji: "🧭" },
    { word: "EVOLUTION", meaning: "วิวัฒนาการ", len: 9, emoji: "🐒" },
    { word: "FOSSIL", meaning: "ฟอสซิล", len: 6, emoji: "🦴" },
    { word: "DINOSAUR", meaning: "ไดโนเสาร์", len: 8, emoji: "🦖" },
    { word: "MAMMAL", meaning: "สัตว์เลี้ยงลูกด้วยนม", len: 6, emoji: "🐘" },
    { word: "REPTILE", meaning: "สัตว์เลื้อยคลาน", len: 7, emoji: "🐍" },
    { word: "AMPHIBIAN", meaning: "สัตว์ครึ่งบกครึ่งน้ำ", len: 9, emoji: "🐸" },
    { word: "INVERTEBRATE", meaning: "สัตว์ไม่มีกระดูกสันหลัง", len: 12, emoji: "🐛" },
    { word: "VERTEBRATE", meaning: "สัตว์มีกระดูกสันหลัง", len: 10, emoji: "🦴" },
    { word: "ORGANISM", meaning: "สิ่งมีชีวิต", len: 8, emoji: "🦠" },
    { word: "BACTERIA", meaning: "แบคทีเรีย", len: 8, emoji: "🧬" },
    { word: "VIRUS", meaning: "ไวรัส", len: 5, emoji: "🦠" },
    { word: "ANTIBIOTIC", meaning: "ยาปฏิชีวนะ", len: 10, emoji: "💊" },
    { word: "VACCINE", meaning: "วัคซีน", len: 7, emoji: "💉" },
    { word: "IMMUNITY", meaning: "ภูมิคุ้มกัน", len: 8, emoji: "🛡️" },
    { word: "CHLOROPHYLL", meaning: "คลอโรฟิลล์", len: 11, emoji: "🍃" },
    { word: "PHOTOSYNTHESIS", meaning: "การสังเคราะห์แสง", len: 14, emoji: "☀️" },
    { word: "RESPIRATION", meaning: "การหายใจ", len: 11, emoji: "🫁" },
    { word: "DIGESTION", meaning: "การย่อยอาหาร", len: 9, emoji: "🍱" },
    { word: "METABOLISM", meaning: "ระบบเผาผลาญ", len: 10, emoji: "🔥" },
    { word: "CHROMOSOME", meaning: "โครโมโซม", len: 10, emoji: "🧬" },
    { word: "ENZYME", meaning: "เอนไซม์", len: 6, emoji: "🧪" },
    { word: "HORMONE", meaning: "ฮอร์โมน", len: 7, emoji: "🩸" },
    { word: "PROTEIN", meaning: "โปรตีน", len: 7, emoji: "🥚" },
    { word: "VITAMIN", meaning: "วิตามิน", len: 7, emoji: "💊" },
    { word: "MINERAL", meaning: "แร่ธาตุ", len: 7, emoji: "🪨" },
    { word: "CALCIUM", meaning: "แคลเซียม", len: 7, emoji: "🥛" },
    { word: "MAGNESIUM", meaning: "แมกนีเซียม", len: 9, emoji: "💊" },
    { word: "POTASSIUM", meaning: "โพแทสเซียม", len: 9, emoji: "🍌" },
    { word: "IRON", meaning: "เหล็ก", len: 4, emoji: "🔩" },
    { word: "COPPER", meaning: "ทองแดง", len: 6, emoji: "🧱" },
    { word: "SILVER", meaning: "เงิน(ธาตุ)", len: 6, emoji: "🥈" },
    { word: "GOLD", meaning: "ทองคำ", len: 4, emoji: "🥇" },
    { word: "PLATINUM", meaning: "แพลทินัม", len: 8, emoji: "💍" },
    { word: "MERCURY", meaning: "ปรอท/ดาวพุธ", len: 7, emoji: "🌡️" },
    { word: "URANIUM", meaning: "ยูเรเนียม", len: 7, emoji: "☢️" },
    { word: "HYDROGEN", meaning: "ไฮโดรเจน", len: 8, emoji: "💧" },
    { word: "OXYGEN", meaning: "ออกซิเจน", len: 6, emoji: "🌬️" },
    { word: "NITROGEN", meaning: "ไนโตรเจน", len: 8, emoji: "💨" },
    { word: "CARBON", meaning: "คาร์บอน", len: 6, emoji: "🌚" },
    { word: "HELIUM", meaning: "ฮีเลียม", len: 6, emoji: "🎈" },
    { word: "METEOROLOGY", meaning: "อุตุนิยมวิทยา", len: 11, emoji: "🌤️" },
    { word: "ATMOSPHERE", meaning: "บรรยากาศ", len: 10, emoji: "☁️" },
    { word: "PRECIPITATION", meaning: "หยาดน้ำฟ้า/ฝน", len: 13, emoji: "⛈️" },
    { word: "HUMIDITY", meaning: "ความชื้น", len: 8, emoji: "💦" },
    { word: "TEMPERATURE", meaning: "อุณหภูมิ", len: 11, emoji: "🌡️" },
    { word: "BAROMETER", meaning: "บารอมิเตอร์", len: 9, emoji: "⏲️" },
    { word: "ANEMOMETER", meaning: "เครื่องวัดความเร็วลม", len: 10, emoji: "🌬️" },
    { word: "ISOBAR", meaning: "เส้นความกดอากาศ", len: 6, emoji: "📈" },
    { word: "STRATOSPHERE", meaning: "ชั้นสตราโตสเฟียร์", len: 12, emoji: "✈️" },
    { word: "TROPOSPHERE", meaning: "ชั้นโทรโพสเฟียร์", len: 11, emoji: "☁️" },
    { word: "IONOSPHERE", meaning: "ชั้นไอโอโนสเฟียร์", len: 10, emoji: "📻" },
    { word: "EXOSPHERE", meaning: "ชั้นเอกโซสเฟียร์", len: 9, emoji: "🛰️" },
    { word: "MAGNETISM", meaning: "แม่เหล็ก", len: 9, emoji: "🧲" },
    { word: "RADIATION", meaning: "รังสี", len: 9, emoji: "☢️" },
    { word: "CONDUCTION", meaning: "การนำความร้อน", len: 10, emoji: "🔥" },
    { word: "CONVECTION", meaning: "การพาความร้อน", len: 10, emoji: "🌬️" },
    { word: "REFLECTION", meaning: "การสะท้อน", len: 10, emoji: "🪞" },
    { word: "REFRACTION", meaning: "การหักเห", len: 10, emoji: "🌈" },
    { word: "DIFFRACTION", meaning: "การเลี้ยวเบน", len: 11, emoji: "🔦" },
    { word: "ABSORPTION", meaning: "การดูดซับ", len: 10, emoji: "🧽" },
    { word: "EVAPORATION", meaning: "การระเหย", len: 11, emoji: "💨" },
    { word: "CONDENSATION", meaning: "การควบแน่น", len: 12, emoji: "💧" },
    { word: "SUBLIMATION", meaning: "การระเหิด", len: 11, emoji: "🧊" },
    { word: "MELTING", meaning: "การละลาย", len: 7, emoji: "🫠" },
    { word: "FREEZING", meaning: "การเยือกแข็ง", len: 8, emoji: "❄️" },
    { word: "BOILING", meaning: "การเดือด", len: 7, emoji: "🍲" },
    { word: "COMBUSTION", meaning: "การเผาไหม้", len: 10, emoji: "🔥" },
    { word: "SOLUTION", meaning: "สารละลาย/ทางแก้", len: 8, emoji: "🧪" },
    { word: "SOLVENT", meaning: "ตัวทำละลาย", len: 7, emoji: "🧴" },
    { word: "SOLUTE", meaning: "ตัวถูกละลาย", len: 6, emoji: "🧂" },
    { word: "MIXTURE", meaning: "สารผสม", len: 7, emoji: "🥣" },
    { word: "COMPOUND", meaning: "สารประกอบ", len: 8, emoji: "🧪" },
    { word: "ELEMENT", meaning: "ธาตุ", len: 7, emoji: "⚛️" },
    { word: "MOLECULE", meaning: "โมเลกุล", len: 8, emoji: "🧬" },
    { word: "PARTICLE", meaning: "อนุภาค", len: 8, emoji: "✨" },
    { word: "ELECTRON", meaning: "อิเล็กตรอน", len: 8, emoji: "⚡" },
    { word: "PROTON", meaning: "โปรตอน", len: 6, emoji: "➕" },
    { word: "NEUTRON", meaning: "นิวตรอน", len: 7, emoji: "⭕" },
    { word: "NUCLEUS", meaning: "นิวเคลียส", len: 7, emoji: "🌀" },
    { word: "ORBITAL", meaning: "ออร์บิทัล/วงโคจร", len: 7, emoji: "🪐" },
    { word: "REVALUATION", meaning: "การประเมินราคาใหม่", len: 11, emoji: "💰" },
    { word: "INFLATION", meaning: "เงินเฟ้อ", len: 9, emoji: "🎈" },
    { word: "DEFLATION", meaning: "เงินฝืด", len: 9, emoji: "📉" },
    { word: "RECESSION", meaning: "เศรษฐกิจถดถอย", len: 9, emoji: "📉" },
    { word: "CURRENCY", meaning: "สกุลเงิน", len: 8, emoji: "💵" },
    { word: "EXCHANGE", meaning: "การแลกเปลี่ยน", len: 8, emoji: "💱" },
    { word: "INVESTMENT", meaning: "การลงทุน", len: 10, emoji: "📈" },
    { word: "PORTFOLIO", meaning: "พอร์ตโฟลิโอ", len: 9, emoji: "📁" },
    { word: "INTEREST", meaning: "ดอกเบี้ย/ความสนใจ", len: 8, emoji: "💹" },
    { word: "DIVIDEND", meaning: "เงินปันส่วน", len: 8, emoji: "💸" },
    { word: "REVENUE", meaning: "รายได้", len: 7, emoji: "💰" },
    { word: "EXPENSE", meaning: "ค่าใช้จ่าย", len: 7, emoji: "🧾" },
    { word: "PROFIT", meaning: "กำไร", len: 6, emoji: "📈" },
    { word: "LOSS", meaning: "ขาดทุน", len: 4, emoji: "📉" },
    { word: "BUDGET", meaning: "งบประมาณ", len: 6, emoji: "💼" },
    { word: "FINANCE", meaning: "การเงิน", len: 7, emoji: "💳" },
    { word: "ACCOUNTANT", meaning: "สมุห์บัญชี", len: 10, emoji: "👨‍💼" },
    { word: "AUDITOR", meaning: "ผู้ตรวจสอบบัญชี", len: 7, emoji: "🧐" },
    { word: "MANAGER", meaning: "ผู้จัดการ", len: 7, emoji: "💼" },
    { word: "DIRECTOR", meaning: "ผู้อำนวยการ", len: 8, emoji: "👔" },
    { word: "EXECUTIVE", meaning: "ผู้บริหาร", len: 9, emoji: "🏢" },
    { word: "PRESIDENT", meaning: "ประธาน", len: 9, emoji: "🗽" },
    { word: "DEPUTY", meaning: "รอง/ตัวแทน", len: 6, emoji: "👤" },
    { word: "ASSISTANT", meaning: "ผู้ช่วย", len: 9, emoji: "🤝" },
    { word: "SECRETARY", meaning: "เลขานุการ", len: 9, emoji: "📑" },
    { word: "RECEPTIONIST", meaning: "พนักงานต้อนรับ", len: 12, emoji: "📞" },
    { word: "CONSULTANT", meaning: "ที่ปรึกษา", len: 10, emoji: "🧠" },
    { word: "ADVISOR", meaning: "ผู้ให้คำแนะนำ", len: 7, emoji: "👨‍🏫" },
    { word: "CLIENT", meaning: "ลูกค้า", len: 6, emoji: "👤" },
    { word: "CUSTOMER", meaning: "จูกค้าผู้ซื้อ", len: 8, emoji: "🛒" },
    { word: "CONSUMER", meaning: "ผู้บริโภค", len: 8, emoji: "🍽️" },
    { word: "SUPPLIER", meaning: "ผู้จัดจำหน่าย", len: 8, emoji: "🚛" },
    { word: "VENDOR", meaning: "คนขายของ", len: 6, emoji: "🏪" },
    { word: "PARTNER", meaning: "หุ้นส่วน", len: 7, emoji: "🤝" },
    { word: "ASSOCIATE", meaning: "เพื่อนร่วมงาน", len: 9, emoji: "👥" },
    { word: "COLLEAGUE", meaning: "เพื่อนร่วมแผนก", len: 9, emoji: "💼" },
    { word: "EMPLOYEE", meaning: "ลูกจ้าง", len: 8, emoji: "👷" },
    { word: "EMPLOYER", meaning: "นายจ้าง", len: 8, emoji: "🤵" },
    { word: "LABORER", meaning: "คนงาน", len: 7, emoji: "⚒️" },
    { word: "PERSONNEL", meaning: "บุคลากร", len: 9, emoji: "👥" },
    { word: "STAFFING", meaning: "การจัดสรรคน", len: 8, emoji: "📋" },
    { word: "RECRUIT", meaning: "รับสมัครคนใหม่", len: 7, emoji: "🤝" },
    { word: "INTERVIEW", meaning: "การสัมภาษณ์", len: 9, emoji: "🎙️" },
    { word: "TRAINING", meaning: "การอบรม", len: 8, emoji: "👨‍🏫" },
    { word: "WORKSHOP", meaning: "เวิร์กชอป", len: 8, emoji: "🛠️" },
    { word: "SEMINAR", meaning: "สัมมนา", len: 7, emoji: "👨‍🏫" },
    { word: "CONFERENCE", meaning: "การประชุมนานาชาติ", len: 10, emoji: "🏛️" },
    { word: "CONVENTION", meaning: "การประชุมใหญ่", len: 10, emoji: "🏟️" },
    { word: "MEETING", meaning: "การประชุม", len: 7, emoji: "👥" },
    { word: "BRIEFING", meaning: "การสรุปคำสั่ง", len: 8, emoji: "📋" },
    { word: "PRESENTATION", meaning: "การนำเสนอ", len: 12, emoji: "📊" },
    { word: "PROJECT", meaning: "โปรเจกต์", len: 7, emoji: "📁" },
    { word: "ASSIGNMENT", meaning: "การได้รับมอบหมาย", len: 10, emoji: "📑" },
    { word: "DEADLINE", meaning: "กำหนดส่ง", len: 8, emoji: "⏰" },
    { word: "SCHEDULE", meaning: "ตารางเวลา", len: 8, emoji: "📅" },
    { word: "CALENDAR", meaning: "ปฏิทิน", len: 8, emoji: "🗓️" },
    { word: "AGENDA", meaning: "วาระการประชุม", len: 6, emoji: "📜" },
    { word: "MINUTES", meaning: "รายงานการประชุม", len: 7, emoji: "📑" },
    { word: "PROPOSAL", meaning: "ข้อเสนอ", len: 8, emoji: "📝" },
    { word: "FEEDBACK", meaning: "ข้อคิดเห็น", len: 8, emoji: "🗨️" },
    { word: "EVALUATION", meaning: "การประเมินผล", len: 10, emoji: "📊" },
    { word: "APPRAISAL", meaning: "การประเมินค่า", len: 9, emoji: "💎" },
    { word: "CRITIQUE", meaning: "บทวิจารณ์", len: 8, emoji: "🧐" },
    { word: "REVIEW", meaning: "รีวิว/ตรวจสอบ", len: 6, emoji: "🔎" },
    { word: "APPROVE", meaning: "อนุมัติ", len: 7, emoji: "✅" },
    { word: "AUTHORIZE", meaning: "อนุญาต/มอบอำนาจ", len: 9, emoji: "🤝" },
    { word: "DELEGATE", meaning: "มอบหมายงาน", len: 8, emoji: "🤝" },
    { word: "COLLABORATE", meaning: "ร่วมมือกัน", len: 11, emoji: "🤝" },
    { word: "COMMUNICATE", meaning: "สื่อสารติดต่อ", len: 11, emoji: "🗣️" },
    { word: "NETWORK", meaning: "เครือข่ายความสัมพันธ์", len: 7, emoji: "🌐" },
    { word: "NEGOTIATE", meaning: "เจรจาต่อรอง", len: 9, emoji: "🤝" },
    { word: "MEDIATE", meaning: "เป็นคนกลาง", len: 7, emoji: "⚖️" },
    { word: "ARBITRATE", meaning: "ตัดสินความ", len: 9, emoji: "👨‍⚖️" },
    { word: "ADVOCATE", meaning: "ผู้สนับสนุน/ทนาย", len: 8, emoji: "📢" },
    { word: "LOBBYIST", meaning: "ผู้มีอิทธิพลในการผลักดัน", len: 8, emoji: "🤵" },
    { word: "CRUSADER", meaning: "ผู้ต่อสู้เพื่ออุดมการณ์", len: 8, emoji: "⚔️" },
    { word: "REFORMER", meaning: "นักปฏิรูป", len: 8, emoji: "🛠️" },
    { word: "ACTIVIST", meaning: "นักกิจกรรม", len: 8, emoji: "✊" },
    { word: "ORGANIZER", meaning: "ผู้จัดงาน", len: 9, emoji: "📅" },
    { word: "VOLUNTEER", meaning: "อาสาสมัคร", len: 9, emoji: "🤲" },
    { word: "CHARITY", meaning: "การกุศล", len: 7, emoji: "💝" },
    { word: "DONATION", meaning: "การบริจาค", len: 8, emoji: "🎁" },
    { word: "FUNDRAISING", meaning: "การระดมทุน", len: 11, emoji: "💰" },
    { word: "FOUNDATION", meaning: "มูลนิธิ", len: 10, emoji: "🏛️" },
    { word: "INSTITUTION", meaning: "สถาบัน", len: 11, emoji: "🏫" },
    { word: "ORGANIZATION", meaning: "องค์กร", len: 12, emoji: "🌐" },
    { word: "ENTERPRISE", meaning: "บริษัท/วิสาหกิจ", len: 10, emoji: "🏢" },
    { word: "CORPORATION", meaning: "นิติบุคคล/บริษัทใหญ่", len: 11, emoji: "🏢" },
    { word: "SUBSIDIARY", meaning: "บริษัทในเครือ", len: 10, emoji: "🏢" },
    { word: "FRANCHISE", meaning: "แฟรนไชส์", len: 9, emoji: "🏪" },
    { word: "PARTNERSHIP", meaning: "หุ้นส่วนทางธุรกิจ", len: 11, emoji: "🤝" },
    { word: "SYNDICATE", meaning: "สมาคมนิติบุคคล", len: 9, emoji: "👥" },
    { word: "CONSORTIUM", meaning: "กลุ่มธุรกิจร่วมค้า", len: 10, emoji: "🏢" },
    { word: "MONOPOLY", meaning: "การผูกขาด", len: 8, emoji: "🎩" },
    { word: "OLIGOPOLY", meaning: "การรวมหัวผูกขาด", len: 9, emoji: "👥" },
    { word: "COMPETITION", meaning: "การแข่งขัน", len: 11, emoji: "🏁" },
    { word: "ADVERTISING", meaning: "การโฆษณา", len: 11, emoji: "📢" },
    { word: "MARKETING", meaning: "การตลาด", len: 9, emoji: "📊" },
    { word: "PROMOTION", meaning: "การส่งเสริมการขาย", len: 9, emoji: "🏷️" },
    { word: "BRANDING", meaning: "การสร้างแบรนด์", len: 8, emoji: "🔖" },
    { word: "PUBLICITY", meaning: "การประชาสัมพันธ์", len: 9, emoji: "📢" },
    { word: "BROADCAST", meaning: "การแพร่ภาพกระจายเสียง", len: 9, emoji: "📡" },
    { word: "TELEVISION", meaning: "โทรทัศน์", len: 10, emoji: "📺" },
    { word: "RADIOSTATION", meaning: "สถานีวิทยุ", len: 12, emoji: "📻" },
    { word: "JOURNALISM", meaning: "สื่อสารมวลชน", len: 10, emoji: "📰" },
    { word: "PERIODICAL", meaning: "นิตยสารรายคาบ", len: 10, emoji: "📚" },
    { word: "GAZETTE", meaning: "ราชกิจจานุเบกษา/นิตยสาร", len: 7, emoji: "📰" },
    { word: "BULLETIN", meaning: "จดหมายข่าว/แถลงการณ์", len: 8, emoji: "🗞️" },
    { word: "LITERATURE", meaning: "วรรณคดี", len: 10, emoji: "📖" },
    { word: "ANTHOLOGY", meaning: "การรวบรวม", len: 9, emoji: "📚" },
    { word: "GLOSSARY", meaning: "อภิธานศัพท์", len: 8, emoji: "📑" },
    { word: "DICTIONARY", meaning: "พจนานุกรม", len: 10, emoji: "📕" },
    { word: "THESAURUS", meaning: "พจนานุกรมคำพ้อง", len: 9, emoji: "📔" },
    { word: "ENCYCLOPEDIA", meaning: "สารานุกรม", len: 12, emoji: "📚" },
    { word: "ATLAS", meaning: "แผนที่เล่ม", len: 5, emoji: "🗺️" },
    { word: "GAZETTEER", meaning: "พจนานุกรมภูมิศาสตร์", len: 9, emoji: "📍" },
    { word: "ALMANAC", meaning: "ปัดทินบันทึกเหตุการณ์", len: 7, emoji: "📅" },
    { word: "CHRONOLOGY", meaning: "การเรียงตามลำดับเวลา", len: 10, emoji: "⏳" },
    { word: "BIOGRAPHY", meaning: "ชีวประวัติ", len: 9, emoji: "📝" },
    { word: "AUTOBIOGRAPHY", meaning: "อัตชีวประวัติ", len: 13, emoji: "✍️" },
    { word: "MEMOIR", meaning: "บันทึกความทรงจำ", len: 6, emoji: "📓" },
    { word: "DIARY", meaning: "ไดอารี่", len: 5, emoji: "📔" },
    { word: "JOURNAL", meaning: "วารสาร", len: 7, emoji: "📙" },
    { word: "BLOGGER", meaning: "บล็อกเกอร์", len: 7, emoji: "🤳" },
    { word: "INFLUENCER", meaning: "อินฟลูเอนเซอร์", len: 10, emoji: "🌟" },
    { word: "FOLLOWER", meaning: "ผู้ติดตาม", len: 8, emoji: "👤" },
    { word: "SUBSCRIBER", meaning: "สมาชิกผู้รับข้อมูล", len: 10, emoji: "🔔" },
    { word: "AUDIENCE", meaning: "ผู้ชม", len: 8, emoji: "🏟️" },
    { word: "SPECTATOR", meaning: "ผู้ชมในงานกีฬา", len: 9, emoji: "🏟️" },
    { word: "LISTENERS", meaning: "ผู้ฟัง", len: 9, emoji: "👂" },
    { word: "READER", meaning: "ผู้อ่าน", len: 6, emoji: "📖" },
    { word: "WRITER", meaning: "นักเขียน", len: 6, emoji: "✍️" },
    { word: "AUTHOR", meaning: "ผู้แต่ง", len: 6, emoji: "🎩" },
    { word: "EDITOR", meaning: "บรรณาธิการ", len: 6, emoji: "📝" },
    { word: "PUBLISHER", meaning: "ผู้จัดพิมพ์", len: 9, emoji: "🖨️" },
    { word: "PRINTER", meaning: "เครื่องพิมพ์/ช่างพิมพ์", len: 7, emoji: "🖨️" },
    { word: "BOOKBINDER", meaning: "ช่างเย็บเล่ม", len: 10, emoji: "📚" },
    { word: "ILLUSTRATOR", meaning: "นักวาดภาพประกอบ", len: 11, emoji: "🎨" },
    { word: "PHOTOGRAPHER", meaning: "ช่างภาพ", len: 12, emoji: "📷" },
    { word: "VIDEOGRAPHER", meaning: "ช่างถ่ายวิดีโอ", len: 12, emoji: "📹" },
    { word: "ANIMATOR", meaning: "นักทำแอนิเมชั่น", len: 8, emoji: "🎬" },
    { word: "PRODUCER", meaning: "ผู้อำนวยการสร้าง", len: 8, emoji: "🤵" },
    { word: "DIRECTOR", meaning: "ผู้กำกับ", len: 8, emoji: "🎬" },
    { word: "SCREENWRITER", meaning: "คนเขียนบท", len: 12, emoji: "📝" },
    { word: "PLAYWRIGHT", meaning: "คนเขียนบทละคร", len: 10, emoji: "🎭" },
    { word: "COMPOSER", meaning: "นักประพันธ์เพลง", len: 8, emoji: "🎼" },
    { word: "CONDUCTOR", meaning: "วาทยกร", len: 9, emoji: "🎻" },
    { word: "PERFORMER", meaning: "นักแสดง(ทักษะ)", len: 9, emoji: "🎭" },
    { word: "ENTERTAINER", meaning: "ผู้สร้างความบันเทิง", len: 11, emoji: "🤡" },
    { word: "MAGICIAN", meaning: "นักมายากล", len: 8, emoji: "🎩" },
    { word: "ILLUSIONIST", meaning: "นักแสดงมายากลจำลอง", len: 11, emoji: "🌀" },
    { word: "ACROBAT", meaning: "นักกายกรรม", len: 7, emoji: "🤸" },
    { word: "GYMNAST", meaning: "นักยิมนาสติก", len: 7, emoji: "🤸‍♀️" },
    { word: "ATHLETE", meaning: "นักกีฬา", len: 7, emoji: "🏃" },
    { word: "SPORTSMAN", meaning: "นักกีฬาชาย", len: 9, emoji: "⛹️" },
    { word: "OLYMPIAN", meaning: "นักกีฬาโอลิมปิก", len: 8, emoji: "🏅" },
    { word: "CHAMPION", meaning: "ผู้ชนะเลิศ", len: 8, emoji: "🏆" },
    { word: "COMPETITOR", meaning: "ผู้ร่วมแข่งขัน", len: 10, emoji: "🏁" },
    { word: "OPPONENT", meaning: "ฝ่ายตรงข้าม", len: 8, emoji: "🥊" },
    { word: "REFEREE", meaning: "ผู้ตัดสิน", len: 7, emoji: "🦓" },
    { word: "UMPIRE", meaning: "กรรมการ", len: 6, emoji: "⚾" },
    { word: "LINESMAN", meaning: "ผู้ตัดสินกำกับเส้น", len: 8, emoji: "🚩" },
    { word: "SPECTATORS", meaning: "ผู้เข้าชมงาน", len: 10, emoji: "🏟️" },
    { word: "STADIUM", meaning: "สนามกีฬาห้าห่วง", len: 7, emoji: "🏟️" },
    { word: "ARENA", meaning: "สนามแข่งขัน", len: 5, emoji: "🏟️" },
    { word: "COURT", meaning: "สนาม(เทนนิส/บาส)/ศาล", len: 5, emoji: "🏸" },
    { word: "PITCH", meaning: "สนาม(ฟุตบอล)/ระดับเสียง", len: 5, emoji: "⚽" },
    { word: "FIELD", meaning: "สนาม/ทุ่งนา", len: 5, emoji: "🌾" },
    { word: "TRACK", meaning: "ลู่วิ่ง", len: 5, emoji: "🏃" },
    { word: "POOL", meaning: "สระว่ายน้ำ", len: 4, emoji: "🏊" },
    { word: "GYMNASIUM", meaning: "ยิมเนเซียม", len: 9, emoji: "🏋️" },
    { word: "EQUIPMENT", meaning: "อุปกรณ์", len: 9, emoji: "🧰" },
    { word: "APPARATUS", meaning: "เครื่องมือ", len: 9, emoji: "🩺" },
    { word: "IMPLEMENT", meaning: "เครื่องมือใช้สอย", len: 9, emoji: "🪛" },
    { word: "UTENSIL", meaning: "อุปกรณ์ในครัว", len: 7, emoji: "🥄" },
    { word: "PACKAGE", meaning: "หีบห่อ", len: 7, emoji: "📦" },
    { word: "CONTAINER", meaning: "ตู้คอนเทนเนอร์/ภาชนะ", len: 9, emoji: "🏗️" },
    { word: "RECEPTACLE", meaning: "ที่รองรับ(เช่นถังขยะ)", len: 10, emoji: "🗑️" },
    { word: "STORAGE", meaning: "ที่เก็บของ/หน่วยความจำ", len: 7, emoji: "🗄️" },
    { word: "WAREHOUSE", meaning: "คลังสินค้า", len: 9, emoji: "🏭" },
    { word: "REPOSITORY", meaning: "คลังสิ่งของ/ที่บรรจุ", len: 10, emoji: "📁" },
    { word: "VAULT", meaning: "ห้องเก็บของนิรภัย", len: 5, emoji: "🔐" },
    { word: "SAFEWAY", meaning: "ทางปลอดภัย", len: 7, emoji: "🛣️" },
    { word: "PASSAGE", meaning: "ทางผ่าน", len: 7, emoji: "🚶" },
    { word: "CORRIDOR", meaning: "ระเบียงทางเดิน", len: 8, emoji: "🏢" },
    { word: "HALLWAY", meaning: "โถงทางเดิน", len: 7, emoji: "🚪" },
    { word: "STAIRCASE", meaning: "บันได", len: 9, emoji: "🪜" },
    { word: "ELEVATOR", meaning: "ลิฟต์", len: 8, emoji: "🛗" },
    { word: "ESCALATOR", meaning: "บันไดเลื่อน", len: 9, emoji: "🪜" },
    { word: "PLATFORM", meaning: "แพลตฟอร์ม/ชานชาลา", len: 8, emoji: "🚉" },
    { word: "TERMINAL", meaning: "สถานีปลายทาง", len: 8, emoji: "🚌" },
    { word: "STATION", meaning: "สถานี", len: 7, emoji: "🚉" },
    { word: "DEPOT", meaning: "โรงเก็บรถ/คลัง", len: 5, emoji: "🏚️" },
    { word: "GARAGE", meaning: "โรงรถ", len: 6, emoji: "🚗" },
    { word: "HANGAR", meaning: "โรงเก็บเครื่องบิน", len: 6, emoji: "✈️" },
    { word: "WHARF", meaning: "ท่าเทียบเรือ", len: 5, emoji: "⚓" },
    { word: "HARBOR", meaning: "ท่าเรือ", len: 6, emoji: "🛳️" },
    { word: "MARINA", meaning: "ท่าจอดเรือยอร์ช", len: 6, emoji: "🛥️" },
    { word: "AIRPORT", meaning: "สนามบิน", len: 7, emoji: "✈️" },
    { word: "HELIPORT", meaning: "สนามจอดเฮลิคอปเตอร์", len: 8, emoji: "🚁" },
    { word: "HIGHWAY", meaning: "ทางหลวง", len: 7, emoji: "🛣️" },
    { word: "EXPRESSWAY", meaning: "ทางด่วน", len: 10, emoji: "🛣️" },
    { word: "MOTORWAY", meaning: "มอเตอร์เวย์", len: 8, emoji: "🏎️" },
    { word: "RAILWAY", meaning: "ทางรถไฟ", len: 7, emoji: "🛤️" },
    { word: "SUBWAY", meaning: "รถไฟใต้ดิน", len: 6, emoji: "🚇" },
    { word: "TRANSIT", meaning: "การขนส่งสาธารณะ", len: 7, emoji: "🚊" },
    { word: "LOGISTICS", meaning: "การจัดการขนส่ง", len: 9, emoji: "🛳️" },
    { word: "INVENTORY", meaning: "สินค้าคงคลัง", len: 9, emoji: "📋" },
    { word: "MANAGEMENT", meaning: "การจัดการ", len: 10, emoji: "👥" },
    { word: "GOVERNANCE", meaning: "การธรรมาภิบาล/ปกป้อง", len: 10, emoji: "⚖️" },
    { word: "REGULATION", meaning: "ข้อบังคับกฎหมาย", len: 10, emoji: "📜" },
    { word: "LEGISLATURE", meaning: "ฝ่ายนิติบัญญัติ", len: 11, emoji: "🏛️" },
    { word: "JUDICIARY", meaning: "ฝ่ายตุลาการ", len: 9, emoji: "👩‍⚖️" },
    { word: "MINISTRY", meaning: "กระทรวง", len: 8, emoji: "🏢" },
    { word: "EMBASSY", meaning: "สถานทูต", len: 7, emoji: "🚩" },
    { word: "CONSULATE", meaning: "สถานกงสุล", len: 9, emoji: "📍" },
    { word: "COUNCIL", meaning: "สภา", len: 7, emoji: "👥" },
    { word: "COMMITTEE", meaning: "คณะกรรมการ", len: 9, emoji: "👥" },
    { word: "ASSEMBLY", meaning: "การรวมตัว/ประกอบชุด", len: 8, emoji: "⚙️" },
    { word: "SOCIETY", meaning: "สังคม", len: 7, emoji: "🌍" },
    { word: "COMMUNITY", meaning: "ชุมชน", len: 9, emoji: "🏡" },
    { word: "NEIGHBOR", meaning: "เพื่อนบ้าน", len: 8, emoji: "👋" },
    { word: "FELLOWSHIP", meaning: "ความเป็นพี่น้อง", len: 10, emoji: "🤝" },
    { word: "BROTHERHOOD", meaning: "ภราดรภาพ", len: 11, emoji: "👬" },
    { word: "SISTERHOOD", meaning: "สมาคมสตรี/พี่น้องสาว", len: 10, emoji: "👭" },
    { word: "MEMBERSHIP", meaning: "ความเป็นสมาชิก", len: 10, emoji: "🎟️" },
    { word: "CITIZENSHIP", meaning: "ความเป็นพลเมือง", len: 11, emoji: "🇺🇳" },
    { word: "PATERNITY", meaning: "ความเป็นพ่อ", len: 9, emoji: "👨" },
    { word: "MATERNITY", meaning: "ความเป็นแม่", len: 9, emoji: "🤱" },
    { word: "CHILDHOOD", meaning: "วัยเด็ก", len: 9, emoji: "🧒" },
    { word: "ADOLESCENCE", meaning: "วัยรุ่น", len: 11, emoji: "🧑" },
    { word: "MATURITY", meaning: "ความเป็นผู้ใหญ่", len: 8, emoji: "🧔" },
    { word: "SENIORITY", meaning: "ความอาวุโส", len: 9, emoji: "👴" },
    { word: "ANESTHESIA", meaning: "ยาสลบ", len: 10, emoji: "💤" },
    { word: "SURGERY", meaning: "ศัลยกรรม", len: 7, emoji: "🩺" },
    { word: "PHARMACY", meaning: "ร้านขายยา", len: 8, emoji: "💊" },
    { word: "HOSPITAL", meaning: "โรงพยาบาล", len: 8, emoji: "🏥" },
    { word: "CLINIC", meaning: "คลินิก", len: 6, emoji: "🩹" },
    { word: "PATIENT", meaning: "คนไข้", len: 7, emoji: "🛌" },
    { word: "NURSE", meaning: "พยาบาล", len: 5, emoji: "👩‍⚕️" },
    { word: "DOCTOR", meaning: "คุณหมอ", len: 6, emoji: "👨‍⚕️" },
    { word: "SURGEON", meaning: "ศัลยแพทย์", len: 7, emoji: "🧤" },
    { word: "DENTIST", meaning: "หมอฟัน", len: 7, emoji: "🦷" },
    { word: "VETERINARY", meaning: "รักษาสัตว์(สัตวแพทย์)", len: 10, emoji: "🐕" },
    { word: "OCCUPATION", meaning: "อาชีพ", len: 10, emoji: "👷" },
    { word: "PROFESSION", meaning: "วิชาชีพ", len: 10, emoji: "👔" },
    { word: "CAREER", meaning: "อาชีพการงาน", len: 6, emoji: "💼" },
    { word: "VOCATION", meaning: "งานใจรัก", len: 8, emoji: "❤️" },
    { word: "BUSINESS", meaning: "ธุรกิจ", len: 8, emoji: "🏢" },
    { word: "COMMERCE", meaning: "การพาณิชย์", len: 8, emoji: "💸" },
    { word: "INDUSTRY", meaning: "อุตสาหกรรม", len: 8, emoji: "🏭" },
    { word: "AGRICULTURE", meaning: "เกษตรกรรม", len: 11, emoji: "🚜" },
    { word: "FISHERY", meaning: "การประมง", len: 7, emoji: "🎣" },
    { word: "FORESTRY", meaning: "การป่าไม้", len: 8, emoji: "🌲" },
    { word: "MINING", meaning: "การทำเหมือง", len: 6, emoji: "⛏️" },
    { word: "MANUFACTURING", meaning: "การผลิตโรงงาน", len: 13, emoji: "⚙️" },
    { word: "CONSTRUCTION", meaning: "การก่อสร้าง", len: 12, emoji: "🏗️" },
    { word: "ENGINEERING", meaning: "วิศวกรรม", len: 11, emoji: "📐" },
    { word: "ARCHITECT", meaning: "สถาปนิก", len: 9, emoji: "🏢" },
    { word: "MECHANIC", meaning: "ช่างยนต์", len: 8, emoji: "🔧" },
    { word: "ELECTRICIAN", meaning: "ช่างไฟ", len: 11, emoji: "⚡" },
    { word: "PLUMBER", meaning: "ช่างประปา", len: 7, emoji: "🚰" },
    { word: "CARPENTER", meaning: "ช่างไม้", len: 9, emoji: "🪚" },
    { word: "BLACKSMITH", meaning: "ช่างตีเหล็ก", len: 10, emoji: "⚒️" },
    { word: "CRAFTSMAN", meaning: "ช่างฝีมือ", len: 9, emoji: "🎨" },
    { word: "ARTISAN", meaning: "ช่างศิลป์", len: 7, emoji: "🏺" },
    { word: "SCULPTOR", meaning: "ประติมากร", len: 8, emoji: "🗿" },
    { word: "PAINTER", meaning: "จิตรกร/ช่างสี", len: 7, emoji: "🖌️" },
    { word: "MUSICIAN", meaning: "นักดนตรี", len: 8, emoji: "🎻" },
    { word: "DANCER", meaning: "นักเต้น", len: 6, emoji: "💃" },
    { word: "SINGER", meaning: "นักร้อง", len: 6, emoji: "🎤" },
    { word: "ACTRESS", meaning: "นักแสดงหญิง", len: 7, emoji: "👸" },
    { word: "JOURNALIST", meaning: "นักข่าว", len: 10, emoji: "📷" },
    { word: "REPORTER", meaning: "ผู้สื่อข่าว", len: 8, emoji: "🎤" },
    { word: "LAWYER", meaning: "ทนายความ", len: 6, emoji: "⚖️" },
    { word: "JUDGE", meaning: "ผู้พิพากษา", len: 5, emoji: "👨‍⚖️" },
    { word: "ATTORNEY", meaning: "ตัวแทนทางกฎหมาย", len: 8, emoji: "📁" },
    { word: "POLICEMAN", meaning: "ตำรวจชาย", len: 9, emoji: "👮" },
    { word: "SOLDIER", meaning: "ทหาร", len: 7, emoji: "🎖️" },
    { word: "SAILOR", meaning: "ลูกเรือ", len: 6, emoji: "⚓" },
    { word: "PILOT", meaning: "นักบิน", len: 5, emoji: "✈️" },
    { word: "FARMER", meaning: "เกษตรกร", len: 6, emoji: "🧑‍🌾" },
    { word: "MINER", meaning: "คนเหมือง", len: 5, emoji: "⛏️" },
    { word: "FISHERMAN", meaning: "คนตกปลา/ชาวประมง", len: 9, emoji: "🛶" },
    { word: "HUNTER", meaning: "นักล่า", len: 6, emoji: "🐺" },
    { word: "WIZARD", meaning: "พ่อมด", len: 6, emoji: "🧙‍♂️" },
    { word: "WITHER", meaning: "เหี่ยวเฉา", len: 6, emoji: "🍂" },
    { word: "WHIRLPOOL", meaning: "น้ำวนขนาดยักษ์", len: 9, emoji: "🌀" },
    { word: "WILDFIRE", meaning: "ไฟป่า", len: 8, emoji: "🔥" },
    { word: "WATCHTOWER", meaning: "หอสังเกตการณ์", len: 10, emoji: "🔭" },
    { word: "WATERFALL", meaning: "น้ำตก", len: 9, emoji: "🌊" },
    { word: "WANDERER", meaning: "ผู้เร่ร่อน", len: 8, emoji: "🚶" },
    { word: "WHITEOUT", meaning: "พายุหิมะขาวโพลน", len: 8, emoji: "❄️" },
    { word: "WRECKAGE", meaning: "ซากปรักหักพัง", len: 8, emoji: "🏚️" },
    { word: "WARSHIP", meaning: "เรือรบ", len: 7, emoji: "🚢" },
    { word: "WELLSPRING", meaning: "ต้นน้ำ", len: 10, emoji: "💧" },
    { word: "XENON", meaning: "ธาตุซีนอน", len: 5, emoji: "💡" },
    { word: "XYLOPHONE", meaning: "ไซโลโฟน/ระนาด", len: 9, emoji: "🎹" },
    { word: "YACHT", meaning: "เรือยอร์ช", len: 5, emoji: "🛥️" },
    { word: "YARDSTICK", meaning: "ไม้หลา/มาตราฐาน", len: 9, emoji: "📏" },
    { word: "YEARBOOK", meaning: "หนังสือรุ่น", len: 8, emoji: "📕" },
    { word: "YELLOWFIN", meaning: "ปลาครีบเหลือง", len: 9, emoji: "🐟" },
    { word: "YESTERDAY", meaning: "เมื่อวาน", len: 9, emoji: "⏳" },
    { word: "YOUTHS", meaning: "เยาวชน", len: 6, emoji: "🧑" },
    { word: "ZIGZAG", meaning: "ฟันปลา/ซิกแซก", len: 6, emoji: "📉" },
    { word: "ZEALOT", meaning: "ผู้คลั่งไคล้", len: 6, emoji: "👺" },
    { word: "ZONE", meaning: "เขต/โซน", len: 4, emoji: "📍" },
    { word: "ZOOM", meaning: "ซูม/ความเร็ว", len: 4, emoji: "🔍" },
    { word: "ZENITH", meaning: "จุดสุดยอด", len: 6, emoji: "🔝" },
    { word: "ZEPHYR", meaning: "สายลมอ่อน", len: 6, emoji: "🍃" },
    { word: "ZERO", meaning: "ศูนย์", len: 4, emoji: "0️⃣" },
    { word: "ZEST", meaning: "ความกระตือรือร้น/ผิวเปลือกส้ม", len: 4, emoji: "🍊" },
    { word: "ZODIAC", meaning: "จักรราศี", len: 6, emoji: "♌" },
    { word: "ZOMBIE", meaning: "ซอมบี้", len: 6, emoji: "🧟" },
    { word: "ZOOLOGY", meaning: "สัตว์วิทยา", len: 7, emoji: "🦋" },
    { word: "ZEBRA", meaning: "ม้าลาย", len: 5, emoji: "🦓" },
];

// --- WORD POOLS: Pre-categorized words for O(1) target selection ---
const WORD_POOLS = {
    easy: GLOBAL_WORD_POOL.filter(w => w.len >= 3 && w.len <= 5),
    medium: GLOBAL_WORD_POOL.filter(w => w.len >= 4 && w.len <= 7),
    hard: GLOBAL_WORD_POOL.filter(w => w.len >= 5 && w.len <= 15)
};

const TypingRPG = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState('MENU'); 
  const [isGameStarted, setIsGameStarted] = useState(false); 
  const [wave, setWave] = useState(1); 
  const [kills, setKills] = useState(0); 
  
  // Castle & Progression
  const [castleLevel, setCastleLevel] = useState(1);
  const [castleXp, setCastleXp] = useState(0);
  const [maxCastleXp, setMaxCastleXp] = useState(BASE_XP_REQ);
  const [acquiredSkills, setAcquiredSkills] = useState([]); // Stores skill IDs like ['burn', 'burn', 'freeze']
  const [skillNotification, setSkillNotification] = useState(null); 
  
  // Inventory System
  const inventoryRef = useRef([]); // Ref for inventory to avoid stale closure in generateWord if needed, or just use state
  const [inventory, setInventory] = useState([]);
  
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);
  const [runHistory, setRunHistory] = useState([]); 
  const [showMeanings, setShowMeanings] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Battle Entities
  const [playerHp, setPlayerHp] = useState(MAX_PLAYER_HP);
  const [enemyHp, setEnemyHp] = useState(BASE_ENEMY_HP);
  const [maxEnemyHp, setMaxEnemyHp] = useState(BASE_ENEMY_HP);
  
  // Image Error States
  const [castleImgError, setCastleImgError] = useState(false);

  // Game Data
  const [wordQueue, setWordQueue] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [combo, setCombo] = useState(0);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0); 
  const [hasTypoInCurrentWord, setHasTypoInCurrentWord] = useState(false);
  
  // Visual Effects
  const [shake, setShake] = useState(false);
  const [bossKnockback, setBossKnockback] = useState(false);
  const [damagePopup, setDamagePopup] = useState(null);
  const [healPopup, setHealPopup] = useState(null);
  const [slashEffect, setSlashEffect] = useState(false);
  const [isInputBlocked, setIsInputBlocked] = useState(false);
  const [statusEffect, setStatusEffect] = useState(null); // 'FROZEN'
  const [skillParticles, setSkillParticles] = useState([]); // Array of {id, emoji, x, y}
  
  // Roulette
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [gainedSkill, setGainedSkill] = useState(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [isDistracted, setIsDistracted] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const lastWordRef = useRef(null);
  const difficultyHistoryRef = useRef([]); // Track difficulty of last words
  
  // Dynamic refs
  const playerHpRef = useRef(playerHp);
  const enemyHpRef = useRef(enemyHp);
  const killsRef = useRef(kills);

  useEffect(() => { playerHpRef.current = playerHp; }, [playerHp]);
  useEffect(() => { enemyHpRef.current = enemyHp; }, [enemyHp]);
  useEffect(() => { killsRef.current = kills; }, [kills]);

  const [isMuted, setIsMuted] = useState(false);
  const [isSlowed, setIsSlowed] = useState(false);
  const skipBlockRef = useRef(false);
  const [isInfiniteMode, setIsInfiniteMode] = useState(false);
  const audioCtx = useRef(null);
  const bgmRef = useRef(null);

  useEffect(() => {
      // Init Audio Context on first interaction
      const initAudio = () => {
          if (!audioCtx.current) {
              audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
          }
      };
      window.addEventListener('keydown', initAudio, { once: true });
      window.addEventListener('mousedown', initAudio, { once: true });
      return () => {
          window.removeEventListener('keydown', initAudio);
          window.removeEventListener('mousedown', initAudio);
      };
  }, []);

  const playTypingSound = (index) => {
      if (isMuted || !audioCtx.current) return;
      
      const now = audioCtx.current.currentTime;
      // Add random jitter to frequency to prevent "robotic" feel
      const jitter = (Math.random() - 0.5) * 30; 
      const baseFreq = 400 + (index * 25) + jitter;

      // 1. Core Sound (Body)
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      
      // Alternate timbre for auditory variety
      osc.type = (index % 3 === 0) ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      osc.start(now);
      osc.stop(now + 0.12);

      // 2. Click Harmonic (Attack)
      const click = audioCtx.current.createOscillator();
      const clickGain = audioCtx.current.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(1500 + (index * 50) + jitter, now);
      
      clickGain.gain.setValueAtTime(0.04, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      
      click.connect(clickGain);
      clickGain.connect(audioCtx.current.destination);
      click.start(now);
      click.stop(now + 0.015);
  };

  useEffect(() => {
      if (!bgmRef.current) {
          bgmRef.current = new Audio('https://freetouse.com/music/download/32281'); 
          // Note: The previous link was a landing page. Using a direct streamable link for testing.
          // In a real environment, this should be a local asset or a direct S3/CDN link.
          bgmRef.current.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"; 
          bgmRef.current.loop = true;
      }
      if (gameState === 'PLAYING' && !isMuted) {
          bgmRef.current.play().catch(e => console.log("BGM Play failed:", e));
          bgmRef.current.volume = 0.3;
      } else {
          bgmRef.current.pause();
      }
  }, [gameState, isMuted]);

  useEffect(() => {
      playerHpRef.current = playerHp;
      enemyHpRef.current = enemyHp;
      killsRef.current = kills;
  }, [playerHp, enemyHp, kills]);

  const startInfiniteMode = () => {
      setIsInfiniteMode(true);
      setGameState('PLAYING');
      spawnEnemy(kills);
  };

// --- LOGIC: Word Generator (High Performance Level O(1)) ---
const generateWord = (difficulty, playerDictionary = []) => {
    try {
        // 1. Dynamic Difficulty Selection
        let candidatesPool;
        const history = difficultyHistoryRef.current;
        const lastWasHard = history[history.length - 1] === 'hard';
        const lastTwoWereHard = history.length >= 2 && history.slice(-2).every(d => d === 'hard');

        const isPanicMode = playerHpRef.current < PANIC_HP_THRESHOLD;

        if (isPanicMode) {
            candidatesPool = WORD_POOLS.easy;
            // No history push for panic to avoid messing up natural scaling
        } else if (difficulty < 3 || lastTwoWereHard) {
            candidatesPool = WORD_POOLS.easy;
            difficultyHistoryRef.current.push('easy');
        } else if (lastWasHard || difficulty < 6) {
            candidatesPool = WORD_POOLS.medium;
            difficultyHistoryRef.current.push('medium');
        } else {
            candidatesPool = WORD_POOLS.hard;
            difficultyHistoryRef.current.push('hard');
        }
        
        // Keep history short
        if (difficultyHistoryRef.current.length > 5) difficultyHistoryRef.current.shift();

        // 2. Set Difference (O(1) Membership Check)
        // แปลง playerDictionary เป็น Set เพื่อความเร็วในการตรวจสอบ (O(N) ครั้งเดียวตอนเริ่มฟังก์ชัน)
        const dictSet = new Set((playerDictionary || []).map(item => item.word));
        
        // คัดกรองเอาเฉพาะคำที่ "ยังไม่มีในคลัง" และ "ไม่ซ้ำกับคำล่าสุด"
        const candidates = candidatesPool.filter(w => {
            const isNotRepeat = !dictSet.has(w.word) && w.word !== lastWordRef.current;
            if (isPanicMode) {
                return isNotRepeat && w.len <= 4; // Force 3-4 chars in panic
            }
            return isNotRepeat;
        });

        if (candidates.length === 0) throw new Error("WORD_POOL_EXHAUSTED");

        const selected = candidates[Math.floor(Math.random() * candidates.length)];
        lastWordRef.current = selected.word;
        idCounter.current += 1;
        
        return { ...selected, id: `word-${idCounter.current}` };
    } catch (error) {
        // Fallback: หากคลังเต็ม (ไม่มีคำเหลือให้สุ่มแล้ว) ให้สุ่มจาก Pool เดิมมาให้เล่นต่อ
        let pool;
        if (playerHpRef.current < PANIC_HP_THRESHOLD) {
            pool = WORD_POOLS.easy.filter(w => w.len <= 4);
        } else {
            pool = difficulty <= 5 ? WORD_POOLS.easy : (difficulty <= 15 ? WORD_POOLS.medium : WORD_POOLS.hard);
        }
        
        const selected = pool[Math.floor(Math.random() * pool.length)];
        
        lastWordRef.current = selected.word;
        idCounter.current += 1;
        
        return { ...selected, id: `word-${idCounter.current}` };
    }
};

  // --- LOGIC: Game Management ---
  const startGame = () => {
    setWave(1);
    setKills(0);
    setIsInfiniteMode(false); // Reset infinite mode
    setCastleLevel(1);
    setCastleXp(0);
    setAcquiredSkills([]);
    // First words for the game
    setWordQueue([generateWord(1, inventory), generateWord(1, inventory)]);
    setRunHistory([]);
    setUserInput('');
    setCombo(0);
    setTotalWordsTyped(0);
    setSkillNotification(null);
    setIsGameStarted(true);
    setGameState('PLAYING');
    setCastleImgError(false);
    setStatusEffect(null);
    setSkillParticles([]);
    
    startLoops();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const resumeGame = () => {
    setGameState('PLAYING');
    startLoops();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const pauseGame = () => {
    stopLoops();
    setGameState('MENU');
  };

  const stopLoops = () => {
      if (timerRef.current) clearInterval(timerRef.current);
  };

  const startLoops = () => {
      startDrainLoop();
  };

  // --- LOGIC: Game Loop ---
  const startDrainLoop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const tickRate = TICK_RATE; 

    timerRef.current = setInterval(() => {
        if (showLevelUpModal) return;

        setPlayerHp(prev => {
            if (prev <= 0) {
                stopLoops();
                setGameState('GAMEOVER');
                setIsGameStarted(false);
                return 0;
            }
            
            // Linear Movement Logic
            // Dynamic Speed Logic
            const pushLvl = getSkillLevel('push');
            
            // ปรับความเร็วช่วงต้นเกม (0-7 kills): 0/20 -> 7/20
            // ความเร็วจะค่อยๆ เพิ่มขึ้น โดยเริ่มจากช้ากว่าเดิม
            let speedFactor = 0.4;
            if (killsRef.current <= 7) {
                speedFactor = 0.2; // ลดความเร็วลงครึ่งหนึ่งในช่วง 7 ตัวแรก
            }
            const bossSpeedBonus = (killsRef.current * speedFactor); 
            
            let drainPerSec = BASE_DRAIN_RATE + bossSpeedBonus + (pushLvl * 1.3);

            // Endgame Spike (Wave 13/20+)
            if (killsRef.current >= 12) {
                drainPerSec += 3; 
            }
            
            if (statusEffect === 'FROZEN') {
                drainPerSec = -0.2; // True Time Stop
            } else if (isSlowed) {
                drainPerSec *= 1.2; // Boss moves 50% slower
            }

            let drainPerTick = drainPerSec * (TICK_RATE / 1000);
            return Math.max(0, prev - drainPerTick);
        });

        // Clean up particles
        setSkillParticles(prev => prev.filter(p => Date.now() - p.id < 1000));
        
    }, tickRate);
  };

  useEffect(() => {
      if (gameState === 'PLAYING' && !showLevelUpModal) {
          startDrainLoop();
      } else {
          stopLoops();
      }
      return () => stopLoops();
  }, [showLevelUpModal, gameState, acquiredSkills, statusEffect]); 

  useEffect(() => {
    if (wordQueue[0]) {
      // FORCE TOTAL INPUT CLEARANCE
      setUserInput('');
      setHasTypoInCurrentWord(false);
      if (inputRef.current) inputRef.current.value = '';

      if (skipBlockRef.current) {
          skipBlockRef.current = false;
          setIsInputBlocked(false);
          setTimeout(() => inputRef.current?.focus(), 10);
          return;
      }
      setIsInputBlocked(true);
      const timer = setTimeout(() => {
          setIsInputBlocked(false);
          // Auto-refocus after block expires
          setTimeout(() => inputRef.current?.focus(), 10);
      }, 250); // Reduced from 500ms for responsiveness
      return () => clearTimeout(timer);
    }
  }, [wordQueue[0]?.id]);

  const handleInput = (e) => {
      if (gameState !== 'PLAYING' || showLevelUpModal || isInputBlocked) return;
      const val = e.target.value.toUpperCase();
      const target = wordQueue[0];
      if (!target) return;

      if (target.word.startsWith(val)) {
          playTypingSound(val.length);
          setUserInput(val);
          if (val === target.word) {
              processWordComplete(target);
          }
      } else {
          setHasTypoInCurrentWord(true);
          setCombo(0);
          shakeConsole();
          // Restore penalty: Boss moves on typo UNLESS time is frozen
          if (statusEffect !== 'FROZEN') {
              setPlayerHp(prev => Math.max(0, prev - TYPO_PENALTY));
          }
      }
  };

  // Helper to count skill levels
  const getSkillLevel = (skillId) => acquiredSkills.filter(s => s === skillId).length;

  const processWordComplete = (target) => {
      setTotalWordsTyped(prev => prev + 1);
      
      // Save word to history
      setRunHistory(prev => {
          if (!prev.some(w => w.word === target.word)) return [...prev, target];
          return prev;
      });

      addCastleXp(100 + (combo * 30));
      
      const godLvl = getSkillLevel('god');
      
      // GOD LVL 3 = INSTANT KILL
      if (godLvl === 3) {
          setEnemyHp(0);
          setDamagePopup({ val: 'GOD KILL', crit: true });
          setTimeout(() => setDamagePopup(null), 800);
          setHealPopup(`TOTAL ANNIHILATION!`);
          setTimeout(() => setHealPopup(null), 800);
          setUserInput('');
          setCombo(c => c + 1);
          setPlayerHp(MAX_PLAYER_HP); // Reset position for next boss
          handleKillBoss();
          return;
      }

      let castCount = 1;
      let powerMult = 1;

      if (godLvl === 1) powerMult = 4;
      else if (godLvl === 2) powerMult = 10;

      if (godLvl === 1 && Math.random() < 0.5) castCount = 2;
      else if (godLvl === 2 && Math.random() < 0.35) castCount = 3;

      let totalDamage = 0;
      let totalKnockback = 0;

      for (let i = 0; i < castCount; i++) {
          // --- DAMAGE CALCULATION ---
          let currentDmg = (40 + (combo * 3.1)) * powerMult;
          
          // 1. FIRE SKILL
          const fireLvl = getSkillLevel('burn');
          if (fireLvl > 0) {
              const burnDmg = 250 * fireLvl * powerMult;
              currentDmg += burnDmg;
              addSkillParticle('🔥');
              if (godLvl > 0) addSkillParticle('💥');
          }
          totalDamage += currentDmg;

          // 2. PUSH SKILL
          const pushLvl = getSkillLevel('push');
          let currentPush = 3 * powerMult; 
          if (pushLvl > 0) {
              currentPush += (pushLvl * 4.2 * powerMult); 
              addSkillParticle('💨');
              if (godLvl > 0 && Math.random() < 0.02) {
                  currentPush += 150; 
                  addSkillParticle('🪐');
                  addSkillParticle('⚡');
              }
          }
          totalKnockback += currentPush;

          // 3. ICE SKILL
          const iceLvl = getSkillLevel('freeze');
          if (iceLvl > 0) {
              setStatusEffect('FROZEN');
              addSkillParticle('❄️');
              if (godLvl > 0) {
                  addSkillParticle('⚡');
                  setIsSlowed(true);
                  setTimeout(() => setIsSlowed(false), 5000 * (godLvl + 1)); // Lingering slow
              }
              setTimeout(() => setStatusEffect(null), 500 + (iceLvl * 500) + (godLvl * 1000));
          }
      }

      // Apply cumulative effects
      setEnemyHp(prev => prev - totalDamage);
      setDamagePopup({ val: Math.floor(totalDamage), crit: (totalDamage > 100 || godLvl > 0) });
      setTimeout(() => setDamagePopup(null), 800);
      setSlashEffect(true);
      
      setPlayerHp(prev => Math.min(MAX_PLAYER_HP, prev + totalKnockback));
      setBossKnockback(true);
      setTimeout(() => {
          setSlashEffect(false);
          setBossKnockback(false);
      }, 200);

      setHealPopup(godLvl > 0 ? `GOD POWER! x${castCount}` : `HIT!`);
      setTimeout(() => setHealPopup(null), 800);

      setUserInput('');
      setCombo(c => c + 1);
      
      // Dictionary Collection: Only if PERFECT (no typos)
      if (!hasTypoInCurrentWord) {
          setInventory(prev => {
              if (prev.some(w => w.word === target.word)) return prev;
              const newInv = [...prev, target];
              inventoryRef.current = newInv;
              return newInv;
          });
      }
      setHasTypoInCurrentWord(false); 

      if (enemyHpRef.current - totalDamage <= 0) {
          handleKillBoss();
      } else {
          setWordQueue(prev => [prev[1], generateWord(killsRef.current, inventoryRef.current)]);
      }
  };

  const addSkillParticle = (emoji) => {
      setSkillParticles(prev => [
          ...prev, 
          { id: Date.now() + Math.random(), emoji, x: Math.random() * 80 - 40, y: Math.random() * 80 - 40 }
      ]);
  };

  const handleKillBoss = () => {
      killsRef.current += 1;
      const currentKills = killsRef.current;
      setKills(currentKills);
      setHasTypoInCurrentWord(false);
      setUserInput('');
      
      if (currentKills >= WIN_BOSS_COUNT && !isInfiniteMode) { 
          stopLoops();
          setGameState('VICTORY');
      } else {
          spawnEnemy(currentKills);
      }
  };

  const spawnEnemy = (killCount) => {
      const newMaxHp = Math.floor(BASE_ENEMY_HP * Math.pow(1.35, killCount)); 
      setEnemyHp(newMaxHp);
      setMaxEnemyHp(newMaxHp);
      setStatusEffect(null); 
      setWordQueue([generateWord(killCount, inventoryRef.current), generateWord(killCount, inventoryRef.current)]);

      // 10% Chance for visual distraction if boss is far (playerHp is high)
      if (playerHpRef.current > 70 && Math.random() < 0.1) {
          setIsDistracted(true);
          setTimeout(() => setIsDistracted(false), 4000); // Distortion lasts 4 seconds
      }
  };

  const addCastleXp = (amount) => {
      let newXp = castleXp + amount;
      if (newXp >= maxCastleXp) {
          const nextLevel = castleLevel + 1;
          setCastleLevel(nextLevel);
          setCastleXp(newXp - maxCastleXp);
          setMaxCastleXp(prev => Math.floor(prev * 1.1));
          
          autoAcquireSkill(); 
      } else {
          setCastleXp(newXp);
      }
  };

  const autoAcquireSkill = () => {
      // Filter skills not yet at max level
      const currentCounts = {};
      SKILLS.forEach(s => currentCounts[s.id] = 0);
      acquiredSkills.forEach(id => { if(currentCounts[id] !== undefined) currentCounts[id]++ });

      const availableSkills = SKILLS.filter(s => {
          if (s.id === 'god') {
              // Only unlock GOD if fire, freeze, push are all MAX
              return currentCounts['burn'] === MAX_SKILL_LEVEL && 
                     currentCounts['freeze'] === MAX_SKILL_LEVEL && 
                     currentCounts['push'] === MAX_SKILL_LEVEL &&
                     currentCounts['god'] < MAX_SKILL_LEVEL;
          }
          return currentCounts[s.id] < MAX_SKILL_LEVEL;
      });

      if (availableSkills.length > 0) {
          const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
          
          if (randomSkill.id === 'god' && getSkillLevel('god') === 0) {
              // PRESTIGE: Absorb all skills when first becoming GOD
              setAcquiredSkills(prev => {
                  const baseSkills = ['burn', 'freeze', 'push'];
                  // Remove ALL base skills, add GOD
                  const filtered = prev.filter(s => !baseSkills.includes(s));
                  return [...filtered, 'god'];
              });
          } else {
              setAcquiredSkills(prev => [...prev, randomSkill.id]);
          }
          
          setSkillNotification(randomSkill);
          setTimeout(() => setSkillNotification(null), 3000);
      } else {
          // All Maxed: Heal instead
          setPlayerHp(MAX_PLAYER_HP);
          setSkillNotification({ name: "Full Heal", icon: <Heart className="text-red-500" />, desc: "All skills maxed!" });
          setTimeout(() => setSkillNotification(null), 3000);
      }
  };

  const shakeConsole = () => {
      const el = document.getElementById('typing-console');
      if(el) {
          el.classList.add('translate-x-2', 'bg-red-900/50');
          setTimeout(() => el.classList.remove('translate-x-2', 'bg-red-900/50'), 100);
      }
  };

  // --- RENDERERS ---
  
  if (gameState === 'MENU') {
      return (
          <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
              <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
              
              <div className="relative z-10 text-center space-y-8">
                  <h1 className="text-[7rem] font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse tracking-tighter">EMOJI TYPING</h1>
                  <div className="flex flex-col gap-4 w-64 mx-auto">
                      {isGameStarted && <button onClick={resumeGame} className="bg-green-600 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"><Play className="fill-white" /> RESUME</button>}
                      <button onClick={startGame} className="bg-blue-600 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"><Play className="fill-white" /> {isGameStarted ? 'NEW GAME' : 'START'}</button>
                      <button onClick={() => setGameState('INVENTORY')} className="bg-slate-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-600 hover:bg-slate-700 transition-colors"><BookOpen className="w-5 h-5" /> DICTIONARY ({inventory.length})</button>
                      <button onClick={() => setGameState('INFO')} className="bg-slate-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-600 hover:bg-slate-700 transition-colors"><Info className="w-5 h-5" /> SKILLS</button>
                  </div>
              </div>
          </div>
      );
  }

  if (gameState === 'INVENTORY') {
    const filtered = inventory.filter(i => i.word.toLowerCase().includes(searchQuery.toLowerCase()) || i.meaning.includes(searchQuery));
    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-6">
                <div className="flex justify-between items-center">
                    <button onClick={() => setGameState('MENU')} className="text-slate-400 hover:text-white flex items-center gap-2"><ArrowLeft /> Back</button>
                    <h2 className="text-3xl font-black text-blue-400 flex items-center gap-2"><BookOpen /> COLLECTED WORDS</h2>
                    <button onClick={() => setShowMeanings(!showMeanings)} className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-600 flex items-center gap-2">
                        {showMeanings ? <EyeOff size={18}/> : <Eye size={18}/>} {showMeanings ? 'Hide Meaning' : 'Show Meaning'}
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                    <input type="text" placeholder="Search..." className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {filtered.map((item, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-500 transition-colors group">
                            <div className="text-3xl">{item.emoji}</div>
                            <div className="flex-1">
                                <div className="font-mono font-bold text-lg text-blue-300 group-hover:text-blue-200">{item.word}</div>
                                <div className="text-sm text-yellow-500">
                                    {showMeanings ? item.meaning : <span className="text-slate-700 cursor-pointer" onClick={(e)=>e.target.innerText=item.meaning}>Tap to reveal</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  if (gameState === 'INFO') {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center overflow-auto">
            <div className="w-full max-w-3xl space-y-4">
                <button onClick={() => setGameState('MENU')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4"><ArrowLeft /> Back</button>
                <h2 className="text-3xl font-bold flex items-center gap-2"><Zap /> SKILLS GUIDE</h2>
                <div className="grid gap-3">
                    {SKILLS.map(skill => (
                        <div key={skill.id} className={`bg-slate-800 p-4 rounded-2xl border-l-4 ${skill.color.replace('text', 'border')} flex items-center gap-4`}>
                            <div className="p-3 bg-slate-900 rounded-full">{skill.icon}</div>
                            <div><div className="font-bold text-lg">{skill.name}</div><div className="text-sm text-slate-400">{skill.desc}</div></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  if (gameState === 'GAMEOVER' || gameState === 'VICTORY') {
      return (
          <div className={`min-h-screen ${gameState === 'VICTORY' ? 'bg-slate-900' : 'bg-red-950'} flex flex-col items-center justify-center text-white p-8`}>
              {gameState === 'VICTORY' ? <div className="text-9xl mb-6 filter drop-shadow-[0_0_50px_rgba(234,179,8,0.6)] animate-bounce">👑</div> : <div className="text-9xl mb-6 filter drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">💀</div>}
              <h2 className="text-6xl font-black mb-4 tracking-tighter">{gameState === 'VICTORY' ? 'VICTORY!' : 'DEFEATED'}</h2>
              <p className="text-xl text-slate-300 mb-8">Bosses Slain: {kills}/{WIN_BOSS_COUNT}</p>
              <div className="flex gap-4">
                  <button onClick={() => {
                      setIsInfiniteMode(false);
                      setGameState('MENU');
                  }} className="bg-white text-black px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl">Main Menu</button>
                  {gameState === 'VICTORY' && (
                      <>
                          <button onClick={startInfiniteMode} className="bg-yellow-500 text-black px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-2 border-b-4 border-yellow-700">🚀 INFINITE MODE</button>
                          <button onClick={() => setGameState('INVENTORY')} className="bg-blue-600 px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-2"><BookOpen /> View Words</button>
                      </>
                  )}
              </div>
          </div>
      );
  }

  // --- GAMEPLAY UI ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans select-none flex flex-col overflow-hidden relative" onClick={() => inputRef.current?.focus()}>
        <input ref={inputRef} type="text" className="opacity-0 absolute" value={userInput} onChange={handleInput} autoFocus />

        {/* --- TOP HUD --- */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-30 pointer-events-none">
            <div className="flex gap-4 pointer-events-auto">
                <button onClick={pauseGame} className="bg-slate-800 p-2 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-400 transition-colors"><Home className="w-5 h-5" /></button>
                <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700 backdrop-blur-md flex flex-col min-w-[140px]">
                    <div className="flex justify-between items-center mb-1 text-xs font-bold text-yellow-500">
                        <span><Castle className="inline w-3 h-3 mr-1"/> Lv.{castleLevel}</span>
                        <span className="text-slate-400 text-[10px] font-normal">{Math.floor(castleXp)}/{maxCastleXp} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${(castleXp / maxCastleXp) * 100}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
                  >
                      {isMuted ? <VolumeX className="w-6 h-6 text-red-400" /> : <Volume2 className="w-6 h-6 text-green-400" />}
                  </button>
                  <div className="flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <span className="text-white font-black text-lg tracking-tighter">BOSS {kills + 1}{isInfiniteMode ? " / ∞" : ` / ${WIN_BOSS_COUNT}`}</span>
                  </div>
                </div>
            </div>
            
            <div className="flex gap-1 p-2 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm max-w-[400px] flex-wrap justify-end">
                {acquiredSkills.map((skillId, idx) => {
                    const s = SKILLS.find(x => x.id === skillId);
                    return (
                        <div key={idx} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-full border border-slate-600 shadow-sm">
                            {React.cloneElement(s.icon, { className: "w-3 h-3 " + s.color })}
                        </div>
                    );
                })}
            </div>

            <div className="text-4xl font-black italic text-slate-700 pointer-events-none pr-4">{combo}x</div>
        </div>

        {/* --- BATTLE ARENA --- */}
        <div className={`flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center ${playerHp < 35 ? 'animate-shake' : ''}`} style={playerHp < 35 ? {animationDuration: `${0.1 + (playerHp/35)*0.3}s`} : {}}>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
            <div className={`absolute left-[15%] top-0 bottom-0 w-1.5 bg-red-700 shadow-[0_0_25px_rgba(185,28,28,0.7)] active-danger-line z-10 transition-all duration-300 ${playerHp < 35 ? 'scale-x-125' : ''}`} />
            
            {/* Panic Overlay */}
            {playerHp < 35 && (
                <div 
                    className="absolute inset-0 pointer-events-none z-0 bg-red-600/20 animate-panic-pulse" 
                    style={{ animationDuration: `${0.2 + (playerHp / 35) * 0.8}s` }}
                />
            )}

            {/* Time Stop Overlay REMOVED */}

            {/* Dynamic Castle Emoji */}
            <div className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                <div className={`text-8xl md:text-9xl filter drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] animate-float-bounce transition-all duration-300 ${playerHp < 35 ? 'scale-110' : ''}`}>
                    {playerHp < 35 ? '😱' : '😎'}
                </div>
                <div className="mt-2 text-[10px] font-bold text-blue-400 bg-blue-900/40 px-3 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-tighter">My Castle</div>
            </div>

            {/* Boss - NO CSS TRANSITION for pure JS movement */}
            <div className="absolute inset-0 pointer-events-none">
                {wordQueue[0] && (
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ left: `${20 + (playerHp / MAX_PLAYER_HP) * 60}%` }} 
                    >
                        <div className={`relative group ${bossKnockback ? 'translate-x-2' : ''}`}>
                            <div className={`text-[10rem] filter drop-shadow-2xl transition-transform duration-75 ${statusEffect === 'FROZEN' ? 'brightness-150 grayscale text-blue-200' : ''}`}>
                                {wordQueue[0].emoji}
                            </div>
                            
                            {/* Skill Particles */}
                            {skillParticles.map(p => (
                                <div key={p.id} className="absolute text-4xl animate-bounce" style={{ top: `calc(50% + ${p.y}px)`, left: `calc(50% + ${p.x}px)` }}>{p.emoji}</div>
                            ))}

                            {slashEffect && <div className="absolute inset-0 w-[140%] h-2 bg-white rotate-[-45deg] animate-ping shadow-[0_0_30px_#fff]"></div>}
                            {damagePopup && <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center z-50"><span className={`text-6xl font-black italic stroke-black text-white ${damagePopup.crit ? 'text-yellow-400 scale-125' : ''}`} style={{WebkitTextStroke: '2px black'}}>{damagePopup.val}</span></div>}
                        </div>
                        <div className="mt-4 w-48 h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-xl">
                            <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 transition-all duration-200" style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }}></div>
                        </div>
                        <div className="mt-1 text-xs font-bold text-red-500 uppercase tracking-widest bg-black/40 px-3 py-0.5 rounded-full">Boss {kills + 1}/{WIN_BOSS_COUNT}</div>
                    </div>
                )}
            </div>
        </div>

        {/* --- TYPING CONSOLE --- */}
        <div id="typing-console" className="h-52 bg-slate-950 border-t-4 border-slate-800 relative z-40">
            {isDistracted && (
                <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 text-9xl font-black italic select-none">DISTORTED</span>
                    </div>
                </div>
            )}
            <div className="absolute top-0 left-0 h-1.5 w-full bg-slate-800">
                <div className="h-full transition-all duration-150" style={{ width: `${(playerHp / MAX_PLAYER_HP) * 100}%`, backgroundColor: playerHp < 30 ? '#ef4444' : '#22c55e', boxShadow: `0 0 15px ${playerHp < 30 ? '#ef4444' : '#22c55e'}` }} />
            </div>
            
            {healPopup && <div className="absolute -top-12 left-8 text-green-400 font-black text-4xl animate-bounce drop-shadow-lg">{healPopup}</div>}

            {skillNotification && (
                <div className="absolute bottom-4 left-4 z-50 bg-slate-800 border-2 border-yellow-500 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-left-10 shadow-2xl max-w-[200px]">
                    <div className="p-2 bg-slate-900 rounded-xl">{skillNotification.icon}</div>
                    <div>
                        <div className="text-yellow-400 font-black text-xs uppercase">Level Up!</div>
                        <div className="text-white font-bold text-[10px]">{skillNotification.name}</div>
                    </div>
                </div>
            )}

            <div className="flex h-full items-center justify-center gap-16 px-12">
                <div className="flex flex-col items-center gap-4">
                    <div key={wordQueue[0]?.id + 'm'} className="text-5xl font-black text-yellow-400 drop-shadow-md animate-pop-center-then-up absolute top-8">
                        {wordQueue[0]?.meaning}
                    </div>
                    <div key={wordQueue[0]?.id + 'w'} className={`flex gap-2 justify-center mt-16 animate-reveal-keys transition-opacity duration-200 ${isInputBlocked ? 'opacity-40' : 'opacity-100'}`}>
                        {wordQueue[0]?.word.split('').map((char, i) => {
                            const isTyped = i < userInput.length;
                            const isCurr = i === userInput.length;
                            return (
                                <div key={i} className={`w-20 h-24 rounded-2xl border-2 flex items-center justify-center text-6xl font-mono font-black transition-all duration-75 ${isTyped ? 'bg-slate-700 border-green-600 text-green-400 translate-y-1 border-b-2' : isCurr ? 'bg-slate-600 border-white text-white animate-pulse -translate-y-1 scale-110 border-b-8' : 'bg-slate-800 border-slate-700 text-slate-600 border-b-8'}`}>{char}</div>
                            );
                        })}
                    </div>
                </div>

                {wordQueue[1] && (
                    <div className="flex flex-col opacity-30 border-l-2 border-slate-800 pl-12 max-sm:hidden">
                        <div className="text-[10px] font-bold text-slate-500 mb-1 tracking-widest uppercase">Next Target</div>
                        <div className="text-2xl text-yellow-700 font-bold mb-1">{wordQueue[1].meaning}</div>
                        <div className="flex gap-1 flex-wrap max-w-xs">
                            {wordQueue[1].word.split('').map((c, i) => (
                                <div key={i} className="w-8 h-10 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-600 font-bold border-b-4">{c}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <style>{`
            @keyframes pop-center-then-up { 
                0% { opacity: 0; transform: translateY(40px) scale(0.5); } 
                30% { opacity: 1; transform: translateY(40px) scale(1.3); }
                100% { transform: translateY(0) scale(1); } 
            }
            .animate-pop-center-then-up { animation: pop-center-then-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            
            @keyframes reveal-keys { 
                0% { opacity: 0; transform: translateY(20px); } 
                50% { opacity: 0; transform: translateY(20px); } 
                100% { opacity: 1; transform: translateY(0); } 
            }
            .animate-reveal-keys { animation: reveal-keys 0.6s ease-out forwards; }


            @keyframes panic-pulse {
                0%, 100% { opacity: 0.1; }
                50% { opacity: 0.4; }
            }
            .animate-panic-pulse { animation: panic-pulse ease-in-out infinite; }

            @keyframes shake {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(-2px, 2px); }
                50% { transform: translate(2px, -2px); }
                75% { transform: translate(-2px, -2px); }
            }
            .animate-shake { animation: shake linear infinite; }

            @keyframes float-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            .animate-float-bounce { animation: float-bounce 2.5s ease-in-out infinite; }

            .active-danger-line {
                animation: pulse-line 3s infinite;
            }
            @keyframes pulse-line {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
            }

            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        `}</style>
    </div>
  );
};

export default TypingRPG;