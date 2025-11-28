import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { scale: 1.01, boxShadow: "0 0 30px rgba(0, 255, 0, 0.15)" } : {}}
      className={cn(
        "relative overflow-hidden rounded-sm border border-green-500/20 bg-black/60 backdrop-blur-xl shadow-lg transition-colors",
        hoverEffect && "hover:border-green-500/40 hover:bg-black/70",
        className
      )}
      {...props}
    >
      {/* Scanline Overlay */}
      <div className="scanline" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2410_1px,transparent_1px),linear-gradient(to_bottom,#0f2410_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
