import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, RefreshCw, Copy, Check, ArrowLeft, Clock, Zap } from "lucide-react";
import PageTransition from "@/components/PageTransition";

type LifeMode = "student" | "worker" | "freelancer";
const modeLabels: Record<LifeMode, string> = { student: "🎓 ছাত্র", worker: "💼 চাকরিজীবী", freelancer: "💻 ফ্রিল্যান্সার" };

type FocusLevel = "low" | "medium" | "high";
const focusLabels: Record<FocusLevel, string> = { low: "😴 কম", medium: "⚡ মাঝারি", high: "🔥 উচ্চ" };

const routineData: Record<LifeMode, Record<FocusLevel, { time: string; task: string }[]>> = {
  student: {
    low: [
      { time: "৭:০০", task: "ঘুম থেকে ওঠা ও নাস্তা" },
      { time: "৮:০০", task: "হালকা পড়াশোনা (১ ঘণ্টা)" },
      { time: "১০:০০", task: "ক্লাস / কলেজ" },
      { time: "১:০০", task: "দুপুরের খাবার ও বিশ্রাম" },
      { time: "৪:০০", task: "হালকা রিভিশন" },
      { time: "৬:০০", task: "খেলাধুলা / বন্ধুদের সাথে সময়" },
      { time: "৮:০০", task: "রাতের খাবার" },
      { time: "১০:০০", task: "ঘুম" },
    ],
    medium: [
      { time: "৬:০০", task: "ঘুম থেকে ওঠা ও ব্যায়াম" },
      { time: "৬:৩০", task: "নাস্তা" },
      { time: "৭:০০", task: "গুরুত্বপূর্ণ বিষয় পড়া (২ ঘণ্টা)" },
      { time: "৯:৩০", task: "ক্লাস / কলেজ" },
      { time: "১:০০", task: "দুপুরের খাবার" },
      { time: "২:৩০", task: "নোট তৈরি / অ্যাসাইনমেন্ট" },
      { time: "৫:০০", task: "স্কিল ডেভেলপমেন্ট" },
      { time: "৭:০০", task: "রাতের খাবার ও বিশ্রাম" },
      { time: "৯:০০", task: "রিভিশন (১ ঘণ্টা)" },
      { time: "১০:৩০", task: "ঘুম" },
    ],
    high: [
      { time: "৫:০০", task: "ফজর ও কুরআন তিলাওয়াত" },
      { time: "৫:৩০", task: "ব্যায়াম ও ফ্রেশ আপ" },
      { time: "৬:০০", task: "কঠিন বিষয় পড়া (২.৫ ঘণ্টা)" },
      { time: "৮:৩০", task: "নাস্তা" },
      { time: "৯:০০", task: "ক্লাস / কলেজ" },
      { time: "১:০০", task: "দুপুরের খাবার" },
      { time: "২:০০", task: "প্র্যাকটিস / প্রশ্ন সমাধান (২ ঘণ্টা)" },
      { time: "৪:৩০", task: "স্কিল ডেভেলপমেন্ট / প্রজেক্ট" },
      { time: "৬:৩০", task: "হালকা হাঁটা" },
      { time: "৭:৩০", task: "রাতের খাবার" },
      { time: "৮:৩০", task: "রিভিশন ও নোট (১.৫ ঘণ্টা)" },
      { time: "১০:০০", task: "ঘুম" },
    ],
  },
  worker: {
    low: [
      { time: "৭:০০", task: "ঘুম থেকে ওঠা ও নাস্তা" },
      { time: "৮:৩০", task: "অফিসে যাওয়া" },
      { time: "৯:০০", task: "অফিসের কাজ" },
      { time: "১:০০", task: "লাঞ্চ ব্রেক" },
      { time: "৫:০০", task: "অফিস থেকে ফেরা" },
      { time: "৬:৩০", task: "পরিবারের সাথে সময়" },
      { time: "৮:০০", task: "রাতের খাবার ও বিশ্রাম" },
      { time: "১০:৩০", task: "ঘুম" },
    ],
    medium: [
      { time: "৬:০০", task: "ব্যায়াম ও ফ্রেশ আপ" },
      { time: "৭:০০", task: "নাস্তা ও পেপার পড়া" },
      { time: "৮:৩০", task: "অফিস" },
      { time: "১:০০", task: "লাঞ্চ" },
      { time: "৫:০০", task: "অফিস থেকে ফেরা" },
      { time: "৫:৩০", task: "ব্যক্তিগত প্রজেক্ট / সাইড হাসল" },
      { time: "৭:০০", task: "পরিবার ও রাতের খাবার" },
      { time: "৯:০০", task: "বই পড়া / স্কিল আপ" },
      { time: "১০:৩০", task: "ঘুম" },
    ],
    high: [
      { time: "৫:০০", task: "ফজর ও মেডিটেশন" },
      { time: "৫:৩০", task: "ব্যায়াম (৪৫ মিনিট)" },
      { time: "৬:৩০", task: "সাইড প্রজেক্ট (১.৫ ঘণ্টা)" },
      { time: "৮:০০", task: "নাস্তা ও অফিসে যাওয়া" },
      { time: "৯:০০", task: "ফোকাসড অফিস ওয়ার্ক" },
      { time: "১:০০", task: "লাঞ্চ ও পাওয়ার ন্যাপ" },
      { time: "৫:০০", task: "অফিস থেকে ফেরা" },
      { time: "৫:৩০", task: "নেটওয়ার্কিং / লার্নিং" },
      { time: "৭:০০", task: "পরিবার ও খাবার" },
      { time: "৯:০০", task: "প্ল্যানিং ও জার্নালিং" },
      { time: "১০:০০", task: "ঘুম" },
    ],
  },
  freelancer: {
    low: [
      { time: "৮:০০", task: "ঘুম থেকে ওঠা ও নাস্তা" },
      { time: "৯:৩০", task: "ইমেইল ও ক্লায়েন্ট চেক" },
      { time: "১০:০০", task: "কাজ (৩ ঘণ্টা)" },
      { time: "১:০০", task: "দুপুরের খাবার ও বিশ্রাম" },
      { time: "৩:০০", task: "কাজ (২ ঘণ্টা)" },
      { time: "৫:০০", task: "ফ্রি টাইম" },
      { time: "৮:০০", task: "রাতের খাবার" },
      { time: "১১:০০", task: "ঘুম" },
    ],
    medium: [
      { time: "৭:০০", task: "ব্যায়াম ও নাস্তা" },
      { time: "৮:৩০", task: "ডিপ ওয়ার্ক সেশন ১ (৩ ঘণ্টা)" },
      { time: "১১:৩০", task: "ব্রেক ও স্ন্যাকস" },
      { time: "১২:০০", task: "ক্লায়েন্ট কমিউনিকেশন" },
      { time: "১:০০", task: "দুপুরের খাবার" },
      { time: "২:৩০", task: "ডিপ ওয়ার্ক সেশন ২ (২.৫ ঘণ্টা)" },
      { time: "৫:০০", task: "স্কিল ডেভেলপমেন্ট" },
      { time: "৭:০০", task: "রাতের খাবার ও রিল্যাক্স" },
      { time: "১০:৩০", task: "ঘুম" },
    ],
    high: [
      { time: "৫:৩০", task: "ফজর ও মর্নিং রুটিন" },
      { time: "৬:৩০", task: "ব্যায়াম ও ঠান্ডা শাওয়ার" },
      { time: "৭:৩০", task: "নাস্তা ও প্ল্যানিং" },
      { time: "৮:০০", task: "ডিপ ওয়ার্ক সেশন ১ (৩.৫ ঘণ্টা)" },
      { time: "১১:৩০", task: "ব্রেক ও মুভমেন্ট" },
      { time: "১২:০০", task: "ক্লায়েন্ট কল ও ইমেইল" },
      { time: "১:০০", task: "লাঞ্চ" },
      { time: "২:০০", task: "ডিপ ওয়ার্ক সেশন ২ (৩ ঘণ্টা)" },
      { time: "৫:০০", task: "লার্নিং / সাইড প্রজেক্ট" },
      { time: "৭:০০", task: "পরিবার ও খাবার" },
      { time: "৯:০০", task: "জার্নালিং ও পরের দিনের প্ল্যান" },
      { time: "১০:০০", task: "ঘুম" },
    ],
  },
};

