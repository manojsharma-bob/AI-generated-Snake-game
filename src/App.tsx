/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bootSequence, setBootSequence] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (bootSequence) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-pixel text-neon-lime text-xs gap-4">
        <div className="animate-pulse">INITIALIZING SYSTEM...</div>
        <div className="flex flex-col gap-1">
          <div>[ OK ] NEURAL_LINK_ESTABLISHED</div>
          <div>[ OK ] AUDIO_BUFFER_LOADED</div>
          <div>[ OK ] GRID_COORDINATES_SYNCED</div>
        </div>
        <div className="w-48 h-1 bg-white/10 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
            className="h-full bg-neon-magenta"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neon-cyan p-4 font-sans crt-flicker selection:bg-neon-magenta selection:text-black relative">
      <div className="static-noise" />
      
      {/* Header Rail */}
      <header className="border-b-2 border-neon-magenta pb-2 mb-6 flex justify-between items-center screen-tear">
        <div className="font-pixel text-lg glitch-text" data-text="NEON_PULSE_v2.4.0">
          NEON_PULSE_v2.4.0
        </div>
        <div className="flex gap-8 text-xs font-pixel text-neon-magenta">
          <div className="flex items-center gap-2">
            <span className="opacity-50">CPU:</span>
            <span>12%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50">BPM:</span>
            <span>128</span>
          </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto">
        {/* Left: Music & Terminal */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <MusicPlayer />
          
          <div className="pixel-border p-4 bg-black/50 flex flex-col gap-2 text-[10px] font-pixel text-neon-lime">
            <div className="text-neon-magenta mb-2 border-b border-neon-magenta/30 pb-1">SYSTEM_LOGS</div>
            <div className="opacity-80">{">"} CACHE_CLEARED</div>
            <div className="opacity-80">{">"} AUDIO_STREAM_STABLE</div>
            <div className="opacity-80">{">"} USER_INPUT_DETECTED</div>
            <div className="animate-pulse">{">"} LISTENING...</div>
          </div>
        </div>

        {/* Center: Game */}
        <div className="flex-1 flex flex-col items-center gap-6">
          <div className="pixel-border p-2 bg-black">
            <SnakeGame 
              onScoreChange={setScore} 
              onHighScoreChange={setHighScore}
              externalScore={score}
              externalHighScore={highScore}
            />
          </div>
          
          <div className="flex gap-12 font-pixel text-xs text-neon-magenta uppercase tracking-tighter">
            <div className="flex flex-col items-center gap-2">
              <span className="opacity-50">Score</span>
              <span className="text-2xl text-neon-lime glitch-text" data-text={score.toString().padStart(6, '0')}>
                {score.toString().padStart(6, '0')}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="opacity-50">High_Score</span>
              <span className="text-2xl text-neon-cyan glitch-text" data-text={highScore.toString().padStart(6, '0')}>
                {highScore.toString().padStart(6, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Data */}
        <div className="w-full lg:w-64 flex flex-col gap-6">
          <div className="pixel-border p-4 bg-black/50">
            <div className="font-pixel text-[10px] text-neon-magenta mb-4 border-b border-neon-magenta/30 pb-1 uppercase">Input_Mapping</div>
            <div className="grid grid-cols-1 gap-3 font-pixel text-[8px] text-neon-cyan">
              <div className="flex justify-between border-b border-neon-cyan/10 pb-1">
                <span>MOVE_UP</span>
                <span className="text-neon-magenta">[W] / [UP]</span>
              </div>
              <div className="flex justify-between border-b border-neon-cyan/10 pb-1">
                <span>MOVE_DOWN</span>
                <span className="text-neon-magenta">[S] / [DOWN]</span>
              </div>
              <div className="flex justify-between border-b border-neon-cyan/10 pb-1">
                <span>MOVE_LEFT</span>
                <span className="text-neon-magenta">[A] / [LEFT]</span>
              </div>
              <div className="flex justify-between border-b border-neon-cyan/10 pb-1">
                <span>MOVE_RIGHT</span>
                <span className="text-neon-magenta">[D] / [RIGHT]</span>
              </div>
              <div className="flex justify-between">
                <span>PAUSE_SYS</span>
                <span className="text-neon-magenta">[SPACE]</span>
              </div>
            </div>
          </div>

          <div className="pixel-border p-4 bg-black/50 flex flex-col gap-4">
            <div className="font-pixel text-[10px] text-neon-magenta border-b border-neon-magenta/30 pb-1 uppercase">Network_Status</div>
            <div className="flex flex-col gap-2">
              <div className="h-1 w-full bg-white/5 relative overflow-hidden">
                <motion.div 
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-1/3 bg-neon-lime"
                />
              </div>
              <div className="flex justify-between font-pixel text-[8px]">
                <span className="text-neon-lime">ENCRYPTED</span>
                <span className="text-neon-magenta">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Rail */}
      <footer className="mt-12 border-t-2 border-neon-magenta pt-2 flex justify-between items-center font-pixel text-[8px] text-neon-magenta/50 screen-tear">
        <div>SYS_ID: 0x882_BETA</div>
        <div className="flex gap-4">
          <span>[ SECURE_CHANNEL_ACTIVE ]</span>
          <span>[ 2026_NEURAL_CORE ]</span>
        </div>
      </footer>
    </div>
  );
}
