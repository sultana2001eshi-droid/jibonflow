import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Copy, Check, ArrowLeft, Sparkles, Hash, RefreshCw } from "lucide-react";
import PageTransition from "@/components/PageTransition";

type Niche = "food" | "fashion" | "gadget" | "service";
type Tone = "emotional" | "professional" | "funny" | "urgent";
type Audience = "male" | "female" | "general";
type Platform = "fb" | "insta" | "whatsapp";

const nicheLabels: Record<Niche, string> = { food: "🍔 খাবার", fashion: "👗 ফ্যাশন", gadget: "📱 গ্যাজেট", service: "🛠️ সার্ভিস" };
const toneLabels: Record<Tone, string> = { emotional: "💕 ইমোশনাল", professional: "💼 প্রফেশনাল", funny: "😂 মজার", urgent: "🔥 আর্জেন্ট" };
const audienceLabels: Record<Audience, string> = { male: "পুরুষ", female: "নারী", general: "সবাই" };
const platformLabels: Record<Platform, string> = { fb: "Facebook", insta: "Instagram", whatsapp: "WhatsApp" };

// Template pools - large enough for non-repetitive generation
const openings: Record<Tone, string[]> = {
  emotional: [
    "আপনি কি জানেন, ", "ভাবুন তো একবার — ", "জীবনে এমন কিছু আছে যা — ",
    "হৃদয় দিয়ে অনুভব করুন — ", "প্রতিটি মুহূর্ত বিশেষ — ", "ভালোবাসা মানেই — ",
  ],
  professional: [
    "আপনার জন্য — ", "স্মার্ট চয়েস: ", "প্রফেশনাল সমাধান — ",
    "বিশ্বাসযোগ্য মান: ", "এক্সপার্ট পছন্দ — ", "কোয়ালিটি গ্যারান্টি — ",
  ],
  funny: [
    "শুনুন শুনুন! ", "ব্রেকিং নিউজ: ", "ডাক্তার বলছে — ",
    "জানেন তো — ", "বন্ধু বলেছে — ", "কান পেতে রই — ",
  ],
  urgent: [
    "⚡ শেষ সুযোগ! ", "🔥 এখনই নিন! ", "⏰ সময় শেষ হচ্ছে! ",
    "🚨 মিস করবেন না! ", "💥 ফ্ল্যাশ অফার! ", "⚠️ লিমিটেড স্টক! ",
  ],
};

const bodies: Record<Niche, string[]> = {
  food: [
    "{p} — স্বাদে অতুলনীয়, মানে অসাধারণ।", "{p} খেয়ে দেখুন, স্বাদ জিহ্বায় থেকে যাবে!",
    "{p} — প্রতিটি কামড়ে ভালোবাসা।", "আসল স্বাদের সন্ধানে? {p} ট্রাই করুন!",
    "{p} — ফ্রেশ, হেলদি, অসম্ভব মজাদার।", "মুখে দিলেই বুঝবেন — {p} আলাদা!",
  ],
  fashion: [
    "{p} — স্টাইল যখন লাইফস্টাইল।", "{p} পরে বের হলে সবার নজর আপনার দিকে!",
    "ফ্যাশন মানেই {p}। ট্রেন্ড সেট করুন।", "{p} — কমফোর্ট মিটস এলিগেন্স।",
    "আপনার লুক আপগ্রেড করুন {p} দিয়ে।", "{p} — প্রতিটি ওকেশনের পারফেক্ট চয়েস।",
  ],
  gadget: [
    "{p} — টেকনোলজি এখন হাতের মুঠোয়।", "{p} দিয়ে লাইফ হবে আরো স্মার্ট!",
    "পারফরম্যান্স কিং: {p}।", "{p} — ফিচার্স যা আপনাকে চমকে দেবে।",
    "আপগ্রেড করুন {p} দিয়ে।", "{p} — বেস্ট ভ্যালু ফর মানি।",
  ],
  service: [
    "{p} — আপনার সমস্যার পারফেক্ট সমাধান।", "বিশ্বস্ত সেবা: {p}।",
    "{p} — প্রফেশনাল, দ্রুত, নির্ভরযোগ্য।", "আপনার কাজ সহজ করে {p}।",
    "{p} — কাস্টমার স্যাটিসফ্যাকশন ১০০%।", "এক ফোনেই সমাধান — {p}।",
  ],
};

