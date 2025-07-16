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
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    // Handle query parameters for properties pages
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-22">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center">
                <img src="/lovable-uploads/e3e8d4b3-aff7-449c-8663-a9e656c4ed74.png" alt="Regal Estate Consultants" className="h-20 w-auto" />
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
                <NavLink to="/contact">Inquiry Form</NavLink>
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
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-luxury transition-all duration-300 hover:scale-110 z-50 animate-pulse"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/lovable-uploads/e3e8d4b3-aff7-449c-8663-a9e656c4ed74.png" alt="Regal Estate Consultants" className="h-24 w-auto" />
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
                <p className="text-primary-foreground/80 text-sm mt-2">
                  <strong>Business Hours:</strong><br />
                  Monday - Saturday: 10am - 6pm<br />
                  Sunday: 10am - 4pm
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
              <ul className="space-y-2 text-primary-foreground/80 text-sm">
                <li>Project Marketing for OC-Ready Properties</li>
                <li>Real Estate Sale Assistance</li>
                <li>Real Estate Purchase Assistance</li>
                <li>Investor Advisory Services</li>
                <li>Real Estate Advisory Services</li>
                <li>Pre-Lease Property Services</li>
                <li>Landlord Representation</li>
                <li>Tenant Representation</li>
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