const habitsByMode: Record<LifeMode, string[]> = {
  student: [
    "প্রতিদিন অন্তত ২ ঘণ্টা মোবাইল-ফ্রি পড়াশোনা করুন 📚",
    "প্রতি সপ্তাহে একটি নতুন টপিক শিখুন 🧠",
    "ক্লাসের পর ১৫ মিনিটে নোট রিভিউ করুন ✍️",
    "প্রতিদিন ৮ গ্লাস পানি পান করুন 💧",
    "সোশ্যাল মিডিয়ায় দিনে ৩০ মিনিটের বেশি না 📱",
    "রাত ১১টার মধ্যে ঘুমানোর অভ্যাস করুন 😴",
  ],
  worker: [
    "সকালে ১০ মিনিট মেডিটেশন করুন 🧘",
    "অফিসে প্রতি ১ ঘণ্টায় ৫ মিনিট দাঁড়ান 🧍",
    "সপ্তাহে অন্তত ৩ দিন ব্যায়াম করুন 💪",
    "একটি সাইড ইনকাম সোর্স তৈরি করুন 💰",
    "প্রতি মাসে একটি বই পড়ুন 📖",
    "পরিবারের সাথে কোয়ালিটি টাইম কাটান ❤️",
  ],
  freelancer: [
    "ডিপ ওয়ার্ক সেশনে নোটিফিকেশন বন্ধ রাখুন 🔕",
    "প্রতিদিন ৩টি প্রধান কাজ ঠিক করুন 🎯",
    "সপ্তাহে ১ দিন পুরো ছুটি নিন 🏖️",
    "ক্লায়েন্ট রিলেশন নিয়মিত মেইনটেইন করুন 🤝",
    "পোর্টফোলিও প্রতি মাসে আপডেট করুন 🖥️",
    "ইনভয়েস ও ফাইন্যান্স ট্র্যাক করুন 📊",
  ],
};

