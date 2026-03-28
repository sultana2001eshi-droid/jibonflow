import { Code, Heart, ExternalLink } from "lucide-react";
import profileImg from "@/assets/md-nasrullah-profile.jpg";

const Developer = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container max-w-lg">
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center space-y-6 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/8 rounded-full blur-3xl" />

        {/* Profile photo */}
        <div className="flex justify-center">
          <div className="profile-frame rounded-full p-[3px]">
            <img
              src={profileImg}
              alt="MD. NASRULLAH"
              className="w-24 h-24 rounded-full object-cover relative z-10 border-4 border-background"
            />
          </div>
        </div>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
          <Code size={24} className="text-accent" />
        </div>

        <h1 className="font-bangla-display text-2xl font-bold text-foreground">ডেভেলপার</h1>

        <div className="space-y-4 text-sm text-muted-foreground font-bangla leading-relaxed">
          <p>
            JibonFlow তৈরি করেছেন <span className="text-foreground font-medium">MD. NASRULLAH</span>।
          </p>
          <p className="font-bangla-serif italic">
            "মানুষের দৈনন্দিন সমস্যার স্মার্ট সমাধান তৈরিতে কাজ করছেন।"
          </p>
          <p>
            এই অ্যাপটি React, TypeScript, এবং Tailwind CSS দিয়ে তৈরি। সম্পূর্ণ ক্লায়েন্ট-সাইড।
          </p>

          <a
            href="https://mdnasrullah.pro.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-heading font-medium"
          >
            <ExternalLink size={14} />
            mdnasrullah.pro.bd
          </a>

          <div className="flex items-center justify-center gap-2 text-accent font-heading font-medium pt-2">
            <span>Crafted with</span>
            <Heart size={16} className="fill-accent" />
            <span>in Bangladesh 🇧🇩</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Developer;
