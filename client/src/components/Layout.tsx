import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import bgImage from "@assets/generated_images/matrix_style_falling_green_digital_rain_code_background.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen font-sans text-green-50 selection:bg-green-500/30 selection:text-green-200 bg-black">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Matrix overlay gradient */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-green-900/5 to-black/90 pointer-events-none" />
      
      {/* Scanlines */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none" />

      <Navbar />
      
      <main className="relative z-10 pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-green-500/20 bg-black/50 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Contact Email */}
            <a 
              href="mailto:prakashclever43@gmail.com"
              className="text-sm font-mono text-green-400 hover:text-green-300 hover:underline transition-colors flex items-center gap-2"
              data-testid="link-contact-email"
            >
              <span className="text-green-500">✉</span>
              prakashclever43@gmail.com
            </a>

            {/* Copyright */}
            <div className="text-xs font-mono text-gray-500 text-center sm:text-right">
              <p>© {new Date().getFullYear()} AI Assignment Checker. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
