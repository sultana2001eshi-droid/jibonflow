import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PenTool, Copy, Check } from "lucide-react";

type Tone = "emotional" | "business" | "funny";
const toneLabels: Record<Tone, string> = { emotional: "ইমোশনাল", business: "বিজনেস", funny: "মজার" };

const captions: Record<Tone, string[]> = {
  emotional: [
    "কিছু মানুষ জীবনে আসে ঠিক যখন দরকার হয়, আবার চলেও যায় — কিন্তু স্মৃতি রেখে যায় চিরকালের জন্য। 💫",
    "যত কঠিনই হোক, থেমো না — কারণ তোমার গল্পটা এখনো শেষ হয়নি। 🌊",
    "হৃদয় যখন ভারী হয়, আকাশের দিকে তাকাও — ওখানেও কেউ তোমার জন্য ভাবছে। 🌙",
    "প্রতিটি সূর্যাস্তের পরে একটি নতুন সকাল আসে — ধৈর্য ধরো। ☀️",
  ],
  business: [
    "সফলতা একদিনে আসে না, কিন্তু একটি সিদ্ধান্তে শুরু হয়। 🚀",
    "তোমার ব্র্যান্ড = তোমার গল্প। প্রতিদিন একটু একটু করে গড়ে তোলো। 📈",
    "ছোট শুরু, বড় স্বপ্ন — এটাই এন্ট্রিপ্রেনিউরশিপ। 💼",
    "কাস্টমারের বিশ্বাস অর্জন করো — বাকিটা সময়ই করে দেবে। 🤝",
  ],
  funny: [
    "জীবনটা একটা চা-এর কাপ — মাঝে মাঝে ঠান্ডা হয়ে যায়, আবার গরম করতে হয়! ☕😂",
    "পরীক্ষায় ফেল করলে মনে রেখো — আইনস্টাইনও করেছিল (সত্যি কিনা জানি না, কিন্তু শান্তি পাও!) 😅",
    "সকালে উঠতে পারি না — এটা আমার দোষ না, এটা বিছানার ষড়যন্ত্র! 🛏️😤",
  ],
};

const bios = [
  "✨ স্বপ্ন দেখি, তৈরি করি 💡 | Creator | 🇧🇩",
  "🌟 জীবন সুন্দর, আরো সুন্দর করার চেষ্টায় | Dreamer & Doer",
  "📚 ছাত্র | 💻 টেক লাভার | ☕ চা-আসক্ত",
  "🎯 ফোকাসড | 🚀 আজকের কাজ আজই | Hustle Mode ON",
];

const CaptionGenerator = () => {
  const [tone, setTone] = useState<Tone>("emotional");
  const [caption, setCaption] = useState("");
  const [bio, setBio] = useState("");
  const [copied, setCopied] = useState("");

  const genCaption = () => {
    const opts = captions[tone];
    setCaption(opts[Math.floor(Math.random() * opts.length)]);
  };

  const genBio = () => setBio(bios[Math.floor(Math.random() * bios.length)]);

  const copy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-500/10 flex items-center justify-center">
            <PenTool size={26} className="text-pink-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">ক্যাপশন ও বায়ো</h1>
        </div>

        {/* Caption */}
        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-heading font-semibold text-foreground text-sm">ক্যাপশন জেনারেটর</h3>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(toneLabels) as Tone[]).map((t) => (
              <button key={t} onClick={() => setTone(t)}
                className={`py-2 rounded-xl text-xs font-bangla font-medium transition-all ${tone === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {toneLabels[t]}
              </button>
            ))}
          </div>
          <Button onClick={genCaption} variant="hero" className="w-full" size="lg">ক্যাপশন তৈরি করুন</Button>

          {caption && (
            <div className="bg-muted rounded-xl p-4 relative">
              <p className="text-sm font-bangla text-foreground leading-relaxed pr-8">{caption}</p>
              <button onClick={() => copy(caption, "caption")} className="absolute top-3 right-3 text-muted-foreground hover:text-accent transition-colors">
                {copied === "caption" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="glass-card rounded-2xl p-6 space-y-4 mt-5 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-heading font-semibold text-foreground text-sm">বায়ো জেনারেটর</h3>
          <Button onClick={genBio} variant="hero" className="w-full" size="lg">বায়ো তৈরি করুন</Button>

          {bio && (
            <div className="bg-muted rounded-xl p-4 relative">
              <p className="text-sm font-bangla text-foreground pr-8">{bio}</p>
              <button onClick={() => copy(bio, "bio")} className="absolute top-3 right-3 text-muted-foreground hover:text-accent transition-colors">
                {copied === "bio" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptionGenerator;
