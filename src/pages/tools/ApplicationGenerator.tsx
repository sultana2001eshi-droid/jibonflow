import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Copy, Check, Download, Eye, RotateCcw, Printer, Save, Image } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import ToolResultSkeleton from "@/components/tools/ToolResultSkeleton";
import ApplicationPreview from "@/components/tools/ApplicationPreview";
import { saveToolHistory } from "@/lib/toolHistory";
import { saveDocument } from "@/lib/documentService";
import { exportAsPDF, exportAsJPG, printElement } from "@/lib/exportUtils";
import { toast } from "sonner";

type AppType = "leave" | "job" | "formal" | "complaint";

const generateFormal = (d: Record<string, string>, type: AppType): { full: string; short: string } => {
  const date = d.date || new Date().toLocaleDateString("bn-BD");
  const name = d.name || "...";
  const to = d.to || "সংশ্লিষ্ট কর্তৃপক্ষ";
  const institution = d.institution || "প্রতিষ্ঠানের নাম";

  const templates: Record<AppType, { full: string; short: string }> = {
    leave: {
      full: `তারিখ: ${date}\n\nবরাবর,\n${to},\n${institution}।\n\nবিষয়: ${d.days || "..."} দিনের ছুটির আবেদন।\n\nজনাব,\nবিনীত নিবেদন এই যে, আমি ${name}, আপনার প্রতিষ্ঠানের ${d.class || "..."} এর একজন নিয়মিত ছাত্র/ছাত্রী। ${d.reason || "ব্যক্তিগত কারণে"} আমি আগামী ${d.days || "..."} দিন (${d.fromDate || "..."} থেকে ${d.toDate || "..."} পর্যন্ত) উপস্থিত থাকতে পারব না।\n\nউল্লেখ্য যে, ছুটি শেষে আমি নিয়মিত উপস্থিত থাকার প্রতিশ্রুতি দিচ্ছি।\n\nঅতএব, মহোদয়ের নিকট আকুল আবেদন, আমাকে উপরোক্ত সময়ের জন্য ছুটি মঞ্জুর করে বাধিত করবেন।\n\nবিনীত নিবেদক,\n${name}\n${d.class || "..."}\n${institution}`,
      short: `বিষয়: ${d.days || "..."} দিনের ছুটি।\n${d.reason || "ব্যক্তিগত কারণে"} ${d.days} দিনের ছুটি চাই।\n— ${name}`,
    },
    job: {
      full: `তারিখ: ${date}\n\nবরাবর,\n${to},\n${institution}।\n\nবিষয়: ${d.position || "..."} পদে নিয়োগের আবেদন।\n\nজনাব,\nবিনীত নিবেদন এই যে, আমি ${name}। শিক্ষাগত যোগ্যতা: ${d.qualification || "..."}। আপনার প্রতিষ্ঠানে প্রকাশিত ${d.position || "..."} পদে আবেদন করছি।\n\nআমি বিশ্বাস করি আমার শিক্ষাগত যোগ্যতা, দক্ষতা ও কর্মস্পৃহা এই পদের জন্য উপযুক্ত। সুযোগ দিলে আমি পূর্ণ নিষ্ঠা ও দায়িত্বশীলতার সাথে কাজ করার প্রতিশ্রুতি দিচ্ছি।\n\nসংযুক্তি:\n১. জীবনবৃত্তান্ত\n২. শিক্ষাগত সনদপত্রের অনুলিপি\n৩. জাতীয় পরিচয়পত্রের অনুলিপি\n\nবিনীত নিবেদক,\n${name}\nযোগাযোগ: ${d.contact || "..."}\nঠিকানা: ${d.address || "..."}`,
      short: `বিষয়: ${d.position || "..."} পদে আবেদন।\nআমি ${name}, ${d.qualification || "..."}। উক্ত পদে আবেদন করছি।\nযোগাযোগ: ${d.contact || "..."}`,
    },
    formal: {
      full: `তারিখ: ${date}\n\nবরাবর,\n${to},\n${institution}।\n\nবিষয়: ${d.subject || "..."}।\n\nজনাব,\nসবিনয়ে জানাচ্ছি যে, ${d.body || "বিনীত নিবেদন এই যে..."}\n\nঅতএব, মহোদয়ের সদয় বিবেচনা ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য বিনীত অনুরোধ জানাচ্ছি।\n\nবিনীত নিবেদক,\n${name}\nতারিখ: ${date}`,
      short: `বিষয়: ${d.subject || "..."}।\n${d.body || "..."}\nব্যবস্থা নেওয়ার অনুরোধ।\n— ${name}`,
    },
    complaint: {
      full: `তারিখ: ${date}\n\nবরাবর,\n${to},\n${institution}।\n\nবিষয়: ${d.subject || "অভিযোগ"}।\n\nজনাব,\nসবিনয়ে জানাচ্ছি যে, ${d.body || "..."}\n\nএই সমস্যাটি দীর্ঘদিন ধরে চলছে এবং এলাকাবাসী অত্যন্ত ভোগান্তির শিকার হচ্ছেন। বিষয়টি আপনার সদয় দৃষ্টিগোচর করে দ্রুত ও কার্যকর পদক্ষেপ গ্রহণের জন্য বিনীত অনুরোধ জানাচ্ছি।\n\nবিনীত নিবেদক,\n${name}\nযোগাযোগ: ${d.contact || "..."}\nঠিকানা: ${d.address || "..."}`,
      short: `বিষয়: ${d.subject || "অভিযোগ"}।\n${d.body || "..."}\nদ্রুত ব্যবস্থা কাম্য।\n— ${name}, ${d.contact || "..."}`,
    },
  };

  return templates[type];
};