const LifeOrganizer = () => {
  const [mode, setMode] = useState<LifeMode>("student");
  const [focus, setFocus] = useState<FocusLevel>("medium");
  const [routine, setRoutine] = useState<{ time: string; task: string }[] | null>(null);
  const [habit, setHabit] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setRoutine(routineData[mode][focus]);
  };

  const genHabit = () => {
    const list = habitsByMode[mode];
    setHabit(list[Math.floor(Math.random() * list.length)]);
  };

  const copyRoutine = () => {
    if (!routine) return;
    const text = routine.map((r) => `${r.time} — ${r.task}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          {/* Header */}
          <div className="mb-6">
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors font-heading mb-4">
              <ArrowLeft size={16} /> টুলস
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Brain size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">লাইফ অর্গানাইজার PRO</h1>
                <p className="text-xs text-muted-foreground font-bangla">আপনার জীবনধারা অনুযায়ী রুটিন তৈরি</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">আপনি কে?</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(modeLabels) as LifeMode[]).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`py-2.5 rounded-xl text-xs font-bangla font-medium transition-all ${mode === m ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {modeLabels[m]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">ফোকাস লেভেল</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(focusLabels) as FocusLevel[]).map((f) => (
                  <button key={f} onClick={() => setFocus(f)}
                    className={`py-2.5 rounded-xl text-xs font-bangla font-medium transition-all ${focus === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {focusLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={generate} variant="hero" className="w-full" size="lg">
              <Clock size={16} /> রুটিন তৈরি করুন
            </Button>
          </div>

          {/* Routine Result */}
          {routine && (
            <div className="glass-card gradient-border rounded-2xl p-6 space-y-3 mt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground text-sm">আপনার দৈনিক রুটিন</h3>
                <Button variant="ghost" size="sm" onClick={copyRoutine}>
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span className="text-xs ml-1">{copied ? "কপি হয়েছে" : "কপি"}</span>
                </Button>
              </div>
              <div className="space-y-2">
                {routine.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                    <span className="text-xs font-heading font-semibold text-accent w-12 shrink-0">{r.time}</span>
                    <span className="text-sm font-bangla text-foreground">{r.task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Habit */}
          <div className="glass-card rounded-2xl p-6 space-y-4 mt-5">
            <h3 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
              <Zap size={14} className="text-accent" /> হ্যাবিট সাজেশন
            </h3>
            <Button onClick={genHabit} variant="hero" className="w-full" size="lg">
              <RefreshCw size={16} /> একটি হ্যাবিট দেখুন
            </Button>
            {habit && (
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-sm font-bangla text-foreground">{habit}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LifeOrganizer;
