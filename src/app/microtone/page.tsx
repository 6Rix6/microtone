'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

/* eslint-disable */
export default function HomePage() {
    const [freqInput, setFreqInput] = useState<string>('440,660,880');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
            osc.type = 'sine';
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
            <div className={"mt-2"}>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center w-full h-full">
                    <h1 className={"text-2xl font-bold mb-6"}>微分音・和音作成</h1>
                </div>
            </div>
        </main>
    );
}
