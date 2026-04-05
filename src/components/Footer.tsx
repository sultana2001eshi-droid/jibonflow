import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  ExternalLink, Heart,
  Wallet, FileText, Receipt, Camera, Brain
} from "lucide-react";

const quickLinks = [
  { label: "টুলস", path: "/tools" },
  { label: "ডকুমেন্টস", path: "/documents" },
  { label: "হিস্ট্রি", path: "/history" },
  { label: "আমার সম্পর্কে", path: "/about" },
  { label: "শর্তাবলী", path: "/terms" },
];

const topTools = [
  { label: "স্মার্ট বাজেট", path: "/tools/budget", icon: Wallet },
  { label: "দরখাস্ত বিল্ডার", path: "/tools/application", icon: FileText },
  { label: "ক্যাশ মেমো", path: "/tools/cashmemo", icon: Receipt },
  { label: "পাসপোর্ট ফটো", path: "/tools/passport-photo", icon: Camera },
  { label: "লাইফ অর্গানাইজার", path: "/tools/organizer", icon: Brain },
];

const Footer = () => (
  <footer className="relative bg-primary text-primary-foreground overflow-hidden">
    {/* Top gradient divider */}
    <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

    <div className="container py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="text-sm text-primary-foreground/50 font-bangla leading-relaxed max-w-xs">
            প্রতিদিনের কাজ সহজ, স্মার্ট আর সুন্দর করার জন্য তৈরি একটি প্রিমিয়াম বাংলা AI প্ল্যাটফর্ম।
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://mdnasrullah.pro.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-heading hover:bg-accent/20 transition-colors"
            >
              <ExternalLink size={12} />
              Portfolio
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-sm text-accent tracking-wide uppercase">লিংক</h4>
          <div className="flex flex-col gap-2">
            {quickLinks.map((l) => (
              <Link key={l.path} to={l.path} className="text-sm text-primary-foreground/40 hover:text-accent transition-colors font-bangla">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Top Tools */}
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-sm text-accent tracking-wide uppercase">জনপ্রিয় টুলস</h4>
          <div className="flex flex-col gap-2">
            {topTools.map((t) => (
              <Link key={t.path} to={t.path} className="flex items-center gap-2 text-sm text-primary-foreground/40 hover:text-accent transition-colors font-bangla">
                <t.icon size={12} />
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Developer */}
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-sm text-accent tracking-wide uppercase">ডেভেলপার</h4>
          <div className="glass-card rounded-xl p-4 bg-primary-foreground/5 border-primary-foreground/10 space-y-3">
            <p className="text-sm font-heading font-semibold text-primary-foreground/80">Md Nasrullah</p>
            <p className="text-xs text-primary-foreground/40 font-bangla">Full-Stack Developer & AI Enthusiast</p>
            <a
              href="https://mdnasrullah.pro.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:text-accent/80 transition-colors font-heading flex items-center gap-1"
            >
              <ExternalLink size={10} />
              mdnasrullah.pro.bd
            </a>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="mt-12 pt-6 border-t border-primary-foreground/8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-primary-foreground/30 font-bangla flex items-center gap-1.5">
          © {new Date().getFullYear()} JibonFlow।
          <Heart size={10} className="text-accent fill-accent" />
          বাংলাদেশে তৈরি 🇧🇩
        </p>
        <p className="text-xs text-primary-foreground/20 font-heading">
          v4.0 — Premium Edition
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
