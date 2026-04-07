import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet, UtensilsCrossed, FileText, Package, Brain,
  PenTool, Target, Clock, ArrowRight, Receipt, Camera, Scissors,
  Sparkles, Search, LayoutGrid, Briefcase, Cpu
} from "lucide-react";
import BengaliPattern from "@/components/BengaliPattern";
import { useState, useMemo } from "react";

type Category = "all" | "daily" | "business" | "ai";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট AI", desc: "মাসিক আয়-ব্যয়ের হিসাব করুন, সেভিংস পরামর্শ পান এবং লাইফস্টাইল টিপস দেখুন।", path: "/tools/budget", gradient: "from-emerald-400 to-teal-500", tag: "জনপ্রিয়", category: "daily" as Category },
  { icon: UtensilsCrossed, title: "মিল ইন্টেলিজেন্স সিস্টেম", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা, র‍্যান্ডম মিল জেনারেটর ও পরিবার/ছাত্র মোড।", path: "/tools/meal", gradient: "from-orange-400 to-red-500", category: "daily" as Category },
  { icon: FileText, title: "স্মার্ট দরখাস্ত বিল্ডার", desc: "A4 প্রিন্ট-রেডি দরখাস্ত — PDF, JPG এক্সপোর্ট ও প্রিন্ট।", path: "/tools/application", gradient: "from-blue-400 to-indigo-500", category: "daily" as Category },
  { icon: Receipt, title: "ক্যাশ মেমো / ইনভয়েস", desc: "ব্যবসায়িক মানের ইনভয়েস — দোকানের তথ্য সেভ, PDF ও JPG এক্সপোর্ট।", path: "/tools/cashmemo", gradient: "from-purple-400 to-pink-500", tag: "ব্যবসা", category: "business" as Category },
  { icon: Package, title: "বিজনেস প্রফিট এনালাইসিস", desc: "প্রফিট ক্যালকুলেটর, মার্জিন ও ব্রেক-ইভেন বিশ্লেষণ।", path: "/tools/business", gradient: "from-fuchsia-400 to-purple-500", category: "business" as Category },
  { icon: Brain, title: "লাইফ অর্গানাইজার PRO", desc: "দৈনিক রুটিন, ফোকাস প্ল্যানার ও হ্যাবিট সাজেশন।", path: "/tools/organizer", gradient: "from-cyan-400 to-blue-500", category: "daily" as Category },
  { icon: PenTool, title: "ক্যাপশন ও বায়ো ল্যাব", desc: "ফেসবুক ক্যাপশন, স্টাইলিশ বায়ো — ইমোশনাল ও বিজনেস টোন।", path: "/tools/caption", gradient: "from-pink-400 to-rose-500", category: "daily" as Category },
  { icon: Target, title: "ডিসিশন ইঞ্জিন", desc: "অপশন দিন, সেরা সিদ্ধান্ত পান — র‍্যান্ডম ও লজিক মিক্স।", path: "/tools/decision", gradient: "from-amber-400 to-yellow-500", category: "daily" as Category },
  { icon: Clock, title: "টাইম ও এজ সিস্টেম", desc: "সঠিক বয়স, সময়ের পার্থক্য ও কাউন্টডাউন।", path: "/tools/time", gradient: "from-violet-400 to-purple-500", category: "daily" as Category },
  { icon: Camera, title: "AI পাসপোর্ট ফটো", desc: "প্রফেশনাল পাসপোর্ট ছবি — ব্যাকগ্রাউন্ড, ড্রেস, প্রিন্ট শীট।", path: "/tools/passport-photo", gradient: "from-sky-400 to-cyan-500", tag: "AI", category: "ai" as Category },
  { icon: Scissors, title: "হেয়ারস্টাইল প্রিভিউ", desc: "AI দিয়ে নতুন হেয়ারস্টাইল দেখুন — ফেড, কোরিয়ান, ফরমাল।", path: "/tools/hair-style", gradient: "from-rose-400 to-pink-500", tag: "AI", category: "ai" as Category },
];

