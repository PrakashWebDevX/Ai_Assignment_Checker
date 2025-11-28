import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  variant?: "glitch" | "neon-wave";
}

export function GlitchText({ text, className, variant = "neon-wave" }: GlitchTextProps) {
  return (
    <span 
      className={cn(`${variant} font-bold uppercase tracking-wider`, className)} 
      data-text={text}
    >
      {text}
    </span>
  );
}
