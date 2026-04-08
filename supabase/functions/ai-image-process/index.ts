import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { mode, imageBase64, options } = await req.json();

    let prompt = "";

    if (mode === "passport_photo") {
      const { background, dressStyle, hairStyle, photoSize } = options || {};
      prompt = `You are an expert passport photo studio editor with years of professional experience.

ABSOLUTE RULES — NEVER BREAK:
- The person's FACE must remain 100% IDENTICAL — do NOT alter face shape, skin tone, skin texture, eyes, nose, mouth, ears, jawline, or any facial feature
- Do NOT reshape, smooth, or beautify the face in any way
- Do NOT cut off ears, hair edges, or the top of the head
- Preserve natural skin texture — no airbrushing

EDITING INSTRUCTIONS:
1. BACKGROUND: Remove the existing background completely and replace with a clean, solid ${background || "white"} background. Ensure crisp, sharp edges around hair and ears — no halos or artifacts
2. FRAMING: Crop to proper ${photoSize || "passport"} photo dimensions:
   - Head centered horizontally
   - Eyes at approximately 60% from bottom
   - Proper headroom (about 10-15% above head)
   - Shoulders visible and balanced
   - No cropping of ears or hair
3. LIGHTING: Apply even, studio-quality soft lighting. Remove harsh shadows. Ensure both sides of face are evenly lit
${dressStyle && dressStyle !== "keep_original" ? `4. CLOTHING: Replace the current outfit with a professional ${dressStyle} attire. Blend naturally at the neckline. Keep the neck and face completely untouched` : "4. CLOTHING: Keep the original clothing as-is"}
${hairStyle && hairStyle !== "keep_original" ? `5. HAIR: Make the hair look ${hairStyle === "clean_hair" ? "neat, tidy and well-groomed" : "formally combed, parted, and professionally styled"}. Do NOT change hair color or length. Keep every strand natural` : "5. HAIR: Keep the original hairstyle exactly as-is"}
6. OUTPUT: A single clean, print-ready portrait photo that looks like it was taken in a professional passport photo studio`;
    } else if (mode === "hairstyle_preview") {
      const { style, gender, hairLength } = options || {};
      prompt = `You are a world-class virtual hairstylist creating realistic salon preview images.

ABSOLUTE RULES — NEVER BREAK:
- The person's FACE must remain 100% IDENTICAL — do NOT alter face shape, skin tone, eyes, nose, mouth, ears, jawline, or any facial feature
- Preserve the exact same head angle, lighting direction, and photo perspective
- Do NOT add weird artifacts on the forehead, ears, or temple area
- The hairline transition must look completely natural

HAIRSTYLE INSTRUCTIONS:
1. Apply a realistic ${hairLength || "medium"} length "${style}" hairstyle
2. Gender context: ${gender || "universal"} — choose appropriate variation
3. Hair must blend naturally with the person's:
   - Skin tone at the hairline and temples
   - Face shape and head contour
   - Natural hair texture direction
4. Fade edges (if applicable) must look clean and realistic — like a real barber did it
5. Keep the original background exactly as-is
6. The final result should look like a real photograph — as if the person actually went to a salon and got this exact haircut
7. Pay special attention to natural-looking edges around ears, forehead, and nape of neck`;
    } else {
      throw new Error("Invalid mode. Use 'passport_photo' or 'hairstyle_preview'");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "রেট লিমিট অতিক্রম হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "ক্রেডিট শেষ। Workspace Usage থেকে ক্রেডিট যোগ করুন।" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI প্রসেসিং ব্যর্থ হয়েছে।" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const outputImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!outputImage) {
      return new Response(JSON.stringify({ error: "AI ছবি তৈরি করতে পারেনি। আবার চেষ্টা করুন।", text: textResponse }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ image: outputImage, text: textResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-image-process error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
