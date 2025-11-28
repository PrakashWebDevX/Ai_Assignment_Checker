import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Shield } from "lucide-react";
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { upgradeToPremium } = useAuth();

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    // Mock Razorpay Options
    const options = {
      key: "YOUR_TEST_KEY_ID", // Placeholder
      amount: 49900, // Amount in paise (499 INR)
      currency: "INR",
      name: "AI Assignment Checker",
      description: "Premium Unlimited Access",
      image: "https://replit.com/public/images/opengraph.png",
      handler: function (response: any) {
        upgradeToPremium();
        onClose();
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#22c55e"
      }
    };

    try {
      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      // Fallback if script fails to load or key is missing
      console.log("Razorpay mock fallback");
      upgradeToPremium();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-black border border-green-500/30 rounded-lg shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                  <Zap className="w-8 h-8 text-green-400 fill-current" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-heading">Upgrade to Premium</h2>
                  <p className="text-gray-400 text-sm">Unlock unlimited scans and detailed insights.</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-200">Unlimited AI Checks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-200">Deep Deep Scan Analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-200">PDF Export & Detailed Reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-200">Priority Processing</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="text-3xl font-bold text-white mb-6">
                    ₹499 <span className="text-sm text-gray-500 font-normal">/ lifetime</span>
                  </div>
                  
                  <Button 
                    onClick={handlePayment}
                    className="w-full py-6 text-lg shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                  >
                    Unlock Premium Access
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    Secured by Razorpay
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
