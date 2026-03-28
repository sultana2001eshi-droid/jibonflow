import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Type, Layout, RotateCcw } from "lucide-react";

const Settings = () => {
  const [dark, setDark] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const reset = () => {
    setDark(false);
    setFontSize(16);
    setDensity("comfortable");
    document.documentElement.classList.remove("dark");
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <h1 className="font-heading text-2xl font-bold text-foreground">সেটিংস</h1>
          <p className="text-sm text-muted-foreground font-bangla">আপনার পছন্দমতো কাস্টমাইজ করুন</p>
        </div>

        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="glass-card rounded-2xl p-5 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              {dark ? <Moon size={20} className="text-accent" /> : <Sun size={20} className="text-accent" />}
              <div>
                <p className="text-sm font-heading font-medium text-foreground">ডার্ক মোড</p>
                <p className="text-xs text-muted-foreground font-bangla">{dark ? "চালু" : "বন্ধ"}</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className={`w-12 h-7 rounded-full transition-colors relative ${dark ? "bg-accent" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 bg-background rounded-full absolute top-1 transition-transform ${dark ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Font Size */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-3 mb-3">
              <Type size={20} className="text-accent" />
              <p className="text-sm font-heading font-medium text-foreground">ফন্ট সাইজ: {fontSize}px</p>
            </div>
            <input
              type="range"
              min={12}
              max={22}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          {/* Density */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-3">
              <Layout size={20} className="text-accent" />
              <p className="text-sm font-heading font-medium text-foreground">UI ঘনত্ব</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["compact", "comfortable"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${
                    density === d ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d === "compact" ? "কমপ্যাক্ট" : "কমফোর্টেবল"}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <Button onClick={reset} variant="outline" className="w-full" size="lg">
            <RotateCcw size={16} />
            রিসেট করুন
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
