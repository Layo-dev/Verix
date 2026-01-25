import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const Footer = () => {
  const links = {
    home: ["Features", "Pricing", "Personal", "Business"],
    about: ["Company", "Leadership", "Customers", "Careers"],
    resources: ["Blog", "Support", "Partners"],
  };

  return (
    <footer className="gradient-footer py-10 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 pb-8 sm:pb-10 md:pb-12 border-b border-border">
          {/* Logo */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1 sm:mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary-foreground rounded-sm" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">Payix.</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Copyright ©2024. All rights reserved.</p>
          </div>

          {/* CTA Button */}
          <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto min-h-[44px]">
            <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
            Open An Account
          </Button>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Home</h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.home.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">About Us</h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.about.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              {links.resources.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Subscribe to our newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your mail"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-2 rounded-full border border-border bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
              />
              <Button variant="default" size="default" className="min-h-[44px] w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
              {'{'} Will send you weekly updates for your better business management. {'}'}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 border-t border-border">
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">Terms & Conditions</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {['⚙', 'f', '𝕏', '📷'].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors text-xs sm:text-sm min-w-[44px] min-h-[44px]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;