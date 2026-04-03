import { useNavigate } from "react-router-dom";
import { 
  Wallet, UtensilsCrossed, FileText, Package, Brain, 
  PenTool, Target, Clock, ArrowRight, Receipt, Camera, Scissors 
} from "lucide-react";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট AI", desc: "মাসিক আয়-ব্যয়ের হিসাব করুন, সেভিংস পরামর্শ পান এবং লাইফস্টাইল টিপস দেখুন।", path: "/tools/budget", gradient: "from-emerald-400 to-teal-500" },
  { icon: UtensilsCrossed, title: "মিল ইন্টেলিজেন্স সিস্টেম", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা, র‍্যান্ডম মিল জেনারেটর ও পরিবার/ছাত্র মোড।", path: "/tools/meal", gradient: "from-orange-400 to-red-500" },
  { icon: FileText, title: "স্মার্ট দরখাস্ত বিল্ডার", desc: "A4 প্রিন্ট-রেডি দরখাস্ত — PDF, JPG এক্সপোর্ট ও প্রিন্ট।", path: "/tools/application", gradient: "from-blue-400 to-indigo-500" },
  { icon: Receipt, title: "ক্যাশ মেমো / ইনভয়েস", desc: "ব্যবসায়িক মানের ইনভয়েস — দোকানের তথ্য সেভ, PDF ও JPG এক্সপোর্ট।", path: "/tools/cashmemo", gradient: "from-purple-400 to-pink-500" },
  { icon: Package, title: "বিজনেস প্রফিট এনালাইসিস", desc: "প্রফিট ক্যালকুলেটর, মার্জিন ও ব্রেক-ইভেন বিশ্লেষণ।", path: "/tools/business", gradient: "from-fuchsia-400 to-purple-500" },
  { icon: Brain, title: "লাইফ অর্গানাইজার PRO", desc: "দৈনিক রুটিন, ফোকাস প্ল্যানার ও হ্যাবিট সাজেশন।", path: "/tools/organizer", gradient: "from-cyan-400 to-blue-500" },
  { icon: PenTool, title: "ক্যাপশন ও বায়ো ল্যাব", desc: "ফেসবুক ক্যাপশন, স্টাইলিশ বায়ো — ইমোশনাল ও বিজনেস টোন।", path: "/tools/caption", gradient: "from-pink-400 to-rose-500" },
  { icon: Target, title: "ডিসিশন ইঞ্জিন", desc: "অপশন দিন, সেরা সিদ্ধান্ত পান — র‍্যান্ডম ও লজিক মিক্স।", path: "/tools/decision", gradient: "from-amber-400 to-yellow-500" },
  { icon: Clock, title: "টাইম ও এজ সিস্টেম", desc: "সঠিক বয়স, সময়ের পার্থক্য ও কাউন্টডাউন।", path: "/tools/time", gradient: "from-violet-400 to-purple-500" },
];

const ToolsPage = () => {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container">
      <div className="text-center mb-14 space-y-4">
        <span className="text-xs font-heading text-accent tracking-[0.3em] uppercase">Tools Ecosystem</span>
        <h1 className="font-bangla-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
          সব <span className="text-accent">টুলস</span>
        </h1>
        <p className="text-muted-foreground font-bangla max-w-md mx-auto">
          আপনার দৈনন্দিন জীবন সহজ করতে প্রতিটি টুল যত্ন সহকারে তৈরি
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {tools.map((tool, i) => (
          <button
            type="button"
            onClick={() => navigate(tool.path)}
            key={tool.path}
            className="glass-card-hover gradient-border rounded-2xl p-6 group animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                <tool.icon size={22} className="text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  {tool.title}
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground font-bangla leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
  );
};

export default ToolsPage;
