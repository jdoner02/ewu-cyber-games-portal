'use client';

// PasswordFortressGame.tsx
// A fun, interactive tower-defense-style game where you defend your digital fortress
// by building password-based defenses against waves of attackers.  
// This code is heavily commented for curious middle-school GenCyber campers who might
// peek into the code and wonder how it works.  

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- TYPES AND CONSTANTS ---

// Each tower in the game has a type, position, and level (upgrade).
type TowerType = 'length' | 'symbol';
interface Tower {
  id: number;        // unique identifier for each tower
  row: number;       // which row (0 to GRID_ROWS-1) it sits on
  col: number;       // which column (0 to GRID_COLS-1) it sits on
  type: TowerType;   // 'length' slows brute-force attacks; 'symbol' weakens dictionary attacks
  level: number;     // upgrade level (1,2,3...)
}

// Enemies come in two flavors: brute-force bots and dictionary drones.
type EnemyType = 'bruteforce' | 'dictionary';
interface Enemy {
  id: number;        // unique identifier for each enemy
  row: number;       // which row they walk across (same grid rows)
  x: number;         // their current x-position (in pixels)
  type: EnemyType;   // 'bruteforce' or 'dictionary'
  health: number;    // remaining health points (when 0 they die)
  speed: number;     // how fast they move (pixels per second)
}

// Grid dimensions: how many rows and columns of build spots we have.
const GRID_ROWS = 5;
const GRID_COLS = 10;
const CELL_SIZE = 60; // each grid cell is 60px square

// Initial resources and health values
const INITIAL_RESOURCES = 100;  // starting "entropy points" you spend to build towers
const INITIAL_HEALTH = 100;     // fortress integrity: if it drops to 0, you lose

// Delay between spawning each enemy in a wave (ms)
const SPAWN_INTERVAL = 1000;

