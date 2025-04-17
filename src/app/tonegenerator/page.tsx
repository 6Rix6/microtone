'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [freqInput, setFreqInput] = useState<string>('440,660,880');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [wave,setWave] = useState<"sine"|"square"|"sawtooth"|"triangle">("sine");
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);

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
        if (freqs.length === 0) return;

        const audioCtx = audioCtxRef.current;

        if(gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
        }

        const gainNode = audioCtx?.createGain();
        if (gainNode) {
            gainNode.gain.value = 1 / freqs.length; //音量を音の数で割る
            gainNode.connect(audioCtx?.destination);
            gainNodeRef.current = gainNode;
        }

        const newOscillators: OscillatorNode[] = [];

        freqs.forEach((freq) => {
            const osc = audioCtxRef.current!.createOscillator();
            osc.type = wave;                    
            osc.frequency.setValueAtTime(freq, audioCtxRef.current!.currentTime);
            osc.connect(gainNode);
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

        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
            gainNodeRef.current = null;
        }
    };

    return (
        <main className="flex flex-col min-h-screen  bg-gray-100 p-6">
            <Link href={"/"}>
                <div className={"text-blue-500 underline font-bold text-xl"}>← Back</div>
            </Link>
            <div className={"flex-col items-center justify-center m-auto"}>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-3">トーンジェネレーター</h1>
                    <div className='text-lg'>波形を選択</div>
                    <div className='flex justify-center mb-6 p-2'>
                        <button 
                            className={`p-1 mr-1 ml-1 shadow-md rounded-md hover:bg-gray-200 ${wave=="sine"?"bg-gray-200":"bg-white"}`}
                            onClick={()=>setWave("sine")}
                            >
                                sine
                        </button>
                        <button 
                            className={`p-1 mr-1 ml-1 shadow-md rounded-md hover:bg-gray-200 ${wave=="square"?"bg-gray-200":"bg-white"}`}
                            onClick={()=>setWave("square")}
                            >
                                square
                        </button>                        
                        <button 
                            className={`p-1 mr-1 ml-1 shadow-md rounded-md hover:bg-gray-200 ${wave=="sawtooth"?"bg-gray-200":"bg-white"}`}
                            onClick={()=>setWave("sawtooth")}
                            >
                                sawtooth
                        </button>                        
                        <button 
                            className={`p-1 mr-1 ml-1 shadow-md rounded-md hover:bg-gray-200 ${wave=="triangle"?"bg-gray-200":"bg-white"}`}
                            onClick={()=>setWave("triangle")}
                            >
                                triangle
                        </button>
                    </div>
                    <label className="block mb-4 text-gray-700 text-center">
                        周波数をカンマ区切りで入力（例: 440,660,880）
                        <input
                            type="text"
                            value={freqInput}
                            onChange={(e) => setFreqInput(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm  focus:border-blue-500 focus:ring-blue-500"
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
            </div>
        </main>
    );
}
