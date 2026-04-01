import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, Lightbulb, AlertTriangle, PieChart, Plus, X, Copy, Check, Target, RotateCcw } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import ToolResultSkeleton from "@/components/tools/ToolResultSkeleton";
import { saveToolHistory } from "@/lib/toolHistory";

type Category = { name: string; amount: string; icon: string };

const defaultCategories: Category[] = [
  { name: "বাড়ি ভাড়া", amount: "", icon: "🏠" },
  { name: "খাবার", amount: "", icon: "🍚" },
  { name: "ট্রান্সপোর্ট", amount: "", icon: "🚌" },
  { name: "মোবাইল/ইন্টারনেট", amount: "", icon: "📱" },
  { name: "পড়াশোনা/কাজ", amount: "", icon: "📚" },
  { name: "জরুরি খরচ", amount: "", icon: "🏥" },
];

type BudgetResult = {
  totalExpense: number;
  savings: number;
  savingsPercent: number;
  lifestyle: "tight" | "balanced" | "comfortable";
  warnings: string[];
  tips: string[];
  categoryBreakdown: { name: string; amount: number; percentage: number; icon: string; status: "ok" | "warning" | "danger" }[];
  suggestedBudget: { needs: number; wants: number; savings: number };
  savingsGoalMonths: number | null;
};

function analyzeBudget(income: number, categories: Category[], savingsGoal: string): BudgetResult {
  const breakdown = categories
    .filter((c) => parseFloat(c.amount) > 0)
    .map((c) => {
      const amt = parseFloat(c.amount) || 0;
      const pct = Math.round((amt / income) * 100);
      let status: "ok" | "warning" | "danger" = "ok";
      if (c.name === "বাড়ি ভাড়া" && pct > 40) status = "danger";
      else if (c.name === "বাড়ি ভাড়া" && pct > 30) status = "warning";
      else if (c.name === "খাবার" && pct > 35) status = "warning";
      else if (c.name === "ট্রান্সপোর্ট" && pct > 15) status = "warning";
      else if (pct > 25) status = "warning";
      return { name: c.name, amount: amt, percentage: pct, icon: c.icon, status };
    });

  const totalExpense = breakdown.reduce((s, c) => s + c.amount, 0);
  const savings = income - totalExpense;
  const savingsPercent = Math.round((savings / income) * 100);

  let lifestyle: "tight" | "balanced" | "comfortable";
  if (savingsPercent < 10) lifestyle = "tight";
  else if (savingsPercent < 25) lifestyle = "balanced";
  else lifestyle = "comfortable";

  // Warnings
  const warnings: string[] = [];
  if (savings < 0) warnings.push("🚨 আয়ের চেয়ে খরচ বেশি! জরুরি ভিত্তিতে খরচ কমান।");
  if (totalExpense / income > 0.8) warnings.push("⚠️ আয়ের ৮০% এর বেশি খরচ হচ্ছে — ঝুঁকিপূর্ণ!");
  breakdown.forEach((c) => {
    if (c.name === "বাড়ি ভাড়া" && c.percentage > 40)
      warnings.push(`⚠️ বাড়ি ভাড়া আয়ের ${c.percentage}% — ৩০% এর নিচে রাখুন।`);
    if (c.name === "খাবার" && c.percentage > 35)
      warnings.push(`⚠️ খাবারে ${c.percentage}% — বাসায় রান্না করে কমান।`);
  });

  // Tips based on lifestyle
  const tipsByLifestyle: Record<string, string[]> = {
    tight: [
      "50/30/20 রুল ফলো করুন: ৫০% প্রয়োজন, ৩০% চাহিদা, ২০% সেভিংস",
      "অপ্রয়োজনীয় সাবস্ক্রিপশন বাদ দিন",
      "বাসায় রান্না করলে খাবার খরচ ৪০% কমবে",
      "পাবলিক ট্রান্সপোর্ট ব্যবহার করুন",
      "প্রতি সপ্তাহে একটি 'নো-স্পেন্ড ডে' রাখুন",
    ],
    balanced: [
      "৩ মাসের জরুরি তহবিল রাখুন",
      "ছোট ছোট বিনিয়োগ শুরু করুন (DPS/FDR)",
      "মাসে একবার 'অডিট' করুন — কোথায় টাকা যাচ্ছে",
      "অফার/ডিসকাউন্ট সিজনে বড় কেনাকাটা করুন",
      "সাইড ইনকামের সুযোগ খুঁজুন",
    ],
    comfortable: [
      "বিনিয়োগ পোর্টফোলিও তৈরি করুন",
      "৬ মাসের ইমার্জেন্সি ফান্ড রাখুন",
      "প্যাসিভ ইনকাম সোর্স তৈরি করুন",
      "ট্যাক্স প্ল্যানিং শুরু করুন",
      "দীর্ঘমেয়াদী সম্পদ তৈরিতে ফোকাস করুন",
    ],
  };

  // 50/30/20 adapted for BD
  const suggestedBudget = {
    needs: Math.round(income * 0.5),
    wants: Math.round(income * 0.3),
    savings: Math.round(income * 0.2),
  };

  const goal = parseFloat(savingsGoal) || 0;
  const savingsGoalMonths = goal > 0 && savings > 0 ? Math.ceil(goal / savings) : null;

  return {
    totalExpense, savings, savingsPercent, lifestyle, warnings,
    tips: tipsByLifestyle[lifestyle],
    categoryBreakdown: breakdown, suggestedBudget, savingsGoalMonths,
  };
}

