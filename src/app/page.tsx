'use client';

import { useRef, useState } from 'react';

export default function HomePage() {
  const [freqInput, setFreqInput] = useState<string>('440,660,880');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const parseFrequencies = (input: string): number[] => {
    return input
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n >= 20 && n <= 20000);
  };

  const startTone = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const freqs = parseFrequencies(freqInput);
    const newOscillators: OscillatorNode[] = [];

    freqs.forEach((freq) => {
      const osc = audioCtxRef.current!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current!.currentTime);
      osc.connect(audioCtxRef.current!.destination);
      osc.start();
      newOscillators.push(osc);
    });

    // 停止用に参照保存
    oscillatorsRef.current = newOscillators;
  };

  const stopTone = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    oscillatorsRef.current.forEach((osc) => {
      osc.stop();
      osc.disconnect();
    });
    oscillatorsRef.current = [];
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Tone Generator</h1>
          <label className="block mb-4 text-left text-gray-700">
            周波数をカンマ区切りで入力（例: 440,660,880）:
            <input
                type="text"
                value={freqInput}
                onChange={(e) => setFreqInput(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
          <div className="flex justify-center gap-4 mt-6">
            <button
                onClick={startTone}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              ▶ Play
            </button>
            <button
                onClick={stopTone}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              ⏹ Stop
            </button>
          </div>
        </div>
      </main>
  );
}
