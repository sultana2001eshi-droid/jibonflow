import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Target, Sparkles, ArrowLeft, Plus, X, Zap } from "lucide-react";
import PageTransition from "@/components/PageTransition";

type Priority = "price" | "quality" | "time";
const priorityLabels: Record<Priority, string> = { price: "💰 দাম", quality: "⭐ মান", time: "⏱ সময়" };

const DecisionHelper = () => {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [priority, setPriority] = useState<Priority>("quality");
  const [result, setResult] = useState<{ best: string; reasoning: string; scores: { name: string; score: number }[] } | null>(null);

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i: number, val: string) => { const n = [...options]; n[i] = val; setOptions(n); };

  const decide = () => {
    const valid = options.filter((o) => o.trim());
    if (valid.length < 2) return;

    // Use timestamp for randomness so results differ each time
    const now = Date.now();
    const scored = valid.map((name, idx) => {
      const seed = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
      const rand1 = ((seed * 7 + 13 + now % 100 + idx * 17) % 40) + 60;
      const rand2 = ((seed * 11 + 29 + now % 77 + idx * 23) % 35) + 65;
      const rand3 = ((seed * 13 + 7 + now % 53 + idx * 31) % 45) + 55;
      return { name, priceScore: rand1, qualityScore: rand2, timeScore: rand3 };
    });

    const weights: Record<Priority, [number, number, number]> = {
      price: [0.5, 0.3, 0.2],
      quality: [0.2, 0.5, 0.3],
      time: [0.2, 0.3, 0.5],
    };

    const w = weights[priority];
    const withTotal = scored.map((o) => ({
      name: o.name,
      score: Math.round(o.priceScore * w[0] + o.qualityScore * w[1] + o.timeScore * w[2]),
    }));

    withTotal.sort((a, b) => b.score - a.score);
    const best = withTotal[0];

    const reasonMap: Record<Priority, string> = {
      price: `"${best.name}" দামের দিক থেকে সবচেয়ে সুবিধাজনক। এটি আপনার বাজেটের সাথে সবচেয়ে ভালো মানিয়ে যায়।`,
      quality: `"${best.name}" গুণগত মানের দিক থেকে সেরা পছন্দ। দীর্ঘমেয়াদে এটি সবচেয়ে ভালো সন্তুষ্টি দেবে।`,
      time: `"${best.name}" সময়ের দিক থেকে সবচেয়ে কার্যকর। দ্রুত ফলাফল পেতে এটি বেছে নিন।`,
    };

    setResult({ best: best.name, reasoning: reasonMap[priority], scores: withTotal });
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <Target size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">ডিসিশন ইঞ্জিন</h1>
                <p className="text-xs text-muted-foreground font-bangla">স্মার্ট সিদ্ধান্ত নিতে সাহায্য করি</p>
              </div>
            </div>
          </div>

          <div className="glass-card gradient-border rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">অপশনগুলো লিখুন</label>
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`অপশন ${i + 1}`} value={opt} onChange={(e) => updateOption(i, e.target.value)} className="font-bangla" />
                  {options.length > 2 && (
                    <button onClick={() => removeOption(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addOption} className="text-accent text-xs">
                <Plus size={14} /> আরো যোগ করুন
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">আপনার প্রায়োরিটি কী?</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(priorityLabels) as Priority[]).map((p) => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${priority === p ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {priorityLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={decide} variant="hero" className="w-full" size="lg">
              <Zap size={16} /> সিদ্ধান্ত নিন
            </Button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="glass-card gradient-border rounded-2xl p-6 text-center space-y-3">
                <Sparkles size={28} className="text-accent mx-auto" />
                <p className="text-sm text-muted-foreground font-bangla">সেরা পছন্দ</p>
                <p className="text-3xl font-display font-bold text-foreground">{result.best}</p>
                <p className="text-sm text-muted-foreground font-bangla leading-relaxed">{result.reasoning}</p>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-heading font-semibold text-foreground">স্কোর তুলনা</h4>
                {result.scores.map((s, i) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bangla">
                      <span className={i === 0 ? "text-accent font-medium" : "text-foreground"}>{s.name}</span>
                      <span className="text-muted-foreground">{s.score}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-accent/80" : "bg-muted-foreground/30"}`} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default DecisionHelper;
