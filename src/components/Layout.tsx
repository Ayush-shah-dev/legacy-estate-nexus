import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle, LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  
  // Track visitor analytics
  useVisitorTracking();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Residential', path: '/properties?type=residential' },
    { name: 'Commercial', path: '/properties?type=commercial' },
    { name: 'Legacy', path: '/legacy' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center">
                <img src="/lovable-uploads/46b29d1b-4aa8-477f-81f8-f40b347788fe.png" alt="Regal Estate Consultants" className="h-16 w-auto" />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "px-3 py-2 text-sm font-medium transition-colors duration-200",
                      isActive(item.path)
                        ? "text-brand-maroon border-b-2 border-brand-maroon"
                        : "text-foreground hover:text-brand-maroon"
                    )}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="tel:+919930033056"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-maroon transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91 99300 33056</span>
              </a>
              <Button variant="outline" size="sm" className="border-brand-classic-gold text-brand-classic-gold hover:bg-brand-classic-gold hover:text-primary">
                <NavLink to="/contact">Enquiry Form</NavLink>
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <NavLink to="/admin-dashboard">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </NavLink>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={signOut}
                    className="text-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <NavLink to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-base font-medium transition-colors",
                    isActive(item.path)
                      ? "text-brand-maroon bg-secondary"
                      : "text-foreground hover:text-brand-maroon hover:bg-secondary"
                  )}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 pb-3 border-t space-y-2">
                <a
                  href="tel:+919930033056"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground"
                >
                  <Phone className="h-4 w-4" />
                  <span>+91 99300 33056</span>
                </a>
                
                {user ? (
                  <div className="space-y-2 px-3">
                    {isAdmin && (
                      <NavLink to="/admin-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </NavLink>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full text-destructive hover:text-destructive"
                      onClick={signOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-3">
                    <NavLink to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919930033056?text=Hi, I'm interested in your real estate services"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-luxury transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/lovable-uploads/46b29d1b-4aa8-477f-81f8-f40b347788fe.png" alt="Regal Estate Consultants" className="h-20 w-auto" />
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Mumbai's trusted partner in premium real estate. Connecting dreams with reality through 
                exceptional properties and unmatched service across the city.
              </p>
              <div className="flex flex-col space-y-2">
                <a href="tel:+919930033056" className="text-brand-classic-gold hover:text-secondary transition-colors">
                  +91 99300 33056
                </a>
                <a href="mailto:sales.regalestate@gmail.com" className="text-brand-classic-gold hover:text-secondary transition-colors">
                  sales.regalestate@gmail.com
                </a>
                <p className="text-primary-foreground/80 text-sm">
                  Shop No. 3, Bharat Altavistas, next to ICICI Bank, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className="text-primary-foreground/80 hover:text-brand-classic-gold transition-colors"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Premium Properties</li>
                <li>Investment Consulting</li>
                <li>Property Management</li>
                <li>Market Analysis</li>
              </ul>
            </div>
          </div>
          
            <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
              <p>&copy; 2024 Regal Estate Consultants. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};