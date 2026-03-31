import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, CalendarDays, Timer, Copy, Check, Sparkles, RotateCcw } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import ToolResultSkeleton from "@/components/tools/ToolResultSkeleton";

const AgeCalculator = () => {
  useNavigate();
  const [birthdate, setBirthdate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [result, setResult] = useState<null | {
    years: number; months: number; days: number;
    totalDays: number; totalHours: number; totalWeeks: number; totalMinutes: number;
    nextBirthday: number; dayOfWeek: string; season: string;
    zodiac: string; generation: string;
    eventCountdown: number | null; eventName: string;
  }>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dayNames = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];

  const getSeason = (month: number) => {
    if (month >= 2 && month <= 3) return "🌸 বসন্ত";
    if (month >= 4 && month <= 5) return "☀️ গ্রীষ্ম";
    if (month >= 6 && month <= 7) return "🌧️ বর্ষা";
    if (month >= 8 && month <= 9) return "🍂 শরৎ";
    if (month >= 10 && month <= 11) return "❄️ হেমন্ত";
    return "🌫️ শীত";
  };

  const getZodiac = (month: number, day: number) => {
    if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return "♒ কুম্ভ";
    if ((month === 1 && day >= 19) || (month === 2 && day <= 20)) return "♓ মীন";
    if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return "♈ মেষ";
    if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return "♉ বৃষ";
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return "♊ মিথুন";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return "♋ কর্কট";
    if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return "♌ সিংহ";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♍ কন্যা";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♎ তুলা";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return "♏ বৃশ্চিক";
    if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return "♐ ধনু";
    return "♑ মকর";
  };

  const getGeneration = (year: number) => {
    if (year >= 2013) return "Gen Alpha (আলফা)";
    if (year >= 1997) return "Gen Z (জেন-জি)";
    if (year >= 1981) return "Millennial (মিলেনিয়াল)";
    if (year >= 1965) return "Gen X (জেন-এক্স)";
    return "Baby Boomer (বুমার)";
  };

  const handleAgeGenerate = async () => {
    if (!birthdate) {
      setError("জন্ম তারিখ দিন।");
      return;
    }

    setError("");
    setLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 800));

    const birth = new Date(birthdate);
    const now = targetDate ? new Date(targetDate) : new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMinutes = totalHours * 60;

    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const nextBirthday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let eventCountdown: number | null = null;
    if (eventDate) {
      const evDate = new Date(eventDate);
      eventCountdown = Math.ceil((evDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    setResult({
      years, months, days, totalDays, totalHours, totalWeeks, totalMinutes,
      nextBirthday,
      dayOfWeek: dayNames[birth.getDay()],
      season: getSeason(birth.getMonth()),
      zodiac: getZodiac(birth.getMonth(), birth.getDate()),
      generation: getGeneration(birth.getFullYear()),
      eventCountdown, eventName: eventName || "ইভেন্ট",
    });
    setLoading(false);
  };

  const resetTool = () => {
    setBirthdate("");
    setTargetDate("");
    setEventName("");
    setEventDate("");
    setResult(null);
    setCopied(false);
    setLoading(false);
    setError("");
  };

  const copyAll = () => {
    if (!result) return;
    const text = `বয়স: ${result.years} বছর ${result.months} মাস ${result.days} দিন\nমোট দিন: ${result.totalDays}\nমোট ঘণ্টা: ${result.totalHours}\nজন্মদিন: ${result.dayOfWeek}\nরাশি: ${result.zodiac}\nজেনারেশন: ${result.generation}\nপরবর্তী জন্মদিন: ${result.nextBirthday} দিন পর`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-lg">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <Clock size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">এজ ও টাইম ইঞ্জিন</h1>
                <p className="text-xs text-muted-foreground font-bangla">বয়স, কাউন্টডাউন ও জীবনের পরিসংখ্যান</p>
              </div>
            </div>
          </div>

          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
                <CalendarDays size={14} className="text-accent" /> জন্ম তারিখ
              </label>
              <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-heading font-medium text-foreground flex items-center gap-2">
                <Timer size={14} className="text-accent" /> পর্যন্ত তারিখ (ঐচ্ছিক)
              </label>
              <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>

            <div className="border-t border-border/30 pt-4 space-y-2">
              <label className="text-sm font-heading font-medium text-foreground">📅 ইভেন্ট কাউন্টডাউন (ঐচ্ছিক)</label>
              <Input placeholder="ইভেন্টের নাম (যেমন: পরীক্ষা, বিয়ে)" value={eventName} onChange={(e) => setEventName(e.target.value)} className="font-bangla" />
              <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAgeGenerate} disabled={!birthdate || loading} variant="hero" className="flex-1" size="lg">{loading ? "হিসাব হচ্ছে..." : "হিসাব করুন"}</Button>
              <Button type="button" onClick={resetTool} variant="outline" size="lg">
                <RotateCcw size={16} /> রিসেট
              </Button>
            </div>

            {error && <p className="text-sm font-bangla text-destructive">{error}</p>}
            {!error && !birthdate && <p className="text-sm font-bangla text-muted-foreground">জন্ম তারিখ দিলে বয়স ও কাউন্টডাউন দেখা যাবে।</p>}
          </div>

          {loading && <ToolResultSkeleton cards={2} />}
          {result && !loading && (
            <div className="mt-6 space-y-4">
              {/* Age */}
              <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-foreground">আপনার বয়স</h3>
                  <button onClick={copyAll} className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 font-heading">
                    {copied ? <><Check size={12} className="text-emerald-500" /> কপি</> : <><Copy size={12} /> কপি</>}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "বছর", value: result.years },
                    { label: "মাস", value: result.months },
                    { label: "দিন", value: result.days },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted rounded-xl p-4 text-center">
                      <p className="text-2xl font-heading font-bold text-accent">{item.value}</p>
                      <p className="text-xs text-muted-foreground font-bangla">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed stats */}
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h4 className="font-heading font-semibold text-foreground text-sm">📊 বিস্তারিত পরিসংখ্যান</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "মোট দিন", value: result.totalDays.toLocaleString() },
                    { label: "মোট ঘণ্টা", value: result.totalHours.toLocaleString() },
                    { label: "মোট সপ্তাহ", value: result.totalWeeks.toLocaleString() },
                    { label: "মোট মিনিট", value: result.totalMinutes.toLocaleString() },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground font-bangla">{item.label}</p>
                      <p className="text-sm font-heading font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Birthday countdown */}
              <div className="glass-card rounded-2xl p-5 text-center space-y-2">
                <p className="text-xs text-muted-foreground font-bangla">🎂 পরবর্তী জন্মদিন</p>
                <p className="text-3xl font-heading font-bold text-accent">{result.nextBirthday} দিন</p>
              </div>

              {/* Event countdown */}
              {result.eventCountdown !== null && (
                <div className="glass-card rounded-2xl p-5 text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-bangla">📅 {result.eventName} পর্যন্ত</p>
                  <p className={`text-3xl font-heading font-bold ${result.eventCountdown >= 0 ? "text-accent" : "text-destructive"}`}>
                    {result.eventCountdown >= 0 ? `${result.eventCountdown} দিন` : `${Math.abs(result.eventCountdown)} দিন আগে`}
                  </p>
                </div>
              )}

              {/* Fun facts */}
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h4 className="font-heading font-semibold text-foreground text-sm flex items-center gap-2">
                  <Sparkles size={14} className="text-accent" /> মজার তথ্য
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "জন্মের দিন", value: result.dayOfWeek },
                    { label: "জন্মের ঋতু", value: result.season },
                    { label: "রাশি", value: result.zodiac },
                    { label: "জেনারেশন", value: result.generation },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center bg-muted/30 rounded-xl px-4 py-2.5">
                      <span className="text-xs font-bangla text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-heading font-semibold text-accent">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AgeCalculator;
