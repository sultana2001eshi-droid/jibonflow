import { Link } from "react-router-dom";
import { 
  Wallet, UtensilsCrossed, FileText, Package, Brain, 
  PenTool, Target, Clock, ArrowRight 
} from "lucide-react";

const tools = [
  { icon: Wallet, title: "স্মার্ট বাজেট প্ল্যানার", desc: "মাসিক আয়-ব্যয়ের হিসাব করুন, সেভিংস পরামর্শ পান এবং লাইফস্টাইল টিপস দেখুন।", path: "/tools/budget" },
  { icon: UtensilsCrossed, title: "ইন্টেলিজেন্ট মিল প্ল্যানার", desc: "বাজেট অনুযায়ী খাবার পরিকল্পনা, র‍্যান্ডম মিল জেনারেটর ও পরিবার/ছাত্র মোড।", path: "/tools/meal" },
  { icon: FileText, title: "বাংলা দরখাস্ত জেনারেটর", desc: "ছুটির আবেদন, চাকরির আবেদন ও ফর্মাল দরখাস্ত সুন্দরভাবে তৈরি করুন।", path: "/tools/application" },
  { icon: Package, title: "ক্ষুদ্র ব্যবসা টুলকিট", desc: "প্রফিট ক্যালকুলেটর, ক্যাশ মেমো, অর্ডার সামারি ও ডেলিভারি চার্জ।", path: "/tools/business" },
  { icon: Brain, title: "লাইফ অর্গানাইজার", desc: "দৈনিক রুটিন, ফোকাস প্ল্যানার ও হ্যাবিট সাজেশন।", path: "/tools/organizer" },
  { icon: PenTool, title: "ক্যাপশন ও বায়ো জেনারেটর", desc: "ফেসবুক ক্যাপশন, স্টাইলিশ বায়ো — ইমোশনাল ও বিজনেস টোন।", path: "/tools/caption" },
  { icon: Target, title: "ডিসিশন হেল্পার", desc: "অপশন দিন, সেরা সিদ্ধান্ত পান — র‍্যান্ডম ও লজিক মিক্স।", path: "/tools/decision" },
  { icon: Clock, title: "বয়স ও সময় ক্যালকুলেটর", desc: "সঠিক বয়স, সময়ের পার্থক্য ও কাউন্টডাউন।", path: "/tools/age" },
];

const ToolsPage = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container">
      <div className="text-center mb-12 space-y-3">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
          সব <span className="text-accent">টুলস</span>
        </h1>
        <p className="text-muted-foreground font-bangla max-w-md mx-auto">
          আপনার দৈনন্দিন জীবন সহজ করতে প্রতিটি টুল যত্ন সহকারে তৈরি
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {tools.map((tool, i) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="glass-card-hover rounded-2xl p-6 group animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <tool.icon size={22} className="text-accent" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                  {tool.title}
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground font-bangla leading-relaxed">{tool.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default ToolsPage;
