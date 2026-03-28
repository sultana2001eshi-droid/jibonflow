import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground font-bangla leading-relaxed max-w-xs">
            জীবন সহজ, স্মার্ট আর সুন্দর। প্রতিদিনের কাজ সহজ করার জন্য তৈরি।
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-sm text-foreground tracking-wide uppercase">লিংক</h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "টুলস", path: "/tools" },
              { label: "আমার সম্পর্কে", path: "/about" },
              { label: "ডেভেলপার", path: "/developer" },
              { label: "শর্তাবলী", path: "/terms" },
            ].map((l) => (
              <Link key={l.path} to={l.path} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-sm text-foreground tracking-wide uppercase">যোগাযোগ</h4>
          <a
            href="https://mdnasrullah.pro.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            mdnasrullah.pro.bd ↗
          </a>
          <p className="text-xs text-muted-foreground font-bangla">
            Crafted with passion in Bangladesh 🇧🇩
          </p>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} JibonFlow। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
