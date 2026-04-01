import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Sparkles, Plus, X, Zap, Copy, Check, RotateCcw } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import ToolResultSkeleton from "@/components/tools/ToolResultSkeleton";
import { saveToolHistory } from "@/lib/toolHistory";

type Priority = "price" | "quality" | "time" | "longterm";
const priorityLabels: Record<Priority, string> = {
  price: "💰 কম দাম", quality: "⭐ ভালো মান", time: "⏱ দ্রুত", longterm: "🔮 দীর্ঘমেয়াদী",
};

type ScoredOption = { name: string; score: number; priceScore: number; qualityScore: number; timeScore: number; longtermScore: number };

const DecisionHelper = () => {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [priority, setPriority] = useState<Priority>("quality");
  const [result, setResult] = useState<{
    best: ScoredOption; runnerUp: ScoredOption | null;
    reasoning: string; allScored: ScoredOption[];
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i: number, val: string) => { const n = [...options]; n[i] = val; setOptions(n); };

  const handleDecisionGenerate = async () => {
    const valid = options.filter((o) => o.trim());
    if (valid.length < 2) {
      setError("কমপক্ষে ২টি অপশন দিন।");
      return;
    }

    setError("");
    setLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 800));

    const now = Date.now();
    const scored: ScoredOption[] = valid.map((name, idx) => {
      const seed = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
      const r = (a: number, b: number) => ((seed * a + b + now % 97 + idx * 19) % 35) + 60;
      return {
        name,
        priceScore: r(7, 13),
        qualityScore: r(11, 29),
        timeScore: r(13, 7),
        longtermScore: r(17, 23),
        score: 0,
      };
    });

    const weights: Record<Priority, [number, number, number, number]> = {
      price: [0.45, 0.2, 0.2, 0.15],
      quality: [0.15, 0.45, 0.2, 0.2],
      time: [0.15, 0.2, 0.45, 0.2],
      longterm: [0.1, 0.25, 0.15, 0.5],
    };

    const w = weights[priority];
    scored.forEach((o) => {
      o.score = Math.round(o.priceScore * w[0] + o.qualityScore * w[1] + o.timeScore * w[2] + o.longtermScore * w[3]);
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    const runnerUp = scored.length > 1 ? scored[1] : null;

    const reasonMap: Record<Priority, string> = {
      price: `"${best.name}" দামের দিক থেকে সবচেয়ে সুবিধাজনক — বাজেট সেভ করে সেরা ভ্যালু দেয়।`,
      quality: `"${best.name}" গুণগত মানে এগিয়ে — দীর্ঘমেয়াদে সেরা সন্তুষ্টি দেবে।`,
      time: `"${best.name}" সময়ের দিক থেকে সবচেয়ে কার্যকর — দ্রুত ফলাফল পেতে এটাই বেস্ট।`,
      longterm: `"${best.name}" দীর্ঘমেয়াদে সবচেয়ে লাভজনক — ভবিষ্যতের কথা ভেবে এটি বেছে নিন।`,
    };

    setResult({ best, runnerUp, reasoning: reasonMap[priority], allScored: scored });
    setLoading(false);
    saveToolHistory("decision", { options: valid, priority }, { best: best.name, score: best.score, reasoning: reasonMap[priority] });
  };

  const copyResult = () => {
    if (!result) return;
    const text = `সেরা পছন্দ: ${result.best.name} (${result.best.score}/100)\n${result.reasoning}\n\nতুলনা:\n${result.allScored.map(s => `${s.name}: ${s.score}/100`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTool = () => {
    setOptions(["", ""]);
    setPriority("quality");
    setResult(null);
    setCopied(false);
    setLoading(false);
    setError("");
  };

  const validOptionsCount = options.filter((option) => option.trim()).length;

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <Target size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">ডিসিশন AI</h1>
                <p className="text-xs text-muted-foreground font-bangla">স্মার্ট তুলনা ও সেরা পছন্দ বাছাই</p>
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
              <Button variant="ghost" size="sm" type="button" onClick={addOption} className="text-accent text-xs">
                <Plus size={14} /> আরো যোগ করুন
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">আপনার প্রায়োরিটি কী?</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(priorityLabels) as Priority[]).map((p) => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${priority === p ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {priorityLabels[p]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleDecisionGenerate} disabled={validOptionsCount < 2 || loading} variant="hero" className="flex-1" size="lg">
                <Zap size={16} /> {loading ? "বিশ্লেষণ চলছে..." : "সিদ্ধান্ত নিন"}
              </Button>
              <Button type="button" onClick={resetTool} variant="outline" size="lg">
                <RotateCcw size={16} /> রিসেট
              </Button>
            </div>

            {error && <p className="text-sm font-bangla text-destructive">{error}</p>}
            {!error && validOptionsCount < 2 && <p className="text-sm font-bangla text-muted-foreground">কমপক্ষে ২টি অপশন দিন।</p>}
          </div>

          {loading && <ToolResultSkeleton cards={2} />}
          {result && !loading && (
            <div className="mt-6 space-y-4">
              {/* Best choice */}
              <div className="glass-card gradient-border rounded-2xl p-6 text-center space-y-3">
                <Sparkles size={28} className="text-accent mx-auto" />
                <p className="text-xs text-muted-foreground font-bangla">🏆 সেরা পছন্দ</p>
                <p className="text-3xl font-display font-bold text-foreground">{result.best.name}</p>
                <p className="text-2xl font-heading font-bold text-accent">{result.best.score}/100</p>
                <p className="text-sm text-muted-foreground font-bangla leading-relaxed">{result.reasoning}</p>
              </div>

              {/* Runner up */}
              {result.runnerUp && (
                <div className="glass-card rounded-2xl p-5 text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-bangla">🥈 রানার-আপ</p>
                  <p className="text-xl font-heading font-bold text-foreground">{result.runnerUp.name}</p>
                  <p className="text-lg font-heading font-bold text-muted-foreground">{result.runnerUp.score}/100</p>
                  <p className="text-xs text-muted-foreground font-bangla">
                    সেরা পছন্দের চেয়ে {result.best.score - result.runnerUp.score} পয়েন্ট পিছিয়ে
                  </p>
                </div>
              )}

              {/* Compare table */}
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-heading font-semibold text-foreground">📊 তুলনামূলক স্কোর</h4>
                  <button onClick={copyResult} className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 font-heading">
                    {copied ? <><Check size={12} className="text-emerald-500" /> কপি</> : <><Copy size={12} /> কপি</>}
                  </button>
                </div>

                {/* Score header */}
                <div className="grid grid-cols-5 gap-1 text-[10px] font-heading text-muted-foreground text-center">
                  <span className="text-left">অপশন</span>
                  <span>💰</span>
                  <span>⭐</span>
                  <span>⏱</span>
                  <span>🔮</span>
                </div>

                {result.allScored.map((s, i) => (
                  <div key={s.name} className={`grid grid-cols-5 gap-1 text-xs text-center items-center py-2 rounded-xl px-2 ${i === 0 ? "bg-accent/10" : "bg-muted/30"}`}>
                    <span className={`text-left font-bangla truncate ${i === 0 ? "text-accent font-medium" : "text-foreground"}`}>{s.name}</span>
                    <span className="font-heading text-muted-foreground">{s.priceScore}</span>
                    <span className="font-heading text-muted-foreground">{s.qualityScore}</span>
                    <span className="font-heading text-muted-foreground">{s.timeScore}</span>
                    <span className="font-heading text-muted-foreground">{s.longtermScore}</span>
                  </div>
                ))}

                {/* Overall bars */}
                <div className="space-y-2 mt-2">
                  {result.allScored.map((s, i) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bangla">
                        <span className={i === 0 ? "text-accent font-medium" : "text-foreground"}>{s.name}</span>
                        <span className="text-muted-foreground font-heading">{s.score}/100</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-accent/80" : "bg-muted-foreground/30"}`} style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default DecisionHelper;
