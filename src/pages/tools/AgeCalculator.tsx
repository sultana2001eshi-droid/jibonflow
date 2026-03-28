import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ArrowLeft, CalendarDays, Timer } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const AgeCalculator = () => {
  const [birthdate, setBirthdate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<null | {
    years: number; months: number; days: number;
    totalDays: number; totalHours: number; totalWeeks: number;
    nextBirthday: number; dayOfWeek: string; season: string;
  }>(null);

  const dayNames = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];

  const getSeason = (month: number) => {
    if (month >= 2 && month <= 3) return "🌸 বসন্ত";
    if (month >= 4 && month <= 5) return "☀️ গ্রীষ্ম";
    if (month >= 6 && month <= 7) return "🌧️ বর্ষা";
    if (month >= 8 && month <= 9) return "🍂 শরৎ";
    if (month >= 10 && month <= 11) return "❄️ হেমন্ত";
    return "🌫️ শীত";
  };

  const calculate = () => {
    if (!birthdate) return;
    const birth = new Date(birthdate);
    const now = targetDate ? new Date(targetDate) : new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalWeeks = Math.floor(totalDays / 7);

    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const nextBirthday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years, months, days, totalDays, totalHours, totalWeeks,
      nextBirthday,
      dayOfWeek: dayNames[birth.getDay()],
      season: getSeason(birth.getMonth()),
    });
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <Clock size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">টাইম ও এজ সিস্টেম</h1>
                <p className="text-xs text-muted-foreground font-bangla">সঠিক বয়স ও সময়ের বিস্তারিত হিসাব</p>
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
              <p className="text-xs text-muted-foreground font-bangla">খালি রাখলে আজকের তারিখ ধরা হবে</p>
            </div>
            <Button onClick={calculate} variant="hero" className="w-full" size="lg">হিসাব করুন</Button>
          </div>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground text-center">আপনার বয়স</h3>
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

              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h4 className="font-heading font-semibold text-foreground text-sm">বিস্তারিত তথ্য</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "মোট দিন", value: result.totalDays.toLocaleString() },
                    { label: "মোট ঘণ্টা", value: result.totalHours.toLocaleString() },
                    { label: "মোট সপ্তাহ", value: result.totalWeeks.toLocaleString() },
                    { label: "পরবর্তী জন্মদিন", value: `${result.nextBirthday} দিন পর` },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground font-bangla">{item.label}</p>
                      <p className="text-sm font-heading font-bold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 space-y-2">
                <h4 className="font-heading font-semibold text-foreground text-sm">মজার তথ্য</h4>
                <p className="text-sm font-bangla text-muted-foreground">📅 আপনি জন্মেছিলেন <span className="text-accent font-medium">{result.dayOfWeek}</span></p>
                <p className="text-sm font-bangla text-muted-foreground">🌿 আপনার জন্মের ঋতু: <span className="text-accent font-medium">{result.season}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AgeCalculator;
