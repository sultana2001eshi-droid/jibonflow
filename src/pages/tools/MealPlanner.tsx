import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { UtensilsCrossed, ArrowLeft, ChefHat, Shuffle, Users, ShoppingCart } from "lucide-react";

type MealOption = {
  name: string;
  items: string[];
  cost: number;
  cookTime: string;
};

type MealPlan = {
  morning: MealOption;
  lunch: MealOption;
  dinner: MealOption;
  totalCost: number;
  outsideComparison: number;
};

const ingredients = [
  "চাল", "ডাল", "আলু", "পেঁয়াজ", "রসুন", "মুরগি", "ডিম", "মাছ",
  "টমেটো", "শসা", "লেবু", "তেল", "মশলা", "আটা", "দুধ", "সবজি",
];

const generateMealPlan = (budget: number, people: number, available: string[], wantCook: boolean): MealPlan => {
  const perPerson = budget / people;
  const hasChicken = available.includes("মুরগি");
  const hasFish = available.includes("মাছ");
  const hasEgg = available.includes("ডিম");
  const hasFlour = available.includes("আটা");

  let morning: MealOption, lunch: MealOption, dinner: MealOption;

  if (perPerson >= 150) {
    morning = hasFlour
      ? { name: "পরোটা সেট", items: ["পরোটা", "ডিমভুজি", "চা", "কলা"], cost: Math.round(35 * people), cookTime: "২০ মিনিট" }
      : { name: "ভাত সেট", items: ["ভাত", "ডিম ভাজি", "আলু ভর্তা", "চা"], cost: Math.round(30 * people), cookTime: "২৫ মিনিট" };
    lunch = hasChicken
      ? { name: "চিকেন সেট", items: ["ভাত", "মুরগির তরকারি", "ডাল", "সালাদ"], cost: Math.round(65 * people), cookTime: "৪৫ মিনিট" }
      : hasFish
      ? { name: "মাছের সেট", items: ["ভাত", "মাছের ঝোল", "ভর্তা", "সবজি"], cost: Math.round(60 * people), cookTime: "৪০ মিনিট" }
      : { name: "ডাল সেট", items: ["ভাত", "ডাল", "সবজি ভাজি", "সালাদ"], cost: Math.round(40 * people), cookTime: "৩০ মিনিট" };
    dinner = { name: "খিচুড়ি ডিনার", items: ["খিচুড়ি", "বেগুনি", "সালাদ"], cost: Math.round(35 * people), cookTime: "৩৫ মিনিট" };
  } else if (perPerson >= 80) {
    morning = { name: "সিম্পল ব্রেকফাস্ট", items: ["রুটি", hasEgg ? "ডিম সেদ্ধ" : "আলু ভর্তা", "চা"], cost: Math.round(20 * people), cookTime: "১৫ মিনিট" };
    lunch = { name: "বাজেট লাঞ্চ", items: ["ভাত", "ডাল", hasEgg ? "ডিম কারি" : "আলু ভাজি", "ভর্তা"], cost: Math.round(35 * people), cookTime: "৩০ মিনিট" };
    dinner = { name: "সহজ ডিনার", items: ["ভাত", "সবজি", "ডাল ভাত"], cost: Math.round(25 * people), cookTime: "২৫ মিনিট" };
  } else {
    morning = { name: "মিনিমাল ব্রেকফাস্ট", items: ["মুড়ি", "চা"], cost: Math.round(10 * people), cookTime: "৫ মিনিট" };
    lunch = { name: "ইকোনমি লাঞ্চ", items: ["ভাত", "ডাল", "আলু ভর্তা"], cost: Math.round(25 * people), cookTime: "২০ মিনিট" };
    dinner = { name: "লাইট ডিনার", items: ["রুটি", "সবজি"], cost: Math.round(15 * people), cookTime: "১৫ মিনিট" };
  }

  const totalCost = morning.cost + lunch.cost + dinner.cost;
  const outsideComparison = Math.round(totalCost * (wantCook ? 2.2 : 1));

  if (!wantCook) {
    morning = { ...morning, name: morning.name + " (বাইরে)", cost: Math.round(morning.cost * 2), cookTime: "—" };
    lunch = { ...lunch, name: lunch.name + " (বাইরে)", cost: Math.round(lunch.cost * 2.2), cookTime: "—" };
    dinner = { ...dinner, name: dinner.name + " (বাইরে)", cost: Math.round(dinner.cost * 2), cookTime: "—" };
  }

  return {
    morning, lunch, dinner,
    totalCost: morning.cost + lunch.cost + dinner.cost,
    outsideComparison: wantCook ? outsideComparison : Math.round((morning.cost + lunch.cost + dinner.cost) / 2.1),
  };
};

