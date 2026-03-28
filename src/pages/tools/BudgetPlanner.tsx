import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, Lightbulb } from "lucide-react";

const tips: Record<string, string[]> = {
  low: ["রান্না বাসায় করুন", "পাবলিক ট্রান্সপোর্ট ব্যবহার করুন", "অফার ও ডিসকাউন্ট খুঁজুন"],
  medium: ["মাসে একবার বাইরে খেতে যান", "জরুরি তহবিল রাখুন", "সাবস্ক্রিপশন রিভিউ করুন"],
  high: ["বিনিয়োগে মনোযোগ দিন", "প্যাসিভ ইনকাম তৈরি করুন", "ট্যাক্স প্ল্যানিং করুন"],
};

const BudgetPlanner = () => {
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [result, setResult] = useState<null | { savings: number; percent: number; level: string }>(null);

  const calculate = () => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expense) || 0;
    const savings = inc - exp;
    const percent = inc > 0 ? Math.round((savings / inc) * 100) : 0;
    const level = percent >= 30 ? "high" : percent >= 10 ? "medium" : "low";
    setResult({ savings, percent, level });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Wallet size={26} className="text-emerald-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">স্মার্ট বাজেট প্ল্যানার</h1>
          <p className="text-sm text-muted-foreground font-bangla">আপনার মাসিক আয়-ব্যয়ের হিসাব করুন</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">মাসিক আয় (৳)</label>
            <Input
              type="number"
              placeholder="যেমন: 25000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="font-bangla"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">মাসিক খরচ (৳)</label>
            <Input
              type="number"
              placeholder="যেমন: 18000"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="font-bangla"
            />
          </div>
          <Button onClick={calculate} variant="hero" className="w-full" size="lg">
            হিসাব করুন
          </Button>
        </div>

        {result && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-accent" />
                <h3 className="font-heading font-semibold text-foreground">ফলাফল</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">সেভিংস</p>
                  <p className="text-xl font-heading font-bold text-foreground">৳{result.savings.toLocaleString()}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">সেভিংস রেট</p>
                  <p className="text-xl font-heading font-bold text-accent">{result.percent}%</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Lightbulb size={20} className="text-accent" />
                <h3 className="font-heading font-semibold text-foreground">লাইফস্টাইল টিপস</h3>
              </div>
              <ul className="space-y-2">
                {tips[result.level].map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-bangla flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;
