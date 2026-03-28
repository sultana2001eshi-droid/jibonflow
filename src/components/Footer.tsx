import { Link } from "react-router-dom";
import Logo from "./Logo";
import { ExternalLink, Heart, Mail } from "lucide-react";

const Footer = () => (
  <footer className="relative bg-primary text-primary-foreground overflow-hidden">
    {/* Subtle glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

    <div className="container py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-primary-foreground/60 font-bangla leading-relaxed max-w-xs">
            প্রতিদিনের কাজ সহজ, স্মার্ট আর সুন্দর করার জন্য তৈরি একটি প্রিমিয়াম বাংলা প্ল্যাটফর্ম।
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-sm text-accent tracking-wide uppercase">লিংক</h4>
          <div className="flex flex-col gap-2.5">
            {[
              { label: "টুলস", path: "/tools" },
              { label: "আমার সম্পর্কে", path: "/about" },
              { label: "ডেভেলপার", path: "/developer" },
              { label: "শর্তাবলী", path: "/terms" },
            ].map((l) => (
              <Link key={l.path} to={l.path} className="text-sm text-primary-foreground/50 hover:text-accent transition-colors font-bangla">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-sm text-accent tracking-wide uppercase">যোগাযোগ</h4>
          <a
            href="https://mdnasrullah.pro.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-heading"
          >
            <ExternalLink size={14} />
            mdnasrullah.pro.bd
          </a>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/40 font-bangla">
            <Heart size={14} className="text-accent fill-accent" />
            Crafted with passion in Bangladesh 🇧🇩
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-primary-foreground/40 font-bangla">
          © {new Date().getFullYear()} JibonFlow। সর্বস্বত্ব সংরক্ষিত।
        </p>
        <p className="text-xs text-primary-foreground/30 font-heading">
          v2.0 — Premium Edition
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
