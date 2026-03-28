import { Code, Heart, ExternalLink, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import profileImg from "@/assets/md-nasrullah-profile.jpg";

const Developer = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container max-w-xl">
      {/* Profile Card */}
      <div className="glass-card gradient-border rounded-3xl p-8 sm:p-10 text-center space-y-6 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/8 rounded-full blur-[60px]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/8 rounded-full blur-[50px]" />

        {/* Profile photo */}
        <div className="flex justify-center relative z-10">
          <div className="profile-frame rounded-full p-[3px]">
            <img
              src={profileImg}
              alt="MD. NASRULLAH"
              className="w-28 h-28 rounded-full object-cover relative z-10 border-4 border-background"
            />
          </div>
        </div>

        <div className="relative z-10 space-y-2">
          <h1 className="font-bangla-display text-2xl font-bold text-foreground">MD. NASRULLAH</h1>
          <p className="text-sm text-accent font-heading">Creative Developer & Digital Innovator</p>
        </div>

        <div className="relative z-10 space-y-4 text-sm text-muted-foreground font-bangla leading-relaxed">
          <p>
            সরকারি ব্রজমোহন কলেজ, বরিশাল-এর ইংরেজি বিভাগে অধ্যয়নরত।
          </p>
          <p>
            ডিজাইন ও ডিজিটাল প্রোডাক্ট নির্মাণে আগ্রহী। মানুষের দৈনন্দিন সমস্যার স্মার্ট সমাধান তৈরিতে কাজ করছেন।
          </p>

          <div className="font-bangla-serif italic text-accent/80 bg-accent/5 rounded-xl p-4">
            "মানুষের জীবনকে সহজ করা — এটাই আমার লক্ষ্য।"
          </div>
        </div>
      </div>

      {/* Portfolio Card */}
      <a
        href="https://mdnasrullah.pro.bd"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 glass-card gradient-border rounded-2xl p-6 flex items-center gap-4 group animate-fade-in hover:border-accent/30 transition-all block"
        style={{ animationDelay: "0.15s" }}
      >
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <Globe size={22} className="text-accent" />
        </div>
        <div className="flex-1">
          <p className="font-heading font-semibold text-foreground text-sm">পোর্টফোলিও ওয়েবসাইট</p>
          <p className="text-xs text-accent">mdnasrullah.pro.bd ↗</p>
        </div>
        <ExternalLink size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
      </a>

      {/* Tech Card */}
      <div className="mt-4 glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center gap-2 mb-4">
          <Code size={16} className="text-accent" />
          <h3 className="font-heading font-semibold text-foreground text-sm">টেকনোলজি</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Tailwind CSS", "Vite"].map((tech) => (
            <span key={tech} className="text-xs bg-muted rounded-lg px-3 py-1.5 text-muted-foreground font-heading">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-accent font-heading text-sm">
          <span>Crafted with</span>
          <Heart size={14} className="fill-accent" />
          <span>in Bangladesh 🇧🇩</span>
        </div>
      </div>
    </div>
  </div>
);

export default Developer;