const categories: { key: Category; label: string; icon: typeof LayoutGrid }[] = [
  { key: "all", label: "সব টুলস", icon: LayoutGrid },
  { key: "daily", label: "দৈনন্দিন", icon: Sparkles },
  { key: "business", label: "ব্যবসা", icon: Briefcase },
  { key: "ai", label: "AI টুলস", icon: Cpu },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const ToolsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      const matchesSearch = !searchQuery || tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <BengaliPattern opacity={0.025} />
      <div className="absolute top-20 right-[5%] w-80 h-80 bg-accent/8 rounded-full blur-[120px] animate-orb-pulse" />
      <div className="absolute bottom-40 left-[5%] w-96 h-96 bg-[hsl(var(--gradient-indigo)/0.06)] rounded-full blur-[140px] animate-orb-pulse" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-14 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-flex items-center gap-2 text-xs font-heading text-accent tracking-[0.25em] uppercase bg-accent/5 px-4 py-2 rounded-full border border-accent/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles size={12} />
            Tools Ecosystem
          </motion.span>

          <h1 className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
            সব <span className="gradient-text">স্মার্ট টুলস</span>
          </h1>

          <p className="text-muted-foreground font-bangla max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            আপনার দৈনন্দিন জীবন সহজ, দ্রুত ও স্মার্ট করতে প্রতিটি টুল যত্ন সহকারে তৈরি
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          className="max-w-3xl mx-auto mb-10 space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="টুল খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/70 backdrop-blur-xl border border-border/40 text-foreground font-bangla text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bangla font-medium transition-all duration-300 border ${
                  activeCategory === cat.key
                    ? "bg-accent/15 text-accent border-accent/30 shadow-sm shadow-accent/10"
                    : "bg-card/50 text-muted-foreground border-border/30 hover:border-accent/20 hover:text-foreground"
                }`}
              >
                <cat.icon size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tools count */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xs text-muted-foreground font-bangla bg-muted/50 px-3 py-1.5 rounded-full">
            {filteredTools.length}টি টুল পাওয়া গেছে
          </span>
        </motion.div>

        {/* Tools grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="show"
          key={activeCategory + searchQuery}
        >
          {filteredTools.map((tool) => (
            <motion.div key={tool.path} variants={fadeUp}>
              <button
                type="button"
                onClick={() => navigate(tool.path)}
                className="tool-card-premium p-5 sm:p-6 group block w-full text-left"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shadow-lg`}
                    style={{ width: "3.25rem", height: "3.25rem" }}
                  >
                    <tool.icon size={22} className="text-white" />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bangla-heading font-semibold text-foreground text-[15px] leading-tight">
                        {tool.title}
                      </h3>
                      {tool.tag && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-heading font-semibold border border-accent/15">
                          {tool.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-muted-foreground font-bangla leading-relaxed">{tool.desc}</p>
                    <div className="flex items-center gap-1.5 text-xs text-accent font-heading font-medium pt-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      ব্যবহার করুন <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {filteredTools.length === 0 && (
          <motion.div
            className="text-center py-16 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search size={40} className="mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground font-bangla text-sm">কোনো টুল পাওয়া যায়নি</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="text-xs text-accent font-heading hover:underline"
            >
              ফিল্টার রিসেট করুন
            </button>
          </motion.div>
        )}

        {/* Bottom stats strip */}
        <motion.div
          className="mt-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-3 p-4 sm:p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30">
            {[
              { num: "১১+", label: "টুলস", gradient: "from-emerald-400 to-teal-500" },
              { num: "১০০%", label: "ফ্রি", gradient: "from-violet-400 to-purple-500" },
              { num: "AI", label: "পাওয়ার্ড", gradient: "from-sky-400 to-cyan-500" },
            ].map((s) => (
              <div key={s.label} className="text-center space-y-1">
                <p className="font-bangla-hero text-2xl sm:text-3xl font-extrabold gradient-text">{s.num}</p>
                <p className="text-xs text-muted-foreground font-bangla font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolsPage;
