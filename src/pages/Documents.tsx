import { useState, useEffect } from "react";
import { FileText, Receipt, Trash2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { getDocuments, deleteDocument } from "@/lib/documentService";
import { toast } from "sonner";

interface Doc {
  id: string;
  doc_type: string;
  title: string;
  content: string | null;
  created_at: string;
}

const docTypeLabel: Record<string, { label: string; icon: typeof Receipt; gradient: string }> = {
  cash_memo: { label: "ক্যাশ মেমো", icon: Receipt, gradient: "from-purple-400 to-pink-500" },
  application: { label: "দরখাস্ত", icon: FileText, gradient: "from-blue-400 to-indigo-500" },
  passport_photo: { label: "পাসপোর্ট ফটো", icon: FileText, gradient: "from-sky-400 to-cyan-500" },
};

const Documents = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchDocs = async () => {
    setLoading(true);
    const data = await getDocuments(100);
    setDocs(data as Doc[]);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    setDocs(docs.filter((d) => d.id !== id));
    toast.success("ডকুমেন্ট মুছে ফেলা হয়েছে।");
  };

  const filtered = filter === "all" ? docs : docs.filter((d) => d.doc_type === filter);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground">📂 সেভ করা ডকুমেন্টস</h1>
            <p className="text-sm text-muted-foreground font-bangla">আপনার সব ক্যাশ মেমো ও দরখাস্ত এখানে</p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "all", label: "সবগুলো" },
              { key: "cash_memo", label: "🧾 ক্যাশ মেমো" },
              { key: "application", label: "📄 দরখাস্ত" },
              { key: "passport_photo", label: "📸 পাসপোর্ট ফটো" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bangla font-medium transition-all ${filter === f.key ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {f.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <FileText size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-bangla">কোনো ডকুমেন্ট পাওয়া যায়নি।</p>
              <p className="text-xs text-muted-foreground font-bangla mt-1">ক্যাশ মেমো বা দরখাস্ত তৈরি করে সেভ করুন।</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((doc) => {
                const meta = docTypeLabel[doc.doc_type] || docTypeLabel.application;
                const Icon = meta.icon;
                return (
                  <div key={doc.id} className="glass-card gradient-border rounded-2xl p-5 flex flex-col gap-3 group hover:shadow-lg transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-heading">{meta.label}</span>
                        <h3 className="text-sm font-heading font-semibold text-foreground truncate">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground font-bangla">
                          {new Date(doc.created_at).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="ghost" size="sm" className="text-xs flex-1 text-destructive" onClick={() => handleDelete(doc.id)}>
                        <Trash2 size={12} /> মুছুন
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && docs.length > 0 && (
            <div className="mt-6 text-center">
              <Button variant="ghost" size="sm" onClick={fetchDocs} className="text-xs text-muted-foreground">
                <RotateCcw size={12} /> রিফ্রেশ করুন
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Documents;