const fieldDefs: Record<AppType, { key: string; label: string; placeholder: string; multiline?: boolean }[]> = {
  leave: [
    { key: "name", label: "আপনার নাম", placeholder: "মোহাম্মদ নাসরুল্লাহ" },
    { key: "to", label: "বরাবর", placeholder: "প্রধান শিক্ষক" },
    { key: "institution", label: "প্রতিষ্ঠান", placeholder: "সরকারি ব্রজমোহন কলেজ" },
    { key: "class", label: "শ্রেণি/বিভাগ", placeholder: "ইংরেজি বিভাগ, ২য় বর্ষ" },
    { key: "days", label: "ছুটির দিন", placeholder: "৩" },
    { key: "fromDate", label: "কোন তারিখ থেকে", placeholder: "০১/০১/২০২৬" },
    { key: "toDate", label: "কোন তারিখ পর্যন্ত", placeholder: "০৩/০১/২০২৬" },
    { key: "reason", label: "কারণ", placeholder: "অসুস্থতার কারণে" },
    { key: "date", label: "আবেদনের তারিখ", placeholder: "০১/০১/২০২৬" },
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
    { key: "address", label: "ঠিকানা", placeholder: "বরিশাল" },
    { key: "date", label: "তারিখ", placeholder: "০১/০১/২০২৬" },
  ],
};

const typeLabels: Record<AppType, string> = {
  leave: "📝 ছুটির আবেদন", job: "💼 চাকরির আবেদন",
  formal: "📄 ফর্মাল দরখাস্ত", complaint: "⚠️ অভিযোগপত্র",
};

