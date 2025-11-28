import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface DigitalDecoderProps {
  text: string;
  className?: string;
}

export function DigitalDecoder({ text, className }: DigitalDecoderProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{display}</span>;
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="w-64 h-1 bg-green-900/30 mb-4 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-green-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
      <div className="text-green-500 font-mono text-xl tracking-widest">
        <DigitalDecoder text="DECODING..." />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover" />
    </div>
  );
}