const ctaStyles: Record<Tone, string[]> = {
  emotional: ["💫 এখনই অর্ডার করুন", "❤️ নিজেকে ভালোবাসুন", "✨ আজই শুরু করুন", "🌟 অনুভব করুন পার্থক্য"],
  professional: ["📞 যোগাযোগ করুন আজই", "📦 অর্ডার করুন", "🎯 এখনই নিন", "✅ ফ্রি ট্রায়াল নিন"],
  funny: ["😎 নিয়ে নিন, পরে আফসোস কেন!", "🤑 পকেট খালি হওয়ার আগে!", "🏃 দৌড়ে আসুন!", "😜 কিনুন, নাহলে বন্ধু কিনবে!"],
  urgent: ["⚡ এখনই অর্ডার করুন!", "🔥 অফার শেষ হওয়ার আগে নিন!", "⏰ আর দেরি নয়!", "💥 লাস্ট চান্স!"],
};

const audienceHooks: Record<Audience, string[]> = {
  male: ["ভাই, ", "বস, ", "স্মার্ট পুরুষদের জন্য — "],
  female: ["আপা, ", "সুন্দরী, ", "স্টাইলিশ নারীদের জন্য — "],
  general: ["সবার জন্য — ", "আপনার জন্য — ", ""],
};

const platformSuffix: Record<Platform, string> = {
  fb: "\n\n👉 আমাদের পেজে লাইক দিন ও শেয়ার করুন!",
  insta: "\n\n📸 ফলো করুন আরো আপডেটের জন্য!",
  whatsapp: "\n\n📲 সরাসরি মেসেজ করুন অর্ডার করতে!",
};

const hashtagsByNiche: Record<Niche, string[]> = {
  food: ["#বাংলাদেশিখাবার", "#ফুডলাভার", "#ঘরেরখাবার", "#স্বাদেঅতুলনীয়", "#ফুডিজ", "#রেসিপি", "#হালালফুড"],
  fashion: ["#ফ্যাশন", "#স্টাইল", "#ট্রেন্ডিং", "#ওয়্যারেবল", "#বাংলাদেশিফ্যাশন", "#লুক", "#আউটফিট"],
  gadget: ["#টেক", "#গ্যাজেট", "#স্মার্টডিভাইস", "#টেকনোলজি", "#আনবক্সিং", "#রিভিউ", "#বেস্টবাই"],
  service: ["#সেবা", "#সার্ভিস", "#বিশ্বস্ত", "#কাস্টমারকেয়ার", "#সমাধান", "#প্রফেশনাল", "#বাংলাদেশ"],
};

