import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChefHat, Shuffle, Users, ShoppingCart, Clock, Copy, Check, Lightbulb, Heart, RotateCcw } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import ToolResultSkeleton from "@/components/tools/ToolResultSkeleton";
import { saveToolHistory } from "@/lib/toolHistory";

type MealType = "rice" | "snack" | "dinner" | "light";
type CookMode = "cook" | "outside";

type MealSuggestion = {
  name: string;
  items: string[];
  cost: number;
  cookTime: string;
  recipe: string[];
  missing: string[];
  healthNote: string;
  why: string;
};

const allIngredients = [
  "চাল", "ডাল", "আলু", "পেঁয়াজ", "রসুন", "আদা", "মুরগি", "ডিম", "মাছ",
  "টমেটো", "শসা", "লেবু", "তেল", "মশলা", "আটা", "দুধ", "সবজি", "পনির",
  "নুডলস", "ব্রেড", "মাখন", "চিনি", "লবণ", "মরিচ", "ধনেপাতা",
];

const mealTypeLabels: Record<MealType, string> = {
  rice: "🍚 ভাতের সেট", snack: "🥪 নাস্তা", dinner: "🌙 রাতের খাবার", light: "🥗 হালকা",
};

function generateMeals(
  budget: number, people: number, available: string[],
  cookTime: number, cookMode: CookMode, mealType: MealType
): MealSuggestion[] {
  const perPerson = budget / people;
  const has = (i: string) => available.includes(i);
  const isOutside = cookMode === "outside";
  const costMult = isOutside ? 2.0 : 1.0;
  const now = Date.now();

  // Large pool of meals categorized
  type MealDef = {
    name: string; items: string[]; baseCost: number; time: number;
    needs: string[]; recipe: string[]; health: string; types: MealType[];
  };

  const mealPool: MealDef[] = [
    { name: "ডিম ভুনা + ভাত", items: ["ভাত", "ডিম ভুনা", "আলু ভর্তা", "সালাদ"], baseCost: 35, time: 25,
      needs: ["ডিম", "চাল", "পেঁয়াজ", "তেল"], recipe: ["তেলে পেঁয়াজ ভাজুন", "ডিম ভেঙে মশলা দিয়ে ভুনুন", "ভাত রান্না করুন", "আলু সেদ্ধ করে ভর্তা করুন"],
      health: "প্রোটিন সমৃদ্ধ, সুষম খাবার", types: ["rice", "dinner"] },
    { name: "মুরগির তরকারি সেট", items: ["ভাত", "মুরগির তরকারি", "ডাল", "সালাদ"], baseCost: 70, time: 45,
      needs: ["মুরগি", "চাল", "পেঁয়াজ", "মশলা"], recipe: ["মুরগি ধুয়ে মশলায় মাখান", "তেলে পেঁয়াজ-রসুন ভাজুন", "মুরগি দিয়ে রান্না করুন ৩০ মিনিট", "আলাদা ভাবে ডাল রান্না করুন"],
      health: "হাই প্রোটিন, শক্তিদায়ক খাবার", types: ["rice", "dinner"] },
    { name: "মাছের ঝোল সেট", items: ["ভাত", "মাছের ঝোল", "ভর্তা", "সবজি ভাজি"], baseCost: 60, time: 40,
      needs: ["মাছ", "চাল", "পেঁয়াজ", "মশলা"], recipe: ["মাছ ধুয়ে হলুদ-লবণ মাখান", "তেলে মাছ হালকা ভাজুন", "ঝোলের মশলা তৈরি করে মাছ দিন", "আলু-সবজি ভর্তা করুন"],
      health: "ওমেগা-৩ সমৃদ্ধ, হৃদরোগ প্রতিরোধক", types: ["rice", "dinner"] },
    { name: "খিচুড়ি ও বেগুনি", items: ["খিচুড়ি", "বেগুনি", "ডিম ভাজি", "সালাদ"], baseCost: 40, time: 35,
      needs: ["চাল", "ডাল", "তেল", "মশলা"], recipe: ["চাল-ডাল ধুয়ে একসাথে রান্না", "বেগুন পাতলা করে কেটে ভাজুন", "ঘি বা তেল দিয়ে পরিবেশন"],
      health: "হজমে সহায়ক, পুষ্টিকর", types: ["rice", "dinner", "light"] },
    { name: "ডাল-ভাত-ভর্তা", items: ["ভাত", "মসুর ডাল", "আলু ভর্তা", "পেঁয়াজ কুচি"], baseCost: 25, time: 20,
      needs: ["চাল", "ডাল", "আলু", "পেঁয়াজ"], recipe: ["ভাত রান্না করুন", "ডাল সেদ্ধ করে ফোড়ন দিন", "আলু সেদ্ধ করে চেপে মশলা মেশান"],
      health: "সবচেয়ে সাশ্রয়ী সুষম খাবার", types: ["rice"] },
    { name: "পরোটা ও ডিম", items: ["পরোটা", "ডিমভুজি", "চা", "কলা"], baseCost: 35, time: 20,
      needs: ["আটা", "ডিম", "তেল"], recipe: ["আটা মেখে পরোটা বানান", "ডিম ভেঙে পেঁয়াজ দিয়ে ভুজি করুন", "চা তৈরি করুন"],
      health: "শক্তিদায়ক সকালের নাস্তা", types: ["snack"] },
    { name: "নুডলস + ডিম", items: ["ম্যাগি/নুডলস", "ডিম পোচ", "সবজি কুচি"], baseCost: 25, time: 12,
      needs: ["নুডলস", "ডিম"], recipe: ["পানি ফুটান ও নুডলস দিন", "সবজি কুচি যোগ করুন", "ডিম পোচ করে উপরে দিন"],
      health: "দ্রুত তৈরি, মাঝারি পুষ্টি", types: ["snack", "light"] },
    { name: "রুটি ও সবজি", items: ["রুটি", "মিক্সড সবজি", "ডাল"], baseCost: 30, time: 25,
      needs: ["আটা", "সবজি", "ডাল"], recipe: ["আটা মেখে রুটি বানান", "সবজি কুচি করে রান্না করুন", "ডাল ফোড়ন দিন"],
      health: "ফাইবার সমৃদ্ধ, হালকা ও স্বাস্থ্যকর", types: ["dinner", "light"] },
    { name: "ভাজা ভাত (ফ্রাইড রাইস)", items: ["ফ্রাইড রাইস", "ডিম", "সবজি", "সয়াসস"], baseCost: 35, time: 15,
      needs: ["চাল", "ডিম", "সবজি", "তেল"], recipe: ["বাসি/ঠান্ডা ভাত ব্যবহার করুন", "ডিম ভেজে সরান", "সবজি ভাজুন, ভাত-ডিম মিশান", "সয়াসস দিন"],
      health: "দ্রুত ও মজাদার", types: ["rice", "dinner"] },
    { name: "দই চিঁড়া", items: ["চিঁড়া", "দই", "কলা", "গুড়"], baseCost: 20, time: 5,
      needs: ["দুধ"], recipe: ["চিঁড়া ভিজিয়ে রাখুন", "দই ও গুড় মেশান", "কলা কুচি দিন"],
      health: "হজমে ভালো, প্রোবায়োটিক", types: ["snack", "light"] },
    { name: "আলু পরোটা", items: ["আলু পরোটা", "আচার", "চা"], baseCost: 25, time: 20,
      needs: ["আটা", "আলু", "তেল"], recipe: ["আলু সেদ্ধ করে মশলায় মাখান", "আটার ভেতর আলু ভরে পরোটা বানান", "তেলে ভাজুন"],
      health: "কার্বোহাইড্রেট সমৃদ্ধ, শক্তি দেয়", types: ["snack"] },
    { name: "সবজি স্যুপ", items: ["মিক্সড সবজি স্যুপ", "ব্রেড", "লেবু"], baseCost: 20, time: 15,
      needs: ["সবজি", "লেবু"], recipe: ["সবজি কুচি করে পানিতে সেদ্ধ করুন", "লবণ-গোলমরিচ দিন", "লেবু চিপে পরিবেশন"],
      health: "লো ক্যালরি, ভিটামিন সমৃদ্ধ", types: ["light"] },
  ];

  // Outside versions
  const outsideMeals: MealDef[] = [
    { name: "হোটেলের ভাত-মাংস", items: ["ভাত", "গরুর মাংস/মুরগি", "ডাল", "সালাদ"], baseCost: 100, time: 0,
      needs: [], recipe: ["নিকটস্থ হোটেলে যান", "সেট মেনু অর্ডার করুন"], health: "পরিমাণ মতো খান, ভাজাপোড়া এড়িয়ে চলুন", types: ["rice", "dinner"] },
    { name: "ফুড কোর্ট বিরিয়ানি", items: ["বিরিয়ানি", "বোরহানি", "সালাদ"], baseCost: 120, time: 0,
      needs: [], recipe: ["ফুড কোর্ট/রেস্তোরাঁ থেকে অর্ডার করুন"], health: "ক্যালরি বেশি, মাঝেমধ্যে খান", types: ["rice", "dinner"] },
    { name: "চা-সিঙ্গারা নাস্তা", items: ["সিঙ্গারা", "সমুচা", "চা"], baseCost: 30, time: 0,
      needs: [], recipe: ["নিকটস্থ চায়ের দোকানে যান"], health: "ভাজা খাবার, নিয়মিত না খাওয়াই ভালো", types: ["snack", "light"] },
    { name: "রেস্তোরাঁ সেট মেনু", items: ["ভাত", "তরকারি", "ভর্তা", "ড্রিংকস"], baseCost: 150, time: 0,
      needs: [], recipe: ["রেস্তোরাঁ থেকে সেট মেনু নিন"], health: "মাঝারি পুষ্টি, দাম বেশি", types: ["rice", "dinner"] },
  ];

  // Filter by type, time, and ingredient availability
  const pool = isOutside ? outsideMeals : mealPool;
  let candidates = pool.filter((m) => m.types.includes(mealType));
  if (!isOutside) {
    candidates = candidates.filter((m) => m.time <= cookTime || cookTime >= 40);
  }

  // Score each meal
  const scored = candidates.map((m) => {
    let score = 0;
    const adjustedCost = Math.round(m.baseCost * people * costMult);

    // Budget fit (closer to budget = better)
    if (adjustedCost <= budget) score += 30;
    if (adjustedCost <= budget * 0.7) score += 10;

    // Ingredient match
    const matchCount = m.needs.filter((n) => has(n)).length;
    const matchRatio = m.needs.length > 0 ? matchCount / m.needs.length : 1;
    score += Math.round(matchRatio * 40);

    // Time fit
    if (m.time <= cookTime) score += 20;

    // Add randomness for variety
    score += ((now + m.name.length * 7) % 15);

    const missing = m.needs.filter((n) => !has(n));

    return { ...m, score, adjustedCost, missing, matchRatio };
  });

  // Sort by score and pick top 3
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(3, scored.length));

  const whyReasons = [
    (m: typeof top[0]) => m.matchRatio === 1
      ? `আপনার বাসায় সব উপকরণ আছে — ${m.name} সবচেয়ে সুবিধাজনক।`
      : `উপকরণের ${Math.round(m.matchRatio * 100)}% মিলেছে এবং বাজেটের মধ্যে আছে।`,
    (m: typeof top[0]) => m.adjustedCost <= budget * 0.5
      ? `বাজেটের অর্ধেকেই হয়ে যাবে — বাকি টাকা সেভ করুন।`
      : `আপনার বাজেট ৳${budget} এর মধ্যে ভালো অপশন।`,
    (m: typeof top[0]) => m.time <= 15
      ? `মাত্র ${m.time} মিনিটে তৈরি — সময় বাঁচান।`
      : `${m.time} মিনিটে পূর্ণাঙ্গ খাবার তৈরি হবে।`,
  ];

  return top.map((m, i): MealSuggestion => ({
    name: m.name,
    items: m.items,
    cost: m.adjustedCost,
    cookTime: isOutside ? "—" : `${m.time} মিনিট`,
    recipe: m.recipe,
    missing: m.missing,
    healthNote: m.health,
    why: whyReasons[i % whyReasons.length](m),
  }));
}

