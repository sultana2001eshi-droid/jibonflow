import { useState, useRef, useCallback } from "react";
import { Camera, Upload, Download, Printer, Save, Image, FileText, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTransition from "@/components/PageTransition";
import ToolBackButton from "@/components/tools/ToolBackButton";
import { supabase } from "@/integrations/supabase/client";
import { saveDocument } from "@/lib/documentService";
import { toast } from "sonner";

const backgrounds = [
  { value: "white", label: "সাদা", color: "#ffffff" },
  { value: "blue", label: "নীল", color: "#1a56db" },
  { value: "red", label: "লাল", color: "#dc2626" },
  { value: "gray", label: "ভিসা গ্রে", color: "#9ca3af" },
  { value: "light_blue", label: "হালকা নীল", color: "#93c5fd" },
];

const photoSizes = [
  { value: "passport", label: "পাসপোর্ট (35×45mm)" },
  { value: "visa", label: "ভিসা (50×50mm)" },
  { value: "cv", label: "সিভি (25×30mm)" },
  { value: "nid", label: "NID (30×36mm)" },
  { value: "custom_35x45", label: "35×45 mm" },
  { value: "custom_45x55", label: "45×55 mm" },
];

const copyOptions = [
  { value: "4", label: "৪ কপি" },
  { value: "8", label: "৮ কপি" },
  { value: "12", label: "১২ কপি" },
];

const dressStyles = [
  { value: "keep_original", label: "আসল রাখুন" },
  { value: "formal_shirt", label: "ফরমাল শার্ট" },
  { value: "suit", label: "স্যুট" },
  { value: "blazer", label: "ব্লেজার" },
  { value: "school_dress", label: "স্কুল ড্রেস" },
  { value: "panjabi", label: "পাঞ্জাবি" },
];

const hairStyles = [
  { value: "keep_original", label: "আসল রাখুন" },
  { value: "clean_hair", label: "পরিষ্কার চুল" },
  { value: "formal_comb", label: "ফরমাল আঁচড়ানো" },
];

const PassportPhoto = () => {
  const [step, setStep] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [background, setBackground] = useState("white");
  const [photoSize, setPhotoSize] = useState("passport");
  const [copies, setCopies] = useState("4");
  const [dressStyle, setDressStyle] = useState("keep_original");
  const [hairStyle, setHairStyle] = useState("keep_original");
  const [processing, setProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ছবি ফাইল আপলোড করুন।");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setStep(1);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const processImage = async () => {
    if (!imagePreview) return;
    setProcessing(true);
    setResultImage("");
    try {
      const { data, error } = await supabase.functions.invoke("ai-image-process", {
        body: {
          mode: "passport_photo",
          imageBase64: imagePreview,
          options: { background, photoSize, dressStyle, hairStyle },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.image) {
        setResultImage(data.image);
        setStep(6);
        toast.success("পাসপোর্ট ফটো তৈরি হয়েছে! ✨");

        // Save to ai_media_history
        await supabase.from("ai_media_history").insert({
          tool_name: "passport_photo",
          input_image: imagePreview.substring(0, 200),
          output_image: data.image.substring(0, 200),
          settings: { background, photoSize, dressStyle, hairStyle, copies } as any,
        });
      } else {
        throw new Error("AI ছবি তৈরি করতে পারেনি।");
      }
    } catch (err: any) {
      toast.error(err.message || "প্রসেসিং ব্যর্থ।");
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = (format: "jpg" | "png") => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.download = `passport-photo.${format}`;
    link.href = resultImage;
    link.click();
    toast.success(`${format.toUpperCase()} ডাউনলোড হচ্ছে...`);
  };

  const saveToDocuments = async () => {
    await saveDocument({
      doc_type: "passport_photo",
      title: `পাসপোর্ট ফটো — ${new Date().toLocaleDateString("bn-BD")}`,
      content: JSON.stringify({ background, photoSize, dressStyle, hairStyle, copies }),
    });
    toast.success("ডকুমেন্টে সেভ হয়েছে! 📂");
  };

  const printSheet = () => {
    if (!resultImage) return;
    const copyCount = parseInt(copies);
    const cols = copyCount <= 4 ? 2 : copyCount <= 8 ? 4 : 4;
    const rows = Math.ceil(copyCount / cols);
    const pw = window.open("", "_blank");
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html><head><title>Print Passport Photos</title>
      <style>
        @page { size: A4; margin: 10mm; }
        body { margin: 0; display: flex; justify-content: center; }
        .grid { display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 4mm; padding: 5mm; }
        .grid img { width: 100%; border: 0.5px dashed #ccc; }
      </style></head><body>
      <div class="grid">${Array(copyCount).fill(`<img src="${resultImage}" />`).join("")}</div>
      </body></html>`);
    pw.document.close();
    pw.onload = () => { pw.print(); pw.close(); };
  };

  const steps = [
    { label: "ছবি আপলোড", icon: Camera },
    { label: "ব্যাকগ্রাউন্ড", icon: Image },
    { label: "সাইজ", icon: FileText },
    { label: "কপি", icon: FileText },
    { label: "ড্রেস", icon: FileText },
    { label: "চুল", icon: FileText },
    { label: "ফলাফল", icon: Download },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16">
        <div className="container max-w-2xl">
          <ToolBackButton />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-heading mb-3">
              <Camera size={14} /> AI Powered
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              📸 পাসপোর্ট ফটো স্টুডিও
            </h1>
            <p className="text-sm text-muted-foreground font-bangla mt-1">AI দিয়ে প্রফেশনাল পাসপোর্ট ছবি তৈরি করুন</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto px-2">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-heading whitespace-nowrap transition-all ${
                i === step ? "bg-accent text-accent-foreground" : i < step ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
              }`}>
                {s.label}
              </div>
            ))}
          </div>

          {/* Step 0: Upload */}
          {step === 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="glass-card rounded-2xl p-10 text-center cursor-pointer border-2 border-dashed border-accent/30 hover:border-accent/60 transition-all group"
            >
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
              <Upload size={48} className="mx-auto text-accent/40 group-hover:text-accent/70 transition-colors mb-4" />
              <p className="font-bangla text-foreground font-semibold text-lg">ছবি আপলোড করুন</p>
              <p className="text-sm text-muted-foreground font-bangla mt-2">ড্র্যাগ এন্ড ড্রপ বা ক্লিক করুন</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-5 justify-center">
                <Button type="button" variant="outline" size="lg" className="gap-2 font-bangla" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  📁 গ্যালারি থেকে আপলোড
                </Button>
                <Button type="button" variant="outline" size="lg" className="gap-2 font-bangla" onClick={(e) => {
                  e.stopPropagation();
                  const camInput = document.createElement("input");
                  camInput.type = "file";
                  camInput.accept = "image/*";
                  camInput.capture = "user";
                  camInput.onchange = (ev) => {
                    const f = (ev.target as HTMLInputElement).files?.[0];
                    if (f) handleFileSelect(f);
                  };
                  camInput.click();
                }}>
                  📷 ক্যামেরা দিয়ে ছবি তুলুন
                </Button>
              </div>
              <p className="text-xs text-muted-foreground font-bangla mt-3">JPG, PNG, WEBP সাপোর্টেড</p>
            </div>
          )}

          {/* Step 1: Background */}
          {step === 1 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">🎨 ব্যাকগ্রাউন্ড নির্বাচন করুন</h3>
              <div className="grid grid-cols-5 gap-3">
                {backgrounds.map((bg) => (
                  <button key={bg.value} onClick={() => setBackground(bg.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      background === bg.value ? "ring-2 ring-accent bg-accent/10" : "bg-muted hover:bg-muted/80"
                    }`}>
                    <div className="w-10 h-10 rounded-full border-2 border-border" style={{ backgroundColor: bg.color }} />
                    <span className="text-[10px] font-bangla text-foreground">{bg.label}</span>
                  </button>
                ))}
              </div>
              {imagePreview && (
                <div className="flex justify-center">
                  <img src={imagePreview} alt="preview" className="w-32 h-40 object-cover rounded-xl border border-border" />
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={() => setStep(2)} className="flex-1">পরবর্তী <ChevronRight size={14} /></Button>
              </div>
            </div>
          )}

          {/* Step 2: Photo Size */}
          {step === 2 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">📐 ফটো সাইজ</h3>
              <Select value={photoSize} onValueChange={setPhotoSize}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {photoSizes.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={() => setStep(3)} className="flex-1">পরবর্তী <ChevronRight size={14} /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Copies */}
          {step === 3 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">📄 কপি সংখ্যা</h3>
              <div className="grid grid-cols-3 gap-3">
                {copyOptions.map((c) => (
                  <button key={c.value} onClick={() => setCopies(c.value)}
                    className={`p-4 rounded-xl text-center font-bangla font-medium transition-all ${
                      copies === c.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={() => setStep(4)} className="flex-1">পরবর্তী <ChevronRight size={14} /></Button>
              </div>
            </div>
          )}

          {/* Step 4: Dress */}
          {step === 4 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">👔 ড্রেস স্টাইল (ঐচ্ছিক)</h3>
              <div className="grid grid-cols-2 gap-3">
                {dressStyles.map((d) => (
                  <button key={d.value} onClick={() => setDressStyle(d.value)}
                    className={`p-3 rounded-xl text-sm font-bangla font-medium transition-all ${
                      dressStyle === d.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={() => setStep(5)} className="flex-1">পরবর্তী <ChevronRight size={14} /></Button>
              </div>
            </div>
          )}

          {/* Step 5: Hair + Generate */}
          {step === 5 && (
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="font-heading font-semibold text-foreground">💇 চুলের স্টাইল (ঐচ্ছিক)</h3>
              <div className="grid grid-cols-3 gap-3">
                {hairStyles.map((h) => (
                  <button key={h.value} onClick={() => setHairStyle(h.value)}
                    className={`p-3 rounded-xl text-sm font-bangla font-medium transition-all ${
                      hairStyle === h.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {h.label}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-1 text-xs font-bangla">
                <p><span className="text-muted-foreground">ব্যাকগ্রাউন্ড:</span> <span className="text-foreground font-medium">{backgrounds.find(b => b.value === background)?.label}</span></p>
                <p><span className="text-muted-foreground">সাইজ:</span> <span className="text-foreground font-medium">{photoSizes.find(s => s.value === photoSize)?.label}</span></p>
                <p><span className="text-muted-foreground">কপি:</span> <span className="text-foreground font-medium">{copyOptions.find(c => c.value === copies)?.label}</span></p>
                <p><span className="text-muted-foreground">ড্রেস:</span> <span className="text-foreground font-medium">{dressStyles.find(d => d.value === dressStyle)?.label}</span></p>
                <p><span className="text-muted-foreground">চুল:</span> <span className="text-foreground font-medium">{hairStyles.find(h => h.value === hairStyle)?.label}</span></p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(4)} className="flex-1"><ChevronLeft size={14} /> পিছনে</Button>
                <Button onClick={processImage} disabled={processing} className="flex-1 bg-gradient-to-r from-accent to-primary text-primary-foreground">
                  {processing ? <><Loader2 size={16} className="animate-spin" /> প্রসেসিং...</> : <>✨ ফটো তৈরি করুন</>}
                </Button>
              </div>
            </div>
          )}

          {/* Processing overlay */}
          {processing && (
            <div className="glass-card rounded-2xl p-10 text-center mt-6 animate-pulse">
              <Loader2 size={48} className="mx-auto text-accent animate-spin mb-4" />
              <p className="font-bangla text-foreground font-medium">AI প্রসেসিং চলছে...</p>
              <p className="text-xs text-muted-foreground font-bangla mt-1">আপনার ছবি স্টুডিও কোয়ালিটিতে রূপান্তর হচ্ছে</p>
            </div>
          )}

          {/* Step 6: Result */}
          {step === 6 && resultImage && (
            <div className="space-y-6">
              {/* Before / After */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4 text-center">🖼️ আগে ও পরে</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bangla mb-2">আসল ছবি</p>
                    <img src={imagePreview} alt="Original" className="w-full aspect-[3/4] object-cover rounded-xl border border-border" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-bangla mb-2">AI ফলাফল</p>
                    <img src={resultImage} alt="Result" className="w-full aspect-[3/4] object-cover rounded-xl border-2 border-accent/30 shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => downloadImage("jpg")} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <Download size={14} /> JPG ডাউনলোড
                </Button>
                <Button onClick={() => downloadImage("png")} variant="outline">
                  <Download size={14} /> PNG ডাউনলোড
                </Button>
                <Button onClick={printSheet} variant="outline">
                  <Printer size={14} /> প্রিন্ট শীট ({copies} কপি)
                </Button>
                <Button onClick={saveToDocuments} variant="outline">
                  <Save size={14} /> সেভ করুন
                </Button>
              </div>

              <Button variant="ghost" onClick={() => { setStep(0); setResultImage(""); setImagePreview(""); setImageFile(null); }} className="w-full text-muted-foreground">
                🔄 নতুন ছবি দিয়ে শুরু করুন
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default PassportPhoto;
