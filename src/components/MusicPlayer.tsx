import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { motion } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Dreams',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3', // Example Pixabay track
    cover: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '2',
    title: 'Neon Horizon',
    artist: 'Digital Echo',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
  },
  {
    id: '3',
    title: 'Pulse of the Grid',
    artist: 'Neural Beats',
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_0788d20ad1.mp3',
    cover: 'https://picsum.photos/seed/grid/400/400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="pixel-border p-4 bg-black/80 flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-3 border-b border-neon-magenta/30 pb-2">
        <Music size={16} className="text-neon-magenta animate-pulse" />
        <span className="font-pixel text-[10px] text-neon-magenta uppercase tracking-tighter">Audio_Buffer_01</span>
      </div>

      <div className="relative group">
        <div className="w-full aspect-square bg-black border-2 border-neon-cyan/30 overflow-hidden relative">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-50 mix-blend-screen"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-neon-magenta/10 mix-blend-overlay" />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-neon-cyan/50 animate-[tear_0.2s_infinite]" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-pixel text-xs text-neon-cyan glitch-text" data-text={currentTrack.title.toUpperCase()}>
          {currentTrack.title.toUpperCase()}
        </h3>
        <p className="font-pixel text-[8px] text-neon-magenta/70 uppercase">{currentTrack.artist.toUpperCase()}</p>
      </div>

      <div className="flex items-center justify-between px-2">
        <button onClick={skipBack} className="text-neon-cyan hover:text-neon-magenta transition-colors">
          <SkipBack size={18} fill="currentColor" />
        </button>
        
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
        </button>

        <button onClick={skipForward} className="text-neon-cyan hover:text-neon-magenta transition-colors">
          <SkipForward size={18} fill="currentColor" />
        </button>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="w-full h-1 bg-white/5 relative overflow-hidden">
          <motion.div 
            style={{ width: `${progress}%` }}
            className="absolute inset-0 h-full bg-neon-magenta shadow-[0_0_8px_var(--color-neon-magenta)]"
          />
        </div>
      </div>
    </div>
  );
}
