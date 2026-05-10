// components/Header.tsx
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 md:h-16 flex justify-between items-center">
        <Link href="/" className="relative w-32 h-8 md:w-40 md:h-10">
          <Image 
            src="/logo.png" 
            alt="물가체크" 
            fill 
            className="object-contain object-left" 
            priority 
          />
        </Link>
        <div className="flex gap-4 text-xs md:text-sm font-bold text-slate-500">
          <Link href="/community" className="hover:text-indigo-600 transition-colors">라운지</Link>
          <Link href="/plan" className="hover:text-indigo-600 transition-colors">일정생성</Link>
        </div>
      </div>
    </nav>
  );
}