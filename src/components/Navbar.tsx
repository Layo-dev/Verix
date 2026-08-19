import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import VerixLogo from "@/assets/verixsms-logo.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <div className="container mx-auto rounded-2xl border border-border bg-card/90 px-4 backdrop-blur-md md:rounded-full md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center">
            <img src={VerixLogo} alt="Verix logo" className="h-14 w-auto block" />
            <span className="text-xl font-extrabold text-foreground leading-none -ml-5 -mb-2">erix.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors">
              Receive SMS
            </a>
            <a href="#marketplace" className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors">
              Marketplace
            </a>
            <a href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors">
              Pricing
            </a>
            <a href="#reviews" className="text-sm font-semibold text-muted-foreground hover:text-accent transition-colors">
              About Us
            </a>
          </div>


          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && user ? (
              <Button variant="accent" size="sm"  asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="accent" size="sm"  asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <a href="#receive-sms" className="text-sm font-medium text-foreground hover:text-foreground transition-colors">
                Receive SMS
              </a>
              <a href="#pricing" className="text-sm font-medium text-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#reviews" className="text-sm font-medium text-foreground hover:text-foreground transition-colors">
                About Us
              </a>
              <div className="flex gap-2 pt-4">
                {!loading && user ? (
                  <Button variant="accent" size="sm"  className="flex-1" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button variant="accent" size="sm"  className="flex-1" asChild>
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
