import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Copy, Check, ArrowLeft, Sparkles } from "lucide-react";
import PageTransition from "@/components/PageTransition";

type Tone = "emotional" | "professional" | "funny";
type Audience = "male" | "female" | "general";

const toneLabels: Record<Tone, string> = { emotional: "ইমোশনাল", professional: "প্রফেশনাল", funny: "মজার" };
const audienceLabels: Record<Audience, string> = { male: "পুরুষ", female: "নারী", general: "সবার জন্য" };

const captionTemplates: Record<Tone, ((product: string, audience: Audience, hasOffer: boolean) => string)[]> = {
  emotional: [
    (p, _a, o) => `${p} — শুধু একটি পণ্য নয়, এটি আপনার গল্পের অংশ। ❤️${o ? "\n🔥 এখনই অফার চলছে — মিস করবেন না!" : ""}`,
    (p, a, o) => `প্রতিটি ${p} এর পেছনে আছে একটি স্বপ্ন, একটি ভালোবাসা। ${a === "female" ? "নিজেকে ভালোবাসুন 💫" : a === "male" ? "নিজের যত্ন নিন 💪" : "জীবনকে উপভোগ করুন ✨"}${o ? "\n🎁 স্পেশাল ডিসকাউন্ট চলছে!" : ""}`,
    (p, _a, o) => `${p} ব্যবহার করুন — কারণ আপনি সেরাটা পাওয়ার যোগ্য। 🌟${o ? "\n⚡ সীমিত সময়ের অফার!" : ""}`,
    (p, a, o) => `জীবন ছোট, ${a === "female" ? "সুন্দর থাকুন" : "স্মার্ট থাকুন"} — ${p} আপনার পাশে আছে সবসময়। 💕${o ? "\n🛍️ এখনই অর্ডার করুন, সেরা দামে!" : ""}`,
    (p, _a, o) => `${p} মানেই বিশ্বাস, মানেই ভরসা। আপনার প্রিয়জনের জন্য বেছে নিন। 🤲${o ? "\n🔥 ফ্ল্যাশ সেল চলছে!" : ""}`,
  ],
  professional: [
    (p, _a, o) => `✅ ${p} — প্রফেশনাল চয়েস, স্মার্ট ডিসিশন।\n📦 অর্ডার করুন আজই।${o ? "\n💰 বিশেষ ব্যবসায়িক ছাড় চলছে!" : ""}`,
    (p, a, o) => `${p} দিয়ে ${a === "female" ? "আপনার ব্র্যান্ড" : a === "male" ? "আপনার ব্যবসা" : "আপনার কাজ"} নিয়ে যান পরবর্তী লেভেলে। 🚀${o ? "\n📊 লিমিটেড টাইম অফার!" : ""}`,
    (p, _a, o) => `কোয়ালিটি + ভ্যালু = ${p}\n🎯 সেরা মানের পণ্য, সেরা দামে।${o ? "\n🔖 আজকের স্পেশাল প্রাইস দেখুন!" : ""}`,
    (p, _a, o) => `${p} — যারা মান বোঝেন, তারাই বেছে নেন।\n⭐ ট্রাস্টেড ব্র্যান্ড।${o ? "\n💥 এক্সক্লুসিভ অফার চলছে!" : ""}`,
  ],
  funny: [
    (p, _a, o) => `${p} নাই? জীবনে কী আছে তাহলে! 😂🤷\nএখনই নিয়ে নিন, পরে আফসোস করবেন!${o ? "\n😱 অফার শেষ হলে কান্না পাবে!" : ""}`,
    (p, a, o) => `${a === "female" ? "বান্ধবীকে" : a === "male" ? "বন্ধুকে" : "সবাইকে"} জিজ্ঞেস করুন — ${p} ব্যবহার করেন কিনা। না করলে ফ্রেন্ডশিপ রিভিউ করুন! 😤😂${o ? "\n🎉 অফার আছে, ফ্রেন্ড নাই — সমস্যা!" : ""}`,
    (p, _a, o) => `ডাক্তার বলছে ${p} ব্যবহার না করলে নাকি হতাশা বাড়ে! 😅💊\n(সোর্স: আমার মন)${o ? "\n💸 অফার দামেই সুখ কিনুন!" : ""}`,
    (p, _a, o) => `${p} — এটা ছাড়া চলে না, ঠিক যেমন বিরিয়ানি ছাড়া জুমাবার চলে না! 🍗😋${o ? "\n🔥 অফার আছে, মিস করলে পস্তাবেন!" : ""}`,
  ],
};

