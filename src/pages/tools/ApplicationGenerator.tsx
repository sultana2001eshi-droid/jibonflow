import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Copy, Check } from "lucide-react";

type AppType = "leave" | "job" | "formal";

const templates: Record<AppType, (d: Record<string, string>) => string> = {
  leave: (d) => `তারিখ: ${d.date || "..."}

বরাবর,
${d.to || "প্রধান শিক্ষক/কর্তৃপক্ষ"},
${d.institution || "প্রতিষ্ঠানের নাম"}।

বিষয়: ${d.days || "..."} দিনের ছুটির আবেদন।

জনাব,
বিনীত নিবেদন এই যে, আমি ${d.name || "..."}, আপনার প্রতিষ্ঠানের ${d.class || "..."} এর একজন ছাত্র/ছাত্রী। ${d.reason || "ব্যক্তিগত কারণে"} আমি আগামী ${d.days || "..."} দিন উপস্থিত থাকতে পারব না।

অতএব, মহোদয়ের নিকট আকুল আবেদন, আমাকে ${d.days || "..."} দিনের ছুটি মঞ্জুর করে বাধিত করবেন।

বিনীত,
${d.name || "..."}
${d.class || "..."}`,

  job: (d) => `তারিখ: ${d.date || "..."}

বরাবর,
${d.to || "ম্যানেজার/পরিচালক"},
${d.institution || "প্রতিষ্ঠানের নাম"}।

বিষয়: ${d.position || "..."} পদে নিয়োগের আবেদন।

জনাব,
বিনীত নিবেদন এই যে, আমি ${d.name || "..."}, ${d.qualification || "..."}। আপনার প্রতিষ্ঠানে ${d.position || "..."} পদে কাজ করার জন্য আগ্রহী।

আমি বিশ্বাস করি আমার যোগ্যতা ও অভিজ্ঞতা এই পদের জন্য উপযুক্ত।

বিনীত,
${d.name || "..."}
যোগাযোগ: ${d.contact || "..."}`,

  formal: (d) => `তারিখ: ${d.date || "..."}

বরাবর,
${d.to || "সংশ্লিষ্ট কর্তৃপক্ষ"},
${d.institution || "প্রতিষ্ঠানের নাম"}।

বিষয়: ${d.subject || "..."}।

জনাব,
${d.body || "বিনীত নিবেদন এই যে..."}

বিনীত,
${d.name || "..."}`,
};

const fields: Record<AppType, { key: string; label: string; placeholder: string }[]> = {
  leave: [
    { key: "name", label: "আপনার নাম", placeholder: "মোহাম্মদ নাসরুল্লাহ" },
    { key: "to", label: "বরাবর", placeholder: "প্রধান শিক্ষক" },
    { key: "institution", label: "প্রতিষ্ঠান", placeholder: "সরকারি ব্রজমোহন কলেজ" },
    { key: "class", label: "শ্রেণি/বিভাগ", placeholder: "ইংরেজি বিভাগ, ২য় বর্ষ" },
    { key: "days", label: "ছুটির দিন", placeholder: "৩" },
    { key: "reason", label: "কারণ", placeholder: "অসুস্থতার কারণে" },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
  job: [
    { key: "name", label: "আপনার নাম", placeholder: "মোহাম্মদ নাসরুল্লাহ" },
    { key: "to", label: "বরাবর", placeholder: "ম্যানেজার" },
    { key: "institution", label: "প্রতিষ্ঠান", placeholder: "ABC কোম্পানি" },
    { key: "position", label: "পদ", placeholder: "জুনিয়র ডেভেলপার" },
    { key: "qualification", label: "শিক্ষাগত যোগ্যতা", placeholder: "বি.এ. (ইংরেজি)" },
    { key: "contact", label: "যোগাযোগ", placeholder: "০১XXXXXXXXX" },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
  formal: [
    { key: "name", label: "আপনার নাম", placeholder: "মোহাম্মদ নাসরুল্লাহ" },
    { key: "to", label: "বরাবর", placeholder: "সংশ্লিষ্ট কর্তৃপক্ষ" },
    { key: "institution", label: "প্রতিষ্ঠান", placeholder: "প্রতিষ্ঠানের নাম" },
    { key: "subject", label: "বিষয়", placeholder: "অভিযোগ / আবেদন" },
    { key: "body", label: "মূল বক্তব্য", placeholder: "বিনীত নিবেদন এই যে..." },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
};

const typeLabels: Record<AppType, string> = { leave: "ছুটির আবেদন", job: "চাকরির আবেদন", formal: "ফর্মাল দরখাস্ত" };

const ApplicationGenerator = () => {
  const [type, setType] = useState<AppType>("leave");
  const [data, setData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => setOutput(templates[type](data));

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <FileText size={26} className="text-blue-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">দরখাস্ত জেনারেটর</h1>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(typeLabels) as AppType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setType(t); setData({}); setOutput(""); }}
                className={`py-2.5 rounded-xl text-xs font-bangla font-medium transition-all ${
                  type === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>

          {fields[type].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-sm font-heading font-medium text-foreground">{f.label}</label>
              <Input
                placeholder={f.placeholder}
                value={data[f.key] || ""}
                onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                className="font-bangla"
              />
            </div>
          ))}

          <Button onClick={generate} variant="hero" className="w-full" size="lg">তৈরি করুন</Button>
        </div>

        {output && (
          <div className="mt-6 glass-card rounded-2xl p-6 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground">আপনার দরখাস্ত</h3>
              <Button variant="ghost" size="sm" onClick={copy}>
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </Button>
            </div>
            <pre className="text-sm text-foreground font-bangla whitespace-pre-wrap bg-muted rounded-xl p-4 leading-relaxed">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationGenerator;
