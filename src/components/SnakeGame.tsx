import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, GameStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 100;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onHighScoreChange: (highScore: number) => void;
  externalScore: number;
  externalHighScore: number;
}

export default function SnakeGame({ 
  onScoreChange, 
  onHighScoreChange, 
  externalScore, 
  externalHighScore 
}: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);

  // Refs for game loop to avoid dependency cycles and side effects in updaters
  const snakeRef = useRef(INITIAL_SNAKE);
  const directionRef = useRef(INITIAL_DIRECTION);
  const foodRef = useRef({ x: 5, y: 5 });
  const statusRef = useRef(GameStatus.IDLE);
  const scoreRef = useRef(externalScore);
  const highScoreRef = useRef(externalHighScore);

  // Sync refs with state/props
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { scoreRef.current = externalScore; }, [externalScore]);
  useEffect(() => { highScoreRef.current = externalHighScore; }, [externalHighScore]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const newFood = generateFood(INITIAL_SNAKE);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(newFood);
    setStatus(GameStatus.PLAYING);
    
    // Update refs immediately
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    foodRef.current = newFood;
    statusRef.current = GameStatus.PLAYING;
    
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (statusRef.current === GameStatus.PLAYING) {
          setStatus(GameStatus.IDLE);
        } else {
          resetGame();
        }
        return;
      }
      
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Only run once

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const moveSnake = () => {
      const currentSnake = snakeRef.current;
      const currentDir = directionRef.current;
      const currentFood = foodRef.current;
      const head = currentSnake[0];

      const newHead = {
        x: (head.x + currentDir.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + currentDir.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (currentSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        const newScore = scoreRef.current + 10;
        onScoreChange(newScore);
        if (newScore > highScoreRef.current) onHighScoreChange(newScore);
        
        const nextFood = generateFood(newSnake);
        setFood(nextFood);
        foodRef.current = nextFood;
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
      snakeRef.current = newSnake;
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [status, generateFood, onScoreChange, onHighScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff00';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#ff00ff' : '#00ffff';
      if (i === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff00ff';
      }
      ctx.fillRect(
        p.x * cellSize + 1,
        p.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black/50 border-2 border-neon-magenta/30"
        />
        
        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              <h2 className="font-pixel text-lg text-neon-magenta mb-8 glitch-text" data-text={status === GameStatus.IDLE ? 'SYSTEM_READY' : 'CRITICAL_FAILURE'}>
                {status === GameStatus.IDLE ? 'SYSTEM_READY' : 'CRITICAL_FAILURE'}
              </h2>
              <button
                onClick={resetGame}
                className="font-pixel text-xs px-6 py-3 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all uppercase tracking-widest"
              >
                {status === GameStatus.IDLE ? 'INITIALIZE' : 'REBOOT'}
              </button>
              <p className="mt-8 font-pixel text-[8px] text-neon-cyan/50 uppercase">
                [SPACE] TO TOGGLE_STATE
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
