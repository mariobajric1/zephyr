import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  withLink?: boolean;
}

export function Logo({ className, withLink = true, ...props }: LogoProps) {
  const [isGlowing, setIsGlowing] = useState(false);

  const LogoSVG = (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "text-primary cursor-pointer transition-all duration-300",
        isGlowing && "animate-glow filter drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]",
        className
      )}
      onClick={() => setIsGlowing(!isGlowing)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <path
        d="M20 0L35.3205 8.82051V26.4615L20 35.2821L4.67949 26.4615V8.82051L20 0Z"
        fill="currentColor"
      />
      <path
        d="M20 4L31.547 10.6923V24.0769L20 30.7692L8.45299 24.0769V10.6923L20 4Z"
        className="fill-background transition-colors duration-300"
      />
      <path
        d="M20 8L27.7735 12.5641V21.6923L20 26.2564L12.2265 21.6923V12.5641L20 8Z"
        fill="currentColor"
      />
    </motion.svg>
  );

  return withLink ? (
    <Link href="/">
      {LogoSVG}
    </Link>
  ) : LogoSVG;
}