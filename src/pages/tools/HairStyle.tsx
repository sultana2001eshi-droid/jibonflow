import { useState, useRef, useCallback } from "react";
import { Scissors, Upload, Download, Loader2, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const hairLengths = [
  { value: "short", label: "ছোট" },
  { value: "medium", label: "মাঝারি" },
  { value: "long", label: "লম্বা" },
];

const styleCounts = [
  { value: 1, label: "১টি স্টাইল" },
  { value: 3, label: "৩টি স্টাইল" },
  { value: 6, label: "৬টি স্টাইল" },
];

const hairTypes = [
  { value: "fade", label: "ফেড", emoji: "💈" },
  { value: "undercut", label: "আন্ডারকাট", emoji: "✂️" },
  { value: "messy", label: "মেসি", emoji: "🌊" },
  { value: "korean", label: "কোরিয়ান", emoji: "🇰🇷" },
  { value: "formal", label: "ফরমাল", emoji: "👔" },
  { value: "curly", label: "কার্লি", emoji: "🌀" },
  { value: "bridal", label: "ব্রাইডাল", emoji: "👰" },
  { value: "hijab_front", label: "হিজাব ফ্রন্ট", emoji: "🧕" },
];

const genderOptions = [
  { value: "male", label: "পুরুষ" },
  { value: "female", label: "মহিলা" },
  { value: "universal", label: "ইউনিভার্সাল" },
];

const HairStyle = () => {
  const [step, setStep] = useState(0);
  const [imagePreview, setImagePreview] = useState("");
  const [hairLength, setHairLength] = useState("medium");
  const [styleCount, setStyleCount] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["fade"]);
  const [gender, setGender] = useState("universal");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ style: string; image: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("শুধুমাত্র ছবি আপলোড করুন।"); return; }
    const reader = new FileReader();
    reader.onload = (e) => { setImagePreview(e.target?.result as string); setStep(1); };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(style)) return prev.filter((s) => s !== style);
      if (prev.length >= styleCount) return [...prev.slice(1), style];
      return [...prev, style];
    });
  };

  const processStyles = async () => {
    if (!imagePreview || selectedStyles.length === 0) return;
    setProcessing(true);
    setResults([]);
    const newResults: { style: string; image: string }[] = [];

    for (const style of selectedStyles) {
      try {
        const { data, error } = await supabase.functions.invoke("ai-image-process", {
          body: {
            mode: "hairstyle_preview",
            imageBase64: imagePreview,
            options: { style, gender, hairLength },
          },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        if (data?.image) {
          newResults.push({ style, image: data.image });
          setResults([...newResults]);
        }
      } catch (err: any) {
        toast.error(`${style} স্টাইল তৈরি ব্যর্থ।`);
      }
    }

    if (newResults.length > 0) {
      setStep(5);
      toast.success(`${newResults.length}টি হেয়ারস্টাইল প্রিভিউ তৈরি হয়েছে! ✨`);
      // Save to ai_media_history
      await supabase.from("ai_media_history").insert({
        tool_name: "hairstyle_preview",
        input_image: imagePreview.substring(0, 200),
        output_image: newResults[0]?.image.substring(0, 200) || null,
        settings: { hairLength, selectedStyles, gender, styleCount } as any,
      });
    }
    setProcessing(false);
  };

  const downloadResult = (image: string, style: string) => {
    const link = document.createElement("a");
    link.download = `hairstyle-${style}.jpg`;
    link.href = image;
    link.click();
    toast.success("ডাউনলোড হচ্ছে...");
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16">
        <div className="container max-w-2xl">
          <ToolBackButton />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading mb-3">
              <Scissors size={14} /> AI Powered
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              💇 হেয়ারস্টাইল প্রিভিউ
            </h1>
            <p className="text-sm text-muted-foreground font-bangla mt-1">AI দিয়ে নতুন হেয়ারস্টাইল দেখে নিন</p>
          </div>

          {/* Step 0: Upload */}
          {step === 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="glass-card rounded-2xl p-10 text-center cursor-pointer border-2 border-dashed border-accent/30 hover:border-accent/60 transition-all group"
            >
              <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
              <Upload size={48} className="mx-auto text-accent/40 group-hover:text-accent/70 transition-colors mb-4" />
              <p className="font-bangla text-foreground font-medium">আপনার ছবি আপলোড করুন</p>
              <p className="text-xs text-muted-foreground font-bangla mt-1">সামনে থেকে তোলা পরিষ্কার ছবি সবচেয়ে ভালো কাজ করে</p>
            </div>
          )}

          {/* Step 1: Gender + Length */}
          {step === 1 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="flex justify-center">
                <img src={imagePreview} alt="preview" className="w-28 h-28 object-cover rounded-full border-2 border-accent/30" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3">🧑 জেন্ডার</h3>
                <div className="grid grid-cols-3 gap-3">
                  {genderOptions.map((g) => (
                    <button key={g.value} onClick={() => setGender(g.value)}
                      className={`p-3 rounded-xl text-sm font-bangla font-medium transition-all ${
                        gender === g.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}>{g.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3">📏 চুলের দৈর্ঘ্য</h3>
                <div className="grid grid-cols-3 gap-3">
                  {hairLengths.map((h) => (
                    <button key={h.value} onClick={() => setHairLength(h.value)}
                      className={`p-3 rounded-xl text-sm font-bangla font-medium transition-all ${
                        hairLength === h.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                      }`}>{h.label}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={() => setStep(2)} className="flex-1">পরবর্তী <ChevronRight size={14} /></Button>
              </div>
            </div>
          )}

          {/* Step 2: Style count */}
          {step === 2 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">🔢 কতটি স্টাইল দেখতে চান?</h3>
              <div className="grid grid-cols-3 gap-3">
                {styleCounts.map((s) => (
                  <button key={s.value} onClick={() => { setStyleCount(s.value); setSelectedStyles(prev => prev.slice(0, s.value)); }}
                    className={`p-4 rounded-xl text-center font-bangla font-medium transition-all ${
                      styleCount === s.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}>{s.label}</button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={() => setStep(3)} className="flex-1">পরবর্তী <ChevronRight size={14} /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Select styles */}
          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">✂️ স্টাইল নির্বাচন করুন ({selectedStyles.length}/{styleCount})</h3>
              <div className="grid grid-cols-2 gap-3">
                {hairTypes.map((h) => (
                  <button key={h.value} onClick={() => toggleStyle(h.value)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedStyles.includes(h.value) ? "bg-accent text-accent-foreground ring-2 ring-accent" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    <span className="text-lg">{h.emoji}</span>
                    <p className="text-sm font-bangla font-medium mt-1">{h.label}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={processStyles} disabled={processing || selectedStyles.length === 0}
                  className="flex-1 bg-gradient-to-r from-accent to-primary text-primary-foreground">
                  {processing ? <><Loader2 size={16} className="animate-spin" /> তৈরি হচ্ছে...</> : <>✨ স্টাইল তৈরি করুন</>}
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {processing && (
            <div className="mt-6 space-y-4">
              <div className="glass-card rounded-2xl p-8 text-center animate-pulse">
                <Loader2 size={48} className="mx-auto text-accent animate-spin mb-4" />
                <p className="font-bangla text-foreground font-medium">AI হেয়ারস্টাইল তৈরি করছে...</p>
                <p className="text-xs text-muted-foreground font-bangla mt-1">{results.length}/{selectedStyles.length} সম্পন্ন</p>
              </div>
              {results.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {results.map((r) => (
                    <div key={r.style} className="glass-card rounded-xl overflow-hidden">
                      <img src={r.image} alt={r.style} className="w-full aspect-[3/4] object-cover" />
                      <p className="text-center text-xs font-bangla py-2 text-foreground">{hairTypes.find(h => h.value === r.style)?.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && !processing && results.length > 0 && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4 text-center">🖼️ আগে ও পরে তুলনা</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bangla mb-2">আসল</p>
                    <img src={imagePreview} alt="Original" className="w-full aspect-[3/4] object-cover rounded-xl border border-border" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bangla mb-2">AI প্রিভিউ</p>
                    <img src={results[0].image} alt="Result" className="w-full aspect-[3/4] object-cover rounded-xl border-2 border-accent/30" />
                  </div>
                </div>
              </div>

              {results.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {results.map((r) => (
                    <div key={r.style} className="glass-card rounded-xl overflow-hidden group">
                      <img src={r.image} alt={r.style} className="w-full aspect-[3/4] object-cover" />
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-xs font-bangla text-foreground font-medium">
                          {hairTypes.find(h => h.value === r.style)?.emoji} {hairTypes.find(h => h.value === r.style)?.label}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => downloadResult(r.image, r.style)} className="h-7 w-7 p-0">
                          <Download size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {results.map((r) => (
                  <Button key={r.style} onClick={() => downloadResult(r.image, r.style)} variant="outline" className="text-xs">
                    <Download size={12} /> {hairTypes.find(h => h.value === r.style)?.label}
                  </Button>
                ))}
              </div>

              <Button variant="ghost" onClick={() => { setStep(0); setResults([]); setImagePreview(""); }}
                className="w-full text-muted-foreground">
                <RotateCcw size={14} /> নতুন ছবি দিয়ে শুরু করুন
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default HairStyle;
