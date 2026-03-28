import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Lightbulb, ArrowLeft, AlertTriangle, PieChart, Plus, X } from "lucide-react";
import PageTransition from "@/components/PageTransition";

type Category = { name: string; amount: string };

const defaultCategories: Category[] = [
  { name: "বাড়ি ভাড়া", amount: "" },
  { name: "খাবার", amount: "" },
  { name: "ট্রান্সপোর্ট", amount: "" },
  { name: "মোবাইল/ইন্টারনেট", amount: "" },
];

const tips: Record<string, string[]> = {
  low: [
    "রান্না বাসায় করুন — বাইরে খেলে ২-৩ গুণ খরচ হয়",
    "পাবলিক ট্রান্সপোর্ট ব্যবহার করুন",
    "অফার ও ডিসকাউন্ট খুঁজুন",
    "অপ্রয়োজনীয় সাবস্ক্রিপশন বাদ দিন",
  ],
  medium: [
    "মাসে একবার বাইরে খেতে যান — বাকি সময় রান্না করুন",
    "৩ মাসের জরুরি তহবিল রাখুন",
    "সাবস্ক্রিপশন রিভিউ করুন",
    "ছোট বিনিয়োগ শুরু করুন",
  ],
  high: [
    "বিনিয়োগে মনোযোগ দিন — ফিক্সড ডিপোজিট বা মিউচুয়াল ফান্ড",
    "প্যাসিভ ইনকাম তৈরি করুন",
    "ট্যাক্স প্ল্যানিং করুন",
    "ইমার্জেন্সি ফান্ড ৬ মাসের রাখুন",
  ],
};

const BudgetPlanner = () => {
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newCat, setNewCat] = useState("");
  const [result, setResult] = useState<null | {
    totalExpense: number; savings: number; percent: number;
    level: string; overspending: string[];
    categoryBreakdown: { name: string; amount: number; percentage: number }[];
  }>(null);

  const addCategory = () => {
    if (newCat.trim()) {
      setCategories([...categories, { name: newCat.trim(), amount: "" }]);
      setNewCat("");
    }
  };
  const removeCategory = (idx: number) => setCategories(categories.filter((_, i) => i !== idx));
  const updateCategory = (idx: number, amount: string) => {
    const updated = [...categories];
    updated[idx].amount = amount;
    setCategories(updated);
  };

  const calculate = () => {
    const inc = parseFloat(income) || 0;
    if (inc <= 0) return;
    const breakdown = categories
      .filter((c) => parseFloat(c.amount) > 0)
      .map((c) => {
        const amt = parseFloat(c.amount) || 0;
        return { name: c.name, amount: amt, percentage: Math.round((amt / inc) * 100) };
      });
    const totalExpense = breakdown.reduce((s, c) => s + c.amount, 0);
    const savings = inc - totalExpense;
    const percent = Math.round((savings / inc) * 100);
    const level = percent >= 30 ? "high" : percent >= 10 ? "medium" : "low";
    const overspending: string[] = [];
    breakdown.forEach((c) => {
      if (c.name === "বাড়ি ভাড়া" && c.percentage > 40) overspending.push(`⚠️ বাড়ি ভাড়া আয়ের ${c.percentage}% — ৩০-৪০% রাখার চেষ্টা করুন`);
      if (c.name === "খাবার" && c.percentage > 35) overspending.push(`⚠️ খাবারে আয়ের ${c.percentage}% — বাসায় রান্না করে কমান`);
      if (c.name === "ট্রান্সপোর্ট" && c.percentage > 15) overspending.push(`⚠️ ট্রান্সপোর্টে ${c.percentage}% — শেয়ার রাইড ব্যবহার করুন`);
    });
    if (percent < 0) overspending.push("🚨 আয়ের চেয়ে খরচ বেশি! জরুরি ভিত্তিতে খরচ কমান।");
    setResult({ totalExpense, savings, percent, level, overspending, categoryBreakdown: breakdown });
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors font-heading mb-4">
              <ArrowLeft size={16} /> টুলস
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Wallet size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">স্মার্ট বাজেট AI</h1>
                <p className="text-xs text-muted-foreground font-bangla">আয়-ব্যয়ের বিস্তারিত বিশ্লেষণ</p>
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
                  <span className="text-sm text-muted-foreground font-bangla min-w-[100px] truncate">{cat.name}</span>
                  <Input type="number" placeholder="৳" value={cat.amount} onChange={(e) => updateCategory(i, e.target.value)} className="font-bangla flex-1" />
                  {i >= 4 && (
                    <button onClick={() => removeCategory(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Input placeholder="নতুন ক্যাটাগরি যোগ করুন" value={newCat} onChange={(e) => setNewCat(e.target.value)} className="font-bangla text-sm" />
                <Button variant="ghost" size="sm" onClick={addCategory} className="text-accent shrink-0"><Plus size={16} /></Button>
              </div>
            </div>

            <Button onClick={calculate} variant="hero" className="w-full" size="lg">
              <PieChart size={16} /> বিশ্লেষণ করুন
            </Button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-accent" />
                  <h3 className="font-heading font-semibold text-foreground">বাজেট রিপোর্ট</h3>
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
                    <p className={`text-lg font-heading font-bold ${result.percent >= 20 ? "text-accent" : "text-destructive"}`}>{result.percent}%</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-heading font-medium text-muted-foreground uppercase tracking-wide">খরচের বিশ্লেষণ</p>
                  {result.categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bangla">
                        <span className="text-foreground">{cat.name}</span>
                        <span className="text-muted-foreground">৳{cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${cat.percentage > 40 ? "bg-destructive/70" : "bg-accent/70"}`} style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.overspending.length > 0 && (
                <div className="glass-card rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    <h4 className="font-heading font-semibold text-foreground text-sm">সতর্কতা</h4>
                  </div>
                  {result.overspending.map((alert, i) => (
                    <p key={i} className="text-sm text-muted-foreground font-bangla">{alert}</p>
                  ))}
                </div>
              )}

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-accent" />
                  <h4 className="font-heading font-semibold text-foreground text-sm">লাইফস্টাইল টিপস</h4>
                </div>
                <ul className="space-y-2">
                  {tips[result.level].map((tip, i) => (
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