const ApplicationGenerator = () => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<AppType>("leave");
  const [data, setData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<{ full: string; short: string } | null>(null);
  const [viewMode, setViewMode] = useState<"full" | "short">("full");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requiredFields: Record<AppType, string[]> = {
    leave: ["name", "to", "institution", "reason", "days"],
    job: ["name", "to", "institution", "position", "qualification"],
    formal: ["name", "to", "institution", "subject", "body"],
    complaint: ["name", "to", "institution", "subject", "body"],
  };

  const handleGenerate = async () => {
    const missingField = requiredFields[type].find((key) => !(data[key] || "").trim());
    if (missingField) {
      setError("দরখাস্ত তৈরি করতে প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    const r = generateFormal(data, type);
    setOutput(r);
    setLoading(false);
    saveToolHistory("application", { type, ...data }, r as any);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(viewMode === "full" ? output.full : output.short);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePDF = () => {
    if (!previewRef.current) return;
    exportAsPDF(previewRef.current, `দরখাস্ত-${typeLabels[type].split(" ").pop()}`);
    toast.success("PDF ডাউনলোড হচ্ছে...");
  };

  const handleJPG = () => {
    if (!previewRef.current) return;
    exportAsJPG(previewRef.current, `দরখাস্ত-${typeLabels[type].split(" ").pop()}`);
    toast.success("JPG ডাউনলোড হচ্ছে...");
  };

  const handlePrint = () => {
    if (!previewRef.current) return;
    printElement(previewRef.current);
  };

  const handleSaveDoc = async () => {
    if (!output) return;
    await saveDocument({
      doc_type: "application",
      title: `${typeLabels[type]} — ${data.name || ""}`,
      content: JSON.stringify({ type, data, output }),
    });
    toast.success("দরখাস্ত সেভ হয়েছে!");
  };

  const resetTool = () => {
    setData({});
    setOutput(null);
    setViewMode("full");
    setCopied(false);
    setLoading(false);
    setError("");
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-2xl">
          <div className="mb-6">
            <ToolBackButton />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <FileText size={22} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">স্মার্ট দরখাস্ত বিল্ডার</h1>
                <p className="text-xs text-muted-foreground font-bangla">A4 প্রিন্ট-রেডি দরখাস্ত — PDF ও JPG এক্সপোর্ট</p>
              </div>
            </div>
          </div>

          <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(typeLabels) as AppType[]).map((t) => (
                <button key={t}
                  onClick={() => { setType(t); setData({}); setOutput(null); }}
                  className={`py-2.5 rounded-xl text-xs font-bangla font-medium transition-all ${type === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {typeLabels[t]}
                </button>
              ))}
            </div>

            {fieldDefs[type].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <label className="text-sm font-heading font-medium text-foreground">{f.label}</label>
                {f.multiline ? (
                  <Textarea placeholder={f.placeholder} value={data[f.key] || ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="font-bangla min-h-[96px]" />
                ) : (
                  <Input placeholder={f.placeholder} value={data[f.key] || ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="font-bangla" />
                )}
              </div>
            ))}

            <div className="flex gap-3">
              <Button onClick={handleGenerate} disabled={loading} variant="hero" className="flex-1" size="lg">
                <Eye size={16} /> {loading ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
              </Button>
              <Button onClick={resetTool} variant="outline" size="lg">
                <RotateCcw size={16} /> রিসেট
              </Button>
            </div>

            {error && <p className="text-sm font-bangla text-destructive">{error}</p>}
          </div>

          {loading && <ToolResultSkeleton cards={1} />}

          {output && !loading && (
            <div className="mt-6 space-y-4">
              {/* Text view */}
              <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-foreground">আপনার দরখাস্ত</h3>
                  <Button variant="ghost" size="sm" onClick={copy} className="text-xs">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    {copied ? "কপি হয়েছে" : "কপি"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("full")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bangla font-medium transition-all ${viewMode === "full" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    📄 সম্পূর্ণ ভার্সন
                  </button>
                  <button onClick={() => setViewMode("short")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bangla font-medium transition-all ${viewMode === "short" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    ⚡ সংক্ষিপ্ত ভার্সন
                  </button>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border/30 shadow-inner">
                  <pre className="text-sm text-foreground font-bangla whitespace-pre-wrap leading-[1.8]">
                    {viewMode === "full" ? output.full : output.short}
                  </pre>
                </div>
              </div>

              {/* A4 Preview */}
              <div className="glass-card gradient-border rounded-2xl p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground">A4 প্রিন্ট প্রিভিউ</h3>
                <div className="border border-border/30 rounded-xl overflow-hidden shadow-lg bg-white">
                  <ApplicationPreview
                    ref={previewRef}
                    data={{ text: output.full, type, typeLabel: typeLabels[type] }}
                  />
                </div>
              </div>

              {/* Export buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button onClick={handlePDF} variant="outline" size="sm" className="text-xs">
                  <Download size={14} /> PDF
                </Button>
                <Button onClick={handleJPG} variant="outline" size="sm" className="text-xs">
                  <Image size={14} /> JPG
                </Button>
                <Button onClick={handlePrint} variant="outline" size="sm" className="text-xs">
                  <Printer size={14} /> প্রিন্ট
                </Button>
                <Button onClick={handleSaveDoc} variant="outline" size="sm" className="text-xs">
                  <Save size={14} /> সেভ করুন
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ApplicationGenerator;
