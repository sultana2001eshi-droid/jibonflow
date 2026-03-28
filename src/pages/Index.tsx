import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Wallet, UtensilsCrossed, FileText, Package, Brain, 
  PenTool, Target, Clock, ArrowRight, Sparkles 
} from "lucide-react";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট প্ল্যানার", desc: "আয়-ব্যয়ের হিসাব ও সেভিংস পরামর্শ", path: "/tools/budget", color: "from-emerald-500/20 to-teal-500/20" },
  { icon: UtensilsCrossed, title: "মিল প্ল্যানার", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা", path: "/tools/meal", color: "from-orange-500/20 to-red-500/20" },
  { icon: FileText, title: "দরখাস্ত জেনারেটর", desc: "স্মার্ট বাংলা আবেদন তৈরি", path: "/tools/application", color: "from-blue-500/20 to-indigo-500/20" },
  { icon: Package, title: "ব্যবসা টুলকিট", desc: "প্রফিট, ক্যাশ মেমো, অর্ডার সামারি", path: "/tools/business", color: "from-purple-500/20 to-pink-500/20" },
  { icon: Brain, title: "লাইফ অর্গানাইজার", desc: "রুটিন ও ফোকাস প্ল্যানার", path: "/tools/organizer", color: "from-cyan-500/20 to-blue-500/20" },
  { icon: PenTool, title: "ক্যাপশন জেনারেটর", desc: "ফেসবুক ক্যাপশন ও বায়ো", path: "/tools/caption", color: "from-pink-500/20 to-rose-500/20" },
  { icon: Target, title: "ডিসিশন হেল্পার", desc: "সেরা সিদ্ধান্ত নেয়ার সহায়তা", path: "/tools/decision", color: "from-amber-500/20 to-yellow-500/20" },
  { icon: Clock, title: "বয়স ক্যালকুলেটর", desc: "সঠিক বয়স ও সময়ের হিসাব", path: "/tools/age", color: "from-violet-500/20 to-purple-500/20" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-gradient" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 right-1/4 animate-float opacity-20">
          <Sparkles size={40} className="text-accent" />
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-float-slow opacity-15">
          <Brain size={50} className="text-secondary" />
        </div>

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-heading text-muted-foreground animate-fade-in">
              <Sparkles size={14} className="text-accent" />
              বাংলায় তৈরি, বাংলার জন্য
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
              আপনার জীবনের প্রতিটি ছোট কাজ,{" "}
              <span className="gradient-text">এখন এক জায়গায়</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground font-bangla max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              হিসাব, রান্না, পরিকল্পনা, লেখালেখি — সবকিছু স্মার্টভাবে
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/tools">
                <Button variant="hero" size="xl">
                  টুলস শুরু করুন
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="hero-outline" size="xl">
                  লাইফ সহজ করুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 relative">
        <div className="container">
          <div className="text-center mb-14 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
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
                className="glass-card-hover rounded-2xl p-6 group animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon size={22} className="text-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1.5">{tool.title}</h3>
                <p className="text-sm text-muted-foreground font-bangla">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="glass-card rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 animate-gradient" />
            <div className="relative z-10 space-y-5">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                আজই শুরু করুন
              </h2>
              <p className="text-muted-foreground font-bangla max-w-md mx-auto">
                কোনো অ্যাকাউন্ট দরকার নেই। সব টুলস সম্পূর্ণ ফ্রি।
              </p>
              <Link to="/tools">
                <Button variant="hero" size="xl">
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
