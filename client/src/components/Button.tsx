import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children?: ReactNode;
}

export function Button({ 
  className, 
  variant = "primary", 
  size = "md",
  isLoading, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-green-600 text-black border border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:bg-green-500 hover:shadow-[0_0_25px_rgba(0,255,0,0.6)]",
    secondary: "bg-black/60 backdrop-blur-md text-green-400 border border-green-500/30 hover:bg-green-900/20 hover:border-green-500/60",
    outline: "bg-transparent border border-green-500/50 text-green-400 hover:border-green-400 hover:text-green-300 hover:bg-green-500/10",
    ghost: "bg-transparent text-green-500/70 hover:text-green-400 hover:bg-green-500/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, textShadow: "0 0 8px rgb(0, 255, 0)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center font-mono font-bold tracking-wider uppercase rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Scanline effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50" />
    </motion.button>
  );
}
