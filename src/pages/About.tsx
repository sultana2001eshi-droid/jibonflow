import { ExternalLink, MapPin, BookOpen, Lightbulb } from "lucide-react";
import profileImg from "@/assets/md-nasrullah-profile.jpg";

const About = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container max-w-2xl">
      {/* Profile Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          {/* Profile image */}
          <div className="flex justify-center">
            <div className="profile-frame rounded-full p-[3px]">
              <img
                src={profileImg}
                alt="MD. NASRULLAH"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover relative z-10 border-4 border-background"
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-bold text-foreground">MD. NASRULLAH</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span className="font-bangla">বরিশাল, বাংলাদেশ</span>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <div className="flex items-start gap-3 text-left glass-card rounded-xl p-4">
              <BookOpen size={18} className="text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground font-bangla leading-relaxed">
                সরকারি ব্রজমোহন কলেজ, বরিশাল-এর ইংরেজি বিভাগে অধ্যয়নরত।
              </p>
            </div>
            <div className="flex items-start gap-3 text-left glass-card rounded-xl p-4">
              <Lightbulb size={18} className="text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground font-bangla leading-relaxed">
                ডিজাইন ও ডিজিটাল প্রোডাক্ট নির্মাণে আগ্রহী। মানুষের দৈনন্দিন সমস্যার স্মার্ট সমাধান তৈরিতে কাজ করছেন।
              </p>
            </div>
          </div>

          {/* Portfolio link */}
          <a
            href="https://mdnasrullah.pro.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 glass-card-hover rounded-xl p-4 text-accent font-heading font-medium text-sm"
          >
            <ExternalLink size={16} />
            mdnasrullah.pro.bd
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default About;