function generateCaptions(
  product: string, niche: Niche, tone: Tone,
  audience: Audience, hasOffer: boolean, platform: Platform
): { captions: string[]; shortCTA: string; emojiHeavy: string; hashtags: string[] } {
  const p = product || "আমাদের পণ্য";
  const now = Date.now();

  // Shuffle helper using timestamp for variety
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = ((now + i * 7) % (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const shuffledOpenings = shuffle(openings[tone]);
  const shuffledBodies = shuffle(bodies[niche]);
  const shuffledCTAs = shuffle(ctaStyles[tone]);
  const shuffledHooks = shuffle(audienceHooks[audience]);

  const offerLine = hasOffer ? "\n🎁 বিশেষ অফার চলছে — সীমিত সময়!" : "";

  // Generate 3 unique captions with different structures
  const captions: string[] = [];

  // Caption 1: Opening + Body + CTA
  captions.push(
    `${shuffledOpenings[0]}${shuffledBodies[0].replace("{p}", p)}${offerLine}\n\n${shuffledCTAs[0]}${platformSuffix[platform]}`
  );

  // Caption 2: Audience hook + Body + different CTA
  captions.push(
    `${shuffledHooks[0]}${shuffledBodies[1].replace("{p}", p)}\n\n${shuffledBodies[2].replace("{p}", p)}${offerLine}\n\n${shuffledCTAs[1]}${platformSuffix[platform]}`
  );

  // Caption 3: Different opening + body + audience touch
  captions.push(
    `${shuffledOpenings[1]}${shuffledBodies[3].replace("{p}", p)}\n\n${shuffledHooks[1] || ""}${shuffledBodies[4].replace("{p}", p)}${offerLine}\n\n${shuffledCTAs[2]}${platformSuffix[platform]}`
  );

  // Short CTA version
  const shortCTA = `${shuffledBodies[5].replace("{p}", p)} ${shuffledCTAs[3]}`;

  // Emoji heavy version
  const emojiHeavy = `✨🔥💯 ${p} 💯🔥✨\n\n${shuffledBodies[0].replace("{p}", `🌟${p}🌟`)} 🎉🎊\n\n${hasOffer ? "🎁💰 অফার চলছে! 💰🎁\n" : ""}${shuffledCTAs[0]} 🛒💫🚀${platformSuffix[platform]}`;

  // Hashtags
  const tags = shuffle(hashtagsByNiche[niche]).slice(0, 5);

  return { captions, shortCTA, emojiHeavy, hashtags: tags };
}

const bios = [
  (name: string) => `✨ ${name} | Creator & Dreamer | 🇧🇩\n💡 স্বপ্ন দেখি, তৈরি করি\n📩 DM for collab`,
  (name: string) => `🌟 ${name}\n📚 Learner | 💻 Builder | ☕ চা-প্রেমী\n🔗 Link in bio`,
  (name: string) => `🎯 ${name} — Hustle Mode ON 🚀\nফোকাসড | ক্রিয়েটিভ | আনস্টপেবল\n💼 Open for work`,
  (name: string) => `💼 ${name}\n🔥 ছোট স্বপ্ন নেই, বড় স্বপ্ন দেখি\n🌍 Entrepreneur | 🇧🇩`,
  (name: string) => `🌙 ${name}\n✍️ লেখালেখি | 📷 ফটোগ্রাফি | 🎵 গানপাগল\n📍 বাংলাদেশ`,
  (name: string) => `⚡ ${name}\n🎨 ডিজাইনার | 💡 ইনোভেটর\n🏆 Making Bangladesh proud`,
];

const CaptionGenerator = () => {
  const [product, setProduct] = useState("");
  const [niche, setNiche] = useState<Niche>("food");
  const [tone, setTone] = useState<Tone>("emotional");
  const [audience, setAudience] = useState<Audience>("general");
  const [hasOffer, setHasOffer] = useState(false);
  const [platform, setPlatform] = useState<Platform>("fb");
  const [result, setResult] = useState<ReturnType<typeof generateCaptions> | null>(null);
  const [copied, setCopied] = useState("");

  const [bioName, setBioName] = useState("");
  const [bio, setBio] = useState("");

  const generate = () => {
    setResult(generateCaptions(product, niche, tone, audience, hasOffer, platform));
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

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => copy(text, id)} className="absolute top-3 right-3 text-muted-foreground hover:text-accent transition-colors">
      {copied === id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors font-heading mb-4">
              <ArrowLeft size={16} /> টুলস
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <PenTool size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">স্মার্ট ক্যাপশন AI</h1>
                <p className="text-xs text-muted-foreground font-bangla">প্ল্যাটফর্ম অনুযায়ী ইউনিক ক্যাপশন তৈরি</p>
              </div>
            </div>
          </div>

          {/* Caption Generator */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">পণ্য / বিষয়</label>
              <Input placeholder="যেমন: হ্যান্ডমেড জুয়েলারি" value={product} onChange={(e) => setProduct(e.target.value)} className="font-bangla" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">নিশ / ক্যাটাগরি</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(nicheLabels) as Niche[]).map((n) => (
                  <button key={n} onClick={() => setNiche(n)}
                    className={`py-2 rounded-xl text-xs font-bangla font-medium transition-all ${niche === n ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {nicheLabels[n]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">টোন</label>
              <div className="grid grid-cols-2 gap-2">
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

            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">প্ল্যাটফর্ম</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(platformLabels) as Platform[]).map((pl) => (
                  <button key={pl} onClick={() => setPlatform(pl)}
                    className={`py-2 rounded-xl text-xs font-heading font-medium transition-all ${platform === pl ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {platformLabels[pl]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setHasOffer(!hasOffer)}
                className={`px-4 py-2 rounded-xl text-xs font-bangla font-medium transition-all ${hasOffer ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {hasOffer ? "🎁 অফার আছে" : "অফার নেই"}
              </button>
            </div>

            <Button onClick={generate} variant="hero" className="w-full" size="lg">
              <Sparkles size={16} /> ক্যাপশন তৈরি করুন
            </Button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 space-y-4">
              {/* 3 Unique Captions */}
              {result.captions.map((cap, i) => (
                <div key={i} className={`glass-card rounded-2xl p-5 relative ${i === 0 ? "gradient-border" : ""}`}>
                  <span className="text-xs text-accent font-heading font-semibold mb-2 block">
                    {i === 0 ? "🏆 ক্যাপশন ১" : i === 1 ? "✨ ক্যাপশন ২" : "💡 ক্যাপশন ৩"}
                  </span>
                  <p className="text-sm font-bangla text-foreground leading-relaxed pr-8 whitespace-pre-line">{cap}</p>
                  <CopyBtn text={cap} id={`cap-${i}`} />
                </div>
              ))}

              {/* Short CTA */}
              <div className="glass-card rounded-2xl p-5 relative">
                <span className="text-xs text-accent font-heading font-semibold mb-2 block">⚡ শর্ট CTA ভার্সন</span>
                <p className="text-sm font-bangla text-foreground pr-8">{result.shortCTA}</p>
                <CopyBtn text={result.shortCTA} id="short" />
              </div>

              {/* Emoji Heavy */}
              <div className="glass-card rounded-2xl p-5 relative">
                <span className="text-xs text-accent font-heading font-semibold mb-2 block">🎉 ইমোজি হেভি ভার্সন</span>
                <p className="text-sm font-bangla text-foreground pr-8 whitespace-pre-line">{result.emojiHeavy}</p>
                <CopyBtn text={result.emojiHeavy} id="emoji" />
              </div>

              {/* Hashtags */}
              <div className="glass-card rounded-2xl p-5 relative">
                <span className="text-xs text-accent font-heading font-semibold mb-2 flex items-center gap-1">
                  <Hash size={12} /> হ্যাশট্যাগ সাজেশন
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag) => (
                    <span key={tag} className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-bangla">{tag}</span>
                  ))}
                </div>
                <CopyBtn text={result.hashtags.join(" ")} id="tags" />
              </div>

              <Button onClick={generate} variant="ghost" className="w-full text-accent" size="sm">
                <RefreshCw size={14} /> নতুন ক্যাপশন তৈরি করুন
              </Button>
            </div>
          )}

          {/* Bio Generator */}
          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4 mt-6">
            <h3 className="font-heading font-semibold text-foreground text-sm">🎭 বায়ো জেনারেটর</h3>
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">আপনার নাম</label>
              <Input placeholder="যেমন: নাসরুল্লাহ" value={bioName} onChange={(e) => setBioName(e.target.value)} className="font-bangla" />
            </div>
            <Button onClick={genBio} variant="hero" className="w-full" size="lg">বায়ো তৈরি করুন</Button>
            {bio && (
              <div className="bg-muted rounded-xl p-4 relative">
                <p className="text-sm font-bangla text-foreground pr-8 whitespace-pre-line">{bio}</p>
                <CopyBtn text={bio} id="bio" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CaptionGenerator;
