import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { FileText, Copy, Check, ArrowLeft, Download, Eye } from "lucide-react";

type AppType = "leave" | "job" | "formal" | "complaint";

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
বিনীত নিবেদন এই যে, আমি ${d.name || "..."}, ${d.qualification || "..."}। আপনার প্রতিষ্ঠানে ${d.position || "..."} পদে কাজ করার আগ্রহ প্রকাশ করছি।

আমি বিশ্বাস করি আমার শিক্ষাগত যোগ্যতা ও দক্ষতা এই পদের জন্য উপযুক্ত। সুযোগ দিলে আমি পূর্ণ নিষ্ঠা ও দায়িত্বশীলতার সাথে কাজ করার প্রতিশ্রুতি দিচ্ছি।

বিনীত,
${d.name || "..."}
যোগাযোগ: ${d.contact || "..."}
ঠিকানা: ${d.address || "..."}`,

  formal: (d) => `তারিখ: ${d.date || "..."}

বরাবর,
${d.to || "সংশ্লিষ্ট কর্তৃপক্ষ"},
${d.institution || "প্রতিষ্ঠানের নাম"}।

বিষয়: ${d.subject || "..."}।

জনাব,
${d.body || "বিনীত নিবেদন এই যে..."}

অতএব, মহোদয়ের সদয় বিবেচনা ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত অনুরোধ জানাচ্ছি।

বিনীত,
${d.name || "..."}`,

  complaint: (d) => `তারিখ: ${d.date || "..."}

বরাবর,
${d.to || "সংশ্লিষ্ট কর্তৃপক্ষ"},
${d.institution || "প্রতিষ্ঠানের নাম"}।

বিষয়: ${d.subject || "অভিযোগ"}।

জনাব,
সবিনয় জানাচ্ছি যে, ${d.body || "..."}

এ বিষয়ে দ্রুত ও কার্যকর পদক্ষেপ গ্রহণের জন্য বিনীত অনুরোধ জানাচ্ছি। আশা করি, যথাযথ কর্তৃপক্ষ বিষয়টি গুরুত্বের সাথে বিবেচনা করবেন।

বিনীত,
${d.name || "..."}
যোগাযোগ: ${d.contact || "..."}`,
};

const fields: Record<AppType, { key: string; label: string; placeholder: string; multiline?: boolean }[]> = {
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
    { key: "address", label: "ঠিকানা", placeholder: "বরিশাল, বাংলাদেশ" },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
  formal: [
    { key: "name", label: "আপনার নাম", placeholder: "মোহাম্মদ নাসরুল্লাহ" },
    { key: "to", label: "বরাবর", placeholder: "সংশ্লিষ্ট কর্তৃপক্ষ" },
    { key: "institution", label: "প্রতিষ্ঠান", placeholder: "প্রতিষ্ঠানের নাম" },
    { key: "subject", label: "বিষয়", placeholder: "সনদপত্র প্রাপ্তির আবেদন" },
    { key: "body", label: "মূল বক্তব্য", placeholder: "বিনীত নিবেদন এই যে...", multiline: true },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
  complaint: [
    { key: "name", label: "আপনার নাম", placeholder: "মোহাম্মদ নাসরুল্লাহ" },
    { key: "to", label: "বরাবর", placeholder: "চেয়ারম্যান / ইউএনও" },
    { key: "institution", label: "প্রতিষ্ঠান / কর্তৃপক্ষ", placeholder: "পৌরসভা / উপজেলা কার্যালয়" },
    { key: "subject", label: "অভিযোগের বিষয়", placeholder: "রাস্তা মেরামত" },
    { key: "body", label: "বিস্তারিত বর্ণনা", placeholder: "আমাদের এলাকায় রাস্তার বেহাল অবস্থায়...", multiline: true },
    { key: "contact", label: "যোগাযোগ", placeholder: "০১XXXXXXXXX" },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
};

const typeLabels: Record<AppType, string> = {
  leave: "ছুটির আবেদন",
  job: "চাকরির আবেদন",
  formal: "ফর্মাল দরখাস্ত",
  complaint: "অভিযোগপত্র",
};

const ApplicationGenerator = () => {
  const [type, setType] = useState<AppType>("leave");
  const [data, setData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generate = () => {
    setOutput(templates[type](data));
    setShowPreview(true);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${typeLabels[type]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-lg">
        <div className="mb-6 animate-fade-in">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors font-heading mb-4">
            <ArrowLeft size={16} /> টুলস
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <FileText size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">দরখাস্ত বিল্ডার</h1>
              <p className="text-xs text-muted-foreground font-bangla">সুন্দর ফরম্যাটেড বাংলা আবেদন তৈরি করুন</p>
            </div>
          </div>
        </div>

        <div className="glass-card gradient-border rounded-2xl p-6 space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Type selection */}
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(typeLabels) as AppType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setType(t); setData({}); setOutput(""); setShowPreview(false); }}
                className={`py-2.5 rounded-xl text-xs font-bangla font-medium transition-all ${
                  type === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {typeLabels[t]}
              </button>
            ))}
          </div>

          {/* Fields */}
          {fields[type].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-sm font-heading font-medium text-foreground">{f.label}</label>
              {f.multiline ? (
                <textarea
                  placeholder={f.placeholder}
                  value={data[f.key] || ""}
                  onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-bangla ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y"
                />
              ) : (
                <Input
                  placeholder={f.placeholder}
                  value={data[f.key] || ""}
                  onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                  className="font-bangla"
                />
              )}
            </div>
          ))}

          <Button onClick={generate} variant="hero" className="w-full" size="lg">
            <Eye size={16} /> তৈরি করুন ও প্রিভিউ দেখুন
          </Button>
        </div>

        {/* Output */}
        {showPreview && output && (
          <div className="mt-6 glass-card gradient-border rounded-2xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground">আপনার দরখাস্ত</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={copy} className="text-xs">
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copied ? "কপি হয়েছে" : "কপি"}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadTxt} className="text-xs">
                  <Download size={14} /> ডাউনলোড
                </Button>
              </div>
            </div>
            <div className="bg-white dark:bg-muted/30 rounded-xl p-6 border border-border/30 shadow-inner">
              <pre className="text-sm text-foreground font-bangla whitespace-pre-wrap leading-[1.8]">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationGenerator;
