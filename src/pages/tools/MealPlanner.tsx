import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, RefreshCw } from "lucide-react";

type Mode = "family" | "student" | "single";

const meals: Record<Mode, string[][]> = {
  family: [
    ["ভাত, মুরগির তরকারি, ডাল, সালাদ", "পরোটা, ডিমভুজি, চা", "খিচুড়ি, বেগুনি"],
    ["ভাত, মাছের ঝোল, ভর্তা", "রুটি, সবজি", "ফ্রাইড রাইস, চিকেন"],
    ["বিরিয়ানি, রায়তা", "পরোটা, হালিম", "ভাত, ডাল, ভাজি"],
  ],
  student: [
    ["ভাত, ডাল, ডিম", "রুটি, কলা", "নুডলস"],
    ["খিচুড়ি", "বিস্কুট, চা", "ভাত, আলু ভর্তা"],
    ["ফ্রাইড রাইস", "পরোটা, ডাল", "ভাত, সবজি"],
  ],
  single: [
    ["ভাত, ডিম, ডাল", "টোস্ট, চা", "ইনস্ট্যান্ট নুডলস"],
    ["খিচুড়ি, ডিম", "বিস্কুট, কলা", "ভাত, ভাজি"],
    ["পরোটা, ডিমভুজি", "চা, রুটি", "ফ্রাইড রাইস"],
  ],
};

const modeLabels: Record<Mode, string> = { family: "পরিবার", student: "ছাত্র", single: "সিঙ্গেল" };

const MealPlanner = () => {
  const [mode, setMode] = useState<Mode>("family");
  const [plan, setPlan] = useState<string[] | null>(null);

  const generate = () => {
    const options = meals[mode];
    setPlan(options[Math.floor(Math.random() * options.length)]);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <UtensilsCrossed size={26} className="text-orange-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">মিল প্ল্যানার</h1>
          <p className="text-sm text-muted-foreground font-bangla">আপনার জন্য খাবারের পরিকল্পনা</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">মোড নির্বাচন করুন</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(modeLabels) as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${
                    mode === m ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {modeLabels[m]}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={generate} variant="hero" className="w-full" size="lg">
            <RefreshCw size={16} />
            মিল জেনারেট করুন
          </Button>
        </div>

        {plan && (
          <div className="mt-6 glass-card rounded-2xl p-6 space-y-3 animate-fade-in">
            <h3 className="font-heading font-semibold text-foreground">আজকের মিল প্ল্যান</h3>
            {["সকাল", "দুপুর", "রাত"].map((time, i) => (
              <div key={time} className="bg-muted rounded-xl p-4">
                <p className="text-xs text-accent font-heading font-medium mb-1">{time}</p>
                <p className="text-sm text-foreground font-bangla">{plan[i]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