const lifestyleLabels: Record<string, { label: string; color: string }> = {
  tight: { label: "⚠️ টাইট বাজেট", color: "text-destructive" },
  balanced: { label: "⚖️ ব্যালেন্সড", color: "text-accent" },
  comfortable: { label: "✅ কমফোর্টেবল", color: "text-emerald-500" },
};

const BudgetPlanner = () => {
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newCat, setNewCat] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [result, setResult] = useState<BudgetResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addCategory = () => {
    if (newCat.trim()) {
      setCategories([...categories, { name: newCat.trim(), amount: "", icon: "📌" }]);
      setNewCat("");
    }
  };
  const removeCategory = (idx: number) => setCategories(categories.filter((_, i) => i !== idx));
  const updateCategory = (idx: number, amount: string) => {
    const updated = [...categories];
    updated[idx] = { ...updated[idx], amount };
    setCategories(updated);
  };

  const handleBudgetCalculate = async () => {
    const inc = parseFloat(income) || 0;
    if (inc <= 0) {
      setError("মাসিক আয় সঠিকভাবে লিখুন।");
      return;
    }

    setError("");
    setLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setResult(analyzeBudget(inc, categories, savingsGoal));
    setLoading(false);
  };

  const resetTool = () => {
    setIncome("");
    setCategories(defaultCategories);
    setNewCat("");
    setSavingsGoal("");
    setResult(null);
    setCopied(false);
    setLoading(false);
    setError("");
  };

  const canCalculate = Boolean(income.trim() && Number(income) > 0);

  const copyReport = () => {
    if (!result) return;
    const text = `বাজেট রিপোর্ট\nআয়: ৳${income}\nমোট খরচ: ৳${result.totalExpense}\nসেভিংস: ৳${result.savings} (${result.savingsPercent}%)\n\n${result.categoryBreakdown.map(c => `${c.icon} ${c.name}: ৳${c.amount} (${c.percentage}%)`).join("\n")}\n\nটিপস:\n${result.tips.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Wallet size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">স্মার্ট বাজেট AI</h1>
                <p className="text-xs text-muted-foreground font-bangla">আয়-ব্যয় বিশ্লেষণ ও সেভিংস প্ল্যান</p>
              </div>
            </div>
          </div>

          <div className="glass-card gradient-border rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">মাসিক আয় (৳)</label>
              <Input type="number" placeholder="যেমন: ২৫,০০০" value={income} onChange={(e) => setIncome(e.target.value)} className="font-bangla" />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-heading font-medium text-foreground">খরচের ক্যাটাগরি</label>
              {categories.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm shrink-0">{cat.icon}</span>
                  <span className="text-xs text-muted-foreground font-bangla min-w-[80px] truncate">{cat.name}</span>
                  <Input type="number" placeholder="৳" value={cat.amount} onChange={(e) => updateCategory(i, e.target.value)} className="font-bangla flex-1" />
                  {i >= defaultCategories.length && (
                    <button onClick={() => removeCategory(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="নতুন ক্যাটাগরি" value={newCat} onChange={(e) => setNewCat(e.target.value)} className="font-bangla text-sm" />
              <Button variant="ghost" size="sm" type="button" onClick={addCategory} className="text-accent shrink-0"><Plus size={16} /></Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
                <Target size={14} className="text-accent" /> সেভিংস গোল (ঐচ্ছিক)
              </label>
              <Input type="number" placeholder="যেমন: ৫০,০০০ — কত টাকা জমাতে চান?" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} className="font-bangla" />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBudgetCalculate} disabled={!canCalculate || loading} variant="hero" className="flex-1" size="lg">
                <PieChart size={16} /> {loading ? "বিশ্লেষণ চলছে..." : "বিশ্লেষণ করুন"}
              </Button>
              <Button type="button" onClick={resetTool} variant="outline" size="lg">
                <RotateCcw size={16} /> রিসেট
              </Button>
            </div>

            {error && <p className="text-sm font-bangla text-destructive">{error}</p>}
            {!error && !canCalculate && <p className="text-sm font-bangla text-muted-foreground">প্রথমে মাসিক আয় লিখুন।</p>}
          </div>

          {loading && <ToolResultSkeleton cards={2} />}
          {result && !loading && (
            <div className="mt-6 space-y-4">
              {/* Summary */}
              <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent" />
                    <h3 className="font-heading font-semibold text-foreground">বাজেট রিপোর্ট</h3>
                  </div>
                  <button onClick={copyReport} className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 font-heading">
                    {copied ? <><Check size={12} className="text-emerald-500" /> কপি</> : <><Copy size={12} /> কপি</>}
                  </button>
                </div>

                {/* Lifestyle badge */}
                <div className="text-center">
                  <span className={`text-lg font-heading font-bold ${lifestyleLabels[result.lifestyle].color}`}>
                    {lifestyleLabels[result.lifestyle].label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">মোট খরচ</p>
                    <p className="text-lg font-heading font-bold text-foreground">৳{result.totalExpense.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">সেভিংস</p>
                    <p className={`text-lg font-heading font-bold ${result.savings >= 0 ? "text-accent" : "text-destructive"}`}>৳{result.savings.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">সেভিংস রেট</p>
                    <p className={`text-lg font-heading font-bold ${result.savingsPercent >= 20 ? "text-accent" : "text-destructive"}`}>{result.savingsPercent}%</p>
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="space-y-2.5">
                  <p className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wide">খরচের বিশ্লেষণ</p>
                  {result.categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bangla">
                        <span className="text-foreground flex items-center gap-1">{cat.icon} {cat.name}</span>
                        <span className="text-muted-foreground">৳{cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${cat.status === "danger" ? "bg-destructive/70" : cat.status === "warning" ? "bg-amber-500/70" : "bg-accent/70"}`}
                          style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 50/30/20 Suggested Budget */}
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h4 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
                  <Target size={14} className="text-accent" /> সাজেস্টেড বাজেট স্প্লিট (50/30/20)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">প্রয়োজন (50%)</p>
                    <p className="text-sm font-heading font-bold text-foreground">৳{result.suggestedBudget.needs.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">চাহিদা (30%)</p>
                    <p className="text-sm font-heading font-bold text-foreground">৳{result.suggestedBudget.wants.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">সেভিংস (20%)</p>
                    <p className="text-sm font-heading font-bold text-accent">৳{result.suggestedBudget.savings.toLocaleString()}</p>
                  </div>
                </div>
                {result.savingsGoalMonths && (
                  <div className="bg-accent/10 rounded-xl p-3 text-center">
                    <p className="text-xs font-bangla text-foreground">
                      🎯 আপনার সেভিংস গোলে পৌঁছাতে লাগবে: <span className="font-heading font-bold text-accent">{result.savingsGoalMonths} মাস</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="glass-card rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <h4 className="font-heading font-semibold text-foreground text-sm">সতর্কতা</h4>
                  </div>
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-sm text-muted-foreground font-bangla">{w}</p>
                  ))}
                </div>
              )}

              {/* Tips */}
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-accent" />
                  <h4 className="font-heading font-semibold text-foreground text-sm">💡 আপনার জন্য টিপস</h4>
                </div>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground font-bangla flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BudgetPlanner;
