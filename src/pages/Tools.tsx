import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet, UtensilsCrossed, FileText, Package, Brain,
  PenTool, Target, Clock, ArrowRight, Receipt, Camera, Scissors
} from "lucide-react";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট AI", desc: "মাসিক আয়-ব্যয়ের হিসাব করুন, সেভিংস পরামর্শ পান এবং লাইফস্টাইল টিপস দেখুন।", path: "/tools/budget", gradient: "from-emerald-400 to-teal-500", tag: "জনপ্রিয়" },
  { icon: UtensilsCrossed, title: "মিল ইন্টেলিজেন্স সিস্টেম", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা, র‍্যান্ডম মিল জেনারেটর ও পরিবার/ছাত্র মোড।", path: "/tools/meal", gradient: "from-orange-400 to-red-500" },
  { icon: FileText, title: "স্মার্ট দরখাস্ত বিল্ডার", desc: "A4 প্রিন্ট-রেডি দরখাস্ত — PDF, JPG এক্সপোর্ট ও প্রিন্ট।", path: "/tools/application", gradient: "from-blue-400 to-indigo-500" },
  { icon: Receipt, title: "ক্যাশ মেমো / ইনভয়েস", desc: "ব্যবসায়িক মানের ইনভয়েস — দোকানের তথ্য সেভ, PDF ও JPG এক্সপোর্ট।", path: "/tools/cashmemo", gradient: "from-purple-400 to-pink-500", tag: "ব্যবসা" },
  { icon: Package, title: "বিজনেস প্রফিট এনালাইসিস", desc: "প্রফিট ক্যালকুলেটর, মার্জিন ও ব্রেক-ইভেন বিশ্লেষণ।", path: "/tools/business", gradient: "from-fuchsia-400 to-purple-500" },
  { icon: Brain, title: "লাইফ অর্গানাইজার PRO", desc: "দৈনিক রুটিন, ফোকাস প্ল্যানার ও হ্যাবিট সাজেশন।", path: "/tools/organizer", gradient: "from-cyan-400 to-blue-500" },
  { icon: PenTool, title: "ক্যাপশন ও বায়ো ল্যাব", desc: "ফেসবুক ক্যাপশন, স্টাইলিশ বায়ো — ইমোশনাল ও বিজনেস টোন।", path: "/tools/caption", gradient: "from-pink-400 to-rose-500" },
  { icon: Target, title: "ডিসিশন ইঞ্জিন", desc: "অপশন দিন, সেরা সিদ্ধান্ত পান — র‍্যান্ডম ও লজিক মিক্স।", path: "/tools/decision", gradient: "from-amber-400 to-yellow-500" },
  { icon: Clock, title: "টাইম ও এজ সিস্টেম", desc: "সঠিক বয়স, সময়ের পার্থক্য ও কাউন্টডাউন।", path: "/tools/time", gradient: "from-violet-400 to-purple-500" },
  { icon: Camera, title: "📸 AI পাসপোর্ট ফটো", desc: "প্রফেশনাল পাসপোর্ট ছবি — ব্যাকগ্রাউন্ড, ড্রেস, প্রিন্ট শীট।", path: "/tools/passport-photo", gradient: "from-sky-400 to-cyan-500", tag: "AI" },
  { icon: Scissors, title: "💇 হেয়ারস্টাইল প্রিভিউ", desc: "AI দিয়ে নতুন হেয়ারস্টাইল দেখুন — ফেড, কোরিয়ান, ফরমাল।", path: "/tools/hair-style", gradient: "from-rose-400 to-pink-500", tag: "AI" },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const ToolsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        <motion.div
          className="text-center mb-14 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-heading text-accent tracking-[0.3em] uppercase">Tools Ecosystem</span>
          <h1 className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            সব <span className="gradient-text">টুলস</span>
          </h1>
          <p className="text-muted-foreground font-bangla max-w-md mx-auto">
            আপনার দৈনন্দিন জীবন সহজ করতে প্রতিটি টুল যত্ন সহকারে তৈরি
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {tools.map((tool) => (
            <motion.div key={tool.path} variants={fadeUp}>
              <button
                type="button"
                onClick={() => navigate(tool.path)}
                className="tool-card-premium p-6 group block w-full text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shadow-lg`}>
                    <tool.icon size={24} className="text-white" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bangla-heading font-semibold text-foreground text-[15px] leading-tight">
                        {tool.title}
                      </h3>
                      {tool.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-heading font-medium">
                          {tool.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-bangla leading-relaxed">{tool.desc}</p>
                    <div className="flex items-center gap-1 text-xs text-accent font-heading font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      ব্যবহার করুন <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ToolsPage;
