import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Wallet, UtensilsCrossed, FileText, Package, Brain,
  PenTool, Target, Clock, ArrowRight, Sparkles,
  TrendingUp, ChefHat, Receipt, Camera, Scissors,
  Zap, Shield, Star
} from "lucide-react";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট AI", desc: "আয়-ব্যয়ের হিসাব ও সেভিংস পরামর্শ", path: "/tools/budget", gradient: "from-emerald-400 to-teal-500", tag: "জনপ্রিয়" },
  { icon: UtensilsCrossed, title: "মিল ইন্টেলিজেন্স", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা", path: "/tools/meal", gradient: "from-orange-400 to-red-500" },
  { icon: FileText, title: "দরখাস্ত বিল্ডার", desc: "A4 প্রিন্ট-রেডি দরখাস্ত — PDF এক্সপোর্ট", path: "/tools/application", gradient: "from-blue-400 to-indigo-500" },
  { icon: Receipt, title: "ক্যাশ মেমো / ইনভয়েস", desc: "ব্যবসায়িক মানের ইনভয়েস তৈরি ও PDF", path: "/tools/cashmemo", gradient: "from-purple-400 to-pink-500", tag: "ব্যবসা" },
  { icon: Package, title: "বিজনেস প্রফিট এনালাইসিস", desc: "প্রফিট, মার্জিন ও ব্রেক-ইভেন বিশ্লেষণ", path: "/tools/business", gradient: "from-fuchsia-400 to-purple-500" },
  { icon: Brain, title: "লাইফ অর্গানাইজার PRO", desc: "রুটিন ও ফোকাস প্ল্যানার", path: "/tools/organizer", gradient: "from-cyan-400 to-blue-500" },
  { icon: PenTool, title: "ক্যাপশন ল্যাব", desc: "স্মার্ট ক্যাপশন ও বায়ো", path: "/tools/caption", gradient: "from-pink-400 to-rose-500" },
  { icon: Target, title: "ডিসিশন ইঞ্জিন", desc: "সেরা সিদ্ধান্ত নেয়ার সহায়তা", path: "/tools/decision", gradient: "from-amber-400 to-yellow-500" },
  { icon: Clock, title: "টাইম সিস্টেম", desc: "সঠিক বয়স ও সময়ের হিসাব", path: "/tools/time", gradient: "from-violet-400 to-purple-500" },
  { icon: Camera, title: "AI পাসপোর্ট ফটো", desc: "প্রফেশনাল পাসপোর্ট ছবি তৈরি", path: "/tools/passport-photo", gradient: "from-sky-400 to-cyan-500", tag: "AI" },
  { icon: Scissors, title: "হেয়ারস্টাইল প্রিভিউ", desc: "AI দিয়ে নতুন লুক দেখুন", path: "/tools/hair-style", gradient: "from-rose-400 to-pink-500", tag: "AI" },
];

