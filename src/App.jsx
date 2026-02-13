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
const BASE_DRAIN_RATE = 3.5; // ลดความเร็วลงนิดหน่อย (จาก 4.5) ให้เล่นทัน
const HEAL_PER_WORD = 4; 
const BASE_ENEMY_HP = 60; 
const BASE_XP_REQ = 100; 
const TYPO_PENALTY = 10;
const TICK_RATE = 16; // 60 FPS update rate for smooth flow
const WIN_BOSS_COUNT = 10;

// Image IDs
const IMG_CASTLE_ID = "14SlsJ9Nky-pqF-l2Npd33Gxq6fmp9QUi";
const getDriveImg = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w500`;

const SKILLS = [
  { id: 'burn', name: 'Ignite', icon: <Flame className="text-orange-500" />, desc: 'Burn DOT', color: 'border-orange-500' },
  { id: 'freeze', name: 'Freeze', icon: <Snowflake className="text-cyan-400" />, desc: 'Slow Enemy', color: 'border-cyan-400' },
  { id: 'chain', name: 'Chain', icon: <Zap className="text-yellow-400" />, desc: 'Bounce DMG', color: 'border-yellow-400' },
  { id: 'lifesteal', name: 'Vampire', icon: <Heart className="text-red-500" />, desc: 'Heal on Kill', color: 'border-red-500' },
  { id: 'shield', name: 'Shield', icon: <Shield className="text-blue-300" />, desc: 'Reduce Drain', color: 'border-blue-300' },
  { id: 'explode', name: 'Boom', icon: <Bomb className="text-red-600" />, desc: 'Death AOE', color: 'border-red-600' },
  { id: 'crit', name: 'Fatal', icon: <Sword className="text-yellow-600" />, desc: 'Double DMG', color: 'border-yellow-600' },
  { id: 'knockback', name: 'Push', icon: <MoveRight className="text-slate-400" />, desc: 'Push Back', color: 'border-slate-400' },
  { id: 'execute', name: 'Exec', icon: <Skull className="text-purple-500" />, desc: 'Kill Low HP', color: 'border-purple-500' },
  { id: 'score', name: 'Greed', icon: <Coins className="text-yellow-300" />, desc: 'Bonus Score', color: 'border-yellow-300' },
];

const GLOBAL_WORD_POOL = [
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
  const [acquiredSkills, setAcquiredSkills] = useState([]);
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
  const [soldierSlashEffect, setSoldierSlashEffect] = useState(false);
  const [isInputBlocked, setIsInputBlocked] = useState(false);
  const [statusEffect, setStatusEffect] = useState(null);
  const [laserEffect, setLaserEffect] = useState(false); 
  const [activeEffects, setActiveEffects] = useState([]); 
  
  // Roulette
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [gainedSkill, setGainedSkill] = useState(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const soldierTimerRef = useRef(null);
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

  // --- LOGIC: Word Generator ---
  const generateWord = (difficulty) => {
    let minLen = 3, maxLen = 10;
    if (difficulty <= 5) { minLen = 3; maxLen = 5; } 
    else if (difficulty <= 15) { minLen = 4; maxLen = 7; } 
    else { minLen = 5; maxLen = 15; }

    const candidates = GLOBAL_WORD_POOL.filter(w => w.len >= minLen && w.len <= maxLen);
    
    let selected;
    let attempts = 0;
    do {
         selected = candidates[Math.floor(Math.random() * candidates.length)] || GLOBAL_WORD_POOL[0];
         attempts++;
    } while (selected.word === lastWordRef.current && attempts < 5);
    
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
    setLaserEffect(false);
    
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

  // --- LOGIC: Game Loop & Auto-Speed ---
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
            const speedMultiplier = 1 + (totalWordsTyped * 0.015);
            let drainPerSec = BASE_DRAIN_RATE * speedMultiplier;
            let drainPerTick = drainPerSec * (TICK_RATE / 1000);
            
            const shieldCount = acquiredSkills.filter(id => id === 'shield').length;
            if (shieldCount > 0) drainPerTick *= (1 - (shieldCount * 0.1));
            if (statusEffect === 'FREEZE') drainPerTick = 0; 

            return Math.max(0, prev - drainPerTick);
        });
        
        setActiveEffects(prev => prev.filter(p => Date.now() - p.id < 1000));
        
    }, tickRate);
  };

  useEffect(() => {
      if (gameState === 'PLAYING' && !showLevelUpModal) {
          startDrainLoop();
      } else {
          stopLoops();
      }
      return () => stopLoops();
  }, [showLevelUpModal, gameState]);

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
          
          if (combo > 5) {
              const effectType = acquiredSkills.includes('burn') ? '🔥' : acquiredSkills.includes('freeze') ? '❄️' : '✨';
              setActiveEffects(prev => [...prev, { id: Date.now(), char: effectType, x: Math.random() * 50 + 25 }]);
              setTimeout(() => setActiveEffects(prev => prev.slice(1)), 500);
          }

          if (val === target.word) {
              processWordComplete(target);
          }
      } else {
          setCombo(0);
          shakeConsole();
          setPlayerHp(prev => Math.max(0, prev - TYPO_PENALTY));
      }
  };

  const processWordComplete = (target) => {
      setTotalWordsTyped(prev => prev + 1);
      
      // เก็บเข้าประวัติชั่วคราว
      setRunHistory(prev => {
          if (!prev.some(w => w.word === target.word)) return [...prev, target];
          return prev;
      });

      addCastleXp(30 + (combo * 5));
      let damage = 20 + (combo * 2);
      if (acquiredSkills.includes('crit') && Math.random() < 0.25) damage *= 2;
      if (acquiredSkills.includes('burn')) damage += 10;

      setEnemyHp(prev => prev - damage);
      setDamagePopup({ val: damage, crit: damage > 40 });
      setTimeout(() => setDamagePopup(null), 800);
      setSlashEffect(true);
      setBossKnockback(true);
      setTimeout(() => {
          setSlashEffect(false);
          setBossKnockback(false);
      }, 200);

      const healAmt = HEAL_PER_WORD + (acquiredSkills.filter(id => id === 'lifesteal').length * 2);
      setPlayerHp(prev => Math.min(MAX_PLAYER_HP, prev + healAmt));
      setHealPopup(`+${healAmt}`);
      setTimeout(() => setHealPopup(null), 800);

      setUserInput('');
      setCombo(c => c + 1);
      
      if (enemyHpRef.current - damage <= 0) handleKillBoss();
      else setWordQueue(prev => [prev[1], generateWord(killsRef.current)]);
  };

  const handleKillBoss = () => {
      const currentKills = killsRef.current + 1;
      setKills(currentKills);
      if (currentKills >= WIN_BOSS_COUNT) { 
          stopLoops();
          // โอนคำศัพท์เข้า Inventory เมื่อชนะ
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
      setWordQueue([generateWord(killCount), generateWord(killCount)]);
  };

  const addCastleXp = (amount) => {
      let newXp = castleXp + amount;
      if (newXp >= maxCastleXp) {
          setCastleLevel(prev => prev + 1);
          setCastleXp(newXp - maxCastleXp);
          setMaxCastleXp(prev => Math.floor(prev * 1.3));
          const randomSkill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
          setAcquiredSkills(prev => [...prev, randomSkill.id]);
          setSkillNotification(randomSkill);
          setTimeout(() => setSkillNotification(null), 3000);
      } else {
          setCastleXp(newXp);
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
            
            <div className="flex gap-1 p-2 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm">
                {acquiredSkills.map((skillId, idx) => {
                    const s = SKILLS.find(x => x.id === skillId);
                    return <div key={idx} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-full border border-slate-600 shadow-sm">{s?.icon}</div>;
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
                            <div className="text-[10rem] filter drop-shadow-2xl transition-transform duration-75">{wordQueue[0].emoji}</div>
                            {slashEffect && <div className="absolute inset-0 w-[140%] h-2 bg-white rotate-[-45deg] animate-ping shadow-[0_0_30px_#fff]"></div>}
                            {activeEffects.map(ef => (
                                <div key={ef.id} className="absolute text-4xl animate-bounce" style={{ top: '50%', left: `${ef.x}%` }}>{ef.char}</div>
                            ))}
                            {damagePopup && <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center z-50"><span className={`text-6xl font-black italic stroke-black text-white ${damagePopup.crit ? 'text-yellow-400 scale-125' : ''}`} style={{WebkitTextStroke: '2px black'}}>{damagePopup.val}</span></div>}
                        </div>
                        <div className="mt-4 w-48 h-4 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-xl">
                            <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-200" style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }}></div>
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
                <div className="absolute bottom-4 left-4 z-50 bg-slate-800 border-2 border-yellow-500 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-left-10 shadow-2xl">
                    <div className="p-2 bg-slate-900 rounded-xl">{skillNotification.icon}</div>
                    <div>
                        <div className="text-yellow-400 font-black text-sm uppercase">Level Up!</div>
                        <div className="text-white font-bold text-xs">{skillNotification.name} Unlocked</div>
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