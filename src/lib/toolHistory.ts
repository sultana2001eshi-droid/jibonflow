import { supabase } from "@/integrations/supabase/client";

export async function saveToolHistory(
  toolName: string,
  inputData: Record<string, unknown>,
  outputData: Record<string, unknown>
) {
  try {
    const { error } = await supabase.from("tool_history").insert({
      tool_name: toolName,
      input_data: inputData as any,
      output_data: outputData as any,
    });
    if (error) console.error("History save error:", error.message);
  } catch (e) {
    console.error("History save failed:", e);
  }
}

export async function getToolHistory(limit = 50) {
  const { data, error } = await supabase
    .from("tool_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("History fetch error:", error.message);
    return [];
  }
  return data || [];
}

export async function deleteToolHistory(id: string) {
  const { error } = await supabase.from("tool_history").delete().eq("id", id);
  if (error) console.error("History delete error:", error.message);
  return !error;
}

export async function toggleFavorite(id: string, current: boolean) {
  const { error } = await supabase
    .from("tool_history")
    .update({ is_favorite: !current })
    .eq("id", id);
  if (error) console.error("Favorite toggle error:", error.message);
  return !error;
}

export const toolNameMap: Record<string, string> = {
  budget: "স্মার্ট বাজেট AI",
  meal: "মিল ইন্টেলিজেন্স",
  caption: "ক্যাপশন ল্যাব",
  business: "বিজনেস প্রফিট এনালাইসিস",
  cashmemo: "ক্যাশ মেমো / ইনভয়েস",
  application: "দরখাস্ত বিল্ডার",
  decision: "ডিসিশন ইঞ্জিন",
  age: "এজ ও টাইম সিস্টেম",
};

export const toolIconGradient: Record<string, string> = {
  budget: "from-emerald-400 to-teal-500",
  meal: "from-orange-400 to-red-500",
  caption: "from-pink-400 to-rose-500",
  business: "from-fuchsia-400 to-purple-500",
  cashmemo: "from-purple-400 to-pink-500",
  application: "from-blue-400 to-indigo-500",
  decision: "from-amber-400 to-yellow-500",
  age: "from-violet-400 to-purple-500",
};
