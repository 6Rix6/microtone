'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <Link href={"/tonegenerator"} className={"m-2"}>
            <div className="text-4xl font-bold hover:underline bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                ♪トーンジェネレーター
            </div>
        </Link>
          <Link href={"/microtone"} className={"m-2"}>
              <div className="text-4xl font-bold hover:underline bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                  ♪ 微分音・和音
              </div>
          </Link>
      </main>
  );
}
