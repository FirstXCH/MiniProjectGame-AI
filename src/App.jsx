import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Zap, Shield, Flame, Skull, 
  ChevronsRight, Crown, Sword, 
  Droplets, Snowflake, Star, ArrowLeft,
  Info, RotateCcw, FastForward, Castle, Play, Home,
  Bomb, MoveRight, Coins, BookOpen, Eye, EyeOff, Search
} from 'lucide-react';

// --- GLOBAL CONSTANTS ---

const MAX_PLAYER_HP = 100;
const BASE_DRAIN_RATE = 3.5; 
const HEAL_PER_WORD = 4; 
const BASE_ENEMY_HP = 60; 
const BASE_XP_REQ = 100; 
const TYPO_PENALTY = 10;
const TICK_RATE = 16; 
const WIN_BOSS_COUNT = 10;
const MAX_SKILL_LEVEL = 3;

// Image IDs
const IMG_CASTLE_ID = "14SlsJ9Nky-pqF-l2Npd33Gxq6fmp9QUi";
const getDriveImg = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w500`;

// --- 3 PRIMARY SKILLS ---
const SKILLS = [
  { id: 'burn', name: 'Fire', icon: <Flame className="text-orange-500" />, desc: 'Bonus Damage on every hit', color: 'border-orange-500' },
  { id: 'freeze', name: 'Ice', icon: <Snowflake className="text-cyan-400" />, desc: 'Stuns boss briefly on hit', color: 'border-cyan-400' },
  { id: 'push', name: 'Push', icon: <MoveRight className="text-yellow-400" />, desc: 'Knocks boss back on hit', color: 'border-yellow-400' },
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
    { word: "SPEAK", meaning: "พูด", len: 5, emoji: "🗣️" }
];

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
  const [inventory, setInventory] = useState([]);
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

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const idCounter = useRef(0);
  const lastWordRef = useRef(null);
  
  // Dynamic refs
  const playerHpRef = useRef(playerHp);
  const enemyHpRef = useRef(enemyHp);
  const killsRef = useRef(kills);

  useEffect(() => {
      playerHpRef.current = playerHp;
      enemyHpRef.current = enemyHp;
      killsRef.current = kills;
  }, [playerHp, enemyHp, kills]);

  // เตรียมข้อมูลล่วงหน้า 1 ครั้ง (สมมติว่า run ตอนโหลดเกม)
const wordsByLength = {
    short: GLOBAL_WORD_POOL.filter(w => w.len >= 3 && w.len <= 5),
    medium: GLOBAL_WORD_POOL.filter(w => w.len >= 4 && w.len <= 7),
    long: GLOBAL_WORD_POOL.filter(w => w.len >= 5 && w.len <= 15)
};

// --- LOGIC: Word Generator (High Performance) ---
const generateWord = (difficulty) => {
    // 1. ชี้เป้าไปที่กลุ่มคำศัพท์ที่เตรียมไว้แล้วเลย (ไม่ต้องมานั่ง filter ใหม่ทุกรอบ)
    let candidatesPool;
    if (difficulty <= 5) candidatesPool = wordsByLength.short;
    else if (difficulty <= 15) candidatesPool = wordsByLength.medium;
    else candidatesPool = wordsByLength.long;

    // 2. กรองแค่คำซ้ำ (เร็วกว่ากรองใหม่ทั้งหมดมากๆ)
    const candidates = candidatesPool.filter(w => w.word !== lastWordRef.current);

    const selected = candidates.length > 0 
        ? candidates[Math.floor(Math.random() * candidates.length)] 
        : GLOBAL_WORD_POOL[0]; // Fallback
    
    lastWordRef.current = selected.word;
    idCounter.current += 1;
    
    return { ...selected, id: `word-${idCounter.current}` };
};

  // --- LOGIC: Game Management ---
  const startGame = () => {
    setWave(1);
    setKills(0);
    setCastleLevel(1);
    setCastleXp(0);
    setMaxCastleXp(BASE_XP_REQ);
    setPlayerHp(MAX_PLAYER_HP);
    setEnemyHp(BASE_ENEMY_HP);
    setMaxEnemyHp(BASE_ENEMY_HP);
    setAcquiredSkills([]);
    setWordQueue([generateWord(1), generateWord(1)]);
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
            let drainPerSec = BASE_DRAIN_RATE;
            
            if (statusEffect === 'FROZEN') {
                drainPerSec = 0; // Boss stops completely
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
      setIsInputBlocked(true);
      const timer = setTimeout(() => setIsInputBlocked(false), 500); 
      return () => clearTimeout(timer);
    }
  }, [wordQueue[0]?.id]);

  const handleInput = (e) => {
      if (gameState !== 'PLAYING' || showLevelUpModal || isInputBlocked) return;
      const val = e.target.value.toUpperCase();
      const target = wordQueue[0];
      if (!target) return;

      if (target.word.startsWith(val)) {
          setUserInput(val);
          if (val === target.word) {
              processWordComplete(target);
          }
      } else {
          setCombo(0);
          shakeConsole();
          setPlayerHp(prev => Math.max(0, prev - TYPO_PENALTY));
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

      addCastleXp(30 + (combo * 5));
      
      // --- DAMAGE CALCULATION ---
      let damage = 20 + (combo * 2);
      
      // 1. FIRE SKILL (Bonus Damage)
      const fireLvl = getSkillLevel('burn');
      if (fireLvl > 0) {
          const burnDmg = 10 * fireLvl;
          damage += burnDmg;
          addSkillParticle('🔥');
      }

      setEnemyHp(prev => prev - damage);
      setDamagePopup({ val: damage, crit: damage > 40 });
      setTimeout(() => setDamagePopup(null), 800);
      setSlashEffect(true);
      
      // 2. PUSH SKILL (Knockback)
      const pushLvl = getSkillLevel('push');
      let knockbackDist = 2; // Default small knockback from Heal/Hit
      if (pushLvl > 0) {
          knockbackDist += (pushLvl * 5); // Push further per level
          addSkillParticle('💨');
      }
      
      // Apply Knockback (Heal acts as pushback in this linear logic)
      setPlayerHp(prev => Math.min(MAX_PLAYER_HP, prev + knockbackDist));
      
      setBossKnockback(true);
      setTimeout(() => {
          setSlashEffect(false);
          setBossKnockback(false);
      }, 200);

      // 3. ICE SKILL (Freeze)
      const iceLvl = getSkillLevel('freeze');
      if (iceLvl > 0) {
          setStatusEffect('FROZEN');
          addSkillParticle('❄️');
          // Duration: 1s, 1.5s, 2s
          setTimeout(() => setStatusEffect(null), 500 + (iceLvl * 500));
      }

      setHealPopup(`HIT!`); // Visual feedback
      setTimeout(() => setHealPopup(null), 800);

      setUserInput('');
      setCombo(c => c + 1);
      
      if (enemyHpRef.current - damage <= 0) handleKillBoss();
      else setWordQueue(prev => [prev[1], generateWord(killsRef.current)]);
  };

  const addSkillParticle = (emoji) => {
      setSkillParticles(prev => [
          ...prev, 
          { id: Date.now() + Math.random(), emoji, x: Math.random() * 80 - 40, y: Math.random() * 80 - 40 }
      ]);
  };

  const handleKillBoss = () => {
      const currentKills = killsRef.current + 1;
      setKills(currentKills);
      if (currentKills >= WIN_BOSS_COUNT) { 
          stopLoops();
          // Transfer history to inventory
          setInventory(prev => {
              const unique = runHistory.filter(h => !prev.some(p => p.word === h.word));
              return [...prev, ...unique];
          });
          setGameState('VICTORY');
      } else {
          spawnEnemy(currentKills);
      }
  };

  const spawnEnemy = (killCount) => {
      const newMaxHp = Math.floor(60 * (1 + killCount * 0.3)); 
      setEnemyHp(newMaxHp);
      setMaxEnemyHp(newMaxHp);
      setStatusEffect(null); // Reset freeze on new boss
      setWordQueue([generateWord(killCount), generateWord(killCount)]);
  };

  const addCastleXp = (amount) => {
      let newXp = castleXp + amount;
      if (newXp >= maxCastleXp) {
          setCastleLevel(prev => prev + 1);
          setCastleXp(newXp - maxCastleXp);
          setMaxCastleXp(prev => Math.floor(prev * 1.3));
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

      const availableSkills = SKILLS.filter(s => currentCounts[s.id] < MAX_SKILL_LEVEL);

      if (availableSkills.length > 0) {
          const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
          setAcquiredSkills(prev => [...prev, randomSkill.id]);
          setSkillNotification(randomSkill);
      } else {
          // All Maxed: Heal instead
          setPlayerHp(MAX_PLAYER_HP);
          setSkillNotification({ name: "Full Heal", icon: <Heart className="text-red-500" />, desc: "All skills maxed!" });
      }
      
      setTimeout(() => setSkillNotification(null), 3000);
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
              <div className="z-10 text-center space-y-8">
                  <h1 className="text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 drop-shadow-2xl">BOSS RUSH</h1>
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
              {gameState === 'VICTORY' ? <Crown className="w-32 h-32 text-yellow-400 mb-6 animate-bounce" /> : <Skull className="w-32 h-32 text-red-500 mb-6" />}
              <h2 className="text-6xl font-black mb-4 tracking-tighter">{gameState === 'VICTORY' ? 'VICTORY!' : 'DEFEATED'}</h2>
              <p className="text-xl text-slate-300 mb-8">Bosses Slain: {kills}/{WIN_BOSS_COUNT}</p>
              <div className="flex gap-4">
                  <button onClick={() => setGameState('MENU')} className="bg-white text-black px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl">Main Menu</button>
                  {gameState === 'VICTORY' && <button onClick={() => setGameState('INVENTORY')} className="bg-blue-600 px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-xl flex items-center gap-2"><BookOpen /> View Words</button>}
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
        <div className="flex-1 relative bg-slate-900 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
            <div className="absolute left-1/4 top-0 bottom-0 w-px border-l border-dashed border-red-500/20" />

            {/* Castle */}
            <div className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <img src={getDriveImg(IMG_CASTLE_ID)} className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
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
                    <div key={wordQueue[0]?.id + 'w'} className="flex gap-2 justify-center mt-16 animate-reveal-keys">
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
                    <div className="hidden lg:flex flex-col opacity-30 border-l-2 border-slate-800 pl-12">
                        <div className="text-[10px] font-bold text-slate-500 mb-1 tracking-widest uppercase">Next Target</div>
                        <div className="text-2xl text-yellow-700 font-bold mb-1">{wordQueue[1].meaning}</div>
                        <div className="flex gap-1">
                            {wordQueue[1].word.slice(0, 5).split('').map((c, i) => (
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

            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        `}</style>
    </div>
  );
};

export default TypingRPG;