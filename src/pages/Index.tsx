import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Wallet, UtensilsCrossed, FileText, Package, Brain,
  PenTool, Target, Clock, ArrowRight, Sparkles,
  TrendingUp, ChefHat, Receipt, Camera, Scissors,
  Zap, Shield, Star, CheckCircle2, Globe, Heart
} from "lucide-react";
import BengaliPattern from "@/components/BengaliPattern";
import { useRef } from "react";

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

const features = [
  { icon: Zap, title: "তীব্র গতি", desc: "সব টুল ইনস্ট্যান্ট — কোনো লোডিং নেই" },
  { icon: Shield, title: "সম্পূর্ণ নিরাপদ", desc: "আপনার ডেটা শুধু আপনারই থাকে" },
  { icon: Globe, title: "সব ডিভাইসে", desc: "ফোন, ট্যাবলেট, ল্যাপটপ — সবখানে" },
  { icon: Heart, title: "সম্পূর্ণ ফ্রি", desc: "কোনো হিডেন চার্জ বা লিমিট নেই" },
];

const Particles = () => (
  <div className="particles">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="particle" style={{ left: `${5 + i * 8}%`, animationDelay: `${i * -0.8}s` }} />
    ))}
  </div>
);

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const Index = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center overflow-hidden gradient-mesh">
        {/* Bengali ornamental pattern */}
        <BengaliPattern opacity={0.06} />

        {/* Animated orbs */}
        <div className="absolute top-16 right-[10%] w-80 h-80 bg-accent/15 rounded-full blur-[120px] animate-orb-pulse" />
        <div className="absolute bottom-20 left-[5%] w-[28rem] h-[28rem] bg-[hsl(var(--gradient-indigo)/0.12)] rounded-full blur-[140px] animate-orb-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[50%] w-72 h-72 bg-[hsl(var(--gradient-purple)/0.08)] rounded-full blur-[120px] animate-orb-pulse" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-[10%] right-[20%] w-48 h-48 bg-accent/10 rounded-full blur-[80px] animate-orb-pulse" style={{ animationDelay: "3s" }} />

        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-accent/10 rounded-tl-3xl" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-accent/10 rounded-br-3xl" />

        <Particles />

        <motion.div className="container relative z-10 pt-20 pb-12 sm:pt-24 sm:pb-16" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
            {/* Left — Typography */}
            <motion.div
              className="space-y-7 text-center lg:text-left"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card text-xs font-heading text-muted-foreground border-accent/20 shadow-sm">
                <Sparkles size={14} className="text-accent animate-pulse" />
                <span className="font-bangla font-medium">বাংলায় তৈরি, বাংলার জন্য</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-bangla-hero text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold leading-[1.12] text-foreground tracking-tight">
                জীবনের প্রতিদিনের কাজ,{" "}
                <span className="gradient-text relative">
                  এখন এক স্মার্ট প্ল্যাটফর্মে
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0 6 Q50 0 100 6 Q150 12 200 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-base sm:text-lg lg:text-xl text-muted-foreground font-bangla-serif max-w-xl mx-auto lg:mx-0 leading-relaxed">
                শুধু টুল নয় — আপনার বাস্তব জীবনের <span className="text-accent font-semibold">AI-চালিত</span> ডিজিটাল সহকারী।
                বাজেট থেকে পাসপোর্ট ফটো — সব এক জায়গায়।
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
                <Link to="/tools">
                  <Button variant="hero" size="xl" className="animate-glow-pulse w-full sm:w-auto group">
                    🚀 টুলস ব্যবহার শুরু করুন
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/documents">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                    📂 ডকুমেন্টস দেখুন
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 justify-center lg:justify-start text-xs text-muted-foreground font-bangla">
                {[
                  { icon: Zap, text: "দ্রুত ও ফ্রি" },
                  { icon: Shield, text: "নিরাপদ" },
                  { icon: Star, text: "১১+ টুলস" },
                  { icon: CheckCircle2, text: "একাউন্ট লাগে না" },
                ].map((b) => (
                  <span key={b.text} className="flex items-center gap-1.5 bg-accent/5 px-3 py-1.5 rounded-full border border-accent/10">
                    <b.icon size={13} className="text-accent" />
                    <span className="font-medium">{b.text}</span>
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Floating preview cards */}
            <motion.div
              className="relative hidden sm:flex flex-col items-center lg:items-end gap-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Budget card */}
              <button type="button" onClick={() => navigate("/tools/budget")} className="hero-float-card p-6 w-full max-w-[340px] text-left animate-hero-float group cursor-pointer hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-heading font-semibold text-foreground block">বাজেট রিপোর্ট</span>
                    <span className="text-[10px] text-muted-foreground font-bangla">এপ্রিল ২০২৬</span>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bangla">
                    <span className="text-muted-foreground">আয়</span>
                    <span className="text-foreground font-semibold">৳২৫,০০০</span>
                  </div>
                  <div className="flex justify-between text-xs font-bangla">
                    <span className="text-muted-foreground">খরচ</span>
                    <span className="text-foreground font-semibold">৳১৮,০০০</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bangla">
                    <span className="text-accent font-bold">সেভিংস: ৳৭,০০০</span>
                    <span className="text-muted-foreground bg-accent/10 px-2 py-0.5 rounded-full font-semibold">২৮%</span>
                  </div>
                </div>
              </button>

              {/* Meal card */}
              <button type="button" onClick={() => navigate("/tools/meal")} className="hero-float-card p-6 w-full max-w-[300px] text-left animate-hero-float-delay group cursor-pointer lg:mr-12 hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <ChefHat size={20} className="text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-heading font-semibold text-foreground block">আজকের মিল প্ল্যান</span>
                    <span className="text-[10px] text-muted-foreground font-bangla">৩ বেলার পরিকল্পনা</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { time: "সকাল", meal: "পরোটা, ডিমভুজি, চা", emoji: "🌅" },
                    { time: "দুপুর", meal: "ভাত, মুরগি, ডাল", emoji: "☀️" },
                    { time: "রাত", meal: "খিচুড়ি, বেগুনি", emoji: "🌙" },
                  ].map((m) => (
                    <div key={m.time} className="flex items-center gap-2.5 text-xs font-bangla bg-muted/30 rounded-lg px-3 py-2">
                      <span className="text-sm">{m.emoji}</span>
                      <span className="text-accent font-bold min-w-[36px]">{m.time}</span>
                      <span className="text-muted-foreground">{m.meal}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-bangla pt-2 border-t border-border/30">
                    <span>মোট খরচ</span>
                    <span className="text-accent font-bold text-sm">৳১২০</span>
                  </div>
                </div>
              </button>

              {/* Floating AI badge */}
              <motion.div
                className="absolute -top-4 -left-4 lg:left-auto lg:-right-4 bg-accent/10 backdrop-blur-xl border border-accent/20 rounded-2xl px-4 py-3 shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  <span className="text-xs font-heading font-semibold text-foreground">AI Powered</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 22.5C1248 25 1344 40 1392 47.5L1440 55V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* ═══════════ FEATURES ROW ═══════════ */}
      <section className="py-12 sm:py-16 relative -mt-1 bg-background">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="text-center p-5 sm:p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <f.icon size={22} className="text-accent" />
                </div>
                <h3 className="font-bangla-heading font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground font-bangla leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TOOLS GRID ═══════════ */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.04),transparent_60%)]" />
        <BengaliPattern opacity={0.02} />
        <div className="container relative">
          <motion.div
            className="text-center mb-12 sm:mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-heading text-accent tracking-[0.25em] uppercase bg-accent/5 px-4 py-2 rounded-full border border-accent/10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles size={12} />
              Tools Ecosystem
            </motion.span>
            <h2 className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
              আমাদের <span className="gradient-text">স্মার্ট টুলস</span>
            </h2>
            <p className="text-muted-foreground font-bangla max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              দৈনন্দিন জীবনের প্রতিটি কাজ সহজ, দ্রুত ও স্মার্ট করতে তৈরি
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            {tools.map((tool, i) => (
              <motion.div key={tool.path} variants={fadeUp}>
                <button
                  type="button"
                  onClick={() => navigate(tool.path)}
                  className="tool-card-premium p-5 sm:p-6 group block w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 shadow-lg`}
                      style={{ width: '3.25rem', height: '3.25rem' }}
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

          {/* View all tools link */}
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/tools">
              <Button variant="outline" size="lg" className="font-bangla group border-accent/20 hover:border-accent/40 hover:bg-accent/5">
                সব টুলস দেখুন <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <BengaliPattern opacity={0.03} />
        <div className="container relative">
          <motion.div
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { num: "১১+", label: "স্মার্ট টুলস", icon: Zap, gradient: "from-amber-400 to-orange-500" },
              { num: "১০০%", label: "সম্পূর্ণ ফ্রি", icon: Star, gradient: "from-violet-400 to-purple-500" },
              { num: "০", label: "একাউন্ট দরকার", icon: Shield, gradient: "from-emerald-400 to-teal-500" },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={scaleIn}
                className="relative p-5 sm:p-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 text-center group hover:border-accent/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon size={22} className="text-white" />
                </div>
                <p className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-extrabold gradient-text mb-1">{s.num}</p>
                <p className="text-xs sm:text-sm text-muted-foreground font-bangla font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-16 sm:py-24 bg-background relative">
        <div className="container">
          <motion.div
            className="text-center mb-12 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-heading text-accent tracking-[0.25em] uppercase bg-accent/5 px-4 py-2 rounded-full border border-accent/10">
              How It Works
            </span>
            <h2 className="font-bangla-hero text-3xl sm:text-4xl font-extrabold text-foreground">
              কিভাবে <span className="gradient-text">কাজ করে?</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { step: "০১", title: "টুল বাছুন", desc: "১১+ টুল থেকে আপনার দরকারি টুলটি সিলেক্ট করুন", emoji: "🎯" },
              { step: "০২", title: "তথ্য দিন", desc: "সহজ বাংলায় আপনার তথ্য ইনপুট করুন", emoji: "✍️" },
              { step: "০৩", title: "ফলাফল পান", desc: "ইনস্ট্যান্ট রেজাল্ট — PDF, প্রিন্ট বা সেভ করুন", emoji: "🚀" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp}
                className="relative p-6 sm:p-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 text-center group hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{s.emoji}</div>
                <span className="text-3xl font-bangla-hero font-extrabold gradient-text opacity-20 absolute top-4 right-5">{s.step}</span>
                <h3 className="font-bangla-heading font-bold text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-bangla leading-relaxed">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight size={20} className="text-accent/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <motion.div
            className="relative rounded-3xl p-8 sm:p-12 md:p-16 text-center overflow-hidden border border-border/30"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* CTA background */}
            <div className="absolute inset-0 gradient-mesh" />
            <BengaliPattern opacity={0.04} />
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/12 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[hsl(var(--gradient-indigo)/0.12)] rounded-full blur-[120px]" />

            <div className="relative z-10 space-y-6">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl"
              >
                🚀
              </motion.div>
              <h2 className="font-bangla-hero text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground">
                আজই <span className="gradient-text">শুরু করুন</span>
              </h2>
              <p className="text-muted-foreground font-bangla-serif max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
                কোনো অ্যাকাউন্ট দরকার নেই। কোনো পেমেন্ট নেই।
                <br />
                <span className="text-accent font-semibold">সব টুলস সম্পূর্ণ ফ্রি।</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/tools">
                  <Button variant="hero" size="xl" className="animate-glow-pulse w-full sm:w-auto group">
                    এখনই শুরু করুন <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                    আমাদের সম্পর্কে
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
