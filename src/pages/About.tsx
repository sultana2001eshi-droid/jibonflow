import { ExternalLink, MapPin, BookOpen, Lightbulb } from "lucide-react";

const About = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container max-w-2xl">
      {/* Profile Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          {/* Avatar placeholder */}
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-accent/30 to-secondary/30 border-4 border-accent/20 gold-glow flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-foreground">MN</span>
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
                ডিজাইন, টেকনোলজি ও ডিজিটাল প্রোডাক্ট নির্মাণে আগ্রহী একজন সৃজনশীল উদ্ভাবক। মানুষের দৈনন্দিন জীবন সহজ করার লক্ষ্যে কাজ করে যাচ্ছেন।
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