// --- MAIN GAME COMPONENT ---
export default function PasswordFortressGame() {
  const router = useRouter();

  // GAME STATE HOOKS
  // resources: how many points you have to build or upgrade towers
  const [resources, setResources] = useState<number>(INITIAL_RESOURCES);
  // health: fortress integrity; enemies reaching the end subtract from this
  const [health, setHealth] = useState<number>(INITIAL_HEALTH);
  // towers: list of your built defenses
  const [towers, setTowers] = useState<Tower[]>([]);
  // enemies: list of active attackers on screen
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  // buildMode: which tower the player has selected to place (null = none)
  const [buildMode, setBuildMode] = useState<TowerType | null>(null);
  // wave number: increases each time you click "Next Wave"
  const [wave, setWave] = useState<number>(1);
  // next IDs for assigning to towers/enemies to keep them unique
  const nextTowerId = useRef<number>(1);
  const nextEnemyId = useRef<number>(1);

  // Effects:
  // 1) Spawn enemies when wave changes.
  useEffect(() => {
    let spawned = 0;
    // spawnInterval will call spawnOne every SPAWN_INTERVAL ms
    const spawnInterval = window.setInterval(() => {
      if (spawned < wave * 5) {
        spawnOne();
        spawned += 1;
      } else {
        clearInterval(spawnInterval);
      }
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawnInterval);
  }, [wave]);

  // 2) Main game loop: move enemies and process tower attacks.
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrame: number;
    
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000; // convert ms -> seconds
      lastTime = time;
      moveEnemies(dt);
      towersAttack(dt);
      animationFrame = requestAnimationFrame(loop);
    };
    animationFrame = requestAnimationFrame(loop);
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [enemies, towers]);

  // --- GAME LOGIC FUNCTIONS ---

  // spawnOne: add a single enemy at the left edge of the grid
  function spawnOne() {
    const row = Math.floor(Math.random() * GRID_ROWS);
    const type: EnemyType = Math.random() < 0.5 ? 'bruteforce' : 'dictionary';
    // set different stats per type
    const speed = type === 'bruteforce' ? 40 : 60; // px/sec
    const health = type === 'bruteforce' ? 3 : 2;
    const enemy: Enemy = {
      id: nextEnemyId.current++,
      row,
      x: 0,
      type,
      health,
      speed,
    };
    setEnemies((e) => [...e, enemy]);
  }

  // moveEnemies: advance each enemy by speed*dt, remove or damage if reaches end
  function moveEnemies(dt: number) {
    setEnemies((list) => {
      return list.flatMap((e) => {
        const nextX = e.x + e.speed * dt;
        if (nextX >= GRID_COLS * CELL_SIZE) {
          // enemy reached fortress!
          handleBreach(e.type);
          return []; // remove it from array
        }
        return [{ ...e, x: nextX }];
      });
    });
  }

  // handleBreach: enemy hits the fortress, reduce health based on type
  function handleBreach(type: EnemyType) {
    const damage = type === 'bruteforce' ? 5 : 10;
    setHealth((h) => Math.max(0, h - damage));
    // if health=0, the game is over; could show a popup or switch state
  }

  // towersAttack: let each tower attack enemies in its row every second
  function towersAttack(dt: number) {
    // For simplicity, each tower has a reload timer in its object state could be added.
    // Here we'll apply a small damage per frame if enemy is in same row and in range.
    setEnemies((list) => {
      return list.map((enemy) => {
        let dmg = 0;
        towers.forEach((tower) => {
          if (tower.row === enemy.row) {
            // towerRange = 3 cells
            const towerX = tower.col * CELL_SIZE;
            if (enemy.x >= towerX - CELL_SIZE && enemy.x <= towerX + CELL_SIZE * 3) {
              // decide damage by tower type
              if (tower.type === 'length' && enemy.type === 'bruteforce') {
                dmg += 1 * tower.level; // length tower is strong vs brute force
              }
              if (tower.type === 'symbol' && enemy.type === 'dictionary') {
                dmg += 1 * tower.level; // symbol tower is strong vs dictionary
              }
            }
          }
        });
        return { ...enemy, health: enemy.health - dmg * dt };
      }).filter((e) => e.health > 0);
    });
  }

  // handleGridClick: place a tower if in buildMode and you have enough resources
  function handleGridClick(row: number, col: number) {
    if (!buildMode) return;
    // cost of tower = 20 points, upgrade cost = 15
    const cost = 20;
    if (resources < cost) {
      alert('Not enough entropy points to build!');
      return;
    }
    // check no tower already here
    if (towers.some((t) => t.row === row && t.col === col)) {
      alert('Tower already placed there!');
      return;
    }
    // build it
    const newTower: Tower = {
      id: nextTowerId.current++,
      row,
      col,
      type: buildMode,
      level: 1,
    };
    setTowers((t) => [...t, newTower]);
    setResources(r => r - cost);
  }

  // nextWave: allow user to start next wave manually
  function nextWaveClick() {
    setWave((w) => w + 1);
    // reward the player a bit for preparation time
    setResources((r) => r + 30);
  }

  // handleRestart: Safe restart function for Next.js environment
  const handleRestart = useCallback(() => {
    // Reset all game state to initial values
    setResources(INITIAL_RESOURCES);
    setHealth(INITIAL_HEALTH);
    setTowers([]);
    setEnemies([]);
    setBuildMode(null);
    setWave(1);
    // Reset ID counters
    nextTowerId.current = 1;
    nextEnemyId.current = 1;
  }, []);

  // --- RENDERING FUNCTIONS ---
  // drawGrid: shows rows x cols clickable cells
  function drawGrid() {
    const rows = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const cells = [];
      for (let col = 0; col < GRID_COLS; col++) {
        const hasTower = towers.find((t) => t.row === row && t.col === col);
        cells.push(
          <div
            key={col}
            onClick={() => handleGridClick(row, col)}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              border: '1px solid #4b5563',
              backgroundColor: hasTower ? '#374151' : '#1f2937',
              cursor: buildMode ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'background-color 0.2s',
            }}
          >
            {hasTower && (
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  backgroundColor: hasTower.type === 'length' ? '#059669' : '#7c3aed',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '2px solid #e5e7eb',
                }}
              >
                Lv{hasTower.level}
              </div>
            )}
          </div>
        );
      }
      rows.push(
        <div key={row} style={{ display: 'flex' }}>
          {cells}
        </div>
      );
    }
    return rows;
  }

  // drawEnemies: positions each enemy as a colored circle moving across grid
  function drawEnemies() {
    return enemies.map((e) => (
      <div
        key={e.id}
        style={{
          position: 'absolute',
          top: e.row * CELL_SIZE + 10,
          left: e.x + 10,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: e.type === 'bruteforce' ? '#ef4444' : '#8b5cf6',
          border: '2px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          zIndex: 10,
        }}
      >
        {e.type === 'bruteforce' ? '🔓' : '📚'}
        {/* health bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '0',
            height: '4px',
            backgroundColor: '#10b981',
            borderRadius: '2px',
            width: (e.health / (e.type === 'bruteforce' ? 3 : 2)) * 40,
            transition: 'width 0.2s',
          }}
        />
      </div>
    ));
  }

  // --- JSX LAYOUT ---
  return (
    <div style={gameContainerStyles}>
      {/* HUD at top shows resources, health, wave */}
      <div style={hudStyles}>
        <div style={hudItemStyles}>Entropy Points: {resources}</div>
        <div style={hudItemStyles}>Fortress Health: {health}</div>
        <div style={hudItemStyles}>Wave: {wave}</div>
      </div>

      {/* Build menu: choose tower type */}
      <div style={buildMenuStyles}>
        <button 
          onClick={() => setBuildMode('length')}
          style={{...buttonStyles, backgroundColor: buildMode === 'length' ? '#059669' : '#3b82f6'}}
        >
          Build Length Tower (20)
        </button>
        <button 
          onClick={() => setBuildMode('symbol')}
          style={{...buttonStyles, backgroundColor: buildMode === 'symbol' ? '#7c3aed' : '#3b82f6'}}
        >
          Build Symbol Tower (20)
        </button>
        <button 
          onClick={() => setBuildMode(null)}
          style={{...buttonStyles, backgroundColor: '#6b7280'}}
        >
          Cancel
        </button>
      </div>

      {/* Main battlefield: grid + enemies */}
      <div 
        style={{
          ...battlefieldStyles,
          width: GRID_COLS * CELL_SIZE, 
          height: GRID_ROWS * CELL_SIZE
        }}
      >
        {drawGrid()}
        {drawEnemies()}
      </div>

      {/* Controls: next wave */}
      <div style={controlsStyles}>
        <button 
          onClick={nextWaveClick}
          style={{...buttonStyles, backgroundColor: '#059669', fontSize: '1.1rem'}}
        >
          Next Wave (+30 pts)
        </button>
      </div>

      {/* Simple game-over message */}
      {health <= 0 && (
        <div className="overlay" style={overlayStyles}>
          <div style={modalStyles}>
            <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Game Over!</h1>
            <p style={{ color: '#ccc', marginBottom: '2rem' }}>Your fortress has fallen. Try again?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={handleRestart}
                style={buttonStyles}
              >
                Play Again
              </button>
              <button 
                onClick={() => router.push('/games')}
                style={{...buttonStyles, backgroundColor: '#6b7280'}}
              >
                Back to Games
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- INLINE STYLES FOR PRODUCTION ---
// Note: In a real production app, these would be in a separate CSS module
// or styled-components, but for educational purposes they're inline here.

// --- INLINE STYLES FOR PRODUCTION ---
// Note: In a real production app, these would be in a separate CSS module
// or styled-components, but for educational purposes they're inline here.

const gameContainerStyles: React.CSSProperties = {
  padding: '1rem',
  backgroundColor: '#1f2937',
  minHeight: '100vh',
  color: 'white',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const hudStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '1rem',
  backgroundColor: '#374151',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
  border: '2px solid #3b82f6',
};

const hudItemStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#e5e7eb',
};

const buildMenuStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

const battlefieldStyles: React.CSSProperties = {
  position: 'relative',
  margin: '1rem auto',
  border: '3px solid #3b82f6',
  borderRadius: '0.5rem',
  backgroundColor: '#111827',
  overflow: 'hidden',
};

const controlsStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
};

const overlayStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyles: React.CSSProperties = {
  backgroundColor: '#1f2937',
  padding: '2rem',
  borderRadius: '1rem',
  textAlign: 'center',
  border: '2px solid #3b82f6',
  minWidth: '300px',
};

const buttonStyles: React.CSSProperties = {
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'background-color 0.2s',
};
