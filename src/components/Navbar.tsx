import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/assets/Logo.jpeg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
            </div>
            <span className="text-xl font-bold text-foreground">Verix.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Receive SMS
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About Us
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && user ? (
              <Button variant="navActive" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="nav" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="navActive" size="sm" asChild>
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
              <a href="#receive-sms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Receive SMS
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </a>
              <div className="flex gap-2 pt-4">
                {!loading && user ? (
                  <Button variant="navActive" size="sm" className="flex-1" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="nav" size="sm" className="flex-1" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button variant="navActive" size="sm" className="flex-1" asChild>
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
