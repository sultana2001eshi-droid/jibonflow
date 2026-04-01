import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Copy, Check, TrendingUp, Receipt, Plus, Lightbulb, AlertTriangle, RotateCcw } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import ToolResultSkeleton from "@/components/tools/ToolResultSkeleton";
import { saveToolHistory } from "@/lib/toolHistory";

type ProfitResult = {
  perUnit: number; totalProfit: number; margin: number;
  totalRevenue: number; totalCost: number; suggestedPrice: number;
  breakEvenQty: number; discountImpact: number;
  insights: string[]; warnings: string[];
};

function calculateProfit(cost: number, sell: number, delivery: number, discount: number, qty: number): ProfitResult {
  const effectiveSell = sell - discount;
  const perUnit = effectiveSell - cost - delivery;
  const totalProfit = perUnit * qty;
  const totalRevenue = effectiveSell * qty;
  const totalCost = (cost + delivery) * qty;
  const margin = effectiveSell > 0 ? Math.round((perUnit / effectiveSell) * 100) : 0;
  const suggestedPrice = Math.round(cost * 1.4 + delivery);

  // Break-even: how many units to cover fixed costs (assuming delivery is per-unit)
  const breakEvenQty = perUnit > 0 ? Math.ceil((cost * qty) / perUnit) : 0;

  const discountImpact = discount * qty;

  const insights: string[] = [];
  const warnings: string[] = [];

  if (margin >= 30) insights.push("✅ মার্জিন ভালো। এই দামে চালিয়ে যান।");
  else if (margin >= 15) insights.push("💡 মার্জিন মোটামুটি। ভলিউম বাড়িয়ে লাভ বাড়ান।");
  else if (margin > 0) insights.push("⚠️ মার্জিন কম। দাম বাড়ান বা খরচ কমান।");
  else insights.push("🚨 লস হচ্ছে! এখনই দাম রিভিউ করুন।");

  if (discount > 0 && discount > sell * 0.2) warnings.push(`⚠️ ডিসকাউন্ট বিক্রয়মূল্যের ${Math.round((discount / sell) * 100)}% — খুব বেশি!`);
  if (delivery > cost * 0.3) warnings.push(`⚠️ ডেলিভারি চার্জ খরচের ${Math.round((delivery / cost) * 100)}% — কমানোর চেষ্টা করুন।`);
  if (perUnit < 0) warnings.push("🚨 প্রতিটি পণ্যে লস হচ্ছে! দাম বাড়াতে হবে।");

  if (suggestedPrice > sell && margin < 20) {
    insights.push(`💰 সাজেস্টেড দাম: ৳${suggestedPrice} (৪০% মার্জিনের জন্য)`);
  }
  if (qty >= 50) insights.push("📦 বেশি পরিমাণে কিনলে ক্রয়মূল্য কমাতে পারেন।");

  return { perUnit, totalProfit, margin, totalRevenue, totalCost, suggestedPrice, breakEvenQty, discountImpact, insights, warnings };
}

