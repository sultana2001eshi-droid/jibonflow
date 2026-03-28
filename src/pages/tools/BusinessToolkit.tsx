import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Copy, Check } from "lucide-react";

const BusinessToolkit = () => {
  const [tab, setTab] = useState<"profit" | "memo">("profit");
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const [qty, setQty] = useState("");
  const [profit, setProfit] = useState<null | { per: number; total: number; margin: number }>(null);

  const [items, setItems] = useState([{ name: "", price: "", qty: "" }]);
  const [memo, setMemo] = useState("");
  const [copied, setCopied] = useState(false);

  const calcProfit = () => {
    const c = parseFloat(cost) || 0;
    const s = parseFloat(sell) || 0;
    const q = parseFloat(qty) || 1;
    const per = s - c;
    setProfit({ per, total: per * q, margin: s > 0 ? Math.round((per / s) * 100) : 0 });
  };

  const generateMemo = () => {
    const lines = items
      .filter((i) => i.name)
      .map((i, idx) => `${idx + 1}. ${i.name} — ৳${i.price} × ${i.qty || 1} = ৳${(parseFloat(i.price) || 0) * (parseFloat(i.qty) || 1)}`);
    const total = items.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseFloat(i.qty) || 1), 0);
    setMemo(`===== ক্যাশ মেমো =====\n\n${lines.join("\n")}\n\n-----------------------\nমোট: ৳${total.toLocaleString()}\n=======================`);
  };

  const copyMemo = () => {
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center">
            <Package size={26} className="text-purple-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">ব্যবসা টুলকিট</h1>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { key: "profit" as const, label: "প্রফিট" },
            { key: "memo" as const, label: "ক্যাশ মেমো" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${
                tab === t.key ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "profit" && (
          <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
            <Input placeholder="ক্রয়মূল্য (৳)" type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="font-bangla" />
            <Input placeholder="বিক্রয়মূল্য (৳)" type="number" value={sell} onChange={(e) => setSell(e.target.value)} className="font-bangla" />
            <Input placeholder="পরিমাণ" type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="font-bangla" />
            <Button onClick={calcProfit} variant="hero" className="w-full" size="lg">হিসাব করুন</Button>

            {profit && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">একক লাভ</p>
                  <p className="text-lg font-heading font-bold text-foreground">৳{profit.per}</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">মোট লাভ</p>
                  <p className="text-lg font-heading font-bold text-accent">৳{profit.total}</p>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">মার্জিন</p>
                  <p className="text-lg font-heading font-bold text-foreground">{profit.margin}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "memo" && (
          <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-5 gap-2">
                <Input placeholder="পণ্য" value={item.name} onChange={(e) => { const n = [...items]; n[i].name = e.target.value; setItems(n); }} className="col-span-2 font-bangla text-sm" />
                <Input placeholder="দাম" type="number" value={item.price} onChange={(e) => { const n = [...items]; n[i].price = e.target.value; setItems(n); }} className="col-span-2 font-bangla text-sm" />
                <Input placeholder="সংখ্যা" type="number" value={item.qty} onChange={(e) => { const n = [...items]; n[i].qty = e.target.value; setItems(n); }} className="font-bangla text-sm" />
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setItems([...items, { name: "", price: "", qty: "" }])} className="text-accent text-xs">+ আরো যোগ করুন</Button>
            <Button onClick={generateMemo} variant="hero" className="w-full" size="lg">মেমো তৈরি করুন</Button>

            {memo && (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={copyMemo}>
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </Button>
                </div>
                <pre className="text-sm text-foreground font-bangla whitespace-pre-wrap bg-muted rounded-xl p-4">{memo}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessToolkit;
