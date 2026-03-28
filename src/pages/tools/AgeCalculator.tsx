import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

const AgeCalculator = () => {
  const [birthdate, setBirthdate] = useState("");
  const [result, setResult] = useState<null | { years: number; months: number; days: number; totalDays: number }>(null);

  const calculate = () => {
    if (!birthdate) return;
    const birth = new Date(birthdate);
    const now = new Date();
    
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
    setResult({ years, months, days, totalDays });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-500/10 flex items-center justify-center">
            <Clock size={26} className="text-violet-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">বয়স ক্যালকুলেটর</h1>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-2">
            <label className="text-sm font-heading font-medium text-foreground">জন্ম তারিখ</label>
            <Input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <Button onClick={calculate} variant="hero" className="w-full" size="lg">হিসাব করুন</Button>
        </div>

        {result && (
          <div className="mt-6 glass-card rounded-2xl p-6 space-y-4 animate-fade-in">
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
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground font-bangla">মোট দিন</p>
              <p className="text-lg font-heading font-bold text-foreground">{result.totalDays.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
