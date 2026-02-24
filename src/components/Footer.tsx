import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const Footer = () => {
  const links = {
    home: ["Features", "Pricing", "Personal", "Business"],
    about: ["Company", "Leadership", "Customers", "Careers"],
    resources: ["Blog", "Support", "Partners"],
  };

  return (
    <footer className="gradient-footer py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-12 border-b border-border">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
              </div>
              <span className="text-xl font-bold text-foreground">Verix.</span>
            </div>
            <p className="text-sm text-muted-foreground">Copyright ©2024. All rights reserved.</p>
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
            <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {['⚙', 'f', '𝕏', '📷'].map((icon, index) => (
              <a
                key={index}
                href="#"
                className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors text-sm"
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
