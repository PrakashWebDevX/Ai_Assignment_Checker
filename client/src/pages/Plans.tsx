import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { GlassCard } from "@/components/GlassCard";
import { Check, Zap, Crown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Plans() {
  const navigate = useNavigate();
  const { user, isPremium, upgradeToPremium } = useAuth();

  const handleUpgrade = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    upgradeToPremium();
    toast.success("Welcome to Premium!");
  };

  const plans = [
    {
      name: "FREE",
      price: "₹0",
      period: "Forever",
      icon: <Zap className="w-8 h-8 text-green-400" />,
      description: "Perfect for getting started",
      features: [
        "15 free scans per month",
        "Basic plagiarism detection",
        "AI content detection",
        "Grammar checking",
        "Email support",
        "Access to sample data"
      ],
      highlighted: false,
      current: !isPremium
    },
    {
      name: "PREMIUM",
      price: "₹499",
      period: "One-time",
      icon: <Crown className="w-8 h-8 text-yellow-400" />,
      description: "Everything you need",
      features: [
        "Unlimited scans",
        "Advanced plagiarism detection",
        "AI probability analysis",
        "Detailed grammar reports",
        "Priority support",
        "Enhanced credit scoring",
        "Profile customization",
        "Detailed analytics"
      ],
      highlighted: true,
      current: isPremium
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 sm:space-y-4"
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-2 sm:mb-4 pl-0 hover:bg-transparent text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
          BACK
        </Button>
        
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white">
            PRICING_PLANS
          </h1>
          <p className="text-green-100/50 font-mono text-xs sm:text-sm max-w-2xl mx-auto">
            Choose your plan and unlock the full potential of AI_CHECKER. Upgrade anytime to get unlimited scans and premium features.
          </p>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative ${plan.highlighted ? 'md:scale-105' : ''}`}
          >
            <GlassCard 
              className={`p-6 sm:p-8 h-full flex flex-col border-t-4 ${
                plan.highlighted 
                  ? 'border-t-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' 
                  : 'border-t-green-500'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-2 sm:-top-3 right-2 sm:right-4 px-2 sm:px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-full">
                  CURRENT PLAN
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center">{plan.icon}</span>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">{plan.name}</h2>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white">{plan.price}</span>
                  <span className="text-gray-400 text-xs sm:text-sm font-mono">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex-1 mb-6 sm:mb-8 space-y-2 sm:space-y-3">
                {plan.features.map((feature, featureIdx) => (
                  <div key={featureIdx} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-green-100/80 text-xs sm:text-sm font-mono">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleUpgrade}
                disabled={plan.current}
                className={`w-full ${
                  plan.highlighted
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 border-none'
                    : 'bg-green-600 text-white hover:bg-green-700 border border-green-500/50'
                } ${plan.current ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {plan.current 
                  ? '✓ CURRENT PLAN' 
                  : plan.name === 'FREE' 
                  ? 'GET STARTED' 
                  : 'UNLOCK PREMIUM'}
              </Button>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-8 sm:pt-12 border-t border-green-500/20"
      >
        <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-6 sm:mb-8 text-center">
          FREQUENTLY_ASKED_QUESTIONS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <GlassCard className="p-4 sm:p-6 border-l-4 border-l-green-500">
            <h4 className="text-white font-bold mb-2 font-mono text-sm sm:text-base">Can I upgrade anytime?</h4>
            <p className="text-gray-400 text-xs sm:text-sm">Yes! Upgrade from FREE to PREMIUM at any time. Premium activation is instant.</p>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6 border-l-4 border-l-blue-500">
            <h4 className="text-white font-bold mb-2 font-mono text-sm sm:text-base">Is Premium a subscription?</h4>
            <p className="text-gray-400 text-xs sm:text-sm">No, Premium is a one-time payment of ₹499 for unlimited scans forever.</p>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6 border-l-4 border-l-purple-500">
            <h4 className="text-white font-bold mb-2 font-mono text-sm sm:text-base">What if I'm not satisfied?</h4>
            <p className="text-gray-400 text-xs sm:text-sm">Contact our support team within 7 days for a full refund. No questions asked.</p>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6 border-l-4 border-l-cyan-500">
            <h4 className="text-white font-bold mb-2 font-mono text-sm sm:text-base">Do you offer discounts?</h4>
            <p className="text-gray-400 text-xs sm:text-sm">Check back soon for seasonal discounts and promotional offers!</p>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