const Particles = () => (
  <div className="particles">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="particle" style={{ left: `${10 + i * 12}%`, animationDelay: `${i * -1.2}s` }} />
    ))}
  </div>
);

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden gradient-mesh">
        {/* Animated orbs */}
        <div className="absolute top-16 right-[10%] w-72 h-72 bg-accent/12 rounded-full blur-[100px] animate-orb-pulse" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-[hsl(var(--gradient-indigo)/0.1)] rounded-full blur-[120px] animate-orb-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[50%] w-64 h-64 bg-[hsl(var(--gradient-purple)/0.06)] rounded-full blur-[100px] animate-orb-pulse" style={{ animationDelay: "4s" }} />

        <Particles />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Typography */}
            <motion.div
              className="space-y-8 text-center lg:text-left"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs font-heading text-muted-foreground border-accent/20">
                <Sparkles size={14} className="text-accent" />
                <span className="font-bangla">বাংলায় তৈরি, বাংলার জন্য</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-bangla-hero text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] text-foreground tracking-tight">
                জীবনের প্রতিদিনের কাজ,{" "}
                <span className="gradient-text">এখন এক স্মার্ট প্ল্যাটফর্মে</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground font-bangla-serif max-w-xl mx-auto lg:mx-0 leading-relaxed">
                শুধু টুল নয় — আপনার বাস্তব জীবনের AI-চালিত ডিজিটাল সহকারী।
                বাজেট থেকে পাসপোর্ট ফটো — সব এক জায়গায়।
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/tools">
                  <Button variant="hero" size="xl" className="animate-glow-pulse w-full sm:w-auto">
                    🚀 টুলস ব্যবহার শুরু করুন
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/documents">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                    📂 ডকুমেন্টস দেখুন
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} className="flex items-center gap-6 justify-center lg:justify-start text-xs text-muted-foreground font-bangla">
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-accent" /> দ্রুত ও ফ্রি</span>
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-accent" /> নিরাপদ</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="text-accent" /> ১১+ টুলস</span>
              </motion.div>
            </motion.div>

            {/* Right — Floating preview cards */}
            <motion.div
              className="relative hidden sm:flex flex-col items-center lg:items-end gap-5"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Budget card float */}
              <button type="button" onClick={() => navigate("/tools/budget")} className="hero-float-card p-6 w-full max-w-[340px] text-left animate-hero-float group cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <TrendingUp size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-heading font-semibold text-foreground">বাজেট রিপোর্ট</span>
                  <ArrowRight size={14} className="ml-auto text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bangla">
                    <span className="text-muted-foreground">আয়</span>
                    <span className="text-foreground font-medium">৳২৫,০০০</span>
                  </div>
                  <div className="flex justify-between text-xs font-bangla">
                    <span className="text-muted-foreground">খরচ</span>
                    <span className="text-foreground font-medium">৳১৮,০০০</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: "72%" }} />
                  </div>
                  <div className="flex justify-between text-xs font-bangla">
                    <span className="text-accent font-semibold">সেভিংস: ৳৭,০০০</span>
                    <span className="text-muted-foreground">২৮%</span>
                  </div>
                </div>
              </button>

              {/* Meal card float */}
              <button type="button" onClick={() => navigate("/tools/meal")} className="hero-float-card p-6 w-full max-w-[300px] text-left animate-hero-float-delay group cursor-pointer lg:mr-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                    <ChefHat size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-heading font-semibold text-foreground">আজকের মিল প্ল্যান</span>
                </div>
                <div className="space-y-2">
                  {[
                    { time: "সকাল", meal: "পরোটা, ডিমভুজি, চা" },
                    { time: "দুপুর", meal: "ভাত, মুরগি, ডাল" },
                    { time: "রাত", meal: "খিচুড়ি, বেগুনি" },
                  ].map((m) => (
                    <div key={m.time} className="flex items-start gap-2 text-xs font-bangla">
                      <span className="text-accent font-semibold min-w-[32px]">{m.time}</span>
                      <span className="text-muted-foreground">{m.meal}</span>
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground font-bangla pt-2 border-t border-border/30">
                    খরচ: <span className="text-accent font-semibold">৳১২০</span>
                  </div>
                </div>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ TOOLS GRID ═══════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.03),transparent_70%)]" />
        <div className="container relative">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-heading text-accent tracking-[0.3em] uppercase">Tools Ecosystem</span>
            <h2 className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              আমাদের <span className="gradient-text">টুলস</span>
            </h2>
            <p className="text-muted-foreground font-bangla max-w-md mx-auto">
              দৈনন্দিন জীবনের প্রতিটি কাজ সহজ করতে তৈরি
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
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
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-16 border-y border-border/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-[hsl(var(--gradient-indigo)/0.03)]" />
        <div className="container relative">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
            {[
              { num: "১১+", label: "স্মার্ট টুলস", icon: Zap },
              { num: "১০০%", label: "সম্পূর্ণ ফ্রি", icon: Star },
              { num: "০", label: "একাউন্ট দরকার", icon: Shield },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <s.icon size={20} className="text-accent mx-auto mb-1" />
                <p className="font-bangla-hero text-3xl sm:text-4xl font-extrabold text-accent">{s.num}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-bangla">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24">
        <div className="container">
          <motion.div
            className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden gradient-mesh border border-border/30"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[hsl(var(--gradient-indigo)/0.1)] rounded-full blur-[100px]" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
                আজই শুরু করুন
              </h2>
              <p className="text-muted-foreground font-bangla-serif max-w-md mx-auto text-lg">
                কোনো অ্যাকাউন্ট দরকার নেই। সব টুলস সম্পূর্ণ ফ্রি।
              </p>
              <Link to="/tools">
                <Button variant="hero" size="xl" className="animate-glow-pulse">
                  এখনই শুরু করুন <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
