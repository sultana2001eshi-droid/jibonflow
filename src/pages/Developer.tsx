import { Code, Heart } from "lucide-react";

const Developer = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container max-w-lg">
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
          <Code size={28} className="text-accent" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">ডেভেলপার</h1>
        <div className="space-y-4 text-sm text-muted-foreground font-bangla leading-relaxed">
          <p>
            JibonFlow তৈরি করেছেন <span className="text-foreground font-medium">MD. NASRULLAH</span>।
          </p>
          <p>
            এই অ্যাপটি React, TypeScript, এবং Tailwind CSS দিয়ে তৈরি। সম্পূর্ণ ক্লায়েন্ট-সাইড, কোনো ব্যাকএন্ড প্রয়োজন নেই।
          </p>
          <div className="flex items-center justify-center gap-2 text-accent font-heading font-medium">
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