const BusinessToolkit = () => {
  const [tab, setTab] = useState<"profit" | "memo">("profit");

  // Profit state
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const [qty, setQty] = useState("");
  const [delivery, setDelivery] = useState("");
  const [discount, setDiscount] = useState("");
  const [profit, setProfit] = useState<ProfitResult | null>(null);

  // Memo state
  const [shopName, setShopName] = useState("");
  const [items, setItems] = useState([{ name: "", price: "", qty: "" }]);
  const [memo, setMemo] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProfitCalculate = async () => {
    const c = parseFloat(cost) || 0;
    const s = parseFloat(sell) || 0;
    const q = parseFloat(qty) || 1;
    const d = parseFloat(delivery) || 0;
    const disc = parseFloat(discount) || 0;

    if (c <= 0 || s <= 0 || q <= 0) {
      setError("ক্রয়মূল্য, বিক্রয়মূল্য ও পরিমাণ সঠিকভাবে দিন।");
      return;
    }

    setError("");
    setLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setProfit(calculateProfit(c, s, d, disc, q));
    setLoading(false);
  };

  const generateMemo = () => {
    const validItems = items.filter((i) => i.name);
    const lines = validItems.map(
      (i, idx) => `${idx + 1}. ${i.name}  ×${i.qty || 1}  @৳${i.price}  = ৳${(parseFloat(i.price) || 0) * (parseFloat(i.qty) || 1)}`
    );
    const total = validItems.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseFloat(i.qty) || 1), 0);
    const date = new Date().toLocaleDateString("bn-BD");
    setMemo(
      `╔══════════════════════════╗\n   ${shopName || "আপনার দোকান"}\n   ক্যাশ মেমো\n╚══════════════════════════╝\n\nতারিখ: ${date}\n\n${lines.join("\n")}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n   মোট: ৳${total.toLocaleString()}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nধন্যবাদ! আবার আসবেন।`
    );
  };

  const copyMemo = () => {
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTool = () => {
    if (tab === "profit") {
      setCost("");
      setSell("");
      setQty("");
      setDelivery("");
      setDiscount("");
      setProfit(null);
      setError("");
      setLoading(false);
      return;
    }

    setShopName("");
    setItems([{ name: "", price: "", qty: "" }]);
    setMemo("");
    setCopied(false);
  };

  const canCalculate = Boolean(cost.trim() && sell.trim() && qty.trim());

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Package size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">বিজনেস ডিসিশন ইঞ্জিন</h1>
                <p className="text-xs text-muted-foreground font-bangla">প্রফিট, মার্জিন ও ব্রেক-ইভেন বিশ্লেষণ</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {([
              { key: "profit" as const, label: "📊 প্রফিট এনালাইসিস" },
              { key: "memo" as const, label: "🧾 ক্যাশ মেমো" },
            ]).map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bangla font-medium transition-all ${tab === t.key ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "profit" && (
            <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-foreground">ক্রয়মূল্য (৳)</label>
                  <Input type="number" placeholder="১০০" value={cost} onChange={(e) => setCost(e.target.value)} className="font-bangla" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-foreground">বিক্রয়মূল্য (৳)</label>
                  <Input type="number" placeholder="১৫০" value={sell} onChange={(e) => setSell(e.target.value)} className="font-bangla" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-foreground">ডেলিভারি (৳)</label>
                  <Input type="number" placeholder="২০" value={delivery} onChange={(e) => setDelivery(e.target.value)} className="font-bangla" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-foreground">ডিসকাউন্ট (৳)</label>
                  <Input type="number" placeholder="১০" value={discount} onChange={(e) => setDiscount(e.target.value)} className="font-bangla" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-heading font-medium text-foreground">পরিমাণ</label>
                  <Input type="number" placeholder="১০" value={qty} onChange={(e) => setQty(e.target.value)} className="font-bangla" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleProfitCalculate} disabled={!canCalculate || loading} variant="hero" className="flex-1" size="lg">
                  <TrendingUp size={16} /> {loading ? "হিসাব চলছে..." : "প্রফিট বিশ্লেষণ"}
                </Button>
                <Button type="button" onClick={resetTool} variant="outline" size="lg">
                  <RotateCcw size={16} /> রিসেট
                </Button>
              </div>

              {error && <p className="text-sm font-bangla text-destructive">{error}</p>}
              {!error && !canCalculate && <p className="text-sm font-bangla text-muted-foreground">ক্রয়মূল্য, বিক্রয়মূল্য ও পরিমাণ দিন।</p>}

              {loading && <ToolResultSkeleton cards={1} />}
              {profit && !loading && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "একক লাভ", value: `৳${profit.perUnit}`, positive: profit.perUnit >= 0 },
                      { label: "মোট লাভ", value: `৳${profit.totalProfit.toLocaleString()}`, positive: profit.totalProfit >= 0 },
                      { label: "মার্জিন", value: `${profit.margin}%`, positive: profit.margin >= 15 },
                      { label: "সাজেস্টেড দাম", value: `৳${profit.suggestedPrice}`, positive: true },
                    ].map((item) => (
                      <div key={item.label} className="bg-muted/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-bangla">{item.label}</p>
                        <p className={`text-lg font-heading font-bold ${item.positive ? "text-accent" : "text-destructive"}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground font-bangla">ব্রেক-ইভেন</p>
                      <p className="text-sm font-heading font-bold text-foreground">{profit.breakEvenQty} ইউনিট</p>
                    </div>
                    {profit.discountImpact > 0 && (
                      <div className="bg-muted/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground font-bangla">ডিসকাউন্ট লস</p>
                        <p className="text-sm font-heading font-bold text-destructive">৳{profit.discountImpact.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Insights */}
                  {profit.insights.length > 0 && (
                    <div className="bg-accent/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb size={14} className="text-accent" />
                        <span className="text-xs font-heading font-semibold text-foreground">ইনসাইটস</span>
                      </div>
                      {profit.insights.map((ins, i) => (
                        <p key={i} className="text-xs font-bangla text-foreground">{ins}</p>
                      ))}
                    </div>
                  )}

                  {/* Warnings */}
                  {profit.warnings.length > 0 && (
                    <div className="bg-destructive/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className="text-destructive" />
                        <span className="text-xs font-heading font-semibold text-foreground">সতর্কতা</span>
                      </div>
                      {profit.warnings.map((w, i) => (
                        <p key={i} className="text-xs font-bangla text-foreground">{w}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "memo" && (
            <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-heading font-medium text-foreground">দোকানের নাম</label>
                <Input placeholder="আপনার দোকানের নাম" value={shopName} onChange={(e) => setShopName(e.target.value)} className="font-bangla" />
              </div>

              <label className="text-sm font-heading font-medium text-foreground block">পণ্যের তালিকা</label>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-7 gap-2">
                  <Input placeholder="পণ্য" value={item.name} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], name: e.target.value }; setItems(n); }} className="col-span-3 font-bangla text-sm" />
                  <Input placeholder="দাম" type="number" value={item.price} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], price: e.target.value }; setItems(n); }} className="col-span-2 font-bangla text-sm" />
                  <Input placeholder="সংখ্যা" type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], qty: e.target.value }; setItems(n); }} className="col-span-2 font-bangla text-sm" />
                </div>
              ))}
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" type="button" onClick={() => setItems([...items, { name: "", price: "", qty: "" }])} className="text-accent text-xs">
                <Plus size={14} /> আরো যোগ করুন
                </Button>
                <Button type="button" onClick={resetTool} variant="outline" size="sm">
                  <RotateCcw size={14} /> রিসেট
                </Button>
              </div>
              <Button onClick={generateMemo} variant="hero" className="w-full" size="lg">
                <Receipt size={16} /> মেমো তৈরি করুন
              </Button>

              {memo && (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-heading font-semibold text-foreground">প্রিভিউ</span>
                    <Button variant="ghost" size="sm" onClick={copyMemo}>
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span className="text-xs ml-1">{copied ? "কপি হয়েছে" : "কপি"}</span>
                    </Button>
                  </div>
                  <pre className="text-sm text-foreground font-bangla whitespace-pre-wrap bg-muted/50 rounded-xl p-4 leading-relaxed border border-border/30">
                    {memo}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default BusinessToolkit;
