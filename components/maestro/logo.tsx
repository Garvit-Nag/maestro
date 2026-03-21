import Link from "next/link"
import { GiSoccerBall } from "react-icons/gi"

interface LogoProps {
  className?: string
  onClick?: () => void
}

export function Logo({ className = "", onClick }: LogoProps) {
  return (
    <Link 
      href="/" 
      onClick={onClick}
      className={`flex items-center text-white hover:scale-105 transition-transform duration-300 group ${className}`}
    >
      <span className="text-[20px] font-bold leading-none">M</span>
      <span className="text-[17px] font-bold leading-none tracking-wide">aestr</span>
      <GiSoccerBall className="w-[18px] h-[18px] text-[#C9A84C] ml-px" />
    </Link>
  )
}
