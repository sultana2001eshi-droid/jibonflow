import { supabase } from "@/integrations/supabase/client";

export async function saveDocument(doc: {
  doc_type: string;
  title: string;
  content?: string;
  download_url?: string;
}) {
  const { data, error } = await supabase.from("saved_documents").insert(doc).select().single();
  if (error) console.error("Document save error:", error.message);
  return data;
}

export async function getDocuments(limit = 50) {
  const { data, error } = await supabase
    .from("saved_documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Documents fetch error:", error.message);
    return [];
  }
  return data || [];
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from("saved_documents").delete().eq("id", id);
  if (error) console.error("Document delete error:", error.message);
  return !error;
}

export async function saveShopProfile(profile: {
  shop_name: string;
  owner_name?: string;
  phone?: string;
  address?: string;
  logo_url?: string;
}) {
  // Check if a profile already exists
  const { data: existing } = await supabase
    .from("shop_profiles")
    .select("*")
    .limit(1)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("shop_profiles")
      .update(profile)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) console.error("Shop profile update error:", error.message);
    return data;
  }

  const { data, error } = await supabase.from("shop_profiles").insert(profile).select().single();
  if (error) console.error("Shop profile save error:", error.message);
  return data;
}

export async function getShopProfile() {
  const { data, error } = await supabase
    .from("shop_profiles")
    .select("*")
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") console.error("Shop profile fetch error:", error.message);
  return data;
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  const r = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `INV-${y}${m}${d}-${r}`;
}
