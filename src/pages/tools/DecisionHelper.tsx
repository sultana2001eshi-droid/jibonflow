import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Shuffle, Sparkles } from "lucide-react";

const DecisionHelper = () => {
  const [options, setOptions] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const decide = () => {
    const opts = options.split(",").map((o) => o.trim()).filter(Boolean);
    if (opts.length < 2) return;
    const chosen = opts[Math.floor(Math.random() * opts.length)];
    setResult(chosen);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Target size={26} className="text-amber-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">ডিসিশন হেল্পার</h1>
          <p className="text-sm text-muted-foreground font-bangla">সিদ্ধান্ত নিতে পারছেন না? আমরা সাহায্য করি!</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">অপশনগুলো লিখুন (কমা দিয়ে আলাদা করুন)</label>
            <Input
              placeholder="চা, কফি, জুস"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="font-bangla"
            />
          </div>
          <Button onClick={decide} variant="hero" className="w-full" size="lg">
            <Shuffle size={16} />
            সিদ্ধান্ত নিন
          </Button>
        </div>

        {result && (
          <div className="mt-6 glass-card rounded-2xl p-8 text-center space-y-3 animate-scale-in">
            <Sparkles size={28} className="text-accent mx-auto" />
            <p className="text-sm text-muted-foreground font-bangla">আপনার সেরা পছন্দ:</p>
            <p className="text-3xl font-display font-bold text-foreground">{result}</p>
            <Button variant="ghost" size="sm" onClick={decide} className="text-accent">
              <Shuffle size={14} /> আবার চেষ্টা করুন
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionHelper;
