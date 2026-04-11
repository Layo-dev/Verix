import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { SiFacebook, SiTiktok, SiX, SiInstagram, SiTelegram} from "react-icons/si";
import VerixLogo from "@/assets/verixsms-logo.svg";

const Footer = () => {
  const links = {
    home: ["Features", "Pricing", "Personal",],
    about: ["Company", "Customers"],
    resources: ["Blog", "Support", "Partners"],
  };

  return (
    <footer className="gradient-footer py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-12 border-b border-border">
          {/* Logo */}
          <div>
            <div className="inline-flex items-center mb-2">
              <img src={VerixLogo} alt="Verix logo" className="h-16 w-auto block" />
              <span className="text-2xl font-bold text-foreground leading-none -ml-6 -mb-3">erix.</span>
            </div>
            <p className="text-sm text-muted-foreground">Copyright ©2026. All rights reserved.</p>
          </div>

          {/* CTA Button */}
          <Button variant="hero" size="lg" className="gap-2">
            <Lock size={18} />
            Open An Account
          </Button>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4">Home</h4>
            <ul className="space-y-3">
              {links.home.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About Us</h4>
            <ul className="space-y-3">
              {links.about.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-4">Subscribe to our newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your mail"
                className="flex-1 min-w-0 px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="default" size="default" className="flex-shrink-0">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {'{'} Will send you weekly updates for your better business management. {'}'}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Refund Policy</a> 
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/share/1CfrdpjoNb/" target="_blank">
            <SiFacebook className="size-9"/>
            </a>
            <a href="https://www.tiktok.com/@verixsms?_r=1&_t=ZS-95RDXQw9A0L" target="_blank">
            <SiTiktok className="size-9"/>
            </a>
            <a href="https://www.instagram.com/verixsms?igsh=MWxiYzRtejhkNmFxOA==" target="_blank">
            <SiInstagram className="size-9"/>
            </a>
            <a href="https://t.me/verixsms" target="_blank">
            <SiTelegram className="size-9"/>
            </a>
            <a href="https://www.x.com/verix.io" target="_blank">
            <SiX className="size-9"/>
            </a>
          
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