const MealPlanner = () => {
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("1");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [wantCook, setWantCook] = useState(true);
  const [plan, setPlan] = useState<MealPlan | null>(null);

  const toggleIngredient = (item: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const generate = () => {
    const b = parseFloat(budget) || 200;
    const p = parseInt(people) || 1;
    setPlan(generateMealPlan(b, p, selectedIngredients, wantCook));
  };

  const MealCard = ({ label, icon, meal }: { label: string; icon: string; meal: MealOption }) => (
    <div className="bg-muted/50 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs text-accent font-heading font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground font-bangla">৳{meal.cost}</span>
      </div>
      <p className="text-sm font-heading font-semibold text-foreground">{meal.name}</p>
      <div className="flex flex-wrap gap-1.5">
        {meal.items.map((item) => (
          <span key={item} className="text-xs bg-background/80 rounded-lg px-2 py-1 text-muted-foreground font-bangla">{item}</span>
        ))}
      </div>
      {meal.cookTime !== "—" && (
        <p className="text-xs text-muted-foreground font-bangla">⏱ রান্নার সময়: {meal.cookTime}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors font-heading mb-4">
            <ArrowLeft size={16} /> টুলস
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">মিল ইন্টেলিজেন্স</h1>
              <p className="text-xs text-muted-foreground font-bangla">বাজেট ও উপকরণ অনুযায়ী খাবার পরিকল্পনা</p>
            </div>
          </div>
        </div>

        {/* Input form */}
        <div className="glass-card gradient-border rounded-2xl p-6 space-y-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Budget */}
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
              <ShoppingCart size={14} className="text-accent" /> আজকের খাবারের বাজেট (৳)
            </label>
            <Input type="number" placeholder="যেমন: ৩০০" value={budget} onChange={(e) => setBudget(e.target.value)} className="font-bangla" />
          </div>

          {/* People */}
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
              <Users size={14} className="text-accent" /> কয়জন খাবে?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["1", "2", "3", "4+"].map((n) => (
                <button
                  key={n}
                  onClick={() => setPeople(n === "4+" ? "4" : n)}
                  className={`py-2 rounded-xl text-sm font-heading font-medium transition-all ${
                    people === (n === "4+" ? "4" : n) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">বাসায় যা আছে (সিলেক্ট করুন)</label>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item) => (
                <button
                  key={item}
                  onClick={() => toggleIngredient(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bangla font-medium transition-all ${
                    selectedIngredients.includes(item)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Cook or outside */}
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">কিভাবে খেতে চান?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWantCook(true)}
                className={`py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${
                  wantCook ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                🍳 রান্না করব
              </button>
              <button
                onClick={() => setWantCook(false)}
                className={`py-2.5 rounded-xl text-sm font-bangla font-medium transition-all ${
                  !wantCook ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                🏪 বাইরে খাব
              </button>
            </div>
          </div>

          <Button onClick={generate} variant="hero" className="w-full" size="lg">
            <Shuffle size={16} /> মিল প্ল্যান তৈরি করুন
          </Button>
        </div>

        {/* Results */}
        {plan && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-accent" /> আজকের মিল প্ল্যান
              </h3>
              <MealCard label="সকাল" icon="🌅" meal={plan.morning} />
              <MealCard label="দুপুর" icon="☀️" meal={plan.lunch} />
              <MealCard label="রাত" icon="🌙" meal={plan.dinner} />
            </div>

            {/* Summary */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h4 className="font-heading font-semibold text-foreground text-sm">খরচের সারাংশ</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">{wantCook ? "রান্না করলে" : "বাইরে খেলে"}</p>
                  <p className="text-xl font-heading font-bold text-accent">৳{plan.totalCost}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <p className="text-xs text-muted-foreground font-bangla">{wantCook ? "বাইরে খেলে" : "রান্না করলে"}</p>
                  <p className="text-xl font-heading font-bold text-foreground">৳{plan.outsideComparison}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-bangla text-center">
                {wantCook
                  ? `🎉 রান্না করে সাশ্রয়: ৳${plan.outsideComparison - plan.totalCost}`
                  : `💡 রান্না করলে বাঁচত: ৳${plan.totalCost - plan.outsideComparison}`}
              </p>
            </div>

            <Button onClick={generate} variant="ghost" className="w-full text-accent" size="sm">
              <Shuffle size={14} /> অন্য প্ল্যান দেখুন
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