const bios = [
  (name: string) => `✨ ${name} | Creator & Dreamer | 🇧🇩\n💡 স্বপ্ন দেখি, তৈরি করি`,
  (name: string) => `🌟 ${name}\n📚 Learner | 💻 Builder | ☕ চা-প্রেমী`,
  (name: string) => `🎯 ${name} — Hustle Mode ON 🚀\nফোকাসড | ক্রিয়েটিভ | আনস্টপেবল`,
  (name: string) => `💼 ${name}\n🔥 ছোট স্বপ্ন নেই, বড় স্বপ্ন দেখি | Entrepreneur`,
  (name: string) => `🌙 ${name}\n✍️ লেখালেখি | 📷 ফটোগ্রাফি | 🎵 গানপাগল`,
];

const CaptionGenerator = () => {
  const [product, setProduct] = useState("");
  const [tone, setTone] = useState<Tone>("emotional");
  const [audience, setAudience] = useState<Audience>("general");
  const [hasOffer, setHasOffer] = useState(false);
  const [captions, setCaptions] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  const [bioName, setBioName] = useState("");
  const [bio, setBio] = useState("");

  const genCaptions = () => {
    const p = product.trim() || "আমাদের পণ্য";
    const templates = captionTemplates[tone];
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    setCaptions(shuffled.slice(0, 3).map((fn) => fn(p, audience, hasOffer)));
  };

  const genBio = () => {
    const name = bioName.trim() || "Your Name";
    setBio(bios[Math.floor(Math.random() * bios.length)](name));
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <PenTool size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">ক্যাপশন ও বায়ো ল্যাব</h1>
                <p className="text-xs text-muted-foreground font-bangla">স্মার্ট ক্যাপশন ও বায়ো তৈরি করুন</p>
              </div>
            </div>
          </div>

          {/* Caption Generator */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-5">
            <h3 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
              <Sparkles size={14} className="text-accent" /> ক্যাপশন জেনারেটর
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">পণ্য / বিষয়</label>
              <Input placeholder="যেমন: হ্যান্ডমেড জুয়েলারি" value={product} onChange={(e) => setProduct(e.target.value)} className="font-bangla" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">টোন</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(toneLabels) as Tone[]).map((t) => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`py-2 rounded-xl text-xs font-bangla font-medium transition-all ${tone === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {toneLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">টার্গেট অডিয়েন্স</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(audienceLabels) as Audience[]).map((a) => (
                  <button key={a} onClick={() => setAudience(a)}
                    className={`py-2 rounded-xl text-xs font-bangla font-medium transition-all ${audience === a ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {audienceLabels[a]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setHasOffer(!hasOffer)}
                className={`px-4 py-2 rounded-xl text-xs font-bangla font-medium transition-all ${hasOffer ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {hasOffer ? "🎁 অফার আছে" : "অফার নেই"}
              </button>
            </div>

            <Button onClick={genCaptions} variant="hero" className="w-full" size="lg">ক্যাপশন তৈরি করুন</Button>

            {captions.length > 0 && (
              <div className="space-y-3">
                {captions.map((cap, i) => (
                  <div key={i} className="bg-muted rounded-xl p-4 relative">
                    <p className="text-sm font-bangla text-foreground leading-relaxed pr-8 whitespace-pre-line">{cap}</p>
                    <button onClick={() => copy(cap, `cap-${i}`)} className="absolute top-3 right-3 text-muted-foreground hover:text-accent transition-colors">
                      {copied === `cap-${i}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bio Generator */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4 mt-5">
            <h3 className="font-heading font-semibold text-foreground text-sm">বায়ো জেনারেটর</h3>
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">আপনার নাম</label>
              <Input placeholder="যেমন: নাসরুল্লাহ" value={bioName} onChange={(e) => setBioName(e.target.value)} className="font-bangla" />
            </div>
            <Button onClick={genBio} variant="hero" className="w-full" size="lg">বায়ো তৈরি করুন</Button>

            {bio && (
              <div className="bg-muted rounded-xl p-4 relative">
                <p className="text-sm font-bangla text-foreground pr-8 whitespace-pre-line">{bio}</p>
                <button onClick={() => copy(bio, "bio")} className="absolute top-3 right-3 text-muted-foreground hover:text-accent transition-colors">
                  {copied === "bio" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CaptionGenerator;
