
'use client'

import { useRef, useState, useEffect, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';

type AudioPlayerProps = {
  audioUrl: string;
  isSender: boolean;
};

const AudioPlayer = ({ audioUrl, isSender }: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { resolvedTheme } = useTheme();

  const handlePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  useEffect(() => {
    if (!waveformRef.current) return;

    const senderColor = resolvedTheme === 'dark' ? '#A8A29E' : '#57534E';
    const receiverColor = resolvedTheme === 'dark' ? '#BFDBFE' : '#1E40AF';
    
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isSender ? senderColor : receiverColor,
      progressColor: isSender ? '#FFFFFF' : '#000000',
      url: audioUrl,
      height: 40,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorWidth: 0,
    });

    wavesurferRef.current.on('play', () => setIsPlaying(true));
    wavesurferRef.current.on('pause', () => setIsPlaying(false));
    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [audioUrl, isSender, resolvedTheme]);

  return (
    <div className="flex items-center gap-2 w-full">
      <Button 
        variant="ghost" 
        size="icon" 
        className={isSender ? 'text-primary-foreground hover:bg-white/20' : 'text-primary hover:bg-black/10'}
        onClick={handlePlayPause}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </Button>
      <div ref={waveformRef} className="w-full"/>
    </div>
  );
};

export default AudioPlayer;

    