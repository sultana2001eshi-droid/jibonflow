import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Copy, Check } from "lucide-react";

const routines = [
  { time: "৫:৩০", task: "ফজরের নামাজ ও কুরআন তিলাওয়াত" },
  { time: "৬:০০", task: "হালকা ব্যায়াম বা হাঁটা" },
  { time: "৬:৩০", task: "সকালের নাস্তা" },
  { time: "৭:০০", task: "পড়াশোনা / গুরুত্বপূর্ণ কাজ" },
  { time: "১০:০০", task: "হালকা বিরতি ও চা" },
  { time: "১০:৩০", task: "সৃজনশীল কাজ / প্রজেক্ট" },
  { time: "১:০০", task: "দুপুরের খাবার ও বিশ্রাম" },
  { time: "৩:০০", task: "হালকা পড়া / স্কিল ডেভেলপমেন্ট" },
  { time: "৫:০০", task: "বিকেলের হাঁটা / ব্যায়াম" },
  { time: "৭:০০", task: "রাতের খাবার" },
  { time: "৮:০০", task: "পরিবারের সাথে সময় / বই পড়া" },
  { time: "১০:০০", task: "ঘুমের প্রস্তুতি" },
];

const habits = [
  "প্রতিদিন অন্তত ১০ পৃষ্ঠা বই পড়ুন 📚",
  "সকালে ১ গ্লাস পানি পান করুন 💧",
  "দিনে ৩০ মিনিট হাঁটুন 🚶",
  "রাতে মোবাইল আগে রাখুন, আগে ঘুমান 😴",
  "প্রতিদিন একটি নতুন শব্দ শিখুন 🧠",
  "কৃতজ্ঞতার ৩টি বিষয় লিখুন ✍️",
  "স্ক্রিন টাইম কমান, সত্যিকার সম্পর্কে সময় দিন 💝",
];

const LifeOrganizer = () => {
  const [habit, setHabit] = useState("");
  const [copied, setCopied] = useState(false);

  const routineText = routines.map((r) => `${r.time} — ${r.task}`).join("\n");

  const genHabit = () => setHabit(habits[Math.floor(Math.random() * habits.length)]);

  const copy = () => {
    navigator.clipboard.writeText(routineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 flex items-center justify-center">
            <Brain size={26} className="text-cyan-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">লাইফ অর্গানাইজার</h1>
        </div>

        {/* Routine */}
        <div className="glass-card rounded-2xl p-6 space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-foreground text-sm">আদর্শ দৈনিক রুটিন</h3>
            <Button variant="ghost" size="sm" onClick={copy}>
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </Button>
          </div>
          <div className="space-y-2">
            {routines.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                <span className="text-xs font-heading font-semibold text-accent w-12 shrink-0">{r.time}</span>
                <span className="text-sm font-bangla text-foreground">{r.task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit */}
        <div className="glass-card rounded-2xl p-6 space-y-4 mt-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-heading font-semibold text-foreground text-sm">হ্যাবিট সাজেশন</h3>
          <Button onClick={genHabit} variant="hero" className="w-full" size="lg">
            <RefreshCw size={16} />
            একটি হ্যাবিট দেখুন
          </Button>
          {habit && (
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm font-bangla text-foreground">{habit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifeOrganizer;
