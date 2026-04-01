import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon, Trash2, Star, Clock, Wallet, UtensilsCrossed, FileText, Package, PenTool, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { getToolHistory, deleteToolHistory, toggleFavorite, toolNameMap, toolIconGradient } from "@/lib/toolHistory";
import { toast } from "@/hooks/use-toast";

const toolIcons: Record<string, React.ElementType> = {
  budget: Wallet,
  meal: UtensilsCrossed,
  caption: PenTool,
  business: Package,
  application: FileText,
  decision: Target,
  age: Clock,
};

type HistoryItem = {
  id: string;
  tool_name: string;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown>;
  is_favorite: boolean;
  created_at: string;
};

const HistoryPage = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const data = await getToolHistory(100);
    setItems(data as HistoryItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    const ok = await deleteToolHistory(id);
    if (ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast({ title: "মুছে ফেলা হয়েছে", description: "হিস্ট্রি আইটেম মুছে ফেলা হয়েছে।" });
    }
  };

  const handleFavorite = async (id: string, current: boolean) => {
    const ok = await toggleFavorite(id, current);
    if (ok) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_favorite: !current } : i)));
    }
  };

  const filtered = filter === "favorites" ? items.filter((i) => i.is_favorite) : items;

  const toolPath: Record<string, string> = {
    budget: "/tools/budget",
    meal: "/tools/meal",
    caption: "/tools/caption",
    business: "/tools/business",
    application: "/tools/application",
    decision: "/tools/decision",
    age: "/tools/time",
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-2xl">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-[hsl(var(--gradient-indigo))] flex items-center justify-center">
                <HistoryIcon size={22} className="text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground">হিস্ট্রি</h1>
                <p className="text-xs text-muted-foreground font-bangla">আপনার টুল ব্যবহারের ইতিহাস</p>
              </div>
            </div>

            <div className="flex gap-2">
              {(["all", "favorites"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bangla font-medium transition-all ${filter === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {f === "all" ? "সব" : "⭐ ফেভারিট"}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4">
              <HistoryIcon size={48} className="text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground font-bangla">
                {filter === "favorites" ? "কোনো ফেভারিট নেই" : "এখনো কোনো হিস্ট্রি নেই"}
              </p>
              <Button variant="hero" onClick={() => navigate("/tools")}>টুলস ব্যবহার শুরু করুন</Button>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((item) => {
              const Icon = toolIcons[item.tool_name] || HistoryIcon;
              const gradient = toolIconGradient[item.tool_name] || "from-gray-400 to-gray-500";
              const name = toolNameMap[item.tool_name] || item.tool_name;
              const date = new Date(item.created_at).toLocaleDateString("bn-BD", {
                year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
              });

              return (
                <div key={item.id} className="glass-card rounded-2xl p-5 group">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-semibold text-foreground text-sm">{name}</h3>
                        <span className="text-[10px] text-muted-foreground font-bangla">{date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-bangla mt-1 truncate">
                        {JSON.stringify(item.input_data).slice(0, 80)}...
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate(toolPath[item.tool_name] || "/tools")}>
                          আবার ব্যবহার করুন
                        </Button>
                        <button onClick={() => handleFavorite(item.id, item.is_favorite)}
                          className={`p-1.5 rounded-lg transition-colors ${item.is_favorite ? "text-accent" : "text-muted-foreground hover:text-accent"}`}>
                          <Star size={14} fill={item.is_favorite ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HistoryPage;