const MealPlanner = () => {
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("1");
  const [ingredientText, setIngredientText] = useState("");
  const [cookTime, setCookTime] = useState("30");
  const [cookMode, setCookMode] = useState<CookMode>("cook");
  const [mealType, setMealType] = useState<MealType>("rice");
  const [results, setResults] = useState<MealSuggestion[] | null>(null);
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addIngredient = (item: string) => {
    const parsed = ingredientText
      .split(/[,\n]/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (parsed.includes(item)) {
      setIngredientText(parsed.filter((value) => value !== item).join(", "));
      return;
    }

    setIngredientText([...parsed, item].join(", "));
  };

  const parsedIngredients = ingredientText
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const canGenerate = Boolean(budget.trim() && ingredientText.trim() && Number(people) > 0);

  const handleMealGenerate = async () => {
    if (!budget.trim()) {
      setError("বাজেট লিখুন।");
      return;
    }

    if (!ingredientText.trim()) {
      setError("উপকরণ লিখুন বা কুইক-সিলেক্ট থেকে যোগ করুন।");
      return;
    }

    setError("");
    setLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 800));

    const b = parseFloat(budget) || 0;
    const p = parseInt(people, 10) || 1;
    const t = parseInt(cookTime, 10) || 30;
    const generated = generateMeals(b, p, parsedIngredients, t, cookMode, mealType);

    setResults(generated);
    setLoading(false);
    saveToolHistory("meal", { budget: b, people: p, ingredients: parsedIngredients, cookMode, mealType }, { meals: generated });
  };

  const resetTool = () => {
    setBudget("");
    setPeople("1");
    setIngredientText("");
    setCookTime("30");
    setCookMode("cook");
    setMealType("rice");
    setResults(null);
    setCopied("");
    setError("");
    setLoading(false);
  };

  const copyResult = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const cookTimeOptions = ["১৫", "২০", "৩০", "৪৫+"];
  const cookTimeValues = ["15", "20", "30", "45"];

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <ChefHat size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">স্মার্ট মিল ইঞ্জিন</h1>
                <p className="text-xs text-muted-foreground font-bangla">বাজেট, উপকরণ ও সময় অনুযায়ী মিল প্ল্যান</p>
              </div>
            </div>
          </div>

          <div className="glass-card gradient-border rounded-2xl p-6 space-y-5">
            {/* Budget */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
                <ShoppingCart size={14} className="text-accent" /> আপনার বাজেট কত? (৳)
              </label>
              <Input type="number" placeholder="যেমন: ৩০০" value={budget} onChange={(e) => setBudget(e.target.value)} className="font-bangla" />
            </div>

            {/* People */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
                <Users size={14} className="text-accent" /> কয়জন খাবে?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["1", "2", "3", "4"].map((n) => (
                  <button key={n} onClick={() => setPeople(n)}
                    className={`py-2 rounded-xl text-sm font-heading font-medium transition-all ${people === n ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {n === "4" ? "4+" : n}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">উপকরণ (কমা বা নতুন লাইনে লিখুন)</label>
              <Textarea
                placeholder="যেমন: চাল, ডিম, পেঁয়াজ, তেল"
                value={ingredientText}
                onChange={(e) => {
                  setIngredientText(e.target.value);
                  setError("");
                }}
                className="font-bangla min-h-[96px]"
              />
              <div className="flex flex-wrap gap-2">
                {allIngredients.map((item) => {
                  const active = parsedIngredients.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => addIngredient(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bangla font-medium transition-all ${active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cook time */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
                <Clock size={14} className="text-accent" /> রান্নার সময় (মিনিট)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {cookTimeOptions.map((label, i) => (
                  <button key={label} onClick={() => setCookTime(cookTimeValues[i])}
                    className={`py-2 rounded-xl text-xs font-bangla font-medium transition-all ${cookTime === cookTimeValues[i] ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {label} মি.
                  </button>
                ))}
              </div>
            </div>

            {/* Cook mode */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">কিভাবে খেতে চান?</label>
              <RadioGroup value={cookMode} onValueChange={(value) => setCookMode(value as CookMode)} className="grid grid-cols-2 gap-2">
                <Label htmlFor="cook-mode-home" className={`flex items-center gap-3 rounded-xl border px-3 py-3 cursor-pointer transition-all ${cookMode === "cook" ? "border-accent bg-accent/10 text-foreground" : "border-border bg-muted/40 text-muted-foreground"}`}>
                  <RadioGroupItem value="cook" id="cook-mode-home" />
                  🍳 রান্না করব
                </Label>
                <Label htmlFor="cook-mode-outside" className={`flex items-center gap-3 rounded-xl border px-3 py-3 cursor-pointer transition-all ${cookMode === "outside" ? "border-accent bg-accent/10 text-foreground" : "border-border bg-muted/40 text-muted-foreground"}`}>
                  <RadioGroupItem value="outside" id="cook-mode-outside" />
                  🏪 বাইরে খাব
                </Label>
              </RadioGroup>
            </div>

            {/* Meal type */}
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">খাবারের ধরন</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bangla ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {(Object.keys(mealTypeLabels) as MealType[]).map((type) => (
                  <option key={type} value={type}>
                    {mealTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleMealGenerate} disabled={!canGenerate || loading} variant="hero" className="flex-1" size="lg">
                <Shuffle size={16} /> {loading ? "সাজেশন তৈরি হচ্ছে..." : "সাজেশন দেখুন"}
              </Button>
              <Button type="button" onClick={resetTool} variant="outline" size="lg">
                <RotateCcw size={16} /> রিসেট
              </Button>
            </div>

            {error && <p className="text-sm font-bangla text-destructive">{error}</p>}
            {!error && !canGenerate && <p className="text-sm font-bangla text-muted-foreground">বাজেট, উপকরণ ও জনসংখ্যা দিন, তারপর সাজেশন তৈরি হবে।</p>}
          </div>

          {/* Results */}
          {loading && <ToolResultSkeleton cards={3} />}
          {results && results.length > 0 && !loading && (
            <div className="mt-6 space-y-4">
              {results.map((meal, i) => (
                <div key={i} className={`glass-card rounded-2xl p-5 space-y-3 ${i === 0 ? "gradient-border" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {i === 0 && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-heading font-semibold">🏆 সেরা পছন্দ</span>}
                      {i === 1 && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-heading">বিকল্প ১</span>}
                      {i === 2 && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-heading">বিকল্প ২</span>}
                    </div>
                    <span className="text-sm font-heading font-bold text-accent">৳{meal.cost}</span>
                  </div>

                  <h4 className="font-heading font-bold text-foreground text-lg">{meal.name}</h4>

                  <div className="flex flex-wrap gap-1.5">
                    {meal.items.map((item) => (
                      <span key={item} className="text-xs bg-muted rounded-lg px-2 py-1 text-muted-foreground font-bangla">{item}</span>
                    ))}
                  </div>

                  {meal.cookTime !== "—" && (
                    <p className="text-xs text-muted-foreground font-bangla flex items-center gap-1">
                      <Clock size={12} /> রান্নার সময়: {meal.cookTime}
                    </p>
                  )}

                  {/* Why recommended */}
                  <div className="bg-accent/10 rounded-xl p-3 flex items-start gap-2">
                    <Lightbulb size={14} className="text-accent mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground font-bangla">{meal.why}</p>
                  </div>

                  {/* Recipe steps */}
                  {meal.recipe.length > 0 && cookMode === "cook" && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide">রেসিপি স্টেপস</p>
                      {meal.recipe.map((step, si) => (
                        <p key={si} className="text-xs font-bangla text-muted-foreground flex items-start gap-2">
                          <span className="text-accent font-heading font-bold shrink-0">{si + 1}.</span> {step}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Missing ingredients */}
                  {meal.missing.length > 0 && (
                    <div className="bg-destructive/10 rounded-xl p-3">
                      <p className="text-xs font-bangla text-destructive">⚠️ কিনতে হবে: {meal.missing.join(", ")}</p>
                    </div>
                  )}

                  {/* Health note */}
                  <div className="flex items-center gap-2">
                    <Heart size={12} className="text-accent" />
                    <p className="text-xs font-bangla text-muted-foreground">{meal.healthNote}</p>
                  </div>

                  {/* Copy */}
                  <button onClick={() => copyResult(`${meal.name}\n${meal.items.join(", ")}\nখরচ: ৳${meal.cost}\n${meal.recipe.join("\n")}`, `meal-${i}`)}
                    className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 font-heading">
                    {copied === `meal-${i}` ? <><Check size={12} className="text-emerald-500" /> কপি হয়েছে</> : <><Copy size={12} /> কপি করুন</>}
                  </button>
                </div>
              ))}

              <Button onClick={handleMealGenerate} variant="ghost" className="w-full text-accent" size="sm">
                <Shuffle size={14} /> অন্য সাজেশন দেখুন
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default MealPlanner;
