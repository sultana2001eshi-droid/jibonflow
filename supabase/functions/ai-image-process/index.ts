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
      prompt = `You are a professional passport photo editor. Edit this person's photo for a ${photoSize || "passport"} photo.

CRITICAL RULES:
- DO NOT change the person's face, skin tone, facial features, or identity in ANY way
- Keep the face EXACTLY as it is
- Only modify background, clothing, and hair styling as specified

Instructions:
1. Remove the existing background completely
2. Replace with a clean, solid ${background || "white"} background
3. Crop to proper passport/ID photo framing (head centered, proper margins)
${dressStyle && dressStyle !== "keep_original" ? `4. Add a professional ${dressStyle} outfit (formal wear), keeping the neck and face area natural` : "4. Keep the original clothing"}
${hairStyle && hairStyle !== "keep_original" ? `5. Make the hair look ${hairStyle === "clean_hair" ? "neat and tidy" : "formally combed and professional"}` : "5. Keep the original hairstyle"}
6. Ensure proper lighting - even, studio-quality lighting on the face
7. The final image should look like a professional studio passport photo
8. Output a single portrait photo with clean edges`;
    } else if (mode === "hairstyle_preview") {
      const { style, gender, hairLength } = options || {};
      prompt = `You are a professional hairstyle preview generator. Apply a ${style} hairstyle to this person's photo.

CRITICAL RULES:
- DO NOT change the person's face, skin tone, facial features, or identity
- Keep the face EXACTLY as it is
- Only modify the hairstyle

Instructions:
1. Apply a ${hairLength || "medium"} length ${style} hairstyle suitable for ${gender || "universal"} look
2. Make the hairstyle look natural and realistic on this person
3. Keep the original background
4. Ensure the hairstyle blends naturally with the person's face shape and skin tone
5. The result should look like a realistic preview of how they would look with this hairstyle`;
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
