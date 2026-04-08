import { useState, useEffect } from "react";
import { FileText, Receipt, Trash2, RotateCcw, FolderOpen, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import BengaliPattern from "@/components/BengaliPattern";
import { getDocuments, deleteDocument } from "@/lib/documentService";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const Documents = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

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

  const filtered = (filter === "all" ? docs : docs.filter((d) => d.doc_type === filter))
    .filter((d) => !search || d.title.toLowerCase().includes(search.toLowerCase()));

  const filterOptions = [
    { key: "all", label: "সবগুলো", emoji: "📋" },
    { key: "cash_memo", label: "ক্যাশ মেমো", emoji: "🧾" },
    { key: "application", label: "দরখাস্ত", emoji: "📄" },
    { key: "passport_photo", label: "পাসপোর্ট ফটো", emoji: "📸" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />
        <BengaliPattern opacity={0.03} />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-accent/10 rounded-full blur-[120px] animate-orb-pulse pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-[hsl(var(--gradient-indigo)/0.08)] rounded-full blur-[120px] animate-orb-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="container max-w-5xl relative">
          {/* Header */}
          <motion.div
            className="text-center mb-10 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 text-xs font-heading text-accent tracking-[0.2em] uppercase bg-accent/5 px-4 py-2 rounded-full border border-accent/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Sparkles size={12} />
              Documents
            </motion.span>
            <h1 className="font-bangla-hero text-3xl sm:text-4xl font-extrabold text-foreground">
              সেভ করা <span className="gradient-text">ডকুমেন্টস</span>
            </h1>
            <p className="text-muted-foreground font-bangla max-w-md mx-auto text-sm leading-relaxed">
              আপনার সব ক্যাশ মেমো, দরখাস্ত ও পাসপোর্ট ফটো এখানে সংরক্ষিত
            </p>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div
            className="mb-8 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ডকুমেন্ট খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-card/60 backdrop-blur-sm border-border/40 font-bangla focus:border-accent/40 focus:ring-accent/20"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bangla font-medium transition-all duration-300 ${
                    filter === f.key
                      ? "bg-accent text-accent-foreground shadow-md shadow-accent/20 scale-105"
                      : "bg-card/60 backdrop-blur-sm text-muted-foreground border border-border/30 hover:border-accent/20 hover:text-foreground"
                  }`}
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse border border-border/20">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-16" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-accent/10 flex items-center justify-center">
                <FolderOpen size={36} className="text-accent/40" />
              </div>
              <p className="text-foreground font-bangla font-semibold text-lg mb-1">কোনো ডকুমেন্ট পাওয়া যায়নি</p>
              <p className="text-sm text-muted-foreground font-bangla max-w-xs mx-auto">
                ক্যাশ মেমো বা দরখাস্ত তৈরি করে সেভ করলে এখানে দেখা যাবে
              </p>
            </motion.div>
          )}

          {/* Document cards */}
          {!loading && filtered.length > 0 && (
            <>
              <motion.p className="text-xs text-muted-foreground font-bangla mb-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                মোট {filtered.length}টি ডকুমেন্ট
              </motion.p>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                variants={stagger}
                initial="hidden"
                animate="show"
              >
                {filtered.map((doc) => {
                  const meta = docTypeLabel[doc.doc_type] || docTypeLabel.application;
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={doc.id}
                      variants={fadeUp}
                      className="tool-card-premium p-5 flex flex-col gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider text-accent font-heading font-semibold">{meta.label}</span>
                          <h3 className="text-sm font-heading font-semibold text-foreground truncate mt-0.5">{doc.title}</h3>
                          <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                            {new Date(doc.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto pt-2 border-t border-border/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs flex-1 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 size={12} /> মুছুন
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}

          {/* Refresh button */}
          {!loading && docs.length > 0 && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDocs}
                className="text-xs font-bangla gap-2 border-accent/20 hover:border-accent/40 hover:bg-accent/5"
              >
                <RotateCcw size={12} /> রিফ্রেশ করুন
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Documents;
