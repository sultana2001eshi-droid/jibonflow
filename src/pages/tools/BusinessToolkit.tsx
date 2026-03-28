import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Package, Copy, Check, ArrowLeft, TrendingUp, Receipt, Plus, Lightbulb } from "lucide-react";

const BusinessToolkit = () => {
  const [tab, setTab] = useState<"profit" | "memo">("profit");

  // Profit state
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const [qty, setQty] = useState("");
  const [delivery, setDelivery] = useState("");
  const [profit, setProfit] = useState<null | {
    perUnit: number; totalProfit: number; margin: number;
    totalRevenue: number; totalCost: number; suggestedPrice: number; insight: string;
  }>(null);

  // Memo state
  const [shopName, setShopName] = useState("");
  const [items, setItems] = useState([{ name: "", price: "", qty: "" }]);
  const [memo, setMemo] = useState("");
  const [copied, setCopied] = useState(false);

  const calcProfit = () => {
    const c = parseFloat(cost) || 0;
    const s = parseFloat(sell) || 0;
    const q = parseFloat(qty) || 1;
    const d = parseFloat(delivery) || 0;
    const perUnit = s - c - d;
    const totalProfit = perUnit * q;
    const totalRevenue = s * q;
    const totalCost = (c + d) * q;
    const margin = s > 0 ? Math.round((perUnit / s) * 100) : 0;
    const suggestedPrice = Math.round(c * 1.4 + d);
    let insight = "";
    if (margin < 10) insight = "⚠️ মার্জিন খুব কম। দাম বাড়ান অথবা খরচ কমান।";
    else if (margin < 25) insight = "💡 মার্জিন মোটামুটি। বেশি পরিমাণে বিক্রি করলে ভালো লাভ হবে।";
    else insight = "✅ ভালো মার্জিন! এই দামে চালিয়ে যান।";
    setProfit({ perUnit, totalProfit, margin, totalRevenue, totalCost, suggestedPrice, insight });
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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="mb-6 animate-fade-in">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors font-heading mb-4">
            <ArrowLeft size={16} /> টুলস
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">ব্যবসা পাওয়ার টুলস</h1>
              <p className="text-xs text-muted-foreground font-bangla">প্রফিট ক্যালকুলেটর ও ক্যাশ মেমো</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { key: "profit" as const, label: "প্রফিট", icon: TrendingUp },
            { key: "memo" as const, label: "ক্যাশ মেমো", icon: Receipt },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bangla font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === t.key ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "profit" && (
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">ক্রয়মূল্য (৳)</label>
              <Input type="number" placeholder="যেমন: ১০০" value={cost} onChange={(e) => setCost(e.target.value)} className="font-bangla" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">বিক্রয়মূল্য (৳)</label>
              <Input type="number" placeholder="যেমন: ১৫০" value={sell} onChange={(e) => setSell(e.target.value)} className="font-bangla" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">ডেলিভারি চার্জ (৳)</label>
              <Input type="number" placeholder="যেমন: ২০" value={delivery} onChange={(e) => setDelivery(e.target.value)} className="font-bangla" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">পরিমাণ</label>
              <Input type="number" placeholder="যেমন: ১০" value={qty} onChange={(e) => setQty(e.target.value)} className="font-bangla" />
            </div>
            <Button onClick={calcProfit} variant="hero" className="w-full" size="lg">
              <TrendingUp size={16} /> হিসাব করুন
            </Button>

            {profit && (
              <div className="space-y-4 mt-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">একক লাভ</p>
                    <p className={`text-lg font-heading font-bold ${profit.perUnit >= 0 ? "text-accent" : "text-destructive"}`}>৳{profit.perUnit}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">মোট লাভ</p>
                    <p className={`text-lg font-heading font-bold ${profit.totalProfit >= 0 ? "text-accent" : "text-destructive"}`}>৳{profit.totalProfit.toLocaleString()}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">মার্জিন</p>
                    <p className="text-lg font-heading font-bold text-foreground">{profit.margin}%</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground font-bangla">সাজেস্টেড দাম</p>
                    <p className="text-lg font-heading font-bold text-foreground">৳{profit.suggestedPrice}</p>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 flex items-start gap-2">
                  <Lightbulb size={16} className="text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground font-bangla">{profit.insight}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "memo" && (
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">দোকানের নাম</label>
              <Input placeholder="আপনার দোকানের নাম" value={shopName} onChange={(e) => setShopName(e.target.value)} className="font-bangla" />
            </div>

            <label className="text-sm font-heading font-medium text-foreground block">পণ্যের তালিকা</label>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-7 gap-2">
                <Input placeholder="পণ্য" value={item.name} onChange={(e) => { const n = [...items]; n[i].name = e.target.value; setItems(n); }} className="col-span-3 font-bangla text-sm" />
                <Input placeholder="দাম" type="number" value={item.price} onChange={(e) => { const n = [...items]; n[i].price = e.target.value; setItems(n); }} className="col-span-2 font-bangla text-sm" />
                <Input placeholder="সংখ্যা" type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[i].qty = e.target.value; setItems(n); }} className="col-span-2 font-bangla text-sm" />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setItems([...items, { name: "", price: "", qty: "" }])} className="text-accent text-xs">
              <Plus size={14} /> আরো যোগ করুন
            </Button>
            <Button onClick={generateMemo} variant="hero" className="w-full" size="lg">
              <Receipt size={16} /> মেমো তৈরি করুন
            </Button>

            {memo && (
              <div className="space-y-2 mt-2 animate-fade-in">
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
  );
};

export default BusinessToolkit;
