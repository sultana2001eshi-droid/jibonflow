import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wallet, UtensilsCrossed, FileText, Package, Brain, 
  PenTool, Target, Clock, ArrowRight, Sparkles, Star, Zap
} from "lucide-react";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট AI", desc: "আয়-ব্যয়ের হিসাব ও সেভিংস পরামর্শ", path: "/tools/budget", gradient: "from-emerald-400 to-teal-500" },
  { icon: UtensilsCrossed, title: "মিল ইন্টেলিজেন্স", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা", path: "/tools/meal", gradient: "from-orange-400 to-red-500" },
  { icon: FileText, title: "দরখাস্ত বিল্ডার", desc: "স্মার্ট বাংলা আবেদন তৈরি", path: "/tools/application", gradient: "from-blue-400 to-indigo-500" },
  { icon: Package, title: "ব্যবসা পাওয়ার টুলস", desc: "প্রফিট, ক্যাশ মেমো, অর্ডার সামারি", path: "/tools/business", gradient: "from-purple-400 to-pink-500" },
  { icon: Brain, title: "লাইফ অর্গানাইজার PRO", desc: "রুটিন ও ফোকাস প্ল্যানার", path: "/tools/organizer", gradient: "from-cyan-400 to-blue-500" },
  { icon: PenTool, title: "ক্যাপশন ল্যাব", desc: "ফেসবুক ক্যাপশন ও বায়ো", path: "/tools/caption", gradient: "from-pink-400 to-rose-500" },
  { icon: Target, title: "ডিসিশন ইঞ্জিন", desc: "সেরা সিদ্ধান্ত নেয়ার সহায়তা", path: "/tools/decision", gradient: "from-amber-400 to-yellow-500" },
  { icon: Clock, title: "টাইম সিস্টেম", desc: "সঠিক বয়স ও সময়ের হিসাব", path: "/tools/age", gradient: "from-violet-400 to-purple-500" },
];

const Particles = () => (
  <div className="particles">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${10 + i * 12}%`,
          animationDelay: `${i * -1.2}s`,
        }}
      />
    ))}
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--gradient-indigo)/0.08),transparent_50%)]" />
        
        {/* Glow orbs */}
        <div className="absolute top-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
        
        {/* Floating particles */}
        <Particles />

        {/* Floating icons */}
        <div className="absolute top-1/4 right-[15%] animate-float opacity-20">
          <Sparkles size={44} className="text-accent" />
        </div>
        <div className="absolute bottom-1/3 left-[10%] animate-float-slow opacity-15">
          <Star size={36} className="text-secondary" />
        </div>
        <div className="absolute top-[60%] right-[8%] animate-float opacity-10" style={{ animationDelay: "2s" }}>
          <Zap size={32} className="text-accent" />
        </div>

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs font-heading text-muted-foreground animate-fade-in border-accent/20">
              <Sparkles size={14} className="text-accent" />
              <span className="font-bangla">বাংলায় তৈরি, বাংলার জন্য</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            
            {/* Main headline */}
            <h1 className="font-bangla-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              আপনার প্রতিদিনের জীবনকে{" "}
              <span className="gradient-text">দিন নতুন রূপ</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground font-bangla-serif max-w-xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              হিসাব, রান্না, পরিকল্পনা, ব্যবসা — সব এক প্ল্যাটফর্মে
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/tools">
                <Button variant="hero" size="xl" className="animate-glow-pulse">
                  এখনই শুরু করুন
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/tools">
                <Button variant="hero-outline" size="xl">
                  টুলস দেখুন
                </Button>
              </Link>
            </div>

            {/* Glass preview card */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md mx-auto border-accent/10 premium-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-secondary/60" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted rounded-full w-1/2" />
                  <div className="h-8 bg-accent/10 rounded-xl w-full mt-4 flex items-center justify-center">
                    <span className="text-xs font-bangla text-accent">৮টি স্মার্ট টুলস</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.03),transparent_70%)]" />
        <div className="container relative">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-heading text-accent tracking-[0.3em] uppercase">Tools Ecosystem</span>
            <h2 className="font-bangla-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              আমাদের <span className="text-accent">টুলস</span>
            </h2>
            <p className="text-muted-foreground font-bangla max-w-md mx-auto">
              দৈনন্দিন জীবনের প্রতিটি কাজ সহজ করতে তৈরি
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="glass-card-hover gradient-border rounded-2xl p-6 group animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <tool.icon size={22} className="text-white" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1.5 flex items-center gap-2">
                  {tool.title}
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                </h3>
                <p className="text-sm text-muted-foreground font-bangla">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="py-12 border-y border-border/30">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
            {[
              { num: "৮+", label: "স্মার্ট টুলস" },
              { num: "১০০%", label: "ফ্রি" },
              { num: "০", label: "একাউন্ট দরকার" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="font-display text-2xl sm:text-3xl font-bold text-accent">{s.num}</p>
                <p className="text-xs text-muted-foreground font-bangla">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="glass-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 animate-gradient" />
            <div className="absolute top-0 right-0 w-60 h-60 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/10 rounded-full blur-[80px]" />
            <div className="relative z-10 space-y-6">
              <h2 className="font-bangla-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